from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
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
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['JWT_SECRET_KEY'] =  os.getenv('JWT_SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'mysql+pymysql://root:@127.0.0.1:3306/researchdb')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAX_CONTENT_LENGTH'] = 64 * 1024 * 1024 

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
    address = db.Column(db.String(255), nullable=True)
    phone_number = db.Column(db.String(20), nullable=True) 
    presentation_type = db.Column(db.String(50), nullable=True)
    city_tour_option = db.Column(db.String(50), nullable=True) 
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
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {"id": user.id, "full_name": user.full_name, "email": user.email, "role": user.role}
        }), 200
        
    except Exception as e:
        return jsonify({"detail": str(e)}), 500


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
        
        # Validate required fields (including new fields)
        required_fields = [
            'selected_track', 'specific_track', 'research_title', 'author', 
            'presenter', 'email_address', 'university_agency', 'address',
            'phone_number', 'presentation_type', 'city_tour_option', 'abstract', 'keywords'
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
        
        # Get sender_id from the data (NO JWT verification)
        sender_id = data.get('sender_id')
        
        # Validate sender_id
        if not sender_id or sender_id == 0:
            return jsonify({"detail": "User authentication required. Please login again."}), 401
        
        # Save to database with new fields
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
            address=data.get('address'),
            phone_number=data.get('phone_number'),
            presentation_type=data.get('presentation_type'),
            city_tour_option=data.get('city_tour_option'),
            abstract=data['abstract'],
            keywords=data['keywords'],
            abstract_drive_view_url=view_url,
            abstract_drive_download_url=download_url,
            status='pending'
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
def get_all_submissions():
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        submissions = AbstractSubmission.query.order_by(AbstractSubmission.created_at.desc()).all()
        result = [{
            'id': s.id,
            'sender_id': s.sender_id,
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
def update_submission_status(submission_id):
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
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
    """Generates a professional PDF for the abstract matching the symposium template."""
    buffer = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    file_path = buffer.name
    buffer.close()
    
    # Page dimensions
    doc = SimpleDocTemplate(
        file_path, 
        pagesize=letter,
        rightMargin=54, leftMargin=54,
        topMargin=54, bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    # Color scheme - Forest Green theme
    FOREST_GREEN = colors.HexColor('#2E5E2E')
    DARK_GREEN = colors.HexColor('#1F3F1F')
    LIGHT_GREEN = colors.HexColor('#E8F5E8')
    BORDER_GREEN = colors.HexColor('#2E5E2E')
    TEXT_COLOR = colors.HexColor('#333333')
    WHITE = colors.white
    
    # Custom styles
    event_title_style = ParagraphStyle(
        'EventTitleStyle',
        parent=styles['Title'],
        fontSize=16,
        spaceAfter=4,
        textColor=WHITE,
        alignment=1,
        fontName='Helvetica-Bold',
        leading=16
    )
    
    # FIXED: Changed 'Times New Roman' to 'Times-Roman' (built-in PostScript font)
    event_subtitle_style = ParagraphStyle(
        'EventSubtitleStyle',
        parent=styles['Normal'],
        fontSize=12,
        spaceAfter=2,
        textColor=WHITE,
        alignment=1,
        fontName='Times-Italic',
        leading=13
    )
    
    # Updated Event Details Style - Font 12, Line Spacing 1.0
    event_details_style = ParagraphStyle(
        'EventDetailsStyle',
        parent=styles['Normal'],
        fontSize=12,
        spaceAfter=0,  
        spaceBefore=0,  
        textColor=WHITE,
        alignment=1,
        fontName='Helvetica',  
        leading=12,
    )
    
    # Updated Form Title Style with Century Gothic font, size 20
    form_title_style = ParagraphStyle(
        'FormTitleStyle',
        parent=styles['Title'],
        fontSize=20,
        spaceAfter=12,
        textColor=WHITE,
        alignment=1,
        fontName='Helvetica-Bold',
        leading=24
    )
    
    # Label style - font size 12
    section_label_style = ParagraphStyle(
        'SectionLabelStyle',
        parent=styles['Normal'],
        fontSize=12,
        leading=16,
        textColor=TEXT_COLOR,
        fontName='Helvetica-Bold',
        spaceAfter=4
    )
    
    # Value style - font size 11
    value_style = ParagraphStyle(
        'ValueStyle',
        parent=styles['Normal'],
        fontSize=11,
        leading=15,
        textColor=TEXT_COLOR,
        spaceAfter=2
    )
    
    abstract_style = ParagraphStyle(
        'AbstractStyle',
        parent=styles['Normal'],
        fontSize=11,
        leading=16,
        spaceAfter=8,
        alignment=4,
        textColor=TEXT_COLOR
    )
    
    from reportlab.platypus import Table, TableStyle
    
    story = []
    
    event_details_text = (
        "10-13 March 2027 | Roxas City, Campus, Philippines<br/>"
        "THE SEAFOOD CAPITAL OF THE PHILIPPINES"
    )
    
    header_data = [
        [Paragraph("3RD INTERNATIONAL AGRI-LIFE &amp; BIORESOURCE SCIENCES SYMPOSIUM", event_title_style)],
        [Paragraph('"Converging Frontiers in Agri-Life and Bioresource Sciences: Science, Innovation, and Collaboration for a Resilient and Sustainable Future"', event_subtitle_style)],
        [Paragraph(event_details_text, event_details_style)],
        [Paragraph("Abstract Submission Form", form_title_style)]
    ]
    
    header_table = Table(header_data, colWidths=[7*inch])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), FOREST_GREEN),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, 0), 6),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 2),
        ('TOPPADDING', (0, 1), (-1, 1), 4),
        ('BOTTOMPADDING', (0, 1), (-1, 1), 4),
        ('TOPPADDING', (0, 2), (-1, 2), 6),
        ('BOTTOMPADDING', (0, 2), (-1, 2), 2),
        ('TOPPADDING', (0, 3), (-1, 3), 8),
        ('BOTTOMPADDING', (0, 3), (-1, 3), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('BOX', (0, 0), (-1, -1), 1.5, FOREST_GREEN),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 12))
    
    # ===== MAIN FORM TABLE =====
    # Determine selected preferences - using checkmark symbol ✓
    presentation_type = data.get('presentation_type', '')
    is_oral = '✓' if presentation_type == 'oral' else '&nbsp;&nbsp;&nbsp;'
    is_poster = '✓' if presentation_type == 'poster' else '&nbsp;&nbsp;&nbsp;'
    
    # Make selected option bold for presentation type
    if presentation_type == 'oral':
        oral_text = f"<b>{is_oral}&nbsp;&nbsp; Oral Presentation</b>"
        poster_text = f"{is_poster}&nbsp;&nbsp; Poster presentation"
    else:
        oral_text = f"{is_oral}&nbsp;&nbsp; Oral Presentation"
        poster_text = f"<b>{is_poster}&nbsp;&nbsp; Poster presentation</b>"
    
    city_tour_option = data.get('city_tour_option', '')
    is_option1 = '✓' if city_tour_option == 'option1' else '&nbsp;&nbsp;&nbsp;'
    is_option2 = '✓' if city_tour_option == 'option2' else '&nbsp;&nbsp;&nbsp;'
    
    # Make selected option bold for city tour
    if city_tour_option == 'option1':
        option1_text = f"<b>{is_option1}&nbsp;&nbsp; Option 1 (City Tour Only)</b>"
        option2_text = f"{is_option2}&nbsp;&nbsp; Option 2 (City tour, and Boracay Transfer)"
    else:
        option1_text = f"{is_option1}&nbsp;&nbsp; Option 1 (City Tour Only)"
        option2_text = f"<b>{is_option2}&nbsp;&nbsp; Option 2 (City tour, and Boracay Transfer)</b>"
    
    # Define form rows
    form_data = []
    
    # Row 1: Presentation Preference
    form_data.append([
        Paragraph("Please indicate preference", section_label_style),
        Paragraph(
            f"{oral_text} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {poster_text}",
            value_style
        )
    ])
    
    # Row 2: Presentation Title
    form_data.append([
        Paragraph("PRESENTATION TITLE", section_label_style),
        Paragraph(data['research_title'], value_style)
    ])
    
    # Row 3: Author(s)
    author_text = data['author']
    if data.get('co_author'):
        author_text += f", {data['co_author']}"
    form_data.append([
        Paragraph("AUTHOR (S)", section_label_style),
        Paragraph(author_text, value_style)
    ])
    
    # Row 4: Presenting Author
    form_data.append([
        Paragraph("PRESENTING AUTHOR", section_label_style),
        Paragraph(data['presenter'], value_style)
    ])
    
    # Row 5: Affiliation
    form_data.append([
        Paragraph("AFFILIATION/S (Institution/ Office)", section_label_style),
        Paragraph(data['university_agency'], value_style)
    ])
    
    # Row 6: Address
    form_data.append([
        Paragraph("Address", section_label_style),
        Paragraph(data.get('address', ''), value_style)
    ])
    
    # Row 7: Phone Number (Telephone/Fax/Cellphone)
    form_data.append([
        Paragraph("Telephone/ Fax. No./ Cellphone No.", section_label_style),
        Paragraph(data.get('phone_number', ''), value_style)
    ])
    
    # Row 8: Email
    form_data.append([
        Paragraph("Email address", section_label_style),
        Paragraph(data['email_address'], value_style)
    ])
    
    # Row 9: City Tour/Boracay Transfer (Multi-line with bold selection)
    city_tour_text = (
        f"{option1_text}<br/><br/>"
        f"{option2_text}<br/><br/>"
        f"<font size='8'><i>Participants proceeding to Boracay shall be responsible for arranging their own "
        f"accommodation and return/onward travel. Delegates may arrange their departure at their convenience through "
        f"Caticlan or Kalibo, depending on their preferred flight or onward travel arrangements. The Organizing "
        f"Committee may provide general travel information and coordination assistance but shall not be responsible "
        f"for individual bookings or personal travel expenses.</i></font>"
    )
    
    form_data.append([
        Paragraph("City Tour/Boracay Transfer", section_label_style),
        Paragraph(city_tour_text, value_style)
    ])
    
    # Create form table
    form_table = Table(form_data, colWidths=[2.5*inch, 4.5*inch])
    form_table.setStyle(TableStyle([
        # Borders
        ('GRID', (0, 0), (-1, -1), 0.75, BORDER_GREEN),
        ('BOX', (0, 0), (-1, -1), 1.5, BORDER_GREEN),
        
        # Cell backgrounds - alternating
        ('BACKGROUND', (0, 0), (0, -1), LIGHT_GREEN),
        ('BACKGROUND', (1, 0), (1, -1), WHITE),
        
        # Text alignment
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
        
        # Vertical alignment
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        
        # Padding
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(form_table)
    story.append(Spacer(1, 12))
    
    # ===== ABSTRACT SECTION =====
    abstract_data = [
        [Paragraph("Abstract <i>(not more than 300 words)</i>", section_label_style)],
        [Paragraph(data['abstract'].replace('\n', '<br/>'), abstract_style)]
    ]
    
    abstract_table = Table(abstract_data, colWidths=[7*inch])
    abstract_table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.75, BORDER_GREEN),
        ('BOX', (0, 0), (-1, -1), 1.5, BORDER_GREEN),
        ('BACKGROUND', (0, 0), (-1, -1), WHITE),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(abstract_table)
    
    # ===== KEYWORDS SECTION =====
    story.append(Spacer(1, 12))
    keywords_data = [
        [Paragraph("<b>KEYWORDS:</b>", section_label_style)],
        [Paragraph(data['keywords'], value_style)]
    ]
    
    keywords_table = Table(keywords_data, colWidths=[7*inch])
    keywords_table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.75, BORDER_GREEN),
        ('BOX', (0, 0), (-1, -1), 1.5, BORDER_GREEN),
        ('BACKGROUND', (0, 0), (0, 0), LIGHT_GREEN),
        ('BACKGROUND', (0, 1), (-1, 1), WHITE),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(keywords_table)
    
    # ===== APPLICATION INFO =====
    story.append(Spacer(1, 16))
    application_text = Paragraph(
        "<b>Application for oral/poster presentation shall be submitted to the official symposium portal on or before January 10, 2027.</b>",
        ParagraphStyle(
            'ApplicationStyle',
            parent=styles['Normal'],
            fontSize=9,
            leading=13,
            textColor=colors.HexColor('#333333'),
            alignment=1
        )
    )
    story.append(application_text)
    story.append(Spacer(1, 6))
    
    story.append(Paragraph(
        "<i>For additional concerns, please contact us through: (insert RDE contact details)</i>",
        ParagraphStyle(
            'ContactStyle',
            parent=styles['Normal'],
            fontSize=8,
            leading=12,
            textColor=colors.HexColor('#666666'),
            alignment=1
        )
    ))
    
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
    
@app.route('/api/my-submissions/<int:user_id>', methods=['GET', 'OPTIONS'])
def get_my_submissions(user_id):
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        submissions = AbstractSubmission.query.filter_by(sender_id=user_id).order_by(AbstractSubmission.created_at.desc()).all()
        result = [{
            'id': s.id,
            'sender_id': s.sender_id,
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
            'abstract_drive_view_url': s.abstract_drive_view_url,
            'abstract_drive_download_url': s.abstract_drive_download_url,
            'status': s.status,
            'created_at': s.created_at.strftime('%Y-%m-%d %H:%M:%S') if s.created_at else None
        } for s in submissions]
        return jsonify(result), 200
    except Exception as e:
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