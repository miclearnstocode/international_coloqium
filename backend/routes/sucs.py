from flask import Blueprint, jsonify, request
from models import db, SUC

sucs_bp = Blueprint('sucs', __name__)


@sucs_bp.route('/api/sucs', methods=['GET', 'OPTIONS'])
def get_sucs():
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        sucs = SUC.query.filter_by(is_active=True).order_by(SUC.name).all()
        return jsonify([{
            'id': s.id, 'region': s.region, 'name': s.name,
            'abbreviation': s.abbreviation,
        } for s in sucs]), 200
    except Exception as e:
        return jsonify({"detail": str(e)}), 500


@sucs_bp.route('/api/sucs/add', methods=['POST', 'OPTIONS'])
def add_suc():
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        data = request.get_json()
        name = (data.get('name') or '').strip()
        region = data.get('region', 'National')
        if not name:
            return jsonify({"detail": "University/Agency name is required"}), 400

        existing = SUC.query.filter_by(name=name).first()
        if existing:
            return jsonify({"message": "University/Agency already exists", "id": existing.id}), 200

        new_suc = SUC(name=name, region=region, abbreviation='', type='Other', is_active=True)
        db.session.add(new_suc)
        db.session.commit()
        return jsonify({
            "message": "University/Agency added successfully",
            "id": new_suc.id, "name": new_suc.name,
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"detail": str(e)}), 500