from flask import Blueprint, jsonify, request
from sqlalchemy import func
from models import db, SUC

sucs_bp = Blueprint('sucs', __name__)


def _suc_to_dict(s):
    return {
        'id': s.id,
        'region': s.region,
        'name': s.name,
        'abbreviation': s.abbreviation,
        'type': s.type,
    }


@sucs_bp.route('/api/sucs', methods=['GET', 'OPTIONS'])
def get_sucs():
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        sucs = SUC.query.filter_by(is_active=True).order_by(SUC.name).all()
        return jsonify([_suc_to_dict(s) for s in sucs]), 200
    except Exception as e:
        return jsonify({"detail": str(e)}), 500


@sucs_bp.route('/api/sucs/add', methods=['POST', 'OPTIONS'])
def add_suc():
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        data = request.get_json(silent=True) or {}

        name = (data.get('name') or '').strip()
        region = (data.get('region') or '').strip()
        abbreviation = (data.get('abbreviation') or '').strip()
        suc_type = (data.get('type') or '').strip()

        missing = [label for label, value in (
            ('Name', name), ('Region', region),
            ('Abbreviation', abbreviation), ('Type', suc_type)
        ) if not value]
        if missing:
            return jsonify({"detail": f"{', '.join(missing)} required"}), 400

        # Case-insensitive duplicate check
        existing = SUC.query.filter(func.lower(SUC.name) == name.lower()).first()
        if existing:
            return jsonify({
                "message": "University/Agency already exists",
                **_suc_to_dict(existing),
            }), 200

        new_suc = SUC(
            name=name,
            region=region,
            abbreviation=abbreviation,
            type=suc_type,
            is_active=True,
        )
        db.session.add(new_suc)
        db.session.commit()
        return jsonify({
            "message": "University/Agency added successfully",
            **_suc_to_dict(new_suc),
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"detail": str(e)}), 500