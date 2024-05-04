from flask import Blueprint, render_template, redirect, url_for, request, flash, jsonify, session
from werkzeug.security import check_password_hash
from flask_login import login_user, logout_user, login_required, current_user
import logging
from .models import User

auth = Blueprint('auth', __name__)

logging.basicConfig(level=logging.INFO)


@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        logging.info("Login request received")
        data = request.get_json()  # Get data as JSON
        logging.info(f"Data received: {data}")
        username = data.get('username')
        password = data.get('password')
        user = User.query.filter_by(username=username).first()

        if user:
            logging.info(f"User found: {user.username}")
            if check_password_hash(user.password_hash, password):
                login_user(user)
                session['user_id'] = user.id
                return jsonify({
                    'message': 'Logged in successfully',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email
                    }
                }), 200
            else:
                logging.warning("Password mismatch")
        else:
            logging.warning("User not found")

        return jsonify({'error': 'Invalid username or password'}), 401
    
    if request.method == 'GET':
        if current_user.is_authenticated:
            return jsonify({
                'message': 'User already logged in',
                'user': {
                    'id': current_user.id,
                    'username': current_user.username,
                    'email': current_user.email
                }
            }), 200

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))


