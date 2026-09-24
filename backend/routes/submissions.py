from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
import os, re, tempfile, traceback
from werkzeug.utils import secure_filename
from google_drive import upload_file_to_drive
from models import db, AbstractSubmission, SUC
from utils.pdf import generate_abstract_pdf

submissions_bp = Blueprint('submissions', __name__)


@submissions_bp.route('/api/papers/submit', methods=['POST', 'OPTIONS'])
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



@submissions_bp.route('/api/abstracts/submit', methods=['POST', 'OPTIONS'])
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


@submissions_bp.route('/api/abstracts/preview', methods=['POST', 'OPTIONS'])
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
    


@submissions_bp.route('/api/staff/submissions', methods=['GET', 'OPTIONS'])
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
            'abstract_drive_view_url': s.abstract_drive_view_url,  # ← FIXED: was 'abstract_view_url'
            'abstract_download_url': s.abstract_drive_download_url,  # ← FIXED: was 'abstract_download_url'
            'status': s.status,
            'created_at': s.created_at.strftime('%Y-%m-%d %H:%M:%S') if s.created_at else None
        } for s in submissions]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"detail": str(e)}), 500



@submissions_bp.route('/api/staff/submissions/<int:submission_id>/status', methods=['PUT', 'OPTIONS'])
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



@submissions_bp.route('/api/my-submissions/<int:user_id>', methods=['GET', 'OPTIONS'])
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
            'abstract_drive_view_url': s.abstract_drive_view_url,  # ← FIXED
            'abstract_drive_download_url': s.abstract_drive_download_url,  # ← FIXED
            'status': s.status,
            'created_at': s.created_at.strftime('%Y-%m-%d %H:%M:%S') if s.created_at else None
        } for s in submissions]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"detail": str(e)}), 500
