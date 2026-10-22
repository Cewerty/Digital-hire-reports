from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    """Админка для кастомного пользователя.

    Дополняет стандартный UserAdmin нестандартными полями модели:
    ``uid`` (публичный идентификатор) и ``role`` (роль).
    """

    fieldsets = (*UserAdmin.fieldsets, ("Дополнительно", {"fields": ("uid", "role")}))
    add_fieldsets = (*UserAdmin.add_fieldsets, ("Дополнительно", {"fields": ("uid", "role")}))
    list_display = ("username", "email", "role", "is_staff", "is_active")
