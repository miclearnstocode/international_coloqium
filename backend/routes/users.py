from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import get_jwt_identity
import traceback
from sqlalchemy.exc import IntegrityError
from .auth import bcrypt
from models import db, User
from utils.decorators import super_admin_required

users_bp = Blueprint('users', __name__)


@users_bp.route('/api/admin/users', methods=['GET', 'OPTIONS'])
@super_admin_required
def list_users():
    """List all registered users, including the current admin."""
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        current_user_id = int(get_jwt_identity())

        users = User.query.order_by(User.created_at.desc()).all()
        result = []
        for u in users:
            data = u.to_dict()
            data['is_self'] = (u.id == current_user_id)  # flag so frontend can disable self-actions
            result.append(data)

        # Aggregate stats for the dashboard header
        stats = {
            "total": len(users),
            "admin": sum(1 for u in users if u.role == 'admin'),
            "staff": sum(1 for u in users if u.role == 'staff'),
            "evaluator": sum(1 for u in users if u.role == 'evaluator'),
            "user": sum(1 for u in users if u.role == 'user'),
        }

        return jsonify({"users": result, "stats": stats}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"detail": str(e)}), 500


@users_bp.post('/api/admin/users/evaluators')
@super_admin_required
def create_evaluator():
    data = request.get_json(silent=True)
    if not isinstance(data, dict) or any(
        not isinstance(data.get(field), str) for field in ('full_name', 'email', 'password')
    ):
        return jsonify({'detail': 'Full name, email and password are required.'}), 400

    name = data['full_name'].strip()
    email = data['email'].strip().lower()
    password = data['password']
    local, separator, domain = email.partition('@')
    if (not name or len(name) > 100 or len(email) > 100 or not separator
            or not local or not domain or '@' in domain or any(c.isspace() for c in email)):
        return jsonify({'detail': 'Enter a valid full name and email address.'}), 400
    if len(password) < 8 or len(password.encode('utf-8')) > 72:
        return jsonify({'detail': 'Use a password with at least 8 characters and at most 72 bytes.'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'detail': 'Email already registered.'}), 409

    evaluator = User(
        full_name=name,
        email=email,
        password_hash=bcrypt.generate_password_hash(password).decode('utf-8'),
        role='evaluator',
    )
    db.session.add(evaluator)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        if User.query.filter_by(email=email).first():
            return jsonify({'detail': 'Email already registered.'}), 409
        raise
    return jsonify({'user': evaluator.to_dict()}), 201


@users_bp.route('/api/admin/users/<int:user_id>', methods=['PUT', 'OPTIONS'])
@super_admin_required
def update_user(user_id):
    """Update a user's role or full name."""
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        current_user_id = int(get_jwt_identity())
        data = request.get_json() or {}

        user = User.query.get(user_id)
        if not user:
            return jsonify({"detail": "User not found"}), 404

        new_role = data.get('role')
        new_name = data.get('full_name')

        # Prevent admin from demoting themselves (avoid lockout)
        if user.id == current_user_id and new_role and new_role != 'admin':
            return jsonify({"detail": "You cannot change your own role"}), 400

        if new_role is not None:
            if new_role not in ('user', 'staff', 'admin', 'evaluator'):
                return jsonify({"detail": "Invalid role"}), 400
            user.role = new_role

        if new_name is not None:
            if not new_name.strip():
                return jsonify({"detail": "Full name cannot be empty"}), 400
            user.full_name = new_name.strip()

        db.session.commit()
        return jsonify({"message": "User updated successfully", "user": user.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({"detail": str(e)}), 500



@users_bp.route('/api/admin/users/<int:user_id>', methods=['DELETE', 'OPTIONS'])
@super_admin_required
def delete_user(user_id):
    """Delete a user (cannot delete yourself)."""
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        current_user_id = int(get_jwt_identity())

        if user_id == current_user_id:
            return jsonify({"detail": "You cannot delete your own account"}), 400

        user = db.session.get(User, user_id, with_for_update=True)
        if not user:
            return jsonify({"detail": "User not found"}), 404

        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({"detail": "This account could not be deleted because other records reference it."}), 409
    except Exception:
        db.session.rollback()
        current_app.logger.exception('Could not delete user %s', user_id)
        return jsonify({"detail": "Could not delete the account. Please try again."}), 500
