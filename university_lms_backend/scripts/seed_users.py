import os
import sys
import psycopg2
import hashlib
from psycopg2.extras import execute_values
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_env(var):
    val = os.getenv(var)
    if not val:
        print(f"Error: {var} not set in .env")
        sys.exit(1)
    return val

def hash_password(password: str) -> str:
    """Replicates the app's secure password hashing (PBKDF2)"""
    salt = os.urandom(16)
    hash_val = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
    return salt.hex() + ":" + hash_val.hex()

def main():
    db_params = dict(
        host=get_env('POSTGRES_HOST'),
        port=get_env('POSTGRES_PORT'),
        user=get_env('POSTGRES_USER'),
        password=get_env('POSTGRES_PASSWORD'),
        dbname=get_env('POSTGRES_DB'),
    )

    print("Connecting to database...")
    conn = psycopg2.connect(**db_params)
    cur = conn.cursor()

    try:
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
            cur.execute("""
                INSERT INTO roles (name, description)
                VALUES (%s, %s)
                ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
                RETURNING role_id;
            """, (name, desc))
            role_id = cur.fetchone()[0]
            role_map[code] = role_id
            print(f" - Role '{name}' ID: {role_id}")

        # 2. Create Users
        print("\nSeeding Users...")
        # (username, email, password, first, last, role_key)
        users = [
            ("admin", "admin@uni.edu", "Admin123!", "System", "Admin", "admin"),
            ("prof_smith", "smith@uni.edu", "Prof123!", "John", "Smith", "professor"),
            ("student_jane", "jane@uni.edu", "Student123!", "Jane", "Doe", "student"),
            ("ta_bob", "bob@uni.edu", "Associate123!", "Bob", "Assistant", "associate"),
        ]

        for username, email, raw_pass, first, last, role_key in users:
            pass_hash = hash_password(raw_pass)
            role_id = role_map[role_key]
            
            cur.execute("""
                INSERT INTO users 
                (username, email, password_hash, first_name, last_name, role_id, is_active, is_verified)
                VALUES (%s, %s, %s, %s, %s, %s, true, true)
                ON CONFLICT (username) DO NOTHING
                RETURNING user_id;
            """, (username, email, pass_hash, first, last, role_id))
            
            res = cur.fetchone()
            if res:
                print(f" - Created user: {username} (Role: {role_key})")
            else:
                print(f" - User {username} already exists.")

        conn.commit()
        print("\n✅ Success! You can now log in.")

    except Exception as e:
        conn.rollback()
        print(f"\n❌ Error: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    main()