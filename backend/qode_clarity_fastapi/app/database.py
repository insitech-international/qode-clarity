# backend\qode_clarity_fastapi\app\database.py

from pymongo import MongoClient
import os

# Use a simple connection string without authentication
MONGO_HOST = os.getenv('MONGO_HOST', 'localhost')
MONGO_PORT = os.getenv('MONGO_PORT', '27017')
MONGO_URL = f"mongodb://{MONGO_HOST}:{MONGO_PORT}"

client = MongoClient(MONGO_URL)
db = client['code-clarity-db']


from fastapi import Depends, HTTPException, status
from qode_clarity_fastapi.settings import Settings
import pymongo
import logging
from qode_clarity_fastapi.app.models import Thread, Message
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


myclient = pymongo.MongoClient('mongodb://localhost:27017/')

# DB name and Collection (i.e. Table) are hardcode. Will be updated later. 
db = myclient["code-clarity-db"]

