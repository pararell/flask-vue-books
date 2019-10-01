from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_restful import Api

from .main.blacklist import BLACKLIST
from .main.config import BaseConfig


app = Flask(__name__, static_folder="./static/dist", template_folder="./static")
app.config.from_object(BaseConfig)
db = SQLAlchemy(app)
bcrypt = Bcrypt()
jwt = JWTManager(app)
api = Api(app)


@jwt.user_claims_loader
def add_claims_to_jwt(identity):
    if identity == 1:   # instead of hard-coding, we should read from a config file to get a list of admins instead
        return {'is_admin': True}
    return {'is_admin': False}


# This method will check if a token is blacklisted, and will be called automatically when blacklist is enabled
@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    return decrypted_token['jti'] in BLACKLIST


@jwt.invalid_token_loader
def invalid_token_callback(error):  # we have to keep the argument here, since it's passed in by the caller internally
    return jsonify({
        'message': 'Signature verification failed.',
        'error': 'invalid_token'
    }), 401


@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({
        "description": "Request does not contain an access token.",
        'error': 'authorization_required'
    }), 401


@jwt.needs_fresh_token_loader
def token_not_fresh_callback():
    return jsonify({
        "description": "The token is not fresh.",
        'error': 'fresh_token_required'
    }), 40


@jwt.revoked_token_loader
def revoked_token_callback():
    return jsonify({
        "description": "The token has been revoked.",
        'error': 'token_revoked'
    }), 401


# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})

from .main.resources.user import UserRegister, UserLogin, User, TokenRefresh, UserLogout
from .main.resources.book import Book, BookList
from .main.resources.searchBook import SearchBook
from .main.resources.showBook import ShowBook
from .main.resources.shelf import Shelf, ShelfList
db.create_all()


api.add_resource(Shelf, '/api/shelf/<string:name>/<int:user_id>')
api.add_resource(ShelfList, '/api/shelfs/<int:user_id>')
api.add_resource(Book, '/api/book/<int:shelf_id>/<int:bookId>')
api.add_resource(SearchBook, '/api/searchBook/<string:name>')
api.add_resource(ShowBook, '/api/showBook/<string:id>')
api.add_resource(BookList, '/api/books')
api.add_resource(UserRegister, '/api/register')
api.add_resource(UserLogin, '/api/login')
api.add_resource(User, '/api/user/<int:user_id>')
api.add_resource(TokenRefresh, '/api/refresh')
api.add_resource(UserLogout, '/api/logout')
