# code_clarity_app/apps.py

from django.apps import AppConfig
from mongoengine import connect
from django.conf import settings


class CodeClarityAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'code_clarity_app'

    def ready(self):
        # Establish a connection to MongoDB
        connect(
            db=settings.MONGO_DATABASE_NAME,
            username=settings.MONGO_USERNAME,
            password=settings.MONGO_PASSWORD,
            host=settings.MONGO_HOST,
            port=int(settings.MONGO_PORT)
        )
