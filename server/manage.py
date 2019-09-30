import os

from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager

from app import app, db


migrate = Migrate(app, db)
manager = Manager(app)

# migrations
manager.add_command('db', MigrateCommand)



@manager.command
def create_db():
    """Creates the db tables."""
    db.create_all()


@manager.command
def run():
    app.run()


if __name__ == '__main__':
    manager.run()