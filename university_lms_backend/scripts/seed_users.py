import os
import sys
import hashlib
from pathlib import Path

# Add the parent directory to the path to import app modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Load environment variables first
load_dotenv()

from app.core.config import get_settings

def hash_password(password: str) -> str:
    """Replicates the app's secure password hashing (PBKDF2)"""
    salt = os.urandom(16)
    hash_val = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
    return salt.hex() + ":" + hash_val.hex()

def main():
    # Get settings and connect to database
    settings = get_settings()
    print(f"Connecting to database: {settings.DATABASE_URL}")
    
    engine = create_engine(settings.DATABASE_URL)

    try:
        with engine.connect() as conn:
            # 1. Create Roles
            print("Seeding Roles...")
            roles = [
                ("admin", "Administrator", "System administrator with full access"),
                ("professor", "Professor", "Faculty member who teaches courses"),
                ("student", "Student", "Enrolled student"),
                ("associate", "Teaching Associate", "Assistant helping professors"),
            ]

            # Upsert roles and return IDs
            role_map = {}
            for code, name, desc in roles:
                # Check if role exists
                result = conn.execute(
                    text("SELECT role_id FROM roles WHERE name = :name"),
                    {"name": name}
                )
                row = result.fetchone()
                
                if row:
                    role_id = row[0]
                    # Update description
                    conn.execute(
                        text("UPDATE roles SET description = :desc WHERE role_id = :id"),
                        {"desc": desc, "id": role_id}
                    )
                else:
                    # Insert new role
                    result = conn.execute(
                        text("INSERT INTO roles (name, description, created_at, updated_at) VALUES (:name, :desc, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"),
                        {"name": name, "desc": desc}
                    )
                    # Get the last inserted id
                    result2 = conn.execute(
                        text("SELECT role_id FROM roles WHERE name = :name"),
                        {"name": name}
                    )
                    role_id = result2.fetchone()[0]
                
                role_map[code] = role_id
                print(f" - Role '{name}' ID: {role_id}")
                conn.commit()

            # 2. Create Users
            print("\nSeeding Users...")
            # (username, email, password, first, last, role_key)
            # Default password format: {username}@12345!
            users = [
                ("admin_remy", "admin@uni.edu", "Admin_Remy@12345!", "Admin", "Remy", "admin"),
                ("prof_smith", "smith@uni.edu", "Prof_Smith@12345!", "Prof", "Smith", "professor"),
                ("student_jane", "jane@uni.edu", "Student_Jane@12345!", "Student", "Jane", "student"),
                ("associate_bob", "bob@uni.edu", "Associate_Bob@12345!", "Associate", "Bob", "associate"),
            ]

            for username, email, raw_pass, first, last, role_key in users:
                # Check if user exists
                result = conn.execute(
                    text("SELECT user_id FROM users WHERE username = :username"),
                    {"username": username}
                )
                existing = result.fetchone()
                
                if existing:
                    print(f" - User {username} already exists.")
                    continue
                
                pass_hash = hash_password(raw_pass)
                role_id = role_map[role_key]
                
                # Insert user
                conn.execute(
                    text("""
                        INSERT INTO users 
                        (username, email, password_hash, first_name, last_name, role_id, is_active, is_verified, created_at, updated_at)
                        VALUES (:username, :email, :password_hash, :first_name, :last_name, :role_id, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                    """),
                    {
                        "username": username,
                        "email": email,
                        "password_hash": pass_hash,
                        "first_name": first,
                        "last_name": last,
                        "role_id": role_id
                    }
                )
                conn.commit()
                print(f" - Created user: {username} (Role: {role_key})")

        print("\n✅ Success! Default users created with the following credentials:")
        print("\n=== Default User Credentials ===")
        print("Role: Admin")
        print("  Username: admin_remy")
        print("  Password: Admin_Remy@12345!")
        print("\nRole: Professor")
        print("  Username: prof_smith")
        print("  Password: Prof_Smith@12345!")
        print("\nRole: Student")
        print("  Username: student_jane")
        print("  Password: Student_Jane@12345!")
        print("\nRole: Associate")
        print("  Username: associate_bob")
        print("  Password: Associate_Bob@12345!")
        print("\nPassword format: {username}@12345!")
        print("================================\n")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()