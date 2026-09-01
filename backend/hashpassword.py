from flask_bcrypt import Bcrypt
bcrypt = Bcrypt()

# The hash from your database
db_hash = '$2b$12$STMjtSD2Mldjft1QCVrZk.6dzzf7vf.H10A6lBa7.bjwC/C9xwwAu'  # YOUR FULL HASH

# Test if password matches
result = bcrypt.check_password_hash(db_hash, 'Int3r_Staff6')
print(f"Password matches: {result}")

# If not, generate a new hash
if not result:
    new_hash = bcrypt.generate_password_hash('Int3r_Staff6').decode('utf-8')
    print(f"New hash: {new_hash}")