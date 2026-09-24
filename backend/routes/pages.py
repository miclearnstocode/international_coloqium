from flask import Blueprint, jsonify, request
import traceback
from models import PageContent, PageContentItem
from utils.decorators import super_admin_required

pages_bp = Blueprint('pages', __name__)

PAGE_REGISTRY = [
    {"slug": "home",                   "name": "Home Page",              "path": "/",                     "category": "Home"},
    {"slug": "about",                  "name": "About Page",             "path": "/about",                "category": "About"},
    {"slug": "program",                "name": "Program Page",           "path": "/program",              "category": "Program"},
    {"slug": "scientific-tracks",      "name": "Scientific Tracks",      "path": "/scientific-tracks",    "category": "Scientific Tracks"},
    {"slug": "abstract-submission",    "name": "Abstract Submission",    "path": "/abstract-submission",  "category": "Abstract Submission"},
    {"slug": "registration",           "name": "Registration Page",      "path": "/registration",         "category": "Registration"},
    {"slug": "presentation-guidelines","name": "Presentation Guidelines","path": "/presentation-guidelines","category": "Guidelines"},
    {"slug": "partner-institutions",   "name": "Partner Institutions",   "path": "/partner-institutions", "category": "Partner Institutions"},
    {"slug": "hotel-mapping",          "name": "Hotel & Mapping",        "path": "/hotel-mapping",        "category": "Hotel & Mapping"},
    {"slug": "contact-us",             "name": "Contact Us",             "path": "/contact-us",           "category": "Contact Us"},
    {"slug": "news-events",            "name": "News & Events",          "path": "/news-events",          "category": "Content"},
]


@pages_bp.route('/api/admin/pages', methods=['GET', 'OPTIONS'])
@super_admin_required
def list_admin_pages():
    if request.method == 'OPTIONS':
        return jsonify({})
    try:
        result = []
        for p in PAGE_REGISTRY:
            result.append({
                "slug": p["slug"], "name": p["name"],
                "path": p["path"], "category": p["category"],
                "field_count": PageContent.query.filter_by(page_slug=p["slug"]).count(),
                "item_count": PageContentItem.query.filter_by(page_slug=p["slug"]).count(),
            })
        return jsonify(result), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"detail": str(e)}), 500