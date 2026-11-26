import json
import re
import sqlite3

from flask import Blueprint, current_app, jsonify, request
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required, get_jwt_identity,
)
from datetime import timedelta
from models import db, User
from utils.login_rate_limit import consume_login_attempt

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()
MAX_LOGIN_BODY = 8 * 1024
EMAIL_PATTERN = re.compile(r"[^\s@]+@[^\s@]+")


@auth_bp.route('/api/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        data = request.get_json()
        if not data.get('full_name') or not data.get('email') or not data.get('password'):
            return jsonify({"detail": "All fields are required"}), 400

        if User.query.filter_by(email=data['email']).first():
            return jsonify({"detail": "Email already registered"}), 400

        password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        new_user = User(
            full_name=data['full_name'],
            email=data['email'],
            password_hash=password_hash,
            role='user',
        )
        db.session.add(new_user)
        db.session.commit()

        access_token = create_access_token(
            identity=str(new_user.id), expires_delta=timedelta(days=7)
        )
        return jsonify({
            "message": "User created successfully",
            "access_token": access_token,
            "user": {
                "id": new_user.id, "full_name": new_user.full_name,
                "email": new_user.email, "role": new_user.role,
            },
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"detail": str(e)}), 500


@auth_bp.post('/api/login')
def login():
    try:
        retry_after = consume_login_attempt()
    except (OSError, sqlite3.Error):
        current_app.logger.exception('Login rate limiter is unavailable')
        return jsonify({'detail': 'Sign-in is temporarily unavailable.'}), 503
    if retry_after:
        response = jsonify({'detail': 'Too many sign-in attempts. Try again shortly.', 'retry_after': retry_after})
        response.headers['Retry-After'] = str(retry_after)
        return response, 429

    if not request.is_json:
        return jsonify({'detail': 'Send an email and password as JSON.'}), 415
    if request.content_length and request.content_length > MAX_LOGIN_BODY:
        return jsonify({'detail': 'Sign-in request is too large.'}), 413
    raw = request.stream.read(MAX_LOGIN_BODY + 1)
    if len(raw) > MAX_LOGIN_BODY:
        return jsonify({'detail': 'Sign-in request is too large.'}), 413
    try:
        data = json.loads(raw)
    except (ValueError, RecursionError):
        return jsonify({'detail': 'Invalid sign-in request.'}), 400

    email = data.get('email') if isinstance(data, dict) else None
    password = data.get('password') if isinstance(data, dict) else None
    if not isinstance(email, str) or not isinstance(password, str):
        return jsonify({'detail': 'Email and password are required.'}), 400

    email = email.strip()
    try:
        password_bytes = password.encode('utf-8')
        email.encode('utf-8')
    except UnicodeError:
        return jsonify({'detail': 'Invalid email or password.'}), 400
    if not email or not EMAIL_PATTERN.fullmatch(email) or len(email) > 100 or not 1 <= len(password_bytes) <= 72:
        return jsonify({'detail': 'Invalid email or password.'}), 400

    try:
        user = db.session.execute(db.select(User).where(User.email == email)).scalar_one_or_none()
        if not user or not bcrypt.check_password_hash(user.password_hash, password_bytes):
            return jsonify({"detail": "Invalid email or password"}), 401

        remember_me = bool(data.get('remember_me', False))
        access_expiry = timedelta(days=30) if remember_me else timedelta(days=7)
        refresh_expiry = timedelta(days=60) if remember_me else timedelta(days=14)

        access_token = create_access_token(
            identity=str(user.id), expires_delta=access_expiry
        )
        refresh_token = create_refresh_token(
            identity=str(user.id), expires_delta=refresh_expiry
        )
        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                "id": user.id, "full_name": user.full_name,
                "email": user.email, "role": user.role,
            },
        }), 200
    except Exception:
        current_app.logger.exception('Login failed')
        return jsonify({'detail': 'Sign-in is temporarily unavailable.'}), 500


@auth_bp.route('/api/refresh', methods=['POST', 'OPTIONS'])
@jwt_required(refresh=True)
def refresh_token():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    try:
        user_id = get_jwt_identity()
        new_access_token = create_access_token(
            identity=str(user_id), expires_delta=timedelta(days=7)
        )
        return jsonify({"access_token": new_access_token}), 200
    except Exception as e:
        return jsonify({"detail": str(e)}), 500


@auth_bp.route('/api/auth/me', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_current_user():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({"detail": "User not found"}), 404
        return jsonify(user.to_dict()), 200
    except Exception as e:
        return jsonify({"detail": str(e)}), 500