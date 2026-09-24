from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity
import traceback
from models import db, PageContent, PageContentItem, ContentAuditLog
from utils.decorators import super_admin_required

content_bp = Blueprint('content', __name__)


@content_bp.route('/api/content/<page_slug>', methods=['GET', 'OPTIONS'])
def get_page_content(page_slug):
    """Public endpoint: fetch all content for a page."""
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        blocks = PageContent.query.filter_by(page_slug=page_slug).all()
        items = PageContentItem.query.filter_by(
            page_slug=page_slug, is_active=True
        ).order_by(PageContentItem.item_order).all()

        # Build nested dict: { section_key: { field_key: value } }
        content = {}
        for b in blocks:
            content.setdefault(b.section_key, {})[b.field_key] = b.field_value

        # Group items: { section_key: [ {...}, {...} ] }
        list_items = {}
        for it in items:
            list_items.setdefault(it.section_key, []).append(it.item_data)

        return jsonify({
            "content": content,
            "items": list_items
        }), 200
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

        # Delete existing items for this section
        PageContentItem.query.filter_by(
            page_slug=page_slug, section_key=section_key
        ).delete()

        # Insert new items
        for idx, item in enumerate(items):
            new_item = PageContentItem(
                page_slug=page_slug,
                section_key=section_key,
                item_order=idx,
                item_data=item,
                is_active=True
            )
            db.session.add(new_item)

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

