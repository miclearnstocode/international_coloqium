from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity
import traceback
from models import db, Event, ContentAuditLog
from utils.decorators import super_admin_required

events_bp = Blueprint('events', __name__)


# ================= EVENTS (News & Events) =================

@events_bp.route('/api/events', methods=['GET', 'OPTIONS'])
def list_events():
    """Public endpoint: list published events (used by the public site)."""
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        # ?include_drafts=1 → admin preview (returns all statuses)
        include_drafts = request.args.get('include_drafts') == '1'

        q = Event.query.filter_by(is_active=True)
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
    """Admin endpoint: list ALL events (drafts + published)."""
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        events = Event.query.filter_by(is_active=True)\
            .order_by(Event.item_order.asc(), Event.date.asc()).all()
        return jsonify([e.to_dict() for e in events]), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"detail": str(e)}), 500


@events_bp.route('/api/admin/events', methods=['POST', 'OPTIONS'])
@super_admin_required
def create_event():
    """Create a new event."""
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        user_id = get_jwt_identity()
        data = request.get_json() or {}

        title = (data.get('title') or '').strip()
        if not title:
            return jsonify({"detail": "Event title is required"}), 400

        # Determine next order value
        max_order = db.session.query(db.func.max(Event.item_order)).scalar() or 0

        new_event = Event(
            title=title,
            description=data.get('description') or '',
            date=data.get('date') or '',
            end_date=data.get('endDate') or '',
            location=data.get('location') or '',
            category=data.get('category') or 'Announcement',
            status='Published' if data.get('status') == 'Published' else 'Draft',
            featured=bool(data.get('featured')),
            item_order=max_order + 1,
            is_active=True,
            created_by=user_id,
        )
        db.session.add(new_event)
        db.session.commit()

        # Audit log
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
    """Update an existing event."""
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        user_id = get_jwt_identity()
        data = request.get_json() or {}

        event = Event.query.get(event_id)
        if not event or not event.is_active:
            return jsonify({"detail": "Event not found"}), 404

        # Track changes for audit
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
            event.date = data['date'] or ''
            changed = True

        if 'endDate' in data:
            event.end_date = data['endDate'] or ''
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
    """Soft-delete an event."""
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        user_id = get_jwt_identity()

        event = Event.query.get(event_id)
        if not event or not event.is_active:
            return jsonify({"detail": "Event not found"}), 404

        event.is_active = False
        db.session.add(ContentAuditLog(
            admin_id=user_id,
            page_slug='news-events',
            action='delete',
            field_key=f"event.{event.id}",
            old_value=event.title,
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
    """Bulk-update event order. Body: { order: [id1, id2, id3, ...] }"""
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        data = request.get_json() or {}
        order = data.get('order', [])
        if not isinstance(order, list):
            return jsonify({"detail": "order must be a list of event IDs"}), 400

        for idx, event_id in enumerate(order):
            ev = Event.query.get(event_id)
            if ev and ev.is_active:
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
    """
    Save the entire events list in one request.
    Body: { events: [ {...}, {...} ] }
    Each item may or may not have an `id`.
      - If `id` exists → update
      - If `id` is missing → create
      - Any DB event NOT in the payload → soft-delete
    """
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
            # Convert string IDs like "evt_xxx" to None (treat as new)
            event_id = None
            if isinstance(raw_id, int):
                event_id = raw_id
            elif isinstance(raw_id, str) and raw_id.isdigit():
                event_id = int(raw_id)

            if event_id:
                ev = Event.query.get(event_id)
                if not ev or not ev.is_active:
                    ev = Event()  # treat as new if missing
                    event_id = None
            else:
                ev = Event()

            ev.title = (item.get('title') or '').strip() or 'Untitled event'
            ev.description = item.get('description') or ''
            ev.date = item.get('date') or ''
            ev.end_date = item.get('endDate') or ''
            ev.location = item.get('location') or ''
            ev.category = item.get('category') or 'Announcement'
            ev.status = 'Published' if item.get('status') == 'Published' else 'Draft'
            ev.featured = bool(item.get('featured'))
            ev.item_order = idx
            ev.is_active = True
            if not ev.created_by:
                ev.created_by = user_id

            db.session.add(ev)
            db.session.flush()  # get ID for new rows
            incoming_ids.add(ev.id)
            saved.append(ev)

        # Soft-delete any DB event not present in the payload
        existing = Event.query.filter_by(is_active=True).all()
        for ev in existing:
            if ev.id not in incoming_ids:
                ev.is_active = False

        db.session.commit()

        return jsonify({
            "message": "Events saved successfully",
            "events": [e.to_dict() for e in saved],
        }), 200
    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({"detail": str(e)}), 500