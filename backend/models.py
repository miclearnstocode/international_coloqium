from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('user', 'staff', 'admin'), nullable=False, default='user')
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }


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

    def to_dict(self):
        return {
            'id': self.id,
            'sender_id': self.sender_id,
            'user_id': self.user_id,
            'selected_track': self.selected_track,
            'specific_track': self.specific_track,
            'research_title': self.research_title,
            'author': self.author,
            'co_author': self.co_author,
            'presenter': self.presenter,
            'email_address': self.email_address,
            'university_agency': self.university_agency,
            'address': self.address,
            'phone_number': self.phone_number,
            'presentation_type': self.presentation_type,
            'city_tour_option': self.city_tour_option,
            'abstract': self.abstract,
            'keywords': self.keywords,
            'abstract_drive_view_url': self.abstract_drive_view_url,
            'abstract_drive_download_url': self.abstract_drive_download_url,
            'status': self.status,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }

class SUC(db.Model):
    __tablename__ = 'sucs_agency'
    id = db.Column(db.Integer, primary_key=True)
    region = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(255), nullable=False, unique=True)
    abbreviation = db.Column(db.String(50), nullable=True)
    type = db.Column(db.String(50), nullable=True)
    is_active = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            'id': self.id,
            'region': self.region,
            'name': self.name,
            'abbreviation': self.abbreviation,
            'type': self.type,
            'is_active': self.is_active
        }

class PasswordResetCode(db.Model):
    __tablename__ = 'password_reset_codes'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), nullable=False, index=True)
    code = db.Column(db.String(6), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    used = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())


# ============================================================
# PAGE CONTENT MODELS (for Super Admin CMS)
# ============================================================
class PageContent(db.Model):
    """Stores individual editable fields for each page."""
    __tablename__ = 'page_content'
    id = db.Column(db.Integer, primary_key=True)
    page_slug = db.Column(db.String(100), nullable=False)
    section_key = db.Column(db.String(100), nullable=False)
    field_key = db.Column(db.String(100), nullable=False)
    field_value = db.Column(db.Text, nullable=True)
    field_type = db.Column(db.String(50), default='text')  # 'text', 'html', 'url', 'image'
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    updated_by = db.Column(db.Integer, nullable=True)

    __table_args__ = (
        db.UniqueConstraint('page_slug', 'section_key', 'field_key', name='unique_field'),
        db.Index('idx_page_slug', 'page_slug'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'page_slug': self.page_slug,
            'section_key': self.section_key,
            'field_key': self.field_key,
            'field_value': self.field_value,
            'field_type': self.field_type,
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S') if self.updated_at else None,
            'updated_by': self.updated_by
        }


class PageContentItem(db.Model):
    """Stores list-style content (announcements, bullet lists, etc.) as JSON."""
    __tablename__ = 'page_content_items'
    id = db.Column(db.Integer, primary_key=True)
    page_slug = db.Column(db.String(100), nullable=False)
    section_key = db.Column(db.String(100), nullable=False)
    item_order = db.Column(db.Integer, default=0)
    item_data = db.Column(db.JSON, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    __table_args__ = (
        db.Index('idx_page_section', 'page_slug', 'section_key'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'page_slug': self.page_slug,
            'section_key': self.section_key,
            'item_order': self.item_order,
            'item_data': self.item_data,
            'is_active': self.is_active
        }


class ContentAuditLog(db.Model):
    """Tracks all content changes made by super admins."""
    __tablename__ = 'content_audit_log'
    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, nullable=False)
    page_slug = db.Column(db.String(100))
    action = db.Column(db.String(50))  # 'create', 'update', 'delete'
    field_key = db.Column(db.String(100))
    old_value = db.Column(db.Text)
    new_value = db.Column(db.Text)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'admin_id': self.admin_id,
            'page_slug': self.page_slug,
            'action': self.action,
            'field_key': self.field_key,
            'old_value': self.old_value,
            'new_value': self.new_value,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }

class Event(db.Model):
    """Stores news & event entries created by admins."""
    __tablename__ = 'events'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(500), nullable=False)
    description = db.Column(db.Text, nullable=True)
    date = db.Column(db.String(50), nullable=True)        # ISO date "2025-09-01"
    end_date = db.Column(db.String(50), nullable=True)    # optional end date
    location = db.Column(db.String(255), nullable=True)
    category = db.Column(db.String(100), nullable=False, default='Announcement')
    status = db.Column(db.Enum('Draft', 'Published'), nullable=False, default='Draft')
    featured = db.Column(db.Boolean, default=False)
    item_order = db.Column(db.Integer, default=0)         # for drag-reorder
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    created_by = db.Column(db.Integer, nullable=True)     # admin user id

    __table_args__ = (
        db.Index('idx_event_status', 'status'),
        db.Index('idx_event_order', 'item_order'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'date': self.date,
            'endDate': self.end_date,
            'location': self.location,
            'category': self.category,
            'status': self.status,
            'featured': self.featured,
            'order': self.item_order,
            'is_active': self.is_active,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None,
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S') if self.updated_at else None,
            'created_by': self.created_by,
        }