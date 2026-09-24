from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity
import traceback
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
            "user": sum(1 for u in users if u.role == 'user'),
        }

        return jsonify({"users": result, "stats": stats}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"detail": str(e)}), 500


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
            if new_role not in ('user', 'staff', 'admin'):
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

        user = User.query.get(user_id)
        if not user:
            return jsonify({"detail": "User not found"}), 404

        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({"detail": str(e)}), 500
    