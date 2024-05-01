from . import db
from datetime import datetime 
from flask_login import UserMixin


class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    articles = db.relationship('Article', backref='author', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'


class Article(db.Model):
    __tablename__ = 'articles'
    id = db.Column(db.Integer, primary_key=True)
    content_mongodb_id = db.Column(db.String(255), nullable=False) 
    title = db.Column(db.String(255), nullable=False)
    publish_date = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id')) 

    def __repr__(self):
        return f'<Article {self.title}>'



class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True)
    articles = db.relationship('Article', backref='category', lazy=True)

    def __repr__(self):
        return f'<Category {self.name}>'
