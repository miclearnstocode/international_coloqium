from datetime import datetime, timezone
import smtplib
from pathlib import Path
from tempfile import TemporaryDirectory, TemporaryFile

from flask import Blueprint, current_app, jsonify, request, send_file, send_from_directory
from flask_jwt_extended import get_jwt_identity, jwt_required
from googleapiclient.errors import HttpError
from PIL import Image
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.utils import secure_filename

from google_drive import download_drive_file, sanitize_folder_name, trash_file_from_drive, upload_payment_proof_to_drive
from models import AbstractPaymentProof, AbstractSubmission, User, db

from utils.acceptance_email import send_decision_email
from utils.decorators import super_admin_required

payment_proofs_bp = Blueprint('payment_proofs', __name__)
MAX_PROOF_SIZE = 60 * 1024 * 1024
IMAGE_EXTENSIONS = {
    'PNG': '.png', 'JPEG': '.jpg', 'GIF': '.gif', 'WEBP': '.webp',
    'BMP': '.bmp', 'TIFF': '.tiff', 'AVIF': '.avif', 'ICO': '.ico',
}
PROOF_ROUTE = '/api/abstracts/<int:submission_id>/payment-proof'


def proof_file_type(stream, original_name):
    header = stream.read(5)
    stream.seek(0)
    if header == b'%PDF-':
        return 'application/pdf', '.pdf'
    try:
        with Image.open(stream) as image:
            extension = IMAGE_EXTENSIONS.get(image.format)
            if extension is None:
                return None
            if image.format == 'JPEG' and Path(original_name).suffix.lower() in ('.jfif', '.jpeg'):
                extension = Path(original_name).suffix.lower()
            mime_type = Image.MIME.get(image.format, 'application/octet-stream')
            image.verify()
            return mime_type, extension
    except (OSError, ValueError, SyntaxError, Image.DecompressionBombError):
        return None


@payment_proofs_bp.post(PROOF_ROUTE)
@jwt_required()
def upload_payment_proof(submission_id):
    user_id = int(get_jwt_identity())
    submission = db.session.get(AbstractSubmission, submission_id)
    if submission is None or submission.sender_id != user_id:
        return jsonify({'detail': 'Submission not found.'}), 404
    if submission.status.lower() != 'accepted':
        return jsonify({'detail': 'Your abstract must be accepted before uploading proof of payment.'}), 409
    if db.session.get(AbstractPaymentProof, submission_id):
        return jsonify({'detail': 'Proof of payment has already been uploaded.'}), 409
    db.session.rollback()

    upload = request.files.get('payment_proof')
    filename = secure_filename(upload.filename or '') if upload else ''
    if not filename or len(filename) > 255:
        return jsonify({'detail': 'Choose a file with a valid filename.'}), 400

    with TemporaryDirectory(prefix='payment-proof-') as directory:
        path = Path(directory) / 'upload'
        size = 0
        with path.open('xb') as output:
            while chunk := upload.stream.read(1024 * 1024):
                size += len(chunk)
                if size > MAX_PROOF_SIZE:
                    return jsonify({'detail': 'Proof of payment must be 60 MB or smaller.'}), 413
                output.write(chunk)

        with path.open('rb') as stream:
            file_type = proof_file_type(stream, filename) if size else None
        if file_type is None:
            return jsonify({'detail': 'Upload a PDF or a supported image file.'}), 400
        mime_type, extension = file_type

        submission = AbstractSubmission.query.filter_by(id=submission_id).with_for_update().one_or_none()
        if submission is None or submission.sender_id != user_id:
            return jsonify({'detail': 'Submission not found.'}), 404
        if submission.status.lower() != 'accepted':
            return jsonify({'detail': 'Your abstract must be accepted before uploading proof of payment.'}), 409
        if db.session.get(AbstractPaymentProof, submission_id):
            return jsonify({'detail': 'Proof of payment has already been uploaded.'}), 409

        author = sanitize_folder_name(submission.author)
        drive_name = f'Payment Proof - {author} - {submission_id}{extension}'
        try:
            drive_id = upload_payment_proof_to_drive(
                path, drive_name, mime_type,
                submission.abstract_drive_view_url or submission.abstract_drive_download_url,
            )
        except ValueError as error:
            return jsonify({'detail': str(error)}), 409
        except (HttpError, OSError) as error:
            current_app.logger.warning('Drive payment proof upload failed (%s)', type(error).__name__)
            return jsonify({'detail': 'Could not save proof of payment to Google Drive. Try again.'}), 502

        db.session.add(AbstractPaymentProof(
            submission_id=submission_id, drive_file_id=drive_id, original_name=drive_name,
        ))
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            try:
                trash_file_from_drive(drive_id)
            except (HttpError, OSError, ValueError):
                current_app.logger.exception('Could not clean up Drive payment proof for submission %s', submission_id)
            if db.session.get(AbstractPaymentProof, submission_id):
                return jsonify({'detail': 'Proof of payment has already been uploaded.'}), 409
            raise
        return jsonify({'payment_proof_filename': drive_name, 'payment_proof_drive_file_id': drive_id}), 201


@payment_proofs_bp.get(PROOF_ROUTE)
@jwt_required()
def download_payment_proof(submission_id):
    user = db.session.get(User, int(get_jwt_identity()))
    submission = db.session.get(AbstractSubmission, submission_id)
    if not user or not submission or (submission.sender_id != user.id and user.role not in ('staff', 'admin')):
        return jsonify({'detail': 'Proof of payment not found.'}), 404

    proof = db.session.get(AbstractPaymentProof, submission_id)
    if proof is None:
        return jsonify({'detail': 'Proof of payment not found.'}), 404

    if request.args.get('metadata') == '1':
        response = jsonify({'payment_proof_drive_file_id': proof.drive_file_id})
        response.headers['Cache-Control'] = 'no-store'
        return response

    directory = Path(current_app.config['PAYMENT_PROOF_DIR'])
    preview = request.args.get('preview') == '1' and (user.role == 'admin' or submission.sender_id == user.id)
    if proof.drive_file_id:
        stream = TemporaryFile()
        try:
            download_drive_file(proof.drive_file_id, stream)
        except (HttpError, OSError) as error:
            stream.close()
            current_app.logger.warning('Drive payment proof download failed (%s)', type(error).__name__)
            return jsonify({'detail': 'Could not retrieve proof of payment from Google Drive.'}), 502
    elif preview:
        if not proof.stored_name:
            return jsonify({'detail': 'Proof of payment not found.'}), 404
        try:
            stream = (directory / proof.stored_name).open('rb')
        except FileNotFoundError:
            return jsonify({'detail': 'Proof of payment not found.'}), 404
    else:
        stream = None

    options = {'as_attachment': True, 'download_name': proof.original_name, 'mimetype': 'application/octet-stream'}
    if stream is not None:
        try:
            if preview:
                file_type = proof_file_type(stream, proof.original_name)
                stream.seek(0)
                if file_type:
                    options.update(as_attachment=False, mimetype=file_type[0])
            response = send_file(stream, **options)
        except Exception:
            stream.close()
            raise
    else:
        response = send_from_directory(directory, proof.stored_name, **options)
    response.headers['Cache-Control'] = 'no-store'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    return response


def send_payment_review_email(submission, subject, body):
    try:
        send_decision_email(submission, subject, body)
    except smtplib.SMTPDataError as error:
        # An explicit temporary refusal means the server did not accept the message.
        if not 400 <= error.smtp_code < 500:
            raise
        send_decision_email(submission, subject, body)


@payment_proofs_bp.post('/api/admin/abstracts/<int:submission_id>/payment-review')
@super_admin_required
def save_payment_review(submission_id):
    data = request.get_json(silent=True)
    status = data.get('status') if isinstance(data, dict) else None
    reason = data.get('reason') if isinstance(data, dict) else None
    if status not in ('accepted', 'rejected'):
        return jsonify({'detail': 'Choose accepted or rejected.'}), 400
    if reason is not None and (not isinstance(reason, str) or len(reason.strip()) > 2000):
        return jsonify({'detail': 'The reason must be text up to 2,000 characters.'}), 400
    reason = reason.strip() if reason else ''

    submission = AbstractSubmission.query.filter_by(id=submission_id).with_for_update().one_or_none()
    proof = db.session.get(AbstractPaymentProof, submission_id, with_for_update=True)
    if submission is None or proof is None:
        return jsonify({'detail': 'Proof of payment not found.'}), 404

    if proof.payment_status == 'pending':
        if submission.status != 'accepted':
            return jsonify({'detail': 'This abstract is not accepted.'}), 409
        if status == 'rejected' and not reason:
            return jsonify({'detail': 'A rejection reason is required.'}), 400
        proof.payment_status = status
        proof.review_reason = reason
        proof.reviewer_id = int(get_jwt_identity())
        db.session.commit()
        proof = db.session.get(AbstractPaymentProof, submission_id, with_for_update=True)

    if proof.payment_status != status:
        return jsonify({'detail': 'This payment has already been reviewed.', 'review': proof.review_data()}), 409
    if proof.review_email_sent_at:
        return jsonify({'review': proof.review_data()})

    accepted = proof.payment_status == 'accepted'
    subject = 'Symposium payment confirmed' if accepted else 'Symposium proof of payment rejected'
    decision = ('Your registration payment has been confirmed.'
                if accepted else 'Your proof of payment was rejected.')
    reason_text = f'Reason:\n{proof.review_reason}\n\n' if proof.review_reason else ''
    result = proof.review_data()
    try:
        send_payment_review_email(
            submission,
            subject,
            f'Dear {submission.author},\n\n'
            f'{decision}\n\n'
            f'Research title: {submission.research_title}\n\n'
            f'{reason_text}Symposium Secretariat\n',
        )
    except (OSError, smtplib.SMTPException, ValueError) as error:
        db.session.rollback()
        current_app.logger.warning('Payment review email failed for submission %s (%s)', submission_id, type(error).__name__)
        if isinstance(error, smtplib.SMTPAuthenticationError):
            detail = 'The email server rejected the sender credentials.'
        elif isinstance(error, smtplib.SMTPRecipientsRefused):
            detail = 'The email server rejected the address on the submission.'
        elif isinstance(error, ValueError):
            detail = 'The sender configuration or recipient address is invalid.'
        else:
            detail = 'The email server could not accept the notification.'
        return jsonify({'review': result, 'email_error': detail})

    proof.review_email_sent_at = datetime.now(timezone.utc).replace(tzinfo=None)
    db.session.commit()
    return jsonify({'review': proof.review_data()})
