from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, session
from .models import *
from flask import current_app as app
from . import mongo
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
from flask_login import login_required, current_user
from bson import ObjectId
from pymongo.errors import PyMongoError
import os

main = Blueprint('main', __name__)

@main.route('/')
def home():
    return render_template('home.html', name='Student')

@main.route('/show_add_user_form', methods=['GET'])
def show_add_user_form():
    return render_template('add_user.html')

@main.route('/signup', methods=['GET', 'POST'])
def add_user():
    if request.method == 'POST':
        data = request.get_json()
        username = data['username']
        email = data['email']
        password = data['password']  
        password_hash = generate_password_hash(password)

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'User with this email already exists'}), 400

        new_user = User(username=username, email=email, password_hash=password_hash)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User registered successfully', 'user': {
                        'id': new_user.id,
                        'username': new_user.username,
                        'email': new_user.email
                    }}), 201

@main.route('/users')
def list_users():
    users = User.query.all()
    return render_template('users.html', users=users)

@main.route('/get_user/<user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if user:
         return jsonify({'username': user.username, 'id': user.id})
    else:
        return jsonify({'error': 'User not found'}), 404

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg', 'gif'}

@main.route('/add_article', methods=['GET', 'POST'])
#@login_required
def add_article():
    if request.method == 'POST':
        title = request.form.get('title')
        user_id = request.form.get('user_id')
        category_id = request.form.get('category_id')

        # Storing content and other unstructured data in MongoDB
        summary = request.form.get('summary')
        image = request.files.get('article_image')

        print("Received file:", image)

        if image and allowed_file(image.filename):
            filename = secure_filename(image.filename)
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image.save(image_path)

        article_content = {
            "summary": summary,
            "comments": [],  # Empty list to hold future comments
            "images": [filename] if filename else []
        }

        try:
            article_content_id = mongo.db.articles.insert_one(article_content).inserted_id
            print("Document inserted successfully into MongoDB")
            print("Article Content ID:", article_content_id)
        except Exception as e:
            print("Error inserting document into MongoDB:", e)

        new_article = Article(title=title, content_mongodb_id=str(article_content_id), publish_date=datetime.utcnow(), user_id=user_id, category_id=category_id)
        print("Article Content ID before commit:", new_article.content_mongodb_id)
        db.session.add(new_article)
        try:
            db.session.commit()
            print("Article inserted successfully into MySQL")
            print("Article Content ID after commit:", new_article.content_mongodb_id)
        except Exception as e:
            print("Error inserting article into MySQL:", e)

        return redirect(url_for('main.list_articles'))

    # On GET request, show the article addition form, might need to pass categories for the dropdown
    categories = Category.query.all()  # Assuming you have a Category model and want to display categories
    return render_template('add_article.html', categories=categories)

@main.route('/article_content/<article_id>', methods=['GET'])
def article_content(article_id):
    article = Article.query.get(article_id)  # Fetching from MySQL
    if article:
        mongo_content = mongo.db.articles.find_one({"_id": ObjectId(article.content_mongodb_id)})
        if mongo_content:
            content = mongo_content.get('summary', 'No content found')
            comments = mongo_content.get('comments', [])
            images = mongo_content.get('images', [])
            return render_template('article_content.html', article=article, content=content, comments=comments, images=images)
        else:
            return render_template('error.html', message="Content not found in MongoDB")
    else:
        return render_template('error.html', message="Article not found")


@main.route('/articles', methods=['GET'])
def list_articles():
    articles_data = []
    articles = Article.query.all()
    for article in articles:
        article_info = {
            "id": article.id,
            "title": article.title,
            "publish_date": article.publish_date,
            "user_id": article.user_id,
            "category_id": article.category_id,
            "summary": None,
            "comments": [],
            "images": []
         }
        if article.content_mongodb_id:
            content = mongo.db.articles.find_one({"_id": ObjectId(article.content_mongodb_id)})
            if content:
                article_info["summary"] = content.get("summary")
                article_info["comments"] = content.get("comments")
                article_info["images"] = content.get("images")
        
        articles_data.append(article_info)

    return jsonify(articles_data) 

@main.route('/add_comment/<article_id>', methods=['POST'])
#@login_required
def add_comment(article_id):
    content = request.json.get('content')
    article = Article.query.get(article_id)
    if article:
        try:
            mongo.db.articles.update_one({"_id": ObjectId(article.content_mongodb_id)}, {"$push": {"comments": content}})
            return jsonify({'message': 'Comment added successfully'}), 200
        except PyMongoError as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Article not found'}), 404


@main.route('/get_comments/<article_id>', methods=['GET'])
def get_comments(article_id):
    try:
        article = Article.query.get(article_id)
        if article:
            mongo_content = mongo.db.articles.find_one({"_id": ObjectId(article.content_mongodb_id)})
            if mongo_content:
                comments = mongo.db.articles.find_one({"_id": ObjectId(article.content_mongodb_id)}, {"comments": 1})
                comments = mongo_content.get('comments', [])
                return render_template('articles.html', article=article, comments=comments)
            else:
                return jsonify({"error": "No comments found"}), 404
        else:
            return jsonify({"error": "Article or MongoDB ID not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@main.route('/add_category', methods=['GET', 'POST'])
def add_category():
    if request.method == 'POST':
        data = request.get_json()
        new_category_name = data['name']

        new_category = Category(name=new_category_name)
        db.session.add(new_category)
        db.session.commit()

    return jsonify({'id': new_category.id, 'name': new_category.name}), 201

@main.route('/categories')
def list_categories():
    categories = Category.query.all()
    category_list = [{'id': cat.id, 'name': cat.name} for cat in categories]
    return jsonify(category_list)

@main.route('/userArticles/<user_id>', methods=['GET'])
def list_user_articles(user_id):
    articles_data = []
    articles = Article.query.filter_by(user_id=user_id).all()
    for article in articles:
        article_info = {
            "id": article.id,
            "title": article.title,
            "publish_date": article.publish_date.strftime('%Y-%m-%d %H:%M:%S'),
            "user_id": article.user_id,
            "category_id": article.category_id,
            "summary": None,
            "comments": [],
            "images": []
        }
        if article.content_mongodb_id:
            content = mongo.db.articles.find_one({"_id": ObjectId(article.content_mongodb_id)})
            if content:
                article_info["summary"] = content.get("summary")
                article_info["comments"] = content.get("comments", [])
                article_info["images"] = content.get("images", [])
        
        articles_data.append(article_info)

    return jsonify(articles_data)

@main.route('/delete_article/<article_id>', methods=['DELETE'])
@login_required
def delete_article(article_id):
    article = Article.query.get(article_id)
    if article is None:
        return jsonify({'error': 'Article not found'}), 404

    if article.user_id != session['user_id']:
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(article)
    db.session.commit()
    return jsonify({'message': 'Article deleted successfully'}), 200

@main.route('/update_article/<article_id>', methods=['POST'])
@login_required
def update_article(article_id):
    article = Article.query.get(article_id)
    if article and article.user_id == session['user_id']:
        article.title = request.json.get('title', article.title)
        article.summary = request.json.get('summary', article.summary)
        db.session.commit()
        return jsonify({'message': 'Article updated successfully'}), 200
    return jsonify({'error': 'Article not found or unauthorized'}), 404