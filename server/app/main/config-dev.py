import os

class BaseConfig(object):
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    JWT_SECRET_KEY = "mcnmcnionvinvein"
    DEBUG = True
    GOODREADS_KEY = ""
    SQLALCHEMY_DATABASE_URI = "mysql://root:123456@localhost:3306/books"