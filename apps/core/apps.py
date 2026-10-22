from dishka import make_async_container
from django.apps import AppConfig
from dmr_dishka import setup_dishka


class CoreConfig(AppConfig):
    """Конфигурация ядрового приложения и его DI-контейнера."""

    name = "apps.core"

    def ready(self) -> None:
        """Собрать Dishka-контейнер и подключить его к DMR."""
        # Импорт внутри ready(): на уровне модуля models ещё недоступны.
        from apps.core.ioc import AppProvider  # noqa: PLC0415

        container = make_async_container(AppProvider())
        setup_dishka(container)
