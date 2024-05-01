from flask import Blueprint
from . import db

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/init_db')
def init_db():
    db.create_all()
    return "Database tables created."
