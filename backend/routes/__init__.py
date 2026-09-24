from .auth import auth_bp
from .submissions import submissions_bp
from .sucs import sucs_bp
from .content import content_bp
from .events import events_bp
from .pages import pages_bp
from .users import users_bp

ALL_BLUEPRINTS = [
    auth_bp,
    submissions_bp,
    sucs_bp,
    content_bp,
    events_bp,
    pages_bp,
    users_bp,
]