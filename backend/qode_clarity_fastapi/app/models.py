from pymongo import MongoClient
from qode_clarity_fastapi.settings import settings

def get_db():
    client_kwargs = {}
    if settings.db_auth_source:
        client_kwargs['authSource'] = settings.db_auth_source

    client = MongoClient(settings.db_url, **client_kwargs)
    
    try:
        # The ismaster command is cheap and does not require auth.
        client.admin.command('ismaster')
    except Exception as e:
        print(f"Failed to connect to MongoDB: {str(e)}")
        return None

    return client[settings.db_base]

db = get_db()

if db is None:
    raise Exception("Failed to connect to the database. Please check your configuration.")

class Question:
    collection = db.questions

class Solution:
    collection = db.solutions

class Category:
    collection = db.categories