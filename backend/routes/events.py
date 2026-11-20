from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity
from datetime import date, datetime, time, timedelta, timezone
import traceback
from models import db, Event, ContentAuditLog
from utils.decorators import super_admin_required

events_bp = Blueprint('events', __name__)
EVENT_TIMEZONE = timezone(timedelta(hours=8))


def parse_date_safe(value):
    """Safely convert a string, datetime, or date to a date object."""
    if not value:
        return None
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    try:
        return date.fromisoformat(str(value).strip()[:10])
    except (ValueError, TypeError):
        return None


def date_str_safe(value):
    """Normalize input to an ISO 'YYYY-MM-DD' string (columns are String(50))."""
    d = parse_date_safe(value)
    return d.isoformat() if d else None


@events_bp.route('/api/events/countdown', methods=['GET', 'OPTIONS'])
def get_event_countdown():
    if request.method == 'OPTIONS':
        return jsonify({})

    try:
        event = (
            Event.query
            .filter(
                Event.status == 'Published',
                Event.date.isnot(None),
                Event.date != '',
            )
            .order_by(Event.featured.desc(), Event.date.asc())
            .first()
        )
        if not event:
            return jsonify({"detail": "No published event with a start date is configured"}), 404

        start_date = parse_date_safe(event.date)
        end_date = parse_date_safe(event.end_date) or start_date

        if not start_date:
            return jsonify({"detail": "Event start date is invalid"}), 500

        if end_date < start_date:
            return jsonify({"detail": "Event end date cannot be before its start date"}), 500

        event_start_at = datetime.combine(start_date, time.min, EVENT_TIMEZONE)
        event_end_at = datetime.combine(end_date, time(23, 59, 59), EVENT_TIMEZONE)
        server_now = datetime.now(EVENT_TIMEZONE)
        target_at = event_start_at if server_now < event_start_at else event_end_at
        remaining_seconds = max(0, int((target_at - server_now).total_seconds()))

        response = jsonify({
            "event_start_at": event_start_at.isoformat(),
            "event_end_at": event_end_at.isoformat(),
            "target_at": target_at.isoformat(),
            "server_now": server_now.isoformat(),
            "remaining_seconds": remaining_seconds,
        })
        response.headers["Cache-Control"] = "no-store"
        return response, 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"detail": str(e)}), 500


@events_bp.route('/api/events', methods=['GET', 'OPTIONS'])
def list_events():
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        include_drafts = request.args.get('include_drafts') == '1'

        q = Event.query
        if not include_drafts:
            q = q.filter_by(status='Published')

        events = q.order_by(Event.item_order.asc(), Event.date.asc()).all()
        return jsonify([e.to_dict() for e in events]), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"detail": str(e)}), 500


@events_bp.route('/api/admin/events', methods=['GET', 'OPTIONS'])
@super_admin_required
def admin_list_events():
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        events = Event.query.order_by(Event.item_order.asc(), Event.date.asc()).all()
        return jsonify([e.to_dict() for e in events]), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"detail": str(e)}), 500


@events_bp.route('/api/admin/events', methods=['POST', 'OPTIONS'])
@super_admin_required
def create_event():
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        user_id = get_jwt_identity()
        data = request.get_json() or {}

        title = (data.get('title') or '').strip()
        if not title:
            return jsonify({"detail": "Event title is required"}), 400

        max_order = db.session.query(db.func.max(Event.item_order)).scalar() or 0

        new_event = Event(
            title=title,
            description=data.get('description') or '',
            date=date_str_safe(data.get('date')),
            end_date=date_str_safe(data.get('endDate')),
            submission_deadline=date_str_safe(data.get('submissionDeadline')),
            is_submission_open=bool(data.get('isSubmissionOpen', True)),
            location=data.get('location') or '',
            category=data.get('category') or 'Announcement',
            status='Published' if data.get('status') == 'Published' else 'Draft',
            featured=bool(data.get('featured')),
            item_order=max_order + 1,
            created_by=user_id,
        )
        db.session.add(new_event)
        db.session.commit()

        db.session.add(ContentAuditLog(
            admin_id=user_id,
            page_slug='news-events',
            action='create',
            field_key=f"event.{new_event.id}",
            old_value=None,
            new_value=title,
        ))
        db.session.commit()

        return jsonify({
            "message": "Event created successfully",
            "event": new_event.to_dict(),
        }), 201
    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({"detail": str(e)}), 500


@events_bp.route('/api/admin/events/<int:event_id>', methods=['PUT', 'OPTIONS'])
@super_admin_required
def update_event(event_id):
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        user_id = get_jwt_identity()
        data = request.get_json() or {}

        event = Event.query.get(event_id)
        if not event:
            return jsonify({"detail": "Event not found"}), 404

        old_title = event.title
        changed = False

        if 'title' in data and data['title'] is not None:
            new_title = data['title'].strip()
            if not new_title:
                return jsonify({"detail": "Event title cannot be empty"}), 400
            event.title = new_title
            changed = True

        if 'description' in data:
            event.description = data['description'] or ''
            changed = True

        if 'date' in data:
            event.date = date_str_safe(data['date'])
            changed = True

        if 'endDate' in data:
            event.end_date = date_str_safe(data['endDate'])
            changed = True

        if 'submissionDeadline' in data:
            event.submission_deadline = date_str_safe(data['submissionDeadline'])
            changed = True

        if 'isSubmissionOpen' in data:
            event.is_submission_open = bool(data['isSubmissionOpen'])
            changed = True

        if 'location' in data:
            event.location = data['location'] or ''
            changed = True

        if 'category' in data:
            event.category = data['category'] or 'Announcement'
            changed = True

        if 'status' in data:
            if data['status'] not in ('Draft', 'Published'):
                return jsonify({"detail": "Invalid status"}), 400
            event.status = data['status']
            changed = True

        if 'featured' in data:
            event.featured = bool(data['featured'])
            changed = True

        if 'order' in data:
            event.item_order = int(data['order'])
            changed = True

        if changed:
            db.session.add(ContentAuditLog(
                admin_id=user_id,
                page_slug='news-events',
                action='update',
                field_key=f"event.{event.id}",
                old_value=old_title,
                new_value=event.title,
            ))

        db.session.commit()
        return jsonify({
            "message": "Event updated successfully",
            "event": event.to_dict(),
        }), 200
    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({"detail": str(e)}), 500


@events_bp.route('/api/admin/events/<int:event_id>', methods=['DELETE', 'OPTIONS'])
@super_admin_required
def delete_event(event_id):
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        user_id = get_jwt_identity()

        event = Event.query.get(event_id)
        if not event:
            return jsonify({"detail": "Event not found"}), 404

        old_title = event.title
        db.session.delete(event)

        db.session.add(ContentAuditLog(
            admin_id=user_id,
            page_slug='news-events',
            action='delete',
            field_key=f"event.{event_id}",
            old_value=old_title,
            new_value=None,
        ))
        db.session.commit()

        return jsonify({"message": "Event deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({"detail": str(e)}), 500


@events_bp.route('/api/admin/events/reorder', methods=['PUT', 'OPTIONS'])
@super_admin_required
def reorder_events():
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        data = request.get_json() or {}
        order = data.get('order', [])
        if not isinstance(order, list):
            return jsonify({"detail": "order must be a list of event IDs"}), 400

        for idx, event_id in enumerate(order):
            ev = Event.query.get(event_id)
            if ev:
                ev.item_order = idx

        db.session.commit()
        return jsonify({"message": "Events reordered successfully"}), 200
    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({"detail": str(e)}), 500


@events_bp.route('/api/admin/events/bulk-save', methods=['PUT', 'OPTIONS'])
@super_admin_required
def bulk_save_events():
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        user_id = get_jwt_identity()
        data = request.get_json() or {}
        incoming = data.get('events', [])

        if not isinstance(incoming, list):
            return jsonify({"detail": "events must be a list"}), 400

        incoming_ids = set()
        saved = []

        for idx, item in enumerate(incoming):
            raw_id = item.get('id')
            event_id = None
            if isinstance(raw_id, int):
                event_id = raw_id
            elif isinstance(raw_id, str) and raw_id.isdigit():
                event_id = int(raw_id)

            if event_id:
                ev = Event.query.get(event_id)
                if not ev:
                    ev = Event()
            else:
                ev = Event()

            ev.title = (item.get('title') or '').strip() or 'Untitled event'
            ev.description = item.get('description') or ''
            ev.date = date_str_safe(item.get('date'))
            ev.end_date = date_str_safe(item.get('endDate'))
            ev.submission_deadline = date_str_safe(item.get('submissionDeadline'))
            ev.is_submission_open = bool(item.get('isSubmissionOpen', True))
            ev.location = item.get('location') or ''
            ev.category = item.get('category') or 'Announcement'
            ev.status = 'Published' if item.get('status') == 'Published' else 'Draft'
            ev.featured = bool(item.get('featured'))
            ev.item_order = idx

            if not ev.created_by:
                ev.created_by = user_id

            db.session.add(ev)
            db.session.flush()
            incoming_ids.add(ev.id)
            saved.append(ev)

        existing = Event.query.all()
        for ev in existing:
            if ev.id not in incoming_ids:
                db.session.delete(ev)

        db.session.commit()

        return jsonify({
            "message": "Events saved successfully",
            "events": [e.to_dict() for e in saved],
        }), 200
    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({"detail": str(e)}), 500
