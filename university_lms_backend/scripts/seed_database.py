#!/usr/bin/env python3
"""
University LMS Database Seeding Script with Faker
-------------------------------------------------
Comprehensive database seeding script that generates realistic test data
for the University LMS system using the Faker library.

This script generates:
- Roles (admin, professor, student, associate)
- 1000+ users with varied roles
- Departments and specializations
- Academic sessions
- Course catalog entries
- Course offerings with professors and associates
- Student enrollments
- Assignments and grades
- Quizzes and related data

Usage:
    python scripts/seed_database.py

Environment Variables:
    DATABASE_URL or individual POSTGRES_* variables
"""

import os
import sys
import random
from pathlib import Path
from datetime import datetime, timedelta, date
from typing import List, Dict, Any

# Add the parent directory to the path to import app modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
from faker import Faker
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Load environment variables first
load_dotenv()

from app.core.config import get_settings
from app.core.security import get_password_hash

# Initialize Faker
fake = Faker()
Faker.seed(42)  # For reproducible data
random.seed(42)

# Global counters for tracking
STATS = {
    'users': 0,
    'professors': 0,
    'associates': 0,
    'students': 0,
    'departments': 0,
    'courses': 0,
    'offerings': 0,
    'enrollments': 0,
    'assignments': 0,
    'grades': 0,
    'quizzes': 0,
}


def create_roles(session):
    """Create or update the basic roles in the system."""
    print("🔧 Creating roles...")
    roles = [
        ("Administrator", "System administrator with full access"),
        ("Professor", "Faculty member who teaches courses"),
        ("Student", "Enrolled student"),
        ("Teaching Associate", "Assistant helping professors"),
    ]
    
    role_map = {}
    for name, desc in roles:
        result = session.execute(
            text("SELECT role_id FROM roles WHERE name = :name"),
            {"name": name}
        )
        row = result.fetchone()
        
        if row:
            role_id = row[0]
            session.execute(
                text("UPDATE roles SET description = :desc WHERE role_id = :id"),
                {"desc": desc, "id": role_id}
            )
        else:
            session.execute(
                text("INSERT INTO roles (name, description) VALUES (:name, :desc)"),
                {"name": name, "desc": desc}
            )
            result = session.execute(
                text("SELECT role_id FROM roles WHERE name = :name"),
                {"name": name}
            )
            role_id = result.fetchone()[0]
        
        role_map[name] = role_id
    
    session.commit()
    print(f"   ✓ Created {len(roles)} roles")
    return role_map


def create_departments(session, count=15):
    """Create departments with realistic names."""
    print(f"🏛️  Creating {count} departments...")
    
    dept_names = [
        ("CS", "Computer Science"),
        ("EE", "Electrical Engineering"),
        ("ME", "Mechanical Engineering"),
        ("CE", "Civil Engineering"),
        ("BIO", "Biology"),
        ("CHEM", "Chemistry"),
        ("PHYS", "Physics"),
        ("MATH", "Mathematics"),
        ("BUS", "Business Administration"),
        ("ECON", "Economics"),
        ("PSY", "Psychology"),
        ("ENG", "English Literature"),
        ("HIST", "History"),
        ("ART", "Fine Arts"),
        ("MUS", "Music"),
    ]
    
    dept_ids = []
    for code, name in dept_names[:count]:
        result = session.execute(
            text("SELECT dept_id FROM departments WHERE code = :code"),
            {"code": code}
        )
        row = result.fetchone()
        
        if not row:
            session.execute(
                text("INSERT INTO departments (code, name) VALUES (:code, :name)"),
                {"code": code, "name": name}
            )
            result = session.execute(
                text("SELECT dept_id FROM departments WHERE code = :code"),
                {"code": code}
            )
            dept_ids.append(result.fetchone()[0])
        else:
            dept_ids.append(row[0])
    
    session.commit()
    STATS['departments'] = len(dept_ids)
    print(f"   ✓ Created {len(dept_ids)} departments")
    return dept_ids


def create_specializations(session, count=20):
    """Create specializations for students."""
    print(f"📚 Creating {count} specializations...")
    
    spec_names = [
        ("AI", "Artificial Intelligence"),
        ("DS", "Data Science"),
        ("NET", "Networks and Security"),
        ("SE", "Software Engineering"),
        ("DB", "Database Systems"),
        ("ML", "Machine Learning"),
        ("CB", "Computational Biology"),
        ("QC", "Quantum Computing"),
        ("IOT", "Internet of Things"),
        ("CLOUD", "Cloud Computing"),
        ("CYBER", "Cybersecurity"),
        ("GAME", "Game Development"),
        ("MOBILE", "Mobile Development"),
        ("WEB", "Web Development"),
        ("ROBO", "Robotics"),
        ("VLSI", "VLSI Design"),
        ("POWER", "Power Systems"),
        ("CTRL", "Control Systems"),
        ("NANO", "Nanotechnology"),
        ("BIO", "Bioinformatics"),
    ]
    
    spec_ids = []
    for code, name in spec_names[:count]:
        result = session.execute(
            text("SELECT specialization_id FROM specializations WHERE code = :code"),
            {"code": code}
        )
        row = result.fetchone()
        
        if not row:
            session.execute(
                text("INSERT INTO specializations (code, name) VALUES (:code, :name)"),
                {"code": code, "name": name}
            )
            result = session.execute(
                text("SELECT specialization_id FROM specializations WHERE code = :code"),
                {"code": code}
            )
            spec_ids.append(result.fetchone()[0])
        else:
            spec_ids.append(row[0])
    
    session.commit()
    print(f"   ✓ Created {len(spec_ids)} specializations")
    return spec_ids


def create_users(session, role_map, spec_ids, 
                 num_professors=50, num_associates=80, num_students=900):
    """Create users with different roles using Faker."""
    print(f"👥 Creating users (professors: {num_professors}, associates: {num_associates}, students: {num_students})...")
    
    user_ids = {
        'admin': [],
        'professor': [],
        'associate': [],
        'student': [],
    }
    
    # Create 1 admin
    admin_data = {
        'username': 'admin_user',
        'email': 'admin@university.edu',
        'password_hash': get_password_hash('Admin@12345!'),
        'first_name': 'Admin',
        'last_name': 'User',
        'role_id': role_map['Administrator'],
        'is_active': 1,
        'is_verified': 1,
    }
    
    result = session.execute(
        text("SELECT user_id FROM users WHERE username = :username"),
        {"username": admin_data['username']}
    )
    if not result.fetchone():
        session.execute(
            text("""
                INSERT INTO users 
                (username, email, password_hash, first_name, last_name, role_id, is_active, is_verified)
                VALUES (:username, :email, :password_hash, :first_name, :last_name, :role_id, :is_active, :is_verified)
            """),
            admin_data
        )
        result = session.execute(
            text("SELECT user_id FROM users WHERE username = :username"),
            {"username": admin_data['username']}
        )
        user_ids['admin'].append(result.fetchone()[0])
    
    # Create professors
    for i in range(num_professors):
        first_name = fake.first_name()
        last_name = fake.last_name()
        username = f"prof_{last_name.lower()}_{i}"
        email = f"{username}@university.edu"
        
        user_data = {
            'username': username,
            'email': email,
            'password_hash': get_password_hash(f'{username}@Pass123!'),
            'first_name': first_name,
            'last_name': last_name,
            'phone': fake.phone_number()[:20],
            'role_id': role_map['Professor'],
            'is_active': 1,
            'is_verified': 1,
        }
        
        result = session.execute(
            text("SELECT user_id FROM users WHERE username = :username"),
            {"username": username}
        )
        if not result.fetchone():
            session.execute(
                text("""
                    INSERT INTO users 
                    (username, email, password_hash, first_name, last_name, phone, role_id, is_active, is_verified)
                    VALUES (:username, :email, :password_hash, :first_name, :last_name, :phone, :role_id, :is_active, :is_verified)
                """),
                user_data
            )
            result = session.execute(
                text("SELECT user_id FROM users WHERE username = :username"),
                {"username": username}
            )
            user_ids['professor'].append(result.fetchone()[0])
    
    # Create associate teachers
    for i in range(num_associates):
        first_name = fake.first_name()
        last_name = fake.last_name()
        username = f"ta_{last_name.lower()}_{i}"
        email = f"{username}@university.edu"
        
        user_data = {
            'username': username,
            'email': email,
            'password_hash': get_password_hash(f'{username}@Pass123!'),
            'first_name': first_name,
            'last_name': last_name,
            'phone': fake.phone_number()[:20],
            'role_id': role_map['Teaching Associate'],
            'is_active': 1,
            'is_verified': 1,
        }
        
        result = session.execute(
            text("SELECT user_id FROM users WHERE username = :username"),
            {"username": username}
        )
        if not result.fetchone():
            session.execute(
                text("""
                    INSERT INTO users 
                    (username, email, password_hash, first_name, last_name, phone, role_id, is_active, is_verified)
                    VALUES (:username, :email, :password_hash, :first_name, :last_name, :phone, :role_id, :is_active, :is_verified)
                """),
                user_data
            )
            result = session.execute(
                text("SELECT user_id FROM users WHERE username = :username"),
                {"username": username}
            )
            user_ids['associate'].append(result.fetchone()[0])
    
    # Create students
    for i in range(num_students):
        first_name = fake.first_name()
        last_name = fake.last_name()
        username = f"student_{last_name.lower()}_{i}"
        email = f"{username}@university.edu"
        spec_id = random.choice(spec_ids) if spec_ids and random.random() > 0.1 else None
        
        user_data = {
            'username': username,
            'email': email,
            'password_hash': get_password_hash(f'{username}@Pass123!'),
            'first_name': first_name,
            'last_name': last_name,
            'phone': fake.phone_number()[:20],
            'role_id': role_map['Student'],
            'specialization_id': spec_id,
            'is_active': 1,
            'is_verified': 1,
        }
        
        result = session.execute(
            text("SELECT user_id FROM users WHERE username = :username"),
            {"username": username}
        )
        if not result.fetchone():
            session.execute(
                text("""
                    INSERT INTO users 
                    (username, email, password_hash, first_name, last_name, phone, role_id, specialization_id, is_active, is_verified)
                    VALUES (:username, :email, :password_hash, :first_name, :last_name, :phone, :role_id, :specialization_id, :is_active, :is_verified)
                """),
                user_data
            )
            result = session.execute(
                text("SELECT user_id FROM users WHERE username = :username"),
                {"username": username}
            )
            user_ids['student'].append(result.fetchone()[0])
            
            # Create student profile
            student_user_id = result.fetchone()[0] if result.rowcount == 0 else user_ids['student'][-1]
            year = random.randint(1, 4)
            status = random.choice(['active', 'active', 'active', 'active', 'inactive'])
            
            session.execute(
                text("""
                    INSERT INTO students (user_id, specialization_id, year, status)
                    VALUES (:user_id, :spec_id, :year, :status)
                    ON CONFLICT (user_id) DO NOTHING
                """),
                {"user_id": student_user_id, "spec_id": spec_id, "year": year, "status": status}
            )
    
    session.commit()
    STATS['users'] = len(user_ids['admin']) + len(user_ids['professor']) + len(user_ids['associate']) + len(user_ids['student'])
    STATS['professors'] = len(user_ids['professor'])
    STATS['associates'] = len(user_ids['associate'])
    STATS['students'] = len(user_ids['student'])
    print(f"   ✓ Created {STATS['users']} users total")
    return user_ids


def create_academic_sessions(session, count=4):
    """Create academic sessions (semesters)."""
    print(f"📅 Creating {count} academic sessions...")
    
    session_ids = []
    current_year = datetime.now().year
    
    for i in range(count):
        year = current_year - (count - i - 1)
        for semester, (start_month, end_month) in [('Fall', (9, 12)), ('Spring', (1, 5))]:
            name = f"{year} {semester}"
            start_date = date(year if semester == 'Fall' else year + 1, start_month, 1)
            end_date = date(year if semester == 'Fall' else year + 1, end_month, 30)
            is_active = (i == count - 1 and semester == 'Fall')
            
            result = session.execute(
                text("SELECT session_id FROM academic_sessions WHERE name = :name"),
                {"name": name}
            )
            row = result.fetchone()
            
            if not row:
                session.execute(
                    text("""
                        INSERT INTO academic_sessions (name, start_date, end_date, is_active)
                        VALUES (:name, :start_date, :end_date, :is_active)
                    """),
                    {"name": name, "start_date": start_date, "end_date": end_date, "is_active": is_active}
                )
                result = session.execute(
                    text("SELECT session_id FROM academic_sessions WHERE name = :name"),
                    {"name": name}
                )
                session_ids.append(result.fetchone()[0])
            else:
                session_ids.append(row[0])
    
    session.commit()
    print(f"   ✓ Created {len(session_ids)} academic sessions")
    return session_ids


def create_course_catalog(session, dept_ids, count=100):
    """Create course catalog entries."""
    print(f"📖 Creating {count} course catalog entries...")
    
    course_prefixes = ['CS', 'EE', 'ME', 'MATH', 'BIO', 'CHEM', 'PHYS', 'BUS', 'ENG', 'HIST']
    course_ids = []
    
    for i in range(count):
        prefix = random.choice(course_prefixes)
        course_num = random.randint(100, 599)
        course_code = f"{prefix}{course_num}"
        course_name = fake.catch_phrase() + " " + random.choice(['Theory', 'Lab', 'Seminar', 'Workshop', 'Research'])
        credits = random.choice([3, 3, 3, 4, 4])
        dept_id = random.choice(dept_ids)
        
        result = session.execute(
            text("SELECT course_id FROM course_catalog WHERE course_code = :code"),
            {"code": course_code}
        )
        row = result.fetchone()
        
        if not row:
            session.execute(
                text("""
                    INSERT INTO course_catalog (course_code, course_name, credits, dept_id)
                    VALUES (:code, :name, :credits, :dept_id)
                """),
                {"code": course_code, "name": course_name, "credits": credits, "dept_id": dept_id}
            )
            result = session.execute(
                text("SELECT course_id FROM course_catalog WHERE course_code = :code"),
                {"code": course_code}
            )
            course_ids.append(result.fetchone()[0])
        else:
            course_ids.append(row[0])
    
    session.commit()
    STATS['courses'] = len(course_ids)
    print(f"   ✓ Created {len(course_ids)} courses")
    return course_ids


def create_course_offerings(session, course_ids, session_ids, dept_ids, user_ids):
    """Create course offerings with professors and associates."""
    print(f"🎓 Creating course offerings...")
    
    offering_ids = []
    sections = ['A', 'B', 'C', 'D', 'L01', 'L02', 'L03']
    
    # Create 2-3 offerings per course across sessions
    for course_id in course_ids:
        num_offerings = random.randint(2, 3)
        for _ in range(num_offerings):
            session_id = random.choice(session_ids)
            section = random.choice(sections)
            dept_id = random.choice(dept_ids)
            
            # Check if offering exists
            result = session.execute(
                text("""
                    SELECT offering_id FROM course_offerings 
                    WHERE course_id = :course_id AND academic_session_id = :session_id AND section = :section
                """),
                {"course_id": course_id, "session_id": session_id, "section": section}
            )
            row = result.fetchone()
            
            if not row:
                session.execute(
                    text("""
                        INSERT INTO course_offerings (course_id, academic_session_id, department_id, section)
                        VALUES (:course_id, :session_id, :dept_id, :section)
                    """),
                    {"course_id": course_id, "session_id": session_id, "dept_id": dept_id, "section": section}
                )
                result = session.execute(
                    text("""
                        SELECT offering_id FROM course_offerings 
                        WHERE course_id = :course_id AND academic_session_id = :session_id AND section = :section
                    """),
                    {"course_id": course_id, "session_id": session_id, "section": section}
                )
                offering_id = result.fetchone()[0]
                offering_ids.append(offering_id)
                
                # Assign 1-2 professors to this offering
                num_profs = random.randint(1, 2)
                selected_profs = random.sample(user_ids['professor'], min(num_profs, len(user_ids['professor'])))
                for prof_user_id in selected_profs:
                    session.execute(
                        text("""
                            INSERT INTO professors (user_id, course_offering_id, department_id, role)
                            VALUES (:user_id, :offering_id, :dept_id, :role)
                        """),
                        {"user_id": prof_user_id, "offering_id": offering_id, "dept_id": dept_id, "role": "professor"}
                    )
                
                # Assign 1-2 associates to this offering
                if random.random() > 0.3:  # 70% chance of having associates
                    num_assocs = random.randint(1, 2)
                    selected_assocs = random.sample(user_ids['associate'], min(num_assocs, len(user_ids['associate'])))
                    for assoc_user_id in selected_assocs:
                        session.execute(
                            text("""
                                INSERT INTO associate_teachers (user_id, course_offering_id, role)
                                VALUES (:user_id, :offering_id, :role)
                            """),
                            {"user_id": assoc_user_id, "offering_id": offering_id, "role": "associate_teacher"}
                        )
            else:
                offering_ids.append(row[0])
    
    session.commit()
    STATS['offerings'] = len(offering_ids)
    print(f"   ✓ Created {len(offering_ids)} course offerings")
    return offering_ids


def create_enrollments(session, offering_ids, user_ids):
    """Enroll students in course offerings."""
    print(f"📝 Creating student enrollments...")
    
    enrollment_count = 0
    
    # Each student enrolls in 3-6 courses
    for student_id in user_ids['student']:
        num_courses = random.randint(3, 6)
        selected_offerings = random.sample(offering_ids, min(num_courses, len(offering_ids)))
        
        for offering_id in selected_offerings:
            status = random.choice(['active', 'active', 'active', 'active', 'dropped', 'waitlisted'])
            enrolled_at = fake.date_time_between(start_date='-6M', end_date='now')
            
            result = session.execute(
                text("""
                    SELECT enrollment_id FROM enrollments 
                    WHERE student_id = :student_id AND course_offering_id = :offering_id
                """),
                {"student_id": student_id, "offering_id": offering_id}
            )
            
            if not result.fetchone():
                session.execute(
                    text("""
                        INSERT INTO enrollments (student_id, course_offering_id, status, enrolled_at)
                        VALUES (:student_id, :offering_id, :status, :enrolled_at)
                    """),
                    {"student_id": student_id, "offering_id": offering_id, "status": status, "enrolled_at": enrolled_at}
                )
                enrollment_count += 1
    
    session.commit()
    STATS['enrollments'] = enrollment_count
    print(f"   ✓ Created {enrollment_count} enrollments")


def create_assignments_and_grades(session, offering_ids, user_ids):
    """Create assignments for offerings and grades for enrolled students."""
    print(f"📄 Creating assignments and grades...")
    
    assignment_count = 0
    grade_count = 0
    
    # Get enrolled students per offering
    for offering_id in offering_ids:
        # Create 3-5 assignments per offering
        num_assignments = random.randint(3, 5)
        
        for i in range(num_assignments):
            title = f"Assignment {i+1}: {fake.catch_phrase()}"
            description = fake.paragraph(nb_sentences=3)
            due_date = fake.date_between(start_date='today', end_date='+60d')
            max_points = random.choice([50, 75, 100, 100, 100])
            
            session.execute(
                text("""
                    INSERT INTO assignments (course_offering_id, title, description, due_date, max_points)
                    VALUES (:offering_id, :title, :description, :due_date, :max_points)
                """),
                {"offering_id": offering_id, "title": title, "description": description, "due_date": due_date, "max_points": max_points}
            )
            result = session.execute(text("SELECT lastval()"))
            assignment_id = result.fetchone()[0]
            assignment_count += 1
            
            # Get students enrolled in this offering
            result = session.execute(
                text("""
                    SELECT student_id FROM enrollments 
                    WHERE course_offering_id = :offering_id AND status = 'active'
                """),
                {"offering_id": offering_id}
            )
            enrolled_students = [row[0] for row in result.fetchall()]
            
            # Create grades for 70% of enrolled students (some haven't submitted yet)
            for student_id in enrolled_students:
                if random.random() > 0.3:
                    numeric_score = random.randint(0, max_points)
                    percentage = (numeric_score / max_points) * 100
                    
                    # Convert to letter grade
                    if percentage >= 90:
                        grade_value = "A"
                    elif percentage >= 80:
                        grade_value = "B"
                    elif percentage >= 70:
                        grade_value = "C"
                    elif percentage >= 60:
                        grade_value = "D"
                    else:
                        grade_value = "F"
                    
                    remarks = random.choice([None, None, None, "Good work", "Needs improvement", "Excellent"])
                    
                    session.execute(
                        text("""
                            INSERT INTO grades (student_id, assignment_id, course_offering_id, grade_value, numeric_score, remarks)
                            VALUES (:student_id, :assignment_id, :offering_id, :grade_value, :numeric_score, :remarks)
                        """),
                        {
                            "student_id": student_id,
                            "assignment_id": assignment_id,
                            "offering_id": offering_id,
                            "grade_value": grade_value,
                            "numeric_score": numeric_score,
                            "remarks": remarks
                        }
                    )
                    grade_count += 1
    
    session.commit()
    STATS['assignments'] = assignment_count
    STATS['grades'] = grade_count
    print(f"   ✓ Created {assignment_count} assignments and {grade_count} grades")


def create_quizzes(session, offering_ids):
    """Create quizzes for course offerings."""
    print(f"📝 Creating quizzes...")
    
    quiz_count = 0
    
    # Create 2-3 quizzes per offering (50% of offerings)
    for offering_id in offering_ids:
        if random.random() > 0.5:
            continue
            
        num_quizzes = random.randint(2, 3)
        
        for i in range(num_quizzes):
            title = f"Quiz {i+1}: {fake.catch_phrase()}"
            description = fake.paragraph(nb_sentences=2)
            due_date = fake.date_between(start_date='today', end_date='+60d')
            max_points = random.choice([20, 25, 30, 50])
            time_limit = random.choice([30, 45, 60, 90])
            
            session.execute(
                text("""
                    INSERT INTO quizzes (course_offering_id, title, description, due_date, max_points, time_limit_minutes)
                    VALUES (:offering_id, :title, :description, :due_date, :max_points, :time_limit)
                """),
                {
                    "offering_id": offering_id,
                    "title": title,
                    "description": description,
                    "due_date": due_date,
                    "max_points": max_points,
                    "time_limit": time_limit
                }
            )
            quiz_count += 1
    
    session.commit()
    STATS['quizzes'] = quiz_count
    print(f"   ✓ Created {quiz_count} quizzes")


def print_summary():
    """Print a summary of all seeded data."""
    print("\n" + "="*60)
    print("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!")
    print("="*60)
    print(f"📊 Summary of seeded data:")
    print(f"   • Users:          {STATS['users']:,}")
    print(f"   • Professors:     {STATS['professors']:,}")
    print(f"   • Associates:     {STATS['associates']:,}")
    print(f"   • Students:       {STATS['students']:,}")
    print(f"   • Departments:    {STATS['departments']:,}")
    print(f"   • Courses:        {STATS['courses']:,}")
    print(f"   • Offerings:      {STATS['offerings']:,}")
    print(f"   • Enrollments:    {STATS['enrollments']:,}")
    print(f"   • Assignments:    {STATS['assignments']:,}")
    print(f"   • Grades:         {STATS['grades']:,}")
    print(f"   • Quizzes:        {STATS['quizzes']:,}")
    print("="*60)
    print("\n✅ Sample credentials:")
    print("   Admin: admin_user / Admin@12345!")
    print("   Professor: prof_[lastname]_[n] / prof_[lastname]_[n]@Pass123!")
    print("   Student: student_[lastname]_[n] / student_[lastname]_[n]@Pass123!")
    print("="*60 + "\n")


def main():
    """Main seeding function."""
    print("\n" + "="*60)
    print("🌱 UNIVERSITY LMS DATABASE SEEDING SCRIPT")
    print("="*60 + "\n")
    
    # Get settings and connect to database
    settings = get_settings()
    print(f"📡 Connecting to database: {settings.DATABASE_URL}\n")
    
    try:
        engine = create_engine(settings.DATABASE_URL)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        session = SessionLocal()
        
        # Run seeding steps
        role_map = create_roles(session)
        dept_ids = create_departments(session, count=15)
        spec_ids = create_specializations(session, count=20)
        user_ids = create_users(session, role_map, spec_ids, 
                               num_professors=50, num_associates=80, num_students=900)
        session_ids = create_academic_sessions(session, count=4)
        course_ids = create_course_catalog(session, dept_ids, count=100)
        offering_ids = create_course_offerings(session, course_ids, session_ids, dept_ids, user_ids)
        create_enrollments(session, offering_ids, user_ids)
        create_assignments_and_grades(session, offering_ids, user_ids)
        create_quizzes(session, offering_ids)
        
        session.close()
        
        # Print summary
        print_summary()
        
    except Exception as e:
        print(f"\n❌ Error during seeding: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
