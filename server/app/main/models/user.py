from app import bcrypt, db


class UserModel(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email    = db.Column(db.String(800))
    password = db.Column(db.String(80))

    def __init__(self, email, password):
        self.email    = email
        self.password = self.hashed_password(password)

    @staticmethod
    def hashed_password(password):
        return bcrypt.generate_password_hash(password).decode("utf-8")

    def json(self):
        return {
            'id'      : self.id,
            'email'   : self.email
        }

    @classmethod
    def find_by_email(cls, email, password):
        user = cls.query.filter_by(email=email).first()
        if user:
            pwhash = bcrypt.check_password_hash(user.password, password)
            if pwhash:
                return user
        return None

    @classmethod
    def find_by_id(cls, user_id):
        return cls.query.filter_by(id=user_id).first()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()