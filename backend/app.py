from functools import wraps
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity, verify_jwt_in_request
from datetime import timedelta
import os, traceback

from routes import ALL_BLUEPRINTS
from models import (
    db,
    User,
    SUC,
)

load_dotenv()
MAIL_SERVER = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
MAIL_PORT = int(os.getenv('MAIL_PORT', 587))
MAIL_USERNAME = os.getenv('MAIL_USERNAME')
MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
MAIL_FROM = os.getenv('MAIL_FROM', MAIL_USERNAME)
MAIL_FROM_NAME = os.getenv('MAIL_FROM_NAME', 'Symposium Portal')
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['JWT_SECRET_KEY'] =  os.getenv('JWT_SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'mysql+pymysql://root:@127.0.0.1:3306/researchdb')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAX_CONTENT_LENGTH'] = 64 * 1024 * 1024 

db.init_app(app)     
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# CORS configuration
CORS(app, 
     origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5000", "http://127.0.0.1:5000"],
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization", "Accept", "X-Requested-With"],
     expose_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     max_age=3600
)


@jwt.unauthorized_loader
def missing_token_callback(reason):
    return jsonify({
        "detail": "Missing authorization token",
        "error": "unauthorized"
    }), 401

@jwt.invalid_token_loader
def invalid_token_callback(reason):
    return jsonify({
        "detail": "Invalid authorization token",
        "error": "invalid_token"
    }), 422

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({
        "detail": "Token has expired. Please login again.",
        "error": "token_expired"
    }), 401

@jwt.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_payload):
    return jsonify({
        "detail": "Token has been revoked",
        "error": "token_revoked"
    }), 401
    
# Create tables
with app.app_context():
    db.create_all()

# ── Register blueprints ──
for bp in ALL_BLUEPRINTS:
    app.register_blueprint(bp)

# Global Error Handler
@app.errorhandler(Exception)
def handle_exception(e):
    traceback.print_exc()
    if hasattr(e, 'code') and e.code:
        return jsonify({"msg": str(e.description or "Error")}), e.code
    return jsonify({"error": str(e)}), 500

def super_admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if request.method == 'OPTIONS':
            return jsonify({}), 200

        verify_jwt_in_request()
        user_id = int(get_jwt_identity())      # ← cast back to int
        user = User.query.get(user_id)
        if not user or user.role != 'admin':
            return jsonify({"detail": "Super admin access required"}), 403
        return fn(*args, **kwargs)
    return wrapper

@app.route('/')
def home():
    return jsonify({"message": "International Colloquium Backend is running!"})

@app.route('/api/test-cors', methods=['GET', 'OPTIONS'])
def test_cors():
    if request.method == 'OPTIONS':
        return jsonify({})
    return jsonify({"message": "CORS is working!"})

@app.route('/api/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        data = request.get_json()
        if not data.get('full_name') or not data.get('email') or not data.get('password'):
            return jsonify({"detail": "All fields are required"}), 400
        
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({"detail": "Email already registered"}), 400
        
        password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        new_user = User(full_name=data['full_name'], email=data['email'], password_hash=password_hash, role='user')
        
        db.session.add(new_user)
        db.session.commit()
        
        access_token = create_access_token(identity=str(new_user.id), expires_delta=timedelta(days=7))
        
        return jsonify({
            "message": "User created successfully",
            "access_token": access_token,
            "user": {"id": new_user.id, "full_name": new_user.full_name, "email": new_user.email, "role": new_user.role}
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"detail": str(e)}), 500

@app.route('/api/login', methods=['POST', 'GET', 'OPTIONS'])
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
        
        access_token = create_access_token(identity=str(user.id), expires_delta=timedelta(days=7))
        refresh_token = create_refresh_token(identity=str(user.id))
        
        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {"id": user.id, "full_name": user.full_name, "email": user.email, "role": user.role}
        }), 200
        
    except Exception as e:
        return jsonify({"detail": str(e)}), 500


@app.route('/api/sucs/add', methods=['POST', 'OPTIONS'])
def add_suc():
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        data = request.get_json()
        name = data.get('name', '').strip()
        region = data.get('region', 'National')
        
        if not name:
            return jsonify({"detail": "University/Agency name is required"}), 400
        
        # Check if already exists
        existing_suc = SUC.query.filter_by(name=name).first()
        if existing_suc:
            return jsonify({"message": "University/Agency already exists", "id": existing_suc.id}), 200
        
        # Create new SUC entry
        new_suc = SUC(
            name=name,
            region=region,
            abbreviation='',
            type='Other',
            is_active=True
        )
        
        db.session.add(new_suc)
        db.session.commit()
        
        return jsonify({
            "message": "University/Agency added successfully",
            "id": new_suc.id,
            "name": new_suc.name
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"detail": str(e)}), 500

@app.route('/api/sucs', methods=['GET', 'OPTIONS'])
def get_sucs():
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        sucs = SUC.query.filter_by(is_active=True).order_by(SUC.name).all()
        result = [{'id': s.id, 'region': s.region, 'name': s.name, 'abbreviation': s.abbreviation} for s in sucs]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"detail": str(e)}), 500


@app.route('/api/auth/me', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_current_user():
    """Return the currently authenticated user's info."""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({"detail": "User not found"}), 404
        return jsonify(user.to_dict()), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"detail": str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True, port=5000, host='127.0.0.1')