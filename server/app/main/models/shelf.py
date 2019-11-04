from app import db


class ShelfModel(db.Model):
    __tablename__ = 'shelfs'

    id       = db.Column(db.Integer, primary_key=True)
    name     = db.Column(db.Text)
    image    = db.Column(db.Text)
    category = db.Column(db.Text)

    books    = db.relationship('BookModel', lazy = 'dynamic')

    user_id  = db.Column(db.Integer, db.ForeignKey('users.id'))
    user     = db.relationship('UserModel')

    def __init__(self, name, category, image, books, user_id):
        self.name       = name
        self.category   = category
        self.image      = image
        self.books      = books or []
        self.user_id    = user_id

    def json(self):
        return {
            'id'         : self.id,
            'name'       : self.name,
            'image'      : self.image,
            'category'   : self.category,
            'books'     : [book.json() for book in self.books.all()],
            'user_id'    : self.user_id
        }

    @classmethod
    def find_by_name(cls, name, user_id):
        return cls.query.filter_by(user_id=user_id).filter_by(name=name).first()

    @classmethod
    def find_by_id(cls, id, user_id):
        return cls.query.filter_by(user_id=user_id).filter_by(id=id).first()

    @classmethod
    def find_all(cls, user_id):
        return cls.query.filter_by(user_id=user_id).all()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()