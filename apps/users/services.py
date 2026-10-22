from django.db import IntegrityError

from apps.core.exceptions import UserEmailAlreadyExistsError, UserNotFoundError
from apps.users.models import CustomUser
from apps.users.schemas import (
    Role,
    UserCreateSchema,
    UserFilterQuerySchema,
)


class UserService:
    """Доменная логика работы с пользователями."""

    async def list_users(
        self,
        filters: UserFilterQuerySchema,
    ) -> list[CustomUser]:
        """Вернуть список пользователей с учётом фильтров."""
        queryset = CustomUser.objects.all()
        if filters.usernames:
            queryset = queryset.filter(username__in=filters.usernames)
        if filters.roles:
            queryset = queryset.filter(role__in=filters.roles)
        if filters.search:
            queryset = queryset.filter(email__icontains=filters.search)
        return [user async for user in queryset[: filters.limit]]

    async def create_user(self, payload: UserCreateSchema) -> CustomUser:
        """Создать пользователя, захешировав пароль."""
        try:
            return await CustomUser.objects.acreate_user(
                username=payload.username,
                email=payload.email,
                password=payload.password,
                role=payload.role,
            )
        except IntegrityError:
            raise UserEmailAlreadyExistsError(
                f"Email {payload.email} already taken",
            ) from None

    async def get_by_id(self, user_id: int) -> CustomUser:
        """Найти пользователя по первичному ключу или бросить доменную ошибку."""
        try:
            return await CustomUser.objects.aget(pk=user_id)
        except CustomUser.DoesNotExist:
            raise UserNotFoundError(f"User with id={user_id} not found") from None

    async def update_role(self, user_id: int, new_role: Role) -> CustomUser:
        """Сменить роль пользователя."""
        user = await self.get_by_id(user_id)
        user.role = new_role
        await user.asave(update_fields=["role"])
        return user

    async def update_password(self, user_id: int, new_password: str) -> CustomUser:
        """Сменить пароль пользователя."""
        user = await self.get_by_id(user_id)
        user.set_password(new_password)
        await user.asave(update_fields=["password"])
        return user
