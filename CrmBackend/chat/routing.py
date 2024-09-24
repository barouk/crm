# chat/routing.py
from django.urls import re_path, path

from . import consumers

websocket_urlpatterns = [
   path("ws/chat/", consumers.ChatConsumer.as_asgi()),
   path("admin/ws/chat/", consumers.AdminChatConsumer.as_asgi()),
]