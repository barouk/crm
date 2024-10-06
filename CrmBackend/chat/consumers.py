from  datetime import datetime
import json
import time
import uuid
import threading
from urllib.parse import parse_qs
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from . import r

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
        timestamp = datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
        self._save_message_to_redis(message , timestamp)
        self._broadcast_message(message, "user",timestamp)

    def chat_message(self, event):
        message_data = event["messages"][0]
        self._send_message(message_data["message"], message_data["user"] ,message_data["timestamp"] )

    def defer(self, event):
        self.send(text_data=json.dumps({"message": event, "user": "system"}))

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
            "messages": [{"message": "سلام چطور میتوانم به شما کمک کنم؟", "user": "admin"}]
        }
        r.set(email, json.dumps(initial_message), 50 * 60)

    def _send_initial_message(self, redis_obj):
        if redis_obj:
            self.send(json.dumps(json.loads(redis_obj)))
        else:
            self._send_message("سلام چطور میتوانم به شما کمک کنم؟", "admin")

    def _save_message_to_redis(self, message, timestamp):
        redis_obj = json.loads(r.get(self.room_name).decode('utf-8'))
        redis_obj["messages"].append({"message": message, "user": "user","timestamp":timestamp})
        r.set(self.room_name, json.dumps(redis_obj), 50 * 60)

    def _broadcast_message(self, message, user,timestamp):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "chat_message",
                "messages": [{"message": message, "user": user,"timestamp":timestamp}]
            }
        )

    def _send_message(self, message, user="system", timestamp = datetime.now().strftime("%m/%d/%Y, %H:%M:%S")):
        self.send(text_data=json.dumps({"messages": [{"message": message, "user": user , "timestamp":timestamp}]}))


class AdminChatList(WebsocketConsumer):
    def connect(self):
        self.accept()
        threading.Thread(target=self._send_updates, daemon=True).start()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        self._send_all_chat_data()

    def defer(self, event):
        self._send_message(event['message'])

    def _send_updates(self):
        while True:
            self._send_all_chat_data()
            time.sleep(5)

    def _send_all_chat_data(self):
        redis_obj = r.keys('*')
        data = [json.loads(r.get(i).decode('utf-8')) for i in redis_obj]
        self.send(text_data=json.dumps(data))

    def _send_message(self, message):
        self.send(text_data=json.dumps({"message": message}))


class AdminChatConsumer(WebsocketConsumer):
    def connect(self):
        email = self._get_email_from_scope()
        redis_obj = r.get(email)
        if redis_obj:
            redis_data = json.loads(redis_obj.decode('utf-8'))
            self.room_name = email
            self.room_group_name = redis_data["chat_id"]
        else:
            self.close()

        async_to_sync(self.channel_layer.group_add)(self.room_group_name, self.channel_name)
        self.accept()
        self.send(text_data=json.dumps(redis_data))

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(self.room_group_name, self.channel_name)

    def receive(self, text_data):
        message = json.loads(text_data)["message"]
        timestamp = datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
        self._save_admin_message_to_redis(message,timestamp)
        self._broadcast_admin_message(message,timestamp)

    def chat_message(self, event):
        message_data = event["messages"][0]
        self._send_message(message_data["message"],message_data["timestamp"], message_data["user"])

    def defer(self, event):
        self.send(text_data=json.dumps({"message": event, "user": "system"}))

    def _get_email_from_scope(self):
        query_string = self.scope["query_string"].decode()
        query_params = parse_qs(query_string)
        return query_params.get("email", [None])[0]

    def _save_admin_message_to_redis(self, message,timestamp):
        redis_obj = json.loads(r.get(self.room_name).decode('utf-8'))
        redis_obj["messages"].append({"message": message, "user": "admin" , "timestamp":timestamp})
        r.set(self.room_name, json.dumps(redis_obj), 50 * 60)

    def _broadcast_admin_message(self, message,timestamp):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "chat_message",
                "messages": [{"message": message, "user": "admin","timestamp":timestamp}]
            }
        )

    def _send_message(self, message, timestamp , user="system",):
        self.send(text_data=json.dumps({"messages": [{"message": message, "user": user,"timestamp":timestamp}]}))
