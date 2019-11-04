from app import db

categoryAndBooks = db.Table('catandbooks',
    db.Column('category_id', db.Integer, db.ForeignKey('categories.id')),
    db.Column('book_id', db.Integer, db.ForeignKey('books.id'))
)

class CategoryModel(db.Model):
    __tablename__ = 'categories'

    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.Text)
    image       = db.Column(db.Text)

    books    = db.relationship('BookModel', secondary=categoryAndBooks, uselist=True, lazy = 'dynamic')

    user_id  = db.Column(db.Integer, db.ForeignKey('users.id'))
    user     = db.relationship('UserModel')


    def __init__(self, name, image, user_id, books):
        self.name       = name
        self.image      = image
        self.books      = books or []
        self.user_id    = user_id

    def json(self):
        return {
            'id'            : self.id,
            'name'          : self.name,
            'image'         : self.image,
            'books'         : [book.json() for book in self.books],
            'user_id'       : self.user_id
        }

    @classmethod
    def find_by_name(cls, name, user_id):
        return cls.query.filter_by(user_id=user_id).filter_by(name=name).first()

    @classmethod
    def find_by_id(cls, category_id, user_id):
        return cls.query.filter_by(user_id=user_id).filter_by(id=category_id).first()

    @classmethod
    def find_all(cls, user_id):
        return cls.query.filter_by(user_id=user_id).all()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()