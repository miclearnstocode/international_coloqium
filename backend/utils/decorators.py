from functools import wraps
from flask import jsonify, request
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from models import User


def super_admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if request.method == 'OPTIONS':
            return jsonify({}), 200

        verify_jwt_in_request()
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or user.role != 'admin':
            return jsonify({"detail": "Super admin access required"}), 403
        return fn(*args, **kwargs)
    return wrapper


def staff_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if request.method == 'OPTIONS':
            return jsonify({}), 200

        verify_jwt_in_request()
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or user.role not in ('staff', 'admin'):
            return jsonify({"detail": "Staff access required"}), 403
        return fn(*args, **kwargs)
    return wrapper

def evaluator_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user = User.query.get(int(get_jwt_identity()))
        if not user or user.role != 'evaluator':
            return jsonify({'detail': 'Evaluator access required.'}), 403
        return fn(*args, **kwargs)
    return wrapper
