from http import HTTPStatus
from typing import final, override

from django.http import HttpResponse
from dmr import (
    APIError,
    Body,
    Controller,
    CookieSpec,
    Headers,
    HeaderSpec,
    NewCookie,
    NewHeader,
    Path,
    Query,
    ResponseSpec,
    modify,
    validate,
)
from dmr.endpoint import Endpoint
from dmr.errors import ErrorType
from dmr.plugins.pydantic import PydanticFastSerializer
from dmr.serializer import BaseSerializer
from dmr_dishka import FromDishka, inject

from apps.core.exceptions import UserEmailAlreadyExistsError, UserNotFoundError
from apps.users.schemas import (
    ClientHeadersSchema,
    UserCreateSchema,
    UserFilterQuerySchema,
    UserPathSchema,
    UserResponseSchema,
    UserUpdatePasswordSchema,
    UserUpdateRoleSchema,
)
from apps.users.services import UserService


@final
class UserCollectionController(Controller[PydanticFastSerializer]):
    """Контроллер для списка и создания пользователей."""

    # 1. Пример RAW ENDPOINT с Query, Headers и @modify
    @modify(
        status_code=HTTPStatus.OK,
        # Статический заголовок, который всегда добавляется к ответу
        headers={"X-API-Resource": NewHeader(value="users-collection")},
    )
    @inject
    async def get(
        self,
        parsed_query: Query[UserFilterQuerySchema],
        parsed_headers: Headers[ClientHeadersSchema],
        user_service: FromDishka[UserService],
    ) -> list[UserResponseSchema]:
        """Получить список пользователей с фильтрацией."""
        users = await user_service.list_users(parsed_query)
        return [UserResponseSchema.model_validate(user) for user in users]

    # 2. Пример REAL ENDPOINT с @validate, динамическими заголовками и куками
    @validate(
        ResponseSpec(
            UserResponseSchema,
            status_code=HTTPStatus.CREATED,
            headers={
                "X-User-UID": HeaderSpec(required=True),
                "X-Admin-Created": HeaderSpec(required=False),
            },
            cookies={
                "last_registered_role": CookieSpec(max_age=3600, required=True),
            },
        ),
        # Регистрируем 409 Conflict в контракте, чтобы валидатор ответов пропустил ошибку
        ResponseSpec(
            Controller.error_model,
            status_code=HTTPStatus.CONFLICT,
        ),
    )
    @inject
    async def post(
        self,
        parsed_body: Body[UserCreateSchema],
        user_service: FromDishka[UserService],
    ) -> HttpResponse:
        """Создать пользователя и выставить динамические заголовки и куки."""
        user = await user_service.create_user(parsed_body)
        response_data = UserResponseSchema.model_validate(user)

        # Формируем динамические заголовки
        headers: dict[str, str] = {"X-User-UID": str(user.uid)}
        if user.role == "admin":
            headers["X-Admin-Created"] = "true"

        # Формируем куки
        cookies: dict[str, NewCookie] = {
            "last_registered_role": NewCookie(value=user.role, max_age=3600),
        }

        return self.to_response(
            response_data,
            status_code=HTTPStatus.CREATED,
            headers=headers,
            cookies=cookies,
        )

    # 3. Перехват доменных ошибок на уровне всего контроллера
    @override
    async def handle_async_error(
        self,
        endpoint: Endpoint,
        controller: Controller[PydanticFastSerializer],
        exc: Exception,
    ) -> HttpResponse:
        """Преобразовать доменные ошибки создания в HTTP-ответ."""
        if isinstance(exc, UserEmailAlreadyExistsError):
            return self.to_error(
                self.format_error(
                    str(exc),
                    error_type=ErrorType.value_error,
                ),
                status_code=HTTPStatus.CONFLICT,
            )
        return await super().handle_async_error(endpoint, controller, exc)


# Локальный обработчик ошибок для конкретного эндпоинта.
# ВАЖНО: контроллер здесь типизирован базовым сериализатором,
# иначе функция не совпадёт с `AsyncErrorHandler` (параметры контравариантны).
async def handle_not_found_error(
    endpoint: Endpoint,
    controller: Controller[BaseSerializer],
    exc: Exception,
) -> HttpResponse:
    """Преобразовать UserNotFoundError в 404, иначе пробросить дальше."""
    if isinstance(exc, UserNotFoundError):
        return controller.to_error(
            controller.format_error(str(exc), error_type=ErrorType.not_found),
            status_code=HTTPStatus.NOT_FOUND,
        )
    raise exc from None


@final
class UserDetailController(Controller[PydanticFastSerializer]):
    """Контроллер для работы с конкретным пользователем по ID."""

    # 1. Использование Path-компонента и локального error_handler
    # Примечание: Компонент Path автоматически добавляет статус 404 в схему ответов!
    @modify(error_handler=handle_not_found_error)
    @inject
    async def get(
        self,
        parsed_path: Path[UserPathSchema],
        user_service: FromDishka[UserService],
    ) -> UserResponseSchema:
        """Получить пользователя по ID."""
        user = await user_service.get_by_id(parsed_path.user_id)
        return UserResponseSchema.model_validate(user)

    # 2. Обновление роли (PATCH) и прямой выброс APIError
    @modify(
        extra_responses=[
            ResponseSpec(Controller.error_model, status_code=HTTPStatus.FORBIDDEN),
        ],
        error_handler=handle_not_found_error,
    )
    @inject
    async def patch(
        self,
        parsed_path: Path[UserPathSchema],
        parsed_body: Body[UserUpdateRoleSchema],
        user_service: FromDishka[UserService],
    ) -> UserResponseSchema:
        """Изменить роль пользователя."""
        # Демонстрация прямого выброса APIError при нарушении бизнес-правила
        if parsed_body.role == "superroot":
            raise APIError(
                self.format_error(
                    "Назначение роли 'superroot' через API запрещено",
                    error_type=ErrorType.value_error,
                ),
                status_code=HTTPStatus.FORBIDDEN,
            )

        user = await user_service.update_role(
            user_id=parsed_path.user_id,
            new_role=parsed_body.role,
        )
        return UserResponseSchema.model_validate(user)

    # 3. Обновление пароля (PUT)
    @modify(error_handler=handle_not_found_error)
    @inject
    async def put(
        self,
        parsed_path: Path[UserPathSchema],
        parsed_body: Body[UserUpdatePasswordSchema],
        user_service: FromDishka[UserService],
    ) -> UserResponseSchema:
        """Изменить пароль пользователя."""
        user = await user_service.update_password(
            user_id=parsed_path.user_id,
            new_password=parsed_body.password,
        )
        return UserResponseSchema.model_validate(user)
