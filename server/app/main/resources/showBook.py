from flask_restful import Resource, reqparse, request
from flask import jsonify
import requests
from app.main.helper import showBookApply
from app.main.config import BaseConfig


class ShowBook(Resource):
    def get(self, id):
        response = requests.get('https://www.goodreads.com/book/show/' + id + '.xml',
            params={'key': BaseConfig.GOODREADS_KEY})
        book = showBookApply(response.content)
        if book:
            return book
        return {'message': 'book not found'}, 404
