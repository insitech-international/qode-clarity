# mongodb.py
from mongoengine import connect
from django.conf import settings

# Connect to MongoDB
def mongo_connect():
    connect(
        db=settings.MONGO_DATABASE_NAME,
        username=settings.MONGO_USERNAME,
        password=settings.MONGO_PASSWORD,
        host=settings.MONGO_HOST,
        port=int(settings.MONGO_PORT)
    )

# Call the connection function to establish connection
mongo_connect()

