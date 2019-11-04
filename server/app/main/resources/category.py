from flask_restful import Resource, reqparse
from app.main.models.category import CategoryModel


class Category(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('user_id',
                        type=int,
                        required=True,
                        help="Every category needs a user_id."
                        )
    parser.add_argument('image',
                        type=str,
                        required=False,
                        help="Every category needs a imageUrl."
                        )
    parser.add_argument('books',
                    type=list,
                    required=False,
                    help="Books."
                    )

    @classmethod
    def get(cls, category_id, user_id):
        category = CategoryModel.find_by_id(category_id, user_id)
        if category:
            return category.json()
        return {'message': 'category not found'}, 404

    @classmethod
    def post(self, name, user_id):
        if CategoryModel.find_by_name(name,user_id):
            return {'message': "A category with name '{}' already exists.".format(name)}, 400

        data = self.parser.parse_args()

        category = CategoryModel(name, **data)
        try:
            category.save_to_db()
        except:
            return {"message": "An error occurred creating the category."}, 500

        return category.json(), 201


    @classmethod
    def put(self, category_id, user_id, book_id):

        category = CategoryModel.find_by_id(category_id, user_id)

        if category:
             categoryBooks = list(filter(lambda book: book.id != book_id, category.books))
             category.books = categoryBooks
             category.save_to_db()

        return category.json() if category else {}


    @classmethod
    def delete(cls, category_id, user_id):
        category = CategoryModel.find_by_id(category_id, user_id)
        if category:
            category.delete_from_db()

        return {'message': 'category deleted'}


class CategoriesList(Resource):
    @classmethod
    def get(cls, user_id):
        return {'categories': [category.json() for category in CategoryModel.find_all(user_id)]}