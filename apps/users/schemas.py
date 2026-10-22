# backend/apps/users/schemas.py
import uuid
from typing import Annotated, ClassVar, Literal, final

import pydantic

#: Доменные роли пользователя. Держим в одном месте, чтобы схемы
#: и модель не разъезжались.
Role = Literal["member", "admin"]

#: Роли, которые клиент может прислать в теле запроса.
#: Шире, чем :data:`Role`: значение ``superroot`` валидно как payload,
#: но запрещено бизнес-правилом (см. ``UserDetailController.patch``).
RequestedRole = Literal["member", "admin", "superroot"]


# 1. Схема для Path-параметров (/api/v1/users/<user_id>/)
@final
class UserPathSchema(pydantic.BaseModel):
    """Path-параметры эндпоинта конкретного пользователя."""

    # DMR проверит, что id в URL строго больше 0
    user_id: Annotated[int, pydantic.Field(gt=0)]


# 2. Схема для Query-параметров (?usernames=admin&roles=member&search=null&limit=10)
@final
class UserFilterQuerySchema(pydantic.BaseModel):
    """Query-параметры фильтрации списка пользователей."""

    # Указываем DMR, какие поля из Query нужно всегда собирать в list[...]
    __dmr_force_list__: ClassVar[frozenset[str]] = frozenset(("usernames", "roles"))
    # Указываем DMR, где строковый 'null' в URL нужно превращать в Python None
    __dmr_cast_null__: ClassVar[frozenset[str]] = frozenset(("search",))

    usernames: list[str] = pydantic.Field(default_factory=list)
    roles: list[Role] = pydantic.Field(default_factory=list)
    search: str | None = None
    limit: Annotated[int, pydantic.Field(ge=1, le=100)] = 20


# 3. Схема для валидации входящих HTTP-заголовков
@final
class ClientHeadersSchema(pydantic.BaseModel):
    """Входящие HTTP-заголовки клиента."""

    # Поле сработает для заголовка X-Client-Version
    x_client_version: str = pydantic.Field(alias="X-Client-Version", default="1.0.0")


# 4. Схема для тела запроса (Body) при создании пользователя
@final
class UserCreateSchema(pydantic.BaseModel):
    """Тело запроса на создание пользователя."""

    email: pydantic.EmailStr | None = None
    username: Annotated[str, pydantic.Field(min_length=3, max_length=50)]
    password: Annotated[str, pydantic.Field(min_length=2, max_length=32)]
    role: Role = "member"


# 5. Схема для тела запроса (Body) при обновлении роли
@final
class UserUpdateRoleSchema(pydantic.BaseModel):
    """Тело запроса на смену роли пользователя."""

    role: RequestedRole


# 6. Схема для тела запроса (Body) при обновлении пароля
@final
class UserUpdatePasswordSchema(pydantic.BaseModel):
    """Тело запроса на смену пароля пользователя."""

    password: Annotated[str, pydantic.Field(min_length=2, max_length=32)]


# 7. Выходная схема ответа (Response DTO)
@final
class UserResponseSchema(pydantic.BaseModel):
    """Выходная схема пользователя."""

    model_config = pydantic.ConfigDict(from_attributes=True)

    id: int
    uid: uuid.UUID
    username: str
    email: pydantic.EmailStr | None = None
    role: Role

    @pydantic.field_validator("email", mode="before")
    @classmethod
    def _empty_email_to_none(cls, value: object) -> object:
        """Django хранит пустой email как '', а EmailStr хочет None."""
        return None if value == "" else value
