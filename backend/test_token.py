# test_token.py — run this in the backend folder
from app import app
from flask_jwt_extended import create_access_token, decode_token

with app.app_context():
    print("JWT_SECRET_KEY in app.config:",
          repr(app.config.get('JWT_SECRET_KEY')))

    # Create a fresh token with the current config
    t = create_access_token(identity=3)
    print("Fresh token:", t[:40], "...")

    # Verify the old token from your browser
    old = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc5MDA1NTY4MCwianRpIjoiNDgzNjZkYTktMzQyYy00MTUwLTlmYWYtYjAwZmZjNzVkYTJmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MywibmJmIjoxNzkwMDU1NjgwLCJjc3JmIjoiNDNmYjI2NjYtM2ZkMC00MjM0LTgwNmItNjM2NjQ2ZWIyNGVkIiwiZXhwIjoxNzkwNjYwNDgwfQ.YHmtkYCmI4GMFmb8L9oUg1ziyNj769O1Orlt0V2bgmY"
    try:
        payload = decode_token(old)
        print("✅ Old token VALID. Payload:", payload)
    except Exception as e:
        print("❌ Old token INVALID:", type(e).__name__, "-", e)