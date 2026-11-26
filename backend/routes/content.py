from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity
import traceback
from models import db, PageContent, PageContentItem, ContentAuditLog
from utils.decorators import super_admin_required

content_bp = Blueprint('content', __name__)


HOTEL_MAPPING = 'hotel-mapping'
HOTEL_LISTS = {'venues_items', 'travel_items'}


def validate_venues(items):
    for index, venue in enumerate(items, start=1):
        name = venue.get('name')
        if not isinstance(name, str) or not name.strip():
            return f'Enter a name for venue {index}.'

        position = venue.get('pos')
        if position is None or (isinstance(position, str) and not position.strip()):
            continue

        try:
            parts = position.split(',') if isinstance(position, str) else position
            if not isinstance(parts, list) or len(parts) != 2 or any(isinstance(part, bool) for part in parts):
                raise ValueError
            lat, lng = map(float, parts)
            if not (-90 <= lat <= 90 and -180 <= lng <= 180):
                raise ValueError
        except (TypeError, ValueError, OverflowError):
            return f'Enter valid latitude and longitude for venue {index}, or leave its coordinates blank.'
    return None


def replace_page_items(page_slug, section_key, items):
    PageContentItem.query.filter_by(page_slug=page_slug, section_key=section_key).delete()
    for index, item in enumerate(items):
        db.session.add(PageContentItem(
            page_slug=page_slug, section_key=section_key, item_order=index,
            item_data=item, is_active=True,
        ))
    if not items and page_slug == HOTEL_MAPPING and section_key in HOTEL_LISTS:
        # An empty saved list must be distinguishable from an unconfigured list.
        db.session.add(PageContentItem(
            page_slug=page_slug, section_key=section_key, item_order=0,
            item_data=None, is_active=False,
        ))


@content_bp.route('/api/content/<page_slug>', methods=['GET', 'OPTIONS'])
def get_page_content(page_slug):
    """Public endpoint: fetch all content for a page."""
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        blocks = PageContent.query.filter_by(page_slug=page_slug).all()
        query = PageContentItem.query.filter_by(page_slug=page_slug)
        if page_slug != HOTEL_MAPPING:
            query = query.filter_by(is_active=True)
        items = query.order_by(PageContentItem.item_order, PageContentItem.id).all()

        # Build nested dict: { section_key: { field_key: value } }
        content = {}
        for b in blocks:
            content.setdefault(b.section_key, {})[b.field_key] = b.field_value

        # Group items: { section_key: [ {...}, {...} ] }
        list_items = {}
        for item in items:
            if item.is_active:
                list_items.setdefault(item.section_key, []).append(item.item_data)
            elif item.section_key in HOTEL_LISTS and item.item_data is None:
                list_items.setdefault(item.section_key, [])

        response = jsonify({"content": content, "items": list_items})
        response.headers['Cache-Control'] = 'no-store'
        return response, 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"detail": str(e)}), 500



@content_bp.route('/api/admin/content/<page_slug>', methods=['PUT', 'OPTIONS'])
@super_admin_required
def update_page_content(page_slug):
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        updates = data.get('updates', [])  # [{section_key, field_key, field_value, field_type}]

        lists = data.get('items', {})
        if page_slug == HOTEL_MAPPING and (
            not isinstance(lists, dict) or any(
                key not in HOTEL_LISTS or not isinstance(entries, list)
                or any(not isinstance(item, dict) for item in entries)
                for key, entries in lists.items()
            )
        ):
            return jsonify({"detail": "Invalid Hotel & Mapping list contents."}), 400
        if page_slug == HOTEL_MAPPING and 'venues_items' in lists:
            error = validate_venues(lists['venues_items'])
            if error:
                return jsonify({"detail": error}), 400

        for upd in updates:
            section_key = upd.get('section_key')
            field_key = upd.get('field_key')
            field_value = upd.get('field_value')
            field_type = upd.get('field_type', 'text')

            if not section_key or not field_key:
                continue

            existing = PageContent.query.filter_by(
                page_slug=page_slug,
                section_key=section_key,
                field_key=field_key
            ).first()

            old_value = existing.field_value if existing else None

            if existing:
                existing.field_value = field_value
                existing.field_type = field_type
                existing.updated_by = user_id
            else:
                new_block = PageContent(
                    page_slug=page_slug,
                    section_key=section_key,
                    field_key=field_key,
                    field_value=field_value,
                    field_type=field_type,
                    updated_by=user_id
                )
                db.session.add(new_block)

            # Audit log
            log = ContentAuditLog(
                admin_id=user_id,
                page_slug=page_slug,
                action='update' if existing else 'create',
                field_key=f"{section_key}.{field_key}",
                old_value=old_value,
                new_value=field_value
            )
            db.session.add(log)

        if page_slug == HOTEL_MAPPING:
            for section_key, entries in lists.items():
                replace_page_items(page_slug, section_key, entries)

        db.session.commit()
        return jsonify({"message": "Content updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({"detail": str(e)}), 500



@content_bp.route('/api/admin/content/<page_slug>/items/<section_key>', methods=['PUT', 'OPTIONS'])
@super_admin_required
def update_page_items(page_slug, section_key):
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        data = request.get_json()
        items = data.get('items', [])  # list of dicts

        if not isinstance(items, list) or any(not isinstance(item, dict) for item in items):
            return jsonify({"detail": "List items must be objects."}), 400
        if page_slug == HOTEL_MAPPING and section_key == 'venues_items':
            error = validate_venues(items)
            if error:
                return jsonify({"detail": error}), 400
        replace_page_items(page_slug, section_key, items)
        db.session.commit()
        return jsonify({"message": "Items updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({"detail": str(e)}), 500



@content_bp.route('/api/admin/content/<page_slug>/seed', methods=['POST', 'OPTIONS'])
@super_admin_required
def seed_page_content(page_slug):
    """Seed default content for a page if not already present."""
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        data = request.get_json() or {}
        fields = data.get('fields', [])   # [{section_key, field_key, field_value, field_type}]
        items_seed = data.get('items', {})  # { section_key: [ {..}, {..} ] }

        created_fields = 0
        for f in fields:
            exists = PageContent.query.filter_by(
                page_slug=page_slug,
                section_key=f['section_key'],
                field_key=f['field_key']
            ).first()
            if not exists:
                db.session.add(PageContent(
                    page_slug=page_slug,
                    section_key=f['section_key'],
                    field_key=f['field_key'],
                    field_value=f.get('field_value', ''),
                    field_type=f.get('field_type', 'text')
                ))
                created_fields += 1

        created_items = 0
        for section_key, items_list in items_seed.items():
            existing_count = PageContentItem.query.filter_by(
                page_slug=page_slug, section_key=section_key
            ).count()
            if existing_count == 0:
                for idx, item in enumerate(items_list):
                    db.session.add(PageContentItem(
                        page_slug=page_slug,
                        section_key=section_key,
                        item_order=idx,
                        item_data=item,
                        is_active=True
                    ))
                    created_items += 1

        db.session.commit()
        return jsonify({
            "message": "Seed complete",
            "fields_created": created_fields,
            "items_created": created_items
        }), 200

    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({"detail": str(e)}), 500



@content_bp.route('/api/admin/content/<page_slug>/audit', methods=['GET', 'OPTIONS'])
@super_admin_required
def get_audit_log(page_slug):
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        logs = ContentAuditLog.query.filter_by(page_slug=page_slug)\
            .order_by(ContentAuditLog.created_at.desc()).limit(100).all()
        return jsonify([l.to_dict() for l in logs]), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"detail": str(e)}), 500

