import redis
import os


r = redis.StrictRedis(host=os.getenv("REDIS"), port=6379, db=0)