import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class CustomUser(AbstractUser):
    """
    Кастомная модель пользователя.

    На этапе старта наследует все стандартные поля AbstractUser (username, email, password и т.д.).
    Дополнительно добавляет публичный идентификатор ``uid`` и доменную роль ``role``.
    """

    class Role(models.TextChoices):
        """Доменные роли пользователя."""

        MEMBER = "member", "Участник"
        ADMIN = "admin", "Администратор"

    uid = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
        verbose_name="UID",
    )
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.MEMBER,
        verbose_name="роль",
    )

    class Meta:
        db_table = "users"
