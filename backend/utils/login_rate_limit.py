from contextlib import closing
from ipaddress import IPv6Address, ip_address, ip_network
from pathlib import Path
import sqlite3
from time import time

from flask import current_app, request

WINDOW_SECONDS = 60
MAX_ATTEMPTS = 10


def client_bucket():
    try:
        address = ip_address(request.remote_addr or '')
    except ValueError:
        return 'unknown'

    if isinstance(address, IPv6Address):
        if address.ipv4_mapped:
            return str(address.ipv4_mapped)
        return str(ip_network((address, 64), strict=False))
    return str(address)


def consume_login_attempt():
    """Return retry seconds if the client has used its current login quota."""
    path = Path(current_app.config.get('LOGIN_RATE_LIMIT_PATH') or
                Path(current_app.instance_path) / 'login-rate-limit.sqlite3')
    path.parent.mkdir(parents=True, exist_ok=True)
    key = client_bucket()
    now = int(time())
    with closing(sqlite3.connect(path, timeout=2)) as connection, connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS login_attempts (
                client TEXT PRIMARY KEY,
                expires_at INTEGER NOT NULL,
                attempts INTEGER NOT NULL
            )
        """)
        connection.execute('CREATE INDEX IF NOT EXISTS login_attempts_expiry ON login_attempts(expires_at)')
        connection.execute('BEGIN IMMEDIATE')
        row = connection.execute(
            'SELECT expires_at, attempts FROM login_attempts WHERE client = ?', (key,)
        ).fetchone()
        if row and row[0] > now and row[1] >= MAX_ATTEMPTS:
            return row[0] - now

        connection.execute('DELETE FROM login_attempts WHERE expires_at <= ?', (now,))
        connection.execute("""
            INSERT INTO login_attempts (client, expires_at, attempts)
            VALUES (?, ?, 1)
            ON CONFLICT(client) DO UPDATE SET attempts = login_attempts.attempts + 1
        """, (key, now + WINDOW_SECONDS))
    return 0
