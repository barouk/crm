import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from channels.db import database_sync_to_async
from . import models
from urllib.parse import parse_qs
import random
import uuid
from django.core.cache import cache
import threading
import json
import time


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        query_string = self.scope["query_string"].decode()
        query_params = parse_qs(query_string)
        email = query_params.get("email", None)[0]
        if email is None:
            return False

        redis_obj = cache.get(str(email))
        if redis_obj is not None:

            self.room_name = str(email)
            self.room_group_name =redis_obj["chat_id"]
        else:

            chat_id = str(uuid.uuid4())
            self.room_name = str(email)
            self.room_group_name = chat_id
            cache.set(str(email), {"email": str(email),
                                   "chat_id":chat_id,
                                   "messages": [{"message": "سلام چطور میتوانم به شما کمک کنم ؟", "user": "admin"}]},
                      timeout=60 * 60)

        async_to_sync(self.channel_layer.group_add)(self.room_group_name, self.channel_name)
        self.accept()

        if redis_obj is  None:
            self.send(text_data=json.dumps({"room_name": str(email),
                                             "chat_id": cache.get(str(email)) is not None if cache.get(
                                                 str(email)) is not None else chat_id,
                                             "messages":[{"message": "سلام چطور میتوانم به شما کمک کنم ؟"}], "user": "admin"}))
        else:
            self.send(text_data=json.dumps(cache.get(str(email))))

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(self.room_group_name, self.channel_name)

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        redis_obj = cache.get(str(self.room_name))
        redis_obj["messages"].append( {"message":message, "user": "user"})
        cache.set(str(self.room_name) , redis_obj)
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, { "type": "chat_message","messages":  [{ "message": message , "user":"user" } ] }
        )

    def chat_message(self, event):
        message = event["messages"][0]["message"]
        user = event["messages"][0]["user"]

        # ارسال پیام به WebSocket
        self.send(text_data=json.dumps({
            "messages":[{
            "message": message,
            "user": user}]
        }))




class AdminChatList(WebsocketConsumer):
    def connect(self):
        self.accept()
        threading.Thread(target=self.send_message_every_10_seconds, daemon=True).start()

    def disconnect(self, close_code):
        pass

    def send_message_every_10_seconds(self):
        while True:
            redis_obj = cache.keys('*')
            data = []
            for i in redis_obj :
                data.append(cache.get(i))
            self.send(text_data=json.dumps(data))
            time.sleep(5)






class AdminChatConsumer(WebsocketConsumer):
    def connect(self):
        query_string = self.scope["query_string"].decode()
        query_params = parse_qs(query_string)
        email = query_params.get("email", None)[0]
        if email is None:
            return False

        print(cache.keys('*'))
        print("dddddddddddd")
        if cache.get(str(email)) is not None:
            self.room_name = str(email)
            self.room_group_name = cache.get(str(email))
            cache.set(str(email), {  "email":cache.get(str(email)) ,"messages":[{"message":"سلام چطور میتوانم به شما کمک کنم ؟" , "user":"admin"}]   }, timeout=60 * 60)
        else:
            chat_id = str(uuid.uuid4())
            self.room_name = str(email)
            self.room_group_name =chat_id
            cache.set(str(email), {  "email":chat_id ,"messages":[{"message":"سلام چطور میتوانم به شما کمک کنم ؟" , "user":"admin"}] } , timeout=60 * 60)
        async_to_sync(self.channel_layer.group_add)(self.room_group_name, self.channel_name)
        self.accept()
        self.send_json(text_data=json.dumps({"room_name" : str(email), "chat_id":cache.get(str(email)) is not None if cache.get(str(email)) is not None else chat_id ,"message":"سلام چطور میتوانم به شما کمک کنم ؟" , "user":"admin" }))

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(self.room_group_name, self.channel_name)

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        #self.save_message(message)
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {"type": "chat_message", "message": message , "username":username}
        )


