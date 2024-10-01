from channels.generic.websocket import WebsocketConsumer
import threading
import time
from . import r
import uuid
import json
from asgiref.sync import async_to_sync
from urllib.parse import parse_qs

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        email = self._get_email()
        if not email:
            self.close()
            return
        redis_obj = self._get_redis_obj(email)
        if redis_obj:
            self._join_existing_room(email, redis_obj)
        else:
            self._create_new_room(email)
        async_to_sync(self.channel_layer.group_add)(self.room_group_name, self.channel_name)
        self.accept()
        self._send_initial_message(redis_obj)

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(self.room_group_name, self.channel_name)

    def receive(self, text_data):
        message = json.loads(text_data)["message"]
        self._save_message_to_redis(message)
        self._broadcast_message(message, "user")

    def chat_message(self, event):
        message = event["messages"][0]["message"]
        user = event["messages"][0]["user"]
        self.send(text_data=json.dumps({"messages": [{"message": message, "user": user}]}))

    def _get_email(self):
        query_string = self.scope["query_string"].decode()
        query_params = parse_qs(query_string)
        return query_params.get("email", [None])[0]

    def _get_redis_obj(self, email):
        return r.get(str(email))

    def _join_existing_room(self, email, redis_obj):
        redis_data = json.loads(redis_obj.decode('utf-8'))
        self.room_name = email
        self.room_group_name = redis_data["chat_id"]

    def _create_new_room(self, email):
        chat_id = str(uuid.uuid4())
        self.room_name = email
        self.room_group_name = chat_id
        initial_message = {
            "email": email,
            "chat_id": chat_id,
            "messages": [{"message": "سلام چطور میتوانم به شما کمک کنم ؟", "user": "admin"}]
        }
        r.set(email, json.dumps(initial_message), 50*60)

    def _send_initial_message(self, redis_obj):
        if redis_obj:
            self.send(json.dumps(json.loads(redis_obj)))
        else:
            self.send(json.dumps({
                "room_name": self.room_name,
                "chat_id": self.room_group_name,
                "messages": [{"message": "سلام چطور میتوانم به شما کمک کنم ؟", "user": "admin"}]
            }))

    def _save_message_to_redis(self, message):
        redis_obj = json.loads(r.get(self.room_name).decode('utf-8'))
        redis_obj["messages"].append({"message": message, "user": "user"})
        r.set(self.room_name, json.dumps(redis_obj),50*60)

    def _broadcast_message(self, message, user):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {
                "type": "chat_message",
                "messages": [{"message": message, "user": user}]
            }
        )

    def defer(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'message': message
        }))


class AdminChatList(WebsocketConsumer):
    def connect(self):
        self.accept()
        threading.Thread(target=self.send_message_every_10_seconds, daemon=True).start()
    def disconnect(self, close_code):
        pass
    def send_message_every_10_seconds(self):
        while True:
            redis_obj = r.keys('*')
            data = []
            for i in redis_obj :
                res = r.get(i).decode('utf-8')
                data.append(json.loads(res))
            self.send(text_data=json.dumps(data))
            time.sleep(5)

    def receive(self, text_data):
        redis_obj = r.keys('*')
        data = []
        for i in redis_obj:
            res = r.get(i).decode('utf-8')
            data.append(json.loads(res))
        self.send(text_data=json.dumps(data))

    def defer(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'message': message
        }))


class AdminChatConsumer(WebsocketConsumer):
    def connect(self):
        query_string = self.scope["query_string"].decode()
        query_params = parse_qs(query_string)
        email = query_params.get("email", None)[0]
        if email is None:
            raise
        redis_obj = r.get(str(email)).decode('utf-8')
        if redis_obj is not None:
            self.room_name = str(email)
            self.room_group_name = json.loads(redis_obj)["chat_id"]
        else:
            raise
        async_to_sync(self.channel_layer.group_add)(self.room_group_name, self.channel_name)
        self.accept()
        self.send(text_data=json.dumps(json.loads(r.get(str(email)).decode('utf-8'))))


    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(self.room_group_name, self.channel_name)

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        redis_obj = json.loads(r.get(str(self.room_name)).decode('utf-8'))
        redis_obj["messages"].append({"message": message, "user": "admin"})
        r.set(str(self.room_name), json.dumps(redis_obj),50*60)
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {"type": "chat_message", "messages": [{"message": message, "user": "admin"}]}
        )

    def chat_message(self, event):
        message = event["messages"][0]["message"]
        user = event["messages"][0]["user"]
        self.send(text_data=json.dumps({
            "messages": [{
                "message": message,
                "user": user}]
        }))

    def defer(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'message': message
        }))




