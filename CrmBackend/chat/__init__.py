import redis
import os


r = redis.StrictRedis(host=os.getenv("REDIS", default="redis"), port=6379, db=0)