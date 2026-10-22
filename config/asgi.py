"""
ASGI config for the project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os
import sys
from pathlib import Path

from dishka import make_async_container
from django.core.asgi import get_asgi_application
from dmr_dishka.integration import setup_dishka

BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

django_asgi_app = get_asgi_application()

# Импортируем провайдер после инициализации настроек Django
from apps.core.ioc import AppProvider  # noqa: E402

container = make_async_container(AppProvider())
setup_dishka(container)

application = django_asgi_app
