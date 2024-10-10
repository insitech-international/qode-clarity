from pathlib import Path
import os
<<<<<<< HEAD
from mongoengine import connect
=======
>>>>>>> 71b968702bf72a1cc858a5aa8a05c3b3aec83a30

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

<<<<<<< HEAD
# Quick-start development settings - unsuitable for production
SECRET_KEY = 'django-insecure-s4czexbhtk4e+fbx^tp1sg65=%6)ei*i(ln4ezx!x*1b!f1g6m'
DEBUG = True
ALLOWED_HOSTS = []

# Application definition
=======

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-s4czexbhtk4e+fbx^tp1sg65=%6)ei*i(ln4ezx!x*1b!f1g6m'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

>>>>>>> 71b968702bf72a1cc858a5aa8a05c3b3aec83a30
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'code_clarity_app',
    'rest_framework',
    'drf_spectacular'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'code_clarity.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'code_clarity.wsgi.application'

# MongoDB settings
<<<<<<< HEAD
MONGO_DATABASE_NAME = 'code-clarity-db'
MONGO_USERNAME = os.environ.get("MONGO_USERNAME", "admin")
MONGO_PASSWORD = os.environ.get("MONGO_PASSWORD", "mercy")
MONGO_HOST = os.environ.get("MONGO_HOST", "localhost")
MONGO_PORT = os.environ.get("MONGO_PORT", 27017)

# Uncomment if you need to use a relational database for any reason
=======
DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'code-clarity-db',
        'ENFORCE_SCHEMA': False,
        'CLIENT': {
            'host': 'localhost',
            'port': 27017,
            'username': '',
            'password': '',
            'authSource': 'admin',
        }
    }
}


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

>>>>>>> 71b968702bf72a1cc858a5aa8a05c3b3aec83a30
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

SPECTACULAR_SETTINGS = {
    'TITLE': 'Your API Title',
    'DESCRIPTION': 'A description for your API.',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'SWAGGER_UI_DIST': 'SIDECAR',
    'SWAGGER_UI_FAVICON_HREF': 'SIDECAR',
    'REDOC_DIST': 'SIDECAR',
    'COMPONENT_SPLIT_REQUEST': True,
}

# Password validation
<<<<<<< HEAD
=======
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

>>>>>>> 71b968702bf72a1cc858a5aa8a05c3b3aec83a30
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

<<<<<<< HEAD
# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
=======

# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

>>>>>>> 71b968702bf72a1cc858a5aa8a05c3b3aec83a30
STATIC_URL = 'static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

<<<<<<< HEAD
# Default primary key field type
=======

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

>>>>>>> 71b968702bf72a1cc858a5aa8a05c3b3aec83a30
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
