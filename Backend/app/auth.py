from flask import Blueprint, render_template, redirect, url_for, request, flash, jsonify
from werkzeug.security import check_password_hash
from flask_login import login_user, logout_user, login_required
import logging
from .models import User

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    logging.info("Login request received")
    if request.method == 'POST':
        data = request.get_json()  # Get data as JSON
        logging.info(f"Data received: {data}")
        username = data.get('username')
        password = data.get('password')
        user = User.query.filter_by(username=username).first()

        if user and check_password_hash(user.password_hash, password) == False:
            login_user(user)
            return jsonify({'message': 'Logged in successfully'}), 200
        else:
            return jsonify({'error': 'Invalid username or password'}), 401
    return render_template('login.html')

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))


