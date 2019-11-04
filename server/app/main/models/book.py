from app import db
from sqlalchemy.sql import expression
from app.main.models.category import categoryAndBooks

class BookModel(db.Model):
    __tablename__ = 'books'

    id               = db.Column(db.Integer, primary_key=True)
    bookId           = db.Column(db.String(800))
    title            = db.Column(db.Text)
    description      = db.Column(db.Text)
    author           = db.Column(db.Text)
    image            = db.Column(db.Text)
    year             = db.Column(db.String(80))
    pages            = db.Column(db.String(80))
    link             = db.Column(db.Text)
    isRead           = db.Column(db.Boolean, server_default=expression.false(), nullable=False)

    categories       = db.relationship('CategoryModel', secondary=categoryAndBooks, uselist=True, lazy = 'dynamic')

    shelf_id         = db.Column(db.Integer, db.ForeignKey('shelfs.id'))
    shelf            = db.relationship('ShelfModel')

    user_id          = db.Column(db.Integer, db.ForeignKey('users.id'))
    user             = db.relationship('UserModel')

    def __init__(self, bookId, title, description, author, image, year, pages, link, isRead, shelf_id, user_id, categories):
        self.bookId             = bookId
        self.title              = title
        self.description        = description
        self.author             = author
        self.image              = image
        self.year               = year
        self.pages              = pages
        self.link               = link
        self.shelf_id           = shelf_id
        self.user_id            = user_id
        self.isRead             = isRead
        self.categories         = categories or []

    def json(self):
        return {
            'id'            : self.id,
            'bookId'        : self.bookId,
            'title'         : self.title,
            'description'   : self.description,
            'author'        : self.author,
            'image'         : self.image,
            'year'          : self.year,
            'pages'         : self.pages,
            'link'          : self.link,
            'shelf_id'      : self.shelf_id,
            'user_id'       : self.user_id,
            'isRead'        : self.isRead,
            'categories'    : [category.id for category in self.categories],
        }


    @classmethod
    def find_by_id(cls, bookId, shelfId, user_id):
        return cls.query.filter_by(bookId=bookId).filter_by(shelf_id=shelfId).filter_by(user_id=user_id).first()

    @classmethod
    def find_all(cls):
        return cls.query.all()

    def update(self, key, value):
        setattr(self, key, value)

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()