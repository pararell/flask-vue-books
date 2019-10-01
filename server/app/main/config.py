import os

class BaseConfig(object):
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    JWT_SECRET_KEY =  os.environ.get('JWT_SECRET_KEY')
    DEBUG = os.environ.get('DEBUG')
    GOODREADS_KEY = os.environ.get('GOODREADS_KEY')
    DATABASE_URL = os.environ.get('DATABASE_URL')