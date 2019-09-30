import os

class BaseConfig(object):
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    DEBUG = os.environ.get('DEBUG')
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    GOODREADS_KEY = os.environ.get('GOODREADS_KEY')
