from .auth import auth_bp
from .submissions import submissions_bp
from .sucs import sucs_bp
from .content import content_bp
from .events import events_bp
from .pages import pages_bp
from .users import users_bp
from .evaluation import evaluation_bp
from .payment_proofs import payment_proofs_bp

ALL_BLUEPRINTS = [
    auth_bp,
    submissions_bp,
    sucs_bp,
    content_bp,
    events_bp,
    pages_bp,
    users_bp,
    evaluation_bp,
    payment_proofs_bp,
]