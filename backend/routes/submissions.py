from hashlib import sha256
import json
from uuid import UUID

from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
import os, re, tempfile, traceback
from sqlalchemy.exc import IntegrityError, OperationalError
from werkzeug.utils import secure_filename
from google_drive import extract_file_id, set_drive_file_trashed, upload_file_to_drive, trash_file_from_drive
from models import db, AbstractEvaluatorDecision, AbstractPaymentProof, AbstractSubmission, AbstractSubmissionRequest, SUC
from utils.pdf import generate_abstract_pdf
from utils.decorators import staff_required

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



ABSTRACT_REQUIRED_FIELDS = (
    'selected_track', 'specific_track', 'research_title', 'author',
    'presenter', 'email_address', 'university_agency', 'address',
    'phone_number', 'presentation_type', 'abstract', 'keywords',
)


def replay_submission(record, payload_hash):
    if record.payload_hash != payload_hash:
        return jsonify({"detail": "This submission key was already used with different abstract details."}), 409
    return jsonify(record.response), 201


def ensure_submission_agency(name):
    if SUC.query.filter_by(name=name).first():
        return
    try:
        with db.session.begin_nested():
            db.session.add(SUC(name=name, region='National', abbreviation='', type='Other', is_active=True))
    except IntegrityError:
        if SUC.query.filter_by(name=name).with_for_update().first() is None:
            raise


@submissions_bp.route('/api/abstracts/submit', methods=['POST', 'OPTIONS'])
@jwt_required()
def submit_abstract():
    if request.method == 'OPTIONS':
        return jsonify({})

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"detail": "Enter the abstract details."}), 400
    for field in ABSTRACT_REQUIRED_FIELDS:
        if not isinstance(data.get(field), str) or not data[field].strip():
            return jsonify({"detail": f"{field.replace('_', ' ').title()} is required"}), 400
    co_author = data.get('co_author')
    if co_author is not None and not isinstance(co_author, str):
        return jsonify({"detail": "Co-author must be text."}), 400

    payload = {field: data[field] for field in ABSTRACT_REQUIRED_FIELDS}
    payload['co_author'] = co_author
    raw_key = request.headers.get('Idempotency-Key')
    key = None
    if raw_key is not None:
        try:
            key = str(UUID(raw_key))
        except ValueError:
            return jsonify({"detail": "Invalid submission key."}), 400

    pdf_path = None
    view_url = None
    record = None
    committed = False
    sender_id = int(get_jwt_identity())
    try:
        if key:
            payload_hash = sha256(json.dumps(payload, sort_keys=True).encode('utf-8')).hexdigest()
            record_key = (sender_id, key)
            existing = db.session.get(AbstractSubmissionRequest, record_key)
            if existing:
                return replay_submission(existing, payload_hash)

            record = AbstractSubmissionRequest(sender_id=sender_id, idempotency_key=key, payload_hash=payload_hash)
            db.session.add(record)
            try:
                db.session.flush()
            except IntegrityError:
                db.session.rollback()
                existing = db.session.get(AbstractSubmissionRequest, record_key)
                if existing:
                    return replay_submission(existing, payload_hash)
                raise

        pdf_path = generate_abstract_pdf(payload)
        author_surname = (payload['author'].split(',')[0].split() or payload['author'].split())[-1]
        safe_title = re.sub(r'[^\w\s-]', '', payload['research_title']).replace(' ', '_')[:50]
        view_url, download_url = upload_file_to_drive(
            pdf_path, f"{author_surname}_{safe_title}.pdf", project_title=payload['selected_track']
        )
        ensure_submission_agency(payload['university_agency'])

        submission = AbstractSubmission(
            sender_id=sender_id, user_id=sender_id, **payload,
            abstract_drive_view_url=view_url, abstract_drive_download_url=download_url, status='pending',
        )
        db.session.add(submission)
        db.session.flush()
        result = {
            "message": "Abstract submitted successfully",
            "submission_id": submission.id,
            "sender_id": sender_id,
            "view_url": view_url,
            "download_url": download_url,
            "status": "pending",
        }
        if record is not None:
            record.response = result
        db.session.commit()
        committed = True
        return jsonify(result), 201
    except OperationalError:
        db.session.rollback()
        current_app.logger.exception('Database unavailable while creating abstract submission')
        return jsonify({"detail": "Could not complete the submission. Retry using the same abstract details."}), 503
    except Exception:
        db.session.rollback()
        current_app.logger.exception('Could not create abstract submission')
        return jsonify({"detail": "Could not submit the abstract. Please try again."}), 500
    finally:
        if not committed and view_url:
            try:
                trash_file_from_drive(view_url)
            except Exception:
                current_app.logger.exception('Could not clean up a failed abstract upload')
        if pdf_path:
            try:
                os.remove(pdf_path)
            except OSError:
                current_app.logger.warning('Could not remove a temporary abstract PDF')


@submissions_bp.route('/api/abstracts/<int:submission_id>', methods=['PUT', 'OPTIONS'])
@jwt_required()
def update_abstract(submission_id):
    if request.method == 'OPTIONS':
        return jsonify({})

    temp_file_path = None
    new_view_url = None
    database_committed = False
    try:
        submission = AbstractSubmission.query.get(submission_id)
        if not submission:
            return jsonify({"detail": "Submission not found"}), 404

        if str(get_jwt_identity()) != str(submission.sender_id):
            return jsonify({"detail": "You can only edit your own submissions"}), 403

        if (submission.status or '').lower() != 'pending':
            return jsonify({"detail": "Only pending submissions can be edited"}), 400

        data = request.get_json() or {}

        required_fields = [
            'selected_track', 'specific_track', 'research_title', 'author',
            'presenter', 'email_address', 'university_agency', 'address',
            'phone_number', 'presentation_type', 'abstract', 'keywords'
        ]
        for field in required_fields:
            if not data.get(field):
                return jsonify({"detail": f"{field.replace('_', ' ').title()} is required"}), 400

        # Check if university/agency exists in database, if not add it
        agency_name = data['university_agency'].strip()
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

        # Store old drive URLs to move to trash after uploading new file
        old_view_url = submission.abstract_drive_view_url
        old_download_url = submission.abstract_drive_download_url

        # Generate new PDF
        pdf_path = generate_abstract_pdf(data)
        temp_file_path = pdf_path

        # Filename: Surname of Author - Research Title
        author_surname = data['author'].split(',')[0].split()[-1]
        safe_research_title = re.sub(r'[^\w\s-]', '', data['research_title']).replace(' ', '_')[:50]
        filename = f"{author_surname}_{safe_research_title}.pdf"

        # Upload new PDF to Google Drive
        new_view_url, new_download_url = upload_file_to_drive(
            pdf_path,
            filename,
            project_title=data['selected_track']
        )

        # Update submission fields
        submission.selected_track = data['selected_track']
        submission.specific_track = data['specific_track']
        submission.research_title = data['research_title']
        submission.author = data['author']
        submission.co_author = data.get('co_author')
        submission.presenter = data['presenter']
        submission.email_address = data['email_address']
        submission.university_agency = agency_name
        submission.address = data.get('address')
        submission.phone_number = data.get('phone_number')
        submission.presentation_type = data.get('presentation_type')
        submission.abstract = data['abstract']
        submission.keywords = data['keywords']
        submission.abstract_drive_view_url = new_view_url
        submission.abstract_drive_download_url = new_download_url

        db.session.commit()
        database_committed = True

        warning = None
        old_file_url = old_view_url or old_download_url
        if old_file_url:
            try:
                trash_file_from_drive(old_file_url)
            except Exception as trash_error:
                warning = f"Abstract updated, but the previous PDF could not be moved to Drive trash: {trash_error}"

        # Cleanup temp PDF
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)

        return jsonify({
            "message": "Abstract updated successfully",
            "submission_id": submission.id,
            "view_url": new_view_url,
            "download_url": new_download_url,
            "status": submission.status,
            "warning": warning
        }), 200

    except Exception as e:
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        db.session.rollback()
        if new_view_url and not database_committed:
            try:
                trash_file_from_drive(new_view_url)
            except Exception:
                traceback.print_exc()
        traceback.print_exc()
        return jsonify({"detail": str(e)}), 500


@submissions_bp.route('/api/abstracts/<int:submission_id>', methods=['DELETE', 'OPTIONS'])
@jwt_required()
def delete_abstract(submission_id):
    if request.method == 'OPTIONS':
        return jsonify({})
    submission = AbstractSubmission.query.filter_by(id=submission_id).with_for_update().one_or_none()
    if submission is None:
        return jsonify({"detail": "Submission not found."}), 404

    if str(get_jwt_identity()) != str(submission.sender_id):
        return jsonify({"detail": "You can only delete your own submissions."}), 403

    if (submission.status or '').lower() != 'pending':
        return jsonify({"detail": "Only pending submissions can be deleted."}), 400

    drive_urls = (submission.abstract_drive_view_url, submission.abstract_drive_download_url)
    drive_file = next((url for url in drive_urls if extract_file_id(url)), None)
    if any(drive_urls) and not drive_file:
        return jsonify({"detail": "The linked Google Drive file ID could not be read."}), 409

    moved_to_trash = False
    if drive_file:
        try:
            moved_to_trash = trash_file_from_drive(drive_file)
        except Exception:
            db.session.rollback()
            current_app.logger.exception('Could not trash Drive file for submission %s', submission_id)
            return jsonify({
                "detail": "Google Drive could not move the abstract file to Trash. The submission is still saved."
            }), 502

    try:
        db.session.delete(submission)
        db.session.commit()
    except Exception:
        db.session.rollback()
        current_app.logger.exception('Could not delete submission %s', submission_id)
        if moved_to_trash:
            try:
                set_drive_file_trashed(drive_file, False)
            except Exception:
                current_app.logger.exception('Could not restore Drive file for submission %s', submission_id)
                return jsonify({
                    "detail": "The submission could not be deleted after its file moved to Google Drive Trash."
                }), 500
        return jsonify({"detail": "The submission could not be deleted."}), 500

    message = "Submission deleted and abstract file moved to Google Drive Trash." if drive_file else "Submission deleted."
    return jsonify({"message": message}), 200


@submissions_bp.route('/api/abstracts/preview', methods=['POST', 'OPTIONS'])
def preview_abstract():
    if request.method == 'OPTIONS':
        return jsonify({})
    
    temp_file_path = None
    try:
        data = request.get_json()
        
        # REMOVED city_tour_option
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
@staff_required
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
            
            # --- ADDED THESE THREE LINES ---
            'address': s.address,
            'phone_number': s.phone_number,
            'presentation_type': s.presentation_type,
            # -------------------------------
            
            'abstract': s.abstract,
            'keywords': s.keywords,
            'abstract_drive_view_url': s.abstract_drive_view_url,
            'abstract_download_url': s.abstract_drive_download_url,
            'status': s.status,
            'created_at': s.created_at.strftime('%Y-%m-%d %H:%M:%S') if s.created_at else None
        } for s in submissions]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"detail": str(e)}), 500

@submissions_bp.route('/api/staff/submissions/<int:submission_id>/status', methods=['PUT', 'OPTIONS'])
@staff_required
def update_submission_status(submission_id):
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        data = request.get_json()
        new_status = data.get('status')
        if new_status not in ['pending', 'accepted', 'rejected']:
            return jsonify({"detail": "Invalid status"}), 400
        
        submission = db.session.get(AbstractSubmission, submission_id, with_for_update=True)
        if not submission:
            return jsonify({"detail": "Submission not found"}), 404
        
        if submission.status != new_status:
            attribution = db.session.get(AbstractEvaluatorDecision, submission_id)
            if attribution:
                db.session.delete(attribution)
            submission.status = new_status
        db.session.commit()
        return jsonify({"message": "Status updated successfully", "status": submission.status}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"detail": str(e)}), 500



@submissions_bp.route('/api/my-submissions/<int:user_id>', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_my_submissions(user_id):
    if request.method == 'OPTIONS':
        return jsonify({})
    if str(get_jwt_identity()) != str(user_id):
        return jsonify({"detail": "You can only view your own submissions"}), 403
    try:
        submissions = db.session.query(AbstractSubmission, AbstractPaymentProof).outerjoin(
            AbstractPaymentProof, AbstractPaymentProof.submission_id == AbstractSubmission.id
        ).filter(AbstractSubmission.sender_id == user_id).order_by(AbstractSubmission.created_at.desc()).all()
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
            
            # --- ADDED THESE THREE LINES ---
            'address': s.address,
            'phone_number': s.phone_number,
            'presentation_type': s.presentation_type,
            # -------------------------------
            
            'abstract': s.abstract,
            'keywords': s.keywords,
            'abstract_drive_view_url': s.abstract_drive_view_url,
            'abstract_drive_download_url': s.abstract_drive_download_url,
            'status': s.status,
            'created_at': s.created_at.strftime('%Y-%m-%d %H:%M:%S') if s.created_at else None,
            'payment_proof_filename': proof.original_name if proof else None,
            'payment_proof_drive_file_id': proof.drive_file_id if proof else None,
        } for s, proof in submissions]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"detail": str(e)}), 500
