from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os
from flask_login import LoginManager
from flask_cors import CORS


db = SQLAlchemy()  # Import and initialize db here
mongo = PyMongo()

login_manager = LoginManager()

from .models import User

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

load_dotenv()  # Load environment variables

def create_app():
    app = Flask(__name__, static_folder='D:/Maria Boussenah/2CS/BDDD/PROJET/Backend/static')
    CORS(app)
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Gets the directory where the script runs
    app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'static', 'uploads')

    # Ensure the upload directory exists
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', default='a_super_secret_key')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://flaskuser:{os.getenv("FLASK_DATABASE_PASSWORD")}@localhost/relational_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config["MONGO_URI"] = "mongodb://localhost:27017/non_relational_db"

    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'

    db.init_app(app)  # Initialize db inside create_app
    mongo.init_app(app)

    from app.routes import main
    from app.admin import admin_bp
    from .auth import auth as auth_blueprint

    app.register_blueprint(main)
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(auth_blueprint)


    return app
