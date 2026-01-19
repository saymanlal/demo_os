import os
import django

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

# 🔑 VERY IMPORTANT: set settings BEFORE anything else
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

# 🔑 VERY IMPORTANT: initialize Django
django.setup()

import backend.routing  # import AFTER django.setup()

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(backend.routing.websocket_urlpatterns)
    ),
})
