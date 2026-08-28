from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
import os, re, tempfile, traceback
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from google_drive import upload_file_to_drive
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.units import inch
from reportlab.lib import colors

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your_super_secret_key_here')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your_jwt_secret_key_here')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'mysql+pymysql://root:@127.0.0.1:3306/researchdb')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAX_CONTENT_LENGTH'] = 64 * 1024 * 1024  # 64MB max file size

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# CORS configuration
CORS(app, 
     origins=["http://localhost:3000", "http://127.0.0.1:3000"],
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization", "Accept", "X-Requested-With"],
     expose_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     max_age=3600
)

@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    if origin in ['http://localhost:3000', 'http://127.0.0.1:3000']:
        # Remove existing headers first to avoid duplicates
        response.headers.remove('Access-Control-Allow-Origin')
        response.headers.add('Access-Control-Allow-Origin', origin)
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response
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
    
    
# Models
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('user', 'staff'), nullable=False, default='user')
    created_at = db.Column(db.DateTime, server_default=db.func.now())

class AbstractSubmission(db.Model):
    __tablename__ = 'abstract_submissions'
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    selected_track = db.Column(db.String(255), nullable=False)
    specific_track = db.Column(db.String(255), nullable=False)
    research_title = db.Column(db.String(500), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    co_author = db.Column(db.Text, nullable=True)
    presenter = db.Column(db.String(255), nullable=False)
    email_address = db.Column(db.String(100), nullable=False)
    university_agency = db.Column(db.String(255), nullable=False)
    abstract = db.Column(db.Text, nullable=False)
    keywords = db.Column(db.String(255), nullable=False)
    abstract_drive_view_url = db.Column(db.String(500), nullable=True)
    abstract_drive_download_url = db.Column(db.String(500), nullable=True)
    status = db.Column(db.String(50), nullable=False, default='pending')
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
class SUC(db.Model):
    __tablename__ = 'sucs_agency'
    id = db.Column(db.Integer, primary_key=True)
    region = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(255), nullable=False, unique=True)
    abbreviation = db.Column(db.String(50), nullable=True)
    type = db.Column(db.String(50), nullable=True)
    is_active = db.Column(db.Boolean, default=True)

# Create tables
with app.app_context():
    db.create_all()

# Global Error Handler
@app.errorhandler(Exception)
def handle_exception(e):
    traceback.print_exc()
    if hasattr(e, 'code') and e.code:
        return jsonify({"msg": str(e.description or "Error")}), e.code
    return jsonify({"error": str(e)}), 500

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
        
        access_token = create_access_token(identity=new_user.id, expires_delta=timedelta(days=7))
        
        return jsonify({
            "message": "User created successfully",
            "access_token": access_token,
            "user": {"id": new_user.id, "full_name": new_user.full_name, "email": new_user.email, "role": new_user.role}
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"detail": str(e)}), 500

@app.route('/api/login', methods=['POST', 'OPTIONS'])
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
        
        access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=7))
        
        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "user": {"id": user.id, "full_name": user.full_name, "email": user.email, "role": user.role}
        }), 200
        
    except Exception as e:
        return jsonify({"detail": str(e)}), 500

# ================= USER'S PAPER SUBMISSION =================
@app.route('/api/papers/submit', methods=['POST', 'OPTIONS'])
@jwt_required()
def submit_paper():
    if request.method == 'OPTIONS':
        return jsonify({})
    
    temp_files = []
    temp_dir = None
    
    try:
        user_id = get_jwt_identity()
        
        extension_project_title = request.form.get('extension_project_title', '')
        thematic_area = request.form.get('thematic_area', '')
        paper_category = request.form.get('paper_category', '')
        suc_agencies = request.form.get('suc_agencies', '')
        author = request.form.get('author', '')
        presenter = request.form.get('presenter', '')
        co_authors = request.form.get('co_authors', '')
        
        missing_fields = []
        if not extension_project_title: missing_fields.append('extension_project_title')
        if not thematic_area: missing_fields.append('thematic_area')
        if not paper_category: missing_fields.append('paper_category')
        if not author: missing_fields.append('author')
        if not presenter: missing_fields.append('presenter')
        
        if missing_fields:
            return jsonify({"detail": f"Missing required fields: {', '.join(missing_fields)}"}), 400
        
        abstract_file = request.files.get('abstract_file')
        endorsement_file = request.files.get('endorsement_file')
        
        if not abstract_file or not abstract_file.filename:
            return jsonify({"detail": "Abstract file is required"}), 400
        if not endorsement_file or not endorsement_file.filename:
            return jsonify({"detail": "Endorsement file is required"}), 400
        
        if not abstract_file.filename.lower().endswith('.pdf'):
            return jsonify({"detail": "Abstract file must be a PDF"}), 400
        if not endorsement_file.filename.lower().endswith('.pdf'):
            return jsonify({"detail": "Endorsement file must be a PDF"}), 400
        
        safe_abstract_name = secure_filename(abstract_file.filename.replace(' ', '_'))
        safe_endorsement_name = secure_filename(endorsement_file.filename.replace(' ', '_'))
        
        temp_dir = tempfile.mkdtemp()
        abstract_path = os.path.join(temp_dir, safe_abstract_name)
        abstract_file.save(abstract_path)
        temp_files.append(abstract_path)
        
        endorsement_path = os.path.join(temp_dir, safe_endorsement_name)
        endorsement_file.save(endorsement_path)
        temp_files.append(endorsement_path)
        
        # Upload to Google Drive
        abstract_view_url, abstract_download_url = upload_file_to_drive(abstract_path, f"abstract_{safe_abstract_name}", project_title=extension_project_title)
        endorsement_view_url, endorsement_download_url = upload_file_to_drive(endorsement_path, f"endorsement_{safe_endorsement_name}", project_title=extension_project_title)
        
        new_submission = AbstractSubmission(
            user_id=user_id,
            extension_project_title=extension_project_title,
            thematic_area=thematic_area,
            paper_category=paper_category,
            suc_agencies=suc_agencies,
            author=author,
            presenter=presenter,
            status='pending',
            co_authors=co_authors if co_authors else None,
            abstract_view_url=abstract_view_url,
            abstract_download_url=abstract_download_url,
            endorsement_view_url=endorsement_view_url,
            endorsement_download_url=endorsement_download_url
        )
        
        db.session.add(new_submission)
        db.session.commit()
        
        return jsonify({
            "message": "Paper submitted successfully",
            "submission_id": new_submission.id,
            "status": "pending"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        for file_path in temp_files:
            try:
                if os.path.exists(file_path): os.remove(file_path)
            except: pass
        if temp_dir and os.path.exists(temp_dir):
            try: os.rmdir(temp_dir)
            except: pass
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

@app.route('/api/abstracts/submit', methods=['POST', 'OPTIONS'])
def submit_abstract():
    if request.method == 'OPTIONS':
        return jsonify({})
    
    temp_file_path = None
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = [
            'selected_track', 'specific_track', 'research_title', 'author', 
            'presenter', 'email_address', 'university_agency', 'abstract', 'keywords'
        ]
        for field in required_fields:
            if not data.get(field):
                return jsonify({"detail": f"{field.replace('_', ' ').title()} is required"}), 400
        
        # Check if university/agency exists in database, if not add it
        agency_name = data['university_agency']
        existing_agency = SUC.query.filter_by(name=agency_name).first()
        if not existing_agency:
            new_agency = SUC(
                name=agency_name,
                region='National',
                abbreviation='',
                type='Other',
                is_active=True
            )
            db.session.add(new_agency)
            db.session.commit()
        
        # Generate PDF
        pdf_path = generate_abstract_pdf(data)
        temp_file_path = pdf_path
        
        # Filename: Surname of Author - Research Title
        author_surname = data['author'].split(',')[0].split()[-1]
        safe_research_title = re.sub(r'[^\w\s-]', '', data['research_title']).replace(' ', '_')[:50]
        filename = f"{author_surname}_{safe_research_title}.pdf"
        
        # Upload to Google Drive
        view_url, download_url = upload_file_to_drive(
            pdf_path, 
            filename, 
            project_title=data['selected_track']
        )
        
        # Get sender_id from the data
        sender_id = data.get('sender_id')
        
        # Validate sender_id
        if not sender_id or sender_id == 0:
            # Try to get from JWT if available (optional fallback)
            try:
                from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
                verify_jwt_in_request(optional=True)
                sender_id = get_jwt_identity()
            except:
                sender_id = None
        
        # If still no sender_id, use a default or return error
        if not sender_id:
            return jsonify({"detail": "User authentication required"}), 401
        
        # Save to database with status='pending'
        new_sub = AbstractSubmission(
            sender_id=sender_id,
            user_id=sender_id,
            selected_track=data['selected_track'],
            specific_track=data['specific_track'],
            research_title=data['research_title'],
            author=data['author'],
            co_author=data.get('co_author'),
            presenter=data['presenter'],
            email_address=data['email_address'],
            university_agency=agency_name,
            abstract=data['abstract'],
            keywords=data['keywords'],
            abstract_drive_view_url=view_url,
            abstract_drive_download_url=download_url,
            status='pending'  # Set status to pending
        )
        
        db.session.add(new_sub)
        db.session.commit()
        
        # Cleanup temp PDF
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            
        return jsonify({
            "message": "Abstract submitted successfully",
            "submission_id": new_sub.id,
            "sender_id": new_sub.sender_id,
            "view_url": view_url,
            "download_url": download_url,
            "status": "pending"
        }), 201
        
    except Exception as e:
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        db.session.rollback()
        traceback.print_exc()
        return jsonify({"detail": str(e)}), 500

@app.route('/api/staff/submissions', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_all_submissions():
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.role != 'staff':
            return jsonify({"detail": "Unauthorized access"}), 403
        
        submissions = AbstractSubmission.query.order_by(AbstractSubmission.created_at.desc()).all()
        result = [{
            'id': s.id,
            'sender_id': s.sender_id,  # Add sender_id
            'user_id': s.user_id,
            'selected_track': s.selected_track,
            'specific_track': s.specific_track,
            'research_title': s.research_title,
            'author': s.author,
            'co_author': s.co_author,
            'presenter': s.presenter,
            'email_address': s.email_address,
            'university_agency': s.university_agency,
            'abstract': s.abstract,
            'keywords': s.keywords,
            'abstract_view_url': s.abstract_drive_view_url,
            'abstract_download_url': s.abstract_drive_download_url,
            'status': s.status,
            'created_at': s.created_at.strftime('%Y-%m-%d %H:%M:%S') if s.created_at else None
        } for s in submissions]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"detail": str(e)}), 500

@app.route('/api/staff/submissions/<int:submission_id>/status', methods=['PUT', 'OPTIONS'])
@jwt_required()
def update_submission_status(submission_id):
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.role != 'staff':
            return jsonify({"detail": "Unauthorized access"}), 403
        
        data = request.get_json()
        new_status = data.get('status')
        if new_status not in ['pending', 'accepted', 'rejected']:
            return jsonify({"detail": "Invalid status"}), 400
        
        submission = AbstractSubmission.query.get(submission_id)
        if not submission:
            return jsonify({"detail": "Submission not found"}), 404
        
        submission.status = new_status
        db.session.commit()
        return jsonify({"message": "Status updated successfully", "status": submission.status}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"detail": str(e)}), 500

def generate_abstract_pdf(data):
    """Generates a professional PDF for the abstract and returns the file path."""
    buffer = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    file_path = buffer.name
    buffer.close()
    
    doc = SimpleDocTemplate(
        file_path, 
        pagesize=letter,
        rightMargin=72, leftMargin=72,
        topMargin=72, bottomMargin=72
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'TitleStyle', 
        parent=styles['Title'], 
        fontSize=18, 
        spaceAfter=16, 
        textColor=colors.HexColor('#0A2540'),
        alignment=1,  # Center alignment
        fontName='Helvetica-Bold',
        leading=22
    )
    
    author_style = ParagraphStyle(
        'AuthorStyle', 
        parent=styles['Normal'], 
        fontSize=11, 
        spaceAfter=4, 
        textColor=colors.HexColor('#333333'),
        alignment=1,  # Center alignment
        fontName='Helvetica-Bold',
        leading=14
    )
    
    email_style = ParagraphStyle(
        'EmailStyle', 
        parent=styles['Normal'], 
        fontSize=10, 
        spaceAfter=2, 
        textColor=colors.HexColor('#555555'),
        alignment=1,  # Center alignment
        leading=13
    )
    
    university_style = ParagraphStyle(
        'UniversityStyle', 
        parent=styles['Normal'], 
        fontSize=10, 
        spaceAfter=16, 
        textColor=colors.HexColor('#555555'),
        alignment=1,  # Center alignment
        leading=13
    )
    
    section_style = ParagraphStyle(
        'SectionStyle', 
        parent=styles['Heading2'], 
        fontSize=13, 
        spaceBefore=12, 
        spaceAfter=6, 
        textColor=colors.HexColor('#0A2540'),
        fontName='Helvetica-Bold',
        leading=16,
        alignment=1  # Center alignment
    )
    
    abstract_style = ParagraphStyle(
        'AbstractStyle', 
        parent=styles['Normal'], 
        fontSize=10, 
        leading=16, 
        spaceAfter=12,
        alignment=4,  # Justified alignment
        textColor=colors.HexColor('#333333')
    )
    
    keyword_style = ParagraphStyle(
        'KeywordStyle', 
        parent=styles['Normal'], 
        fontSize=10, 
        leading=14,
        textColor=colors.HexColor('#333333'),
        spaceBefore=6,
        alignment=0  # Left alignment
    )
    
    story = []
    
    # Title (Centered)
    story.append(Paragraph(data['research_title'], title_style))
    
    # Author Line (Centered)
    author_text = data['author']
    if data.get('co_author'):
        author_text += f", {data['co_author']}"
    story.append(Paragraph(author_text, author_style))
    
    # Email (Centered)
    story.append(Paragraph(data['email_address'], email_style))
    
    # University/Agency (Centered)
    story.append(Paragraph(data['university_agency'], university_style))
    
    # Horizontal line after header
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#0A2540'), spaceAfter=12))
    
    # Abstract Section (Title Centered)
    story.append(Paragraph("ABSTRACT", section_style))
    story.append(Paragraph(data['abstract'].replace('\n', '<br/>'), abstract_style))
    
    # Keywords Section (Left aligned - on same line: KEYWORDS: value)
    story.append(Paragraph(f"<b>KEYWORDS:</b> {data['keywords']}", keyword_style))
    
    doc.build(story)
    return file_path

@app.route('/api/abstracts/preview', methods=['POST', 'OPTIONS'])
def preview_abstract():
    if request.method == 'OPTIONS':
        return jsonify({})
    
    temp_file_path = None
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = [
            'selected_track', 'specific_track', 'research_title', 'author', 
            'presenter', 'email_address', 'university_agency', 'abstract', 'keywords'
        ]
        for field in required_fields:
            if not data.get(field):
                return jsonify({"detail": f"{field.replace('_', ' ').title()} is required"}), 400
        
        # Generate PDF
        pdf_path = generate_abstract_pdf(data)
        temp_file_path = pdf_path
        
        # Return the PDF as a response
        with open(pdf_path, 'rb') as pdf_file:
            pdf_data = pdf_file.read()
        
        # Clean up temp file
        if os.path.exists(pdf_path):
            os.remove(pdf_path)
        
        # Return PDF with base64 encoding for preview
        import base64
        pdf_base64 = base64.b64encode(pdf_data).decode('utf-8')
        
        return jsonify({
            "preview_url": f"data:application/pdf;base64,{pdf_base64}"
        }), 200
        
    except Exception as e:
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        traceback.print_exc()
        return jsonify({"detail": str(e)}), 500
    
# ================= SUC ENDPOINTS =================
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

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='127.0.0.1')