from django.contrib import admin
from django.urls import path as django_path
from dmr.openapi import build_schema
from dmr.openapi.views import OpenAPIJsonView, SwaggerView
from dmr.routing import Router, path

from apps.users.views import UserCollectionController, UserDetailController

# API-роутер версии v1
api_v1_router = Router(
    "api/v1/",
    [
        path("users/", UserCollectionController.as_view(), name="users-collection"),
        # Важно: имя параметра <int:user_id> должно совпадать с полем в UserPathSchema
        path("users/<int:user_id>/", UserDetailController.as_view(), name="users-detail"),
    ],
)

# Схема OpenAPI строится из роутера
schema = build_schema(api_v1_router)

urlpatterns = [
    # Классическая админка
    django_path("admin/", admin.site.urls),
    # Роуты API
    api_v1_router.to_urlpatterns(namespace="api-v1"),
    # Документация OpenAPI и Swagger UI
    django_path("docs/openapi.json/", OpenAPIJsonView.as_view(schema), name="openapi"),
    django_path("docs/swagger/", SwaggerView.as_view(schema), name="swagger"),
]
