from django.db.backends.base.base import BaseDatabaseWrapper
from django.db.backends.base.features import BaseDatabaseFeatures
from django.db.backends.base.operations import BaseDatabaseOperations
from django.db.backends.base.client import BaseDatabaseClient
from django.db.backends.base.creation import BaseDatabaseCreation
from django.db.backends.base.introspection import BaseDatabaseIntrospection
from django.db.backends.base.schema import BaseDatabaseSchemaEditor
from pymongo import MongoClient

class DatabaseFeatures(BaseDatabaseFeatures):
    pass

class DatabaseOperations(BaseDatabaseOperations):
    pass

class DatabaseClient(BaseDatabaseClient):
    pass

class DatabaseCreation(BaseDatabaseCreation):
    pass

class DatabaseIntrospection(BaseDatabaseIntrospection):
    pass

class DatabaseSchemaEditor(BaseDatabaseSchemaEditor):
    pass

class MongoDBBackend(BaseDatabaseWrapper):
    vendor = 'mongodb'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.features = DatabaseFeatures(self)
        self.ops = DatabaseOperations(self)
        self.client = DatabaseClient(self)
        self.creation = DatabaseCreation(self)
        self.introspection = DatabaseIntrospection(self)
        self.mongo_client = None

    def get_connection_params(self):
        settings_dict = self.settings_dict
        return {
            'host': settings_dict.get('HOST', 'localhost'),
            'port': settings_dict.get('PORT', 27017),
            'username': settings_dict.get('USER', ''),
            'password': settings_dict.get('PASSWORD', ''),
            'authSource': settings_dict.get('AUTH_SOURCE', 'admin'),
            'authMechanism': settings_dict.get('AUTH_MECHANISM', 'SCRAM-SHA-1'),
        }

    def get_new_connection(self, conn_params):
        return MongoClient(**conn_params)

    def init_connection_state(self):
        pass

    def create_cursor(self, name=None):
        return self.connection[self.settings_dict['NAME']]

    def _set_autocommit(self, autocommit):
        pass

    def is_usable(self):
        try:
            self.connection.admin.command('ismaster')
        except:
            return False
        return True