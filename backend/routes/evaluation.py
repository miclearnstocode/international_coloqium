from datetime import datetime, timezone
import smtplib

from flask import Blueprint, current_app, jsonify, request
from models import AbstractAcceptanceEmail, AbstractPaymentProof, AbstractRejectionEmail, AbstractSubmission, db
from utils.acceptance_email import send_acceptance_email, send_rejection_email
from utils.decorators import evaluator_required, super_admin_required

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
    submissions = []
    for submission, acceptance, rejection in decision_query().all():
        row = submission.to_dict()
        entry = {field: row[field] for field in REVIEW_FIELDS}
        if submission.status == 'accepted' and acceptance is not None:
            entry['acceptance_email'] = 'sent' if acceptance.sent_at else 'pending'
        if submission.status == 'rejected' and rejection is not None:
            entry['rejection_email'] = 'sent' if rejection.sent_at else 'pending'
            entry['rejection_reason'] = rejection.reason
        submissions.append(entry)
    response = jsonify({'submissions': submissions})
    response.headers['Cache-Control'] = 'no-store'
    return response


@evaluation_bp.get('/api/evaluator/submissions/<int:submission_id>/abstract')
@evaluator_required
def get_abstract_text(submission_id):
    submission = db.session.get(AbstractSubmission, submission_id)
    if submission is None:
        return jsonify({'detail': 'Submission not found.'}), 404
    response = jsonify({'abstract': submission.abstract})
    response.headers['Cache-Control'] = 'no-store'
    return response


def decision_query():
    return db.session.query(AbstractSubmission, AbstractAcceptanceEmail, AbstractRejectionEmail).outerjoin(
        AbstractAcceptanceEmail,
        AbstractAcceptanceEmail.submission_id == AbstractSubmission.id,
    ).outerjoin(
        AbstractRejectionEmail,
        AbstractRejectionEmail.submission_id == AbstractSubmission.id,
    ).order_by(AbstractSubmission.created_at.desc(), AbstractSubmission.id.desc())


@evaluation_bp.get('/api/admin/abstract-decisions')
@super_admin_required
def list_decisions():
    rows = decision_query().add_entity(AbstractPaymentProof).outerjoin(
        AbstractPaymentProof, AbstractPaymentProof.submission_id == AbstractSubmission.id,
    ).filter(AbstractSubmission.status.in_(('accepted', 'rejected'))).all()
    decisions = []
    for submission, acceptance, rejection, proof in rows:
        notification = acceptance if submission.status == 'accepted' else rejection
        sent_at = notification.sent_at if notification else None
        decisions.append({
            'id': submission.id,
            'research_title': submission.research_title,
            'author': submission.author,
            'email_address': submission.email_address,
            'status': submission.status,
            'rejection_reason': rejection.reason if rejection and submission.status == 'rejected' else None,
            'email_status': 'sent' if sent_at else 'pending' if notification else 'untracked',
            'email_sent_at': sent_at.replace(tzinfo=timezone.utc).isoformat() if sent_at else None,
            'payment_proof': {
                'filename': proof.original_name,
                'review': proof.review_data(),
            } if proof else None,
        })
    response = jsonify({'decisions': decisions})
    response.headers['Cache-Control'] = 'no-store'
    return response


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
    return deliver_notification(submission, notification, 'acceptance_email', send_acceptance_email)


def deliver_notification(submission, notification, field, send):
    status = submission.status
    if notification is None:
        return jsonify({'status': status})
    if notification.sent_at:
        return jsonify({'status': status, field: 'sent'})

    try:
        send(submission)
    except (OSError, smtplib.SMTPException, ValueError) as error:
        db.session.rollback()
        current_app.logger.warning(
            'Decision email failed for submission %s (%s)', submission.id, type(error).__name__
        )
        return jsonify({'status': status, field: 'pending'})

    notification.sent_at = datetime.now(timezone.utc).replace(tzinfo=None)
    db.session.commit()
    return jsonify({'status': status, field: 'sent'})


@evaluation_bp.put('/api/evaluator/submissions/<int:submission_id>/status')
@evaluator_required
def decide_submission(submission_id):
    data = request.get_json(silent=True)
    status = data.get('status') if isinstance(data, dict) else None
    if status not in ('accepted', 'rejected'):
        return jsonify({'detail': 'Choose accepted or rejected.'}), 400

    if status == 'accepted':
        return accept_and_notify(submission_id)

    reason = data.get('reason')
    if reason is not None and (not isinstance(reason, str) or not reason.strip() or len(reason.strip()) > 2000):
        return jsonify({'detail': 'Enter a rejection reason of 1 to 2,000 characters.'}), 400

    if reason is not None:
        updated = AbstractSubmission.query.filter_by(id=submission_id, status='pending').update(
            {'status': 'rejected'}
        )
        if updated:
            notification = db.session.get(AbstractRejectionEmail, submission_id)
            if notification is None:
                db.session.add(AbstractRejectionEmail(submission_id=submission_id, reason=reason.strip()))
            db.session.commit()
        else:
            db.session.rollback()

    submission = db.session.get(AbstractSubmission, submission_id)
    if submission is None:
        return jsonify({'detail': 'Submission not found.'}), 404
    if submission.status == 'pending' and reason is None:
        return jsonify({'detail': 'A rejection reason is required.'}), 400
    if submission.status != 'rejected':
        return jsonify({
            'detail': 'This submission already has a decision.',
            'status': submission.status,
        }), 409

    notification = AbstractRejectionEmail.query.filter_by(
        submission_id=submission_id
    ).with_for_update().one_or_none()
    return deliver_notification(
        submission, notification, 'rejection_email',
        lambda row: send_rejection_email(row, notification.reason),
    )
