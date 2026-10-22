from typing import final


class DomainError(Exception):
    """Базовая ошибка доменной логики."""


@final
class UserEmailAlreadyExistsError(DomainError):
    """Пользователь с таким email уже существует."""


@final
class UserNotFoundError(DomainError):
    """Пользователь не найден в базе данных."""
