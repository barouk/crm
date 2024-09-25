# chat/routing.py
from django.urls import re_path, path

from . import consumers

websocket_urlpatterns = [
   path("ws/chat/", consumers.ChatConsumer.as_asgi()),
   path("ws/admin/chat/", consumers.AdminChatConsumer.as_asgi()),
   path("ws/admin/list/", consumers.AdminChatList.as_asgi()),


]