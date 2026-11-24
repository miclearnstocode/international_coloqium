from datetime import datetime, timezone
import smtplib

from flask import Blueprint, current_app, jsonify, request
from models import AbstractAcceptanceEmail, AbstractSubmission, db
from utils.acceptance_email import send_acceptance_email
from utils.decorators import evaluator_required

evaluation_bp = Blueprint('evaluation', __name__)

REVIEW_FIELDS = (
    'id', 'research_title', 'author', 'co_author', 'university_agency',
    'selected_track', 'specific_track', 'presentation_type',
    'keywords', 'status', 'created_at', 'abstract_drive_view_url',
    'abstract_drive_download_url',
)


@evaluation_bp.get('/api/evaluator/submissions')
@evaluator_required
def list_submissions():
    rows = db.session.query(AbstractSubmission, AbstractAcceptanceEmail).outerjoin(
        AbstractAcceptanceEmail,
        AbstractAcceptanceEmail.submission_id == AbstractSubmission.id,
    ).order_by(AbstractSubmission.created_at.desc(), AbstractSubmission.id.desc()).all()
    submissions = []
    for submission, notification in rows:
        row = submission.to_dict()
        entry = {field: row[field] for field in REVIEW_FIELDS}
        if notification is not None:
            entry['acceptance_email'] = 'sent' if notification.sent_at else 'pending'
        submissions.append(entry)
    return jsonify({'submissions': submissions})


@evaluation_bp.post('/api/evaluator/submissions/<int:submission_id>/accept')
@evaluator_required
def accept_submission(submission_id):
    return accept_and_notify(submission_id)


def accept_and_notify(submission_id):
    updated = AbstractSubmission.query.filter_by(id=submission_id, status='pending').update(
        {'status': 'accepted'}
    )
    if updated:
        notification = db.session.get(AbstractAcceptanceEmail, submission_id)
        if notification is None:
            db.session.add(AbstractAcceptanceEmail(submission_id=submission_id))
        db.session.commit()
    else:
        db.session.rollback()

    submission = db.session.get(AbstractSubmission, submission_id)
    if submission is None:
        return jsonify({'detail': 'Submission not found.'}), 404
    if submission.status != 'accepted':
        return jsonify({
            'detail': 'This submission already has a decision.',
            'status': submission.status,
        }), 409

    notification = AbstractAcceptanceEmail.query.filter_by(
        submission_id=submission_id
    ).with_for_update().one_or_none()
    if notification is None:
        return jsonify({'status': 'accepted'})
    if notification.sent_at:
        return jsonify({'status': 'accepted', 'acceptance_email': 'sent'})

    try:
        send_acceptance_email(submission)
    except (OSError, smtplib.SMTPException, ValueError) as error:
        db.session.rollback()
        current_app.logger.warning(
            'Acceptance email failed for submission %s (%s)', submission_id, type(error).__name__
        )
        return jsonify({'status': 'accepted', 'acceptance_email': 'pending'})

    notification.sent_at = datetime.now(timezone.utc).replace(tzinfo=None)
    db.session.commit()
    return jsonify({'status': 'accepted', 'acceptance_email': 'sent'})


@evaluation_bp.put('/api/evaluator/submissions/<int:submission_id>/status')
@evaluator_required
def decide_submission(submission_id):
    data = request.get_json(silent=True)
    status = data.get('status') if isinstance(data, dict) else None
    if status not in ('accepted', 'rejected'):
        return jsonify({'detail': 'Choose accepted or rejected.'}), 400

    if status == 'accepted':
        return accept_and_notify(submission_id)

    updated = AbstractSubmission.query.filter_by(
        id=submission_id, status='pending'
    ).update({'status': status})
    if updated:
        db.session.commit()
        return jsonify({'status': status})

    submission = db.session.get(AbstractSubmission, submission_id)
    if submission is None:
        return jsonify({'detail': 'Submission not found.'}), 404
    if submission.status == status:
        return jsonify({'status': status})
    return jsonify({
        'detail': 'This submission already has a decision.',
        'status': submission.status,
    }), 409
