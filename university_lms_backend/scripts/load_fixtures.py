#!/usr/bin/env python3
"""
University LMS Load Fixtures Script (Production)
------------------------------------------------
Loads initial or reference data (departments, specializations, catalog entries)
into the PostgreSQL database for production/acceptance setups.

- No sample, test, or fake demo data.
- All fixtures are real, global reference data relevant for all university runs.
- Idempotent (safe to run multiple times).

Usage:
    python scripts/load_fixtures.py

Environment Variables:
    POSTGRES_HOST
    POSTGRES_PORT
    POSTGRES_USER
    POSTGRES_PASSWORD
    POSTGRES_DB

Security:
    - Uses only DB credentials from env vars.
    - Should be run by trusted admin only.
"""

import os
import sys
import psycopg2
from psycopg2.extras import execute_values

from dotenv import load_dotenv
load_dotenv()

def env_or_die(var):
    value = os.environ.get(var)
    if not value:
        print(f"ERROR: Required environment variable '{var}' is not set.", file=sys.stderr)
        sys.exit(1)
    return value

def main():
    # Load DB config from env
    DB_PARAMS = dict(
        host=env_or_die('POSTGRES_HOST'),
        port=env_or_die('POSTGRES_PORT'),
        user=env_or_die('POSTGRES_USER'),
        password=env_or_die('POSTGRES_PASSWORD'),
        dbname=env_or_die('POSTGRES_DB'),
    )

    # Real, global reference fixture data. NO sample/demo/fake data.
    departments = [
        # (dept_code, dept_name)
        ("CS", "Computer Science"),
        ("EE", "Electrical Engineering"),
        ("ME", "Mechanical Engineering"),
        ("BIO", "Biology"),
        ("MATH", "Mathematics"),
        ("BUS", "Business Administration"),
        ("CHEM", "Chemistry"),
    ]
    specializations = [
        # (spec_code, spec_name)
        ("AI", "Artificial Intelligence"),
        ("DS", "Data Science"),
        ("NET", "Networks"),
        ("CB", "Computational Biology"),
        ("ORG", "Organic Chemistry"),
    ]
    course_catalog = [
        # (course_code, course_name, credits, dept_code)
        ("CS101", "Introduction to Programming", 3, "CS"),
        ("CS201", "Data Structures", 3, "CS"),
        ("MATH101", "Calculus I", 3, "MATH"),
        ("EE210", "Circuits", 4, "EE"),
        ("DS301", "Intro to Data Science", 3, "CS"),
        ("BIO110", "General Biology", 3, "BIO"),
        ("BUS105", "Principles of Management", 3, "BUS"),
    ]

    with psycopg2.connect(**DB_PARAMS) as conn:
        with conn.cursor() as cur:
            # Departments
            print("Upserting departments...")
            execute_values(
                cur,
                """
                INSERT INTO departments (code, name)
                VALUES %s
                ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
                """,
                departments,
            )
            
            # Specializations
            print("Upserting specializations...")
            execute_values(
                cur,
                """
                INSERT INTO specializations (code, name)
                VALUES %s
                ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
                """,
                specializations,
            )
            
            # Course Catalog
            # CORRECTED: Uses 'course_code' and 'course_name' to match the model
            print("Upserting course catalog...")
            execute_values(
                cur,
                """
                INSERT INTO course_catalog (course_code, course_name, credits, dept_id)
                SELECT data.c_code, data.c_name, data.c_credits, d.dept_id
                FROM (VALUES %s) AS data(c_code, c_name, c_credits, d_code)
                JOIN departments d ON d.code = data.d_code
                ON CONFLICT (course_code) DO UPDATE SET
                  course_name = EXCLUDED.course_name,
                  credits = EXCLUDED.credits,
                  dept_id = EXCLUDED.dept_id
                """,
                course_catalog,
            )
        conn.commit()
    print("Fixture loading completed successfully.")

if __name__ == "__main__":
    main()