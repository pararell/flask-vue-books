from flask_restful import Resource, reqparse
from app.main.models.shelf import ShelfModel


class Shelf(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('user_id',
                        type=int,
                        required=True,
                        help="Every shelf needs a user_id."
                        )
    parser.add_argument('category',
                        type=str,
                        required=False,
                        help="Every shelf needs a category."
                        )
    parser.add_argument('image',
                        type=str,
                        required=False,
                        help="Every shelf needs a imageUrl."
                        )
    parser.add_argument('books',
                        type=list,
                        required=False,
                        help="Books."
                        )

    @classmethod
    def get(cls, shelf_id, user_id):
        shelf = ShelfModel.find_by_id(shelf_id, user_id)
        if shelf:
            return shelf.json()
        return {'message': 'shelf not found'}, 404

    @classmethod
    def post(self, name, user_id):
        if ShelfModel.find_by_name(name,user_id):
            return {'message': "A shelf with name '{}' already exists.".format(name)}, 400

        data = self.parser.parse_args()

        shelf = ShelfModel(name, **data)
        try:
            shelf.save_to_db()
        except:
            return {"message": "An error occurred creating the shelf."}, 500

        return shelf.json(), 201

    @classmethod
    def delete(cls, shelf_id, user_id):
        shelf = ShelfModel.find_by_id(shelf_id, user_id)
        if shelf:
            shelf.delete_from_db()

        return {'message': 'shelf deleted'}


class ShelfList(Resource):
    @classmethod
    def get(cls, user_id):
        return {'shelfs': [shelf.json() for shelf in ShelfModel.find_all(user_id)]}