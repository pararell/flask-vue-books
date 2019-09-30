from flask_restful import Resource, reqparse, request
from flask import jsonify
import requests
from app.main.helper import searchByQuery
from app.main.config import BaseConfig

class SearchBook(Resource):
    def get(self, name):
        response = requests.get('https://www.goodreads.com/search/index.xml',
            params={'q' : name, 'key': BaseConfig.GOODREADS_KEY })
        books = searchByQuery(response.content)
        if books:
            return books
        return {'message': 'books not found'}, 404
