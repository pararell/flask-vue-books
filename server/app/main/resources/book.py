from flask_restful import Resource, reqparse
from flask_jwt_extended import get_jwt_identity, jwt_required, get_jwt_claims, fresh_jwt_required, jwt_optional
from app.main.models.book import BookModel
from app.main.models.category import CategoryModel
from app.main.helper import detailBookApply
from app.main.config import BaseConfig
import requests
from sqlalchemy import exc
from app import db
import sys

"""
The following resources contain endpoints that are protected by jwt,
one may need a valid access token, a valid fresh token or a valid token with authorized privilege
to access each endpoint, details can be found in the README.md doc.
"""


class Book(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('isRead',
                        type=bool,
                        required=True,
                        help="Read on not read, that is the question"
                        )
    parser.add_argument('title',
                        type=str,
                        required=True,
                        help="Every book needs a title."
                        )
    parser.add_argument('pages',
                        type=float,
                        required=True,
                        help="This field cannot be left blank!"
                        )
    parser.add_argument('shelf_id',
                        type=int,
                        required=True,
                        help="Every book needs a shelf_id."
                        )
    parser.add_argument('user_id',
                        type=int,
                        required=True,
                        help="Every book needs a user_id."
                        )
    parser.add_argument('author',
                        type=str,
                        required=True,
                        help="Every book needs a author."
                        )
    parser.add_argument('bookId',
                        type=str,
                        required=True,
                        help="Every book needs a bookId."
                        )
    parser.add_argument('image',
                        type=str,
                        required=True,
                        help="Every book needs a image."
                        )
    parser.add_argument('description',
                        type=str,
                        required=True,
                        help="Every book needs a description."
                        )
    parser.add_argument('link',
                        type=str,
                        required=True,
                        help="Every book needs a link."
                        )
    parser.add_argument('year',
                        type=str,
                        required=True,
                        help="Every book needs a year."
                        )
    parser.add_argument('categories',
                    type=list,
                    required=False,
                    help="Categories."
                    )

    @jwt_required
    def get(self, shelf_id, bookId, user_id):
        fullBook = {}
        book = BookModel.find_by_id(bookId, shelf_id, user_id)

        goodreadsResponse = requests.get('https://www.goodreads.com/book/show/'"{}"'.xml'.format(bookId),
            params={'key': BaseConfig.GOODREADS_KEY})
        goodReadsbook = detailBookApply(goodreadsResponse.content)

        fullBook = {
            'book'          : book.json() if book else {},
            'similarBooks'  : goodReadsbook['similarBooks'],
            'reviews'       : goodReadsbook['reviews']
        }

        if book:
            return fullBook
        return {'message': 'book not found'}, 404

    @jwt_required
    def post(self, shelf_id, bookId, user_id):

        if BookModel.find_by_id(bookId, shelf_id, user_id):
            return {'message': "An book with bookId '{}' already exists.".format(bookId)}, 400

        data = self.parser.parse_args()

        book = BookModel(**data)

        try:
            book.save_to_db()
        except exc.IntegrityError as e:
            db.session().rollback()
        except:
            print("Unexpected error:", sys.exc_info()[0])
            return {"message": "An error occurred while inserting the book."}, 500

        return book.json(), 201

    @jwt_required
    def delete(self, shelf_id, bookId, user_id):
        # claims = get_jwt_claims()
        # if not claims['is_admin']:
        #     return {'message': 'Admin privilege required.'}, 401

        book = BookModel.find_by_id(bookId, shelf_id, user_id)
        book.categories = []
        if book:
            book.delete_from_db()
            return {'message': 'book deleted.'}
        return {'message': 'book not found.'}, 404


    @jwt_required
    def put(self, shelf_id, bookId, category_id, user_id):

        book = BookModel.find_by_id(bookId, shelf_id, user_id)
        category = CategoryModel.find_by_id(category_id, user_id)

        if book:
            book.categories.append(category)
            book.save_to_db()

        return book.json() if book else {}


class BookList(Resource):
    @jwt_optional
    def get(self):
        user_id = get_jwt_identity()
        books = [book.json() for book in BookModel.find_all()]
        if user_id:
            return {'books': books}, 200
        return {
            'books': [book['title'] for book in books],
            'message': 'More data available if you log in.'
        }, 200