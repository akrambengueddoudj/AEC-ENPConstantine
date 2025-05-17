import os
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from detector import routing  # NEW: Import routing module

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fod_system.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(  # NEW: Wrapped in AuthMiddleware
        URLRouter(
            routing.websocket_urlpatterns  # NEW: Uses routing.py
        )
    ),
})