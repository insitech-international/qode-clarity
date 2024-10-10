<<<<<<< HEAD
# code_clarity_app/apps.py

from django.apps import AppConfig
from mongoengine import connect
from django.conf import settings
=======
from django.apps import AppConfig
>>>>>>> 71b968702bf72a1cc858a5aa8a05c3b3aec83a30


class CodeClarityAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'code_clarity_app'

<<<<<<< HEAD
    def ready(self):
        # Establish a connection to MongoDB
        connect(
            db=settings.MONGO_DATABASE_NAME,
            username=settings.MONGO_USERNAME,
            password=settings.MONGO_PASSWORD,
            host=settings.MONGO_HOST,
            port=int(settings.MONGO_PORT)
        )
=======
>>>>>>> 71b968702bf72a1cc858a5aa8a05c3b3aec83a30
