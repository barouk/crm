# set in redis
#redis-cli config set notify-keyspace-events Ex
import redis
import json
import mysql.connector
import time
from datetime import datetime,timedelta

# اتصال به دیتابیس
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="ipmdbpass",
    database="Crm"
)
cursorr = db.cursor()

r = redis.StrictRedis(host='localhost', port=6379, db=0)

def check_keys_before_expire():
    cursor = 0
    while True:
        cursor, keys = r.scan(cursor=cursor, count=100)  # 100 کلید در هر بار اسکن
        if not keys:
            break
        for key in keys:
            ttl = r.ttl(key)
            if ttl > 0 and ttl < 10:
                data = json.loads(r.get(key))
                if data:
                    query = "INSERT INTO Tickets (name, chat_id, messages,input_date) VALUES (%s, %s, %s,%s)"
                    values = (data['email'], data['chat_id'], json.dumps(data['messages']) ,  datetime.now().strftime("%Y-%m-%d") )
                    cursorr.execute(query, values)
                    db.commit()
                    r.delete(key)

        if cursor == 0:
            break

while True:
    check_keys_before_expire()
    time.sleep(1)


cursor.close()
db.close()