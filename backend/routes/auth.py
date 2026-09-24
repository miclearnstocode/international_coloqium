from flask import Blueprint, jsonify, request
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required, get_jwt_identity,
)
from datetime import timedelta
from models import db, User

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()


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


@auth_bp.route('/api/login', methods=['POST', 'GET', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        data = request.get_json()
        if not data.get('email') or not data.get('password'):
            return jsonify({"detail": "Email and password are required"}), 400

        user = User.query.filter_by(email=data['email']).first()
        if not user or not bcrypt.check_password_hash(user.password_hash, data['password']):
            return jsonify({"detail": "Invalid email or password"}), 401

        access_token = create_access_token(
            identity=str(user.id), expires_delta=timedelta(days=7)
        )
        refresh_token = create_refresh_token(identity=str(user.id))
        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                "id": user.id, "full_name": user.full_name,
                "email": user.email, "role": user.role,
            },
        }), 200
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