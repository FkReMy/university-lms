#!/usr/bin/env python3
"""
University LMS Database Backup Script (Production)
--------------------------------------------------
Creates a timestamped backup of the PostgreSQL database, storing it to a secure location.
This script is intended to run via cron, CI/CD, or manually by an administrator.

- Requires environment variables for DB credentials and backup directory.
- Dumps only the structure and data (no generic temp/test tables).
- Output file is automatically named as lms_backup_YYYYMMDD_HHMMSS.sql.gz (compressed).

Usage:
    python scripts/backup_db.py

Environment Variables:
    POSTGRES_HOST
    POSTGRES_PORT
    POSTGRES_USER
    POSTGRES_PASSWORD
    POSTGRES_DB
    BACKUP_DIR

Security:
    - Never commits backups to code repo.
    - Permissions: Backup dir should be accessible only by admins.
    - .env file is NOT read directly to avoid leaking secrets.
"""

import os
import sys
import subprocess
import datetime

def env_or_die(var):
    value = os.environ.get(var)
    if not value:
        print(f"ERROR: Required environment variable '{var}' is not set.", file=sys.stderr)
        sys.exit(1)
    return value

def main():
    # Collect and validate required environment variables
    host = env_or_die('POSTGRES_HOST')
    port = env_or_die('POSTGRES_PORT')
    user = env_or_die('POSTGRES_USER')
    password = env_or_die('POSTGRES_PASSWORD')
    db = env_or_die('POSTGRES_DB')
    backup_dir = env_or_die('BACKUP_DIR')

    # Prepare backup filename and ensure directory exists
    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    out_file = os.path.join(backup_dir, f"lms_backup_{timestamp}.sql.gz")
    os.makedirs(backup_dir, exist_ok=True)

    # Construct pg_dump command with secure env passing
    pg_env = os.environ.copy()
    pg_env['PGPASSWORD'] = password

    cmd = [
        "pg_dump",
        "-h", host,
        "-p", str(port),
        "-U", user,
        "-d", db,
        "-F", "p",          # Plain SQL
        "--no-owner",       # Do not output owner
        "--no-privileges",  # Do not output privilege commands
    ]

    print(f"Backing up {db} to {out_file} ...")
    try:
        # Run pg_dump and compress output
        with open(out_file, 'wb') as f:
            proc_pg = subprocess.Popen(cmd, env=pg_env, stdout=subprocess.PIPE)
            proc_gzip = subprocess.Popen(["gzip"], stdin=proc_pg.stdout, stdout=f)
            proc_pg.stdout.close()
            proc_gzip.communicate()
            if proc_pg.wait() != 0 or proc_gzip.returncode != 0:
                raise Exception("pg_dump or gzip failed")
        print("Backup completed successfully.")
    except Exception as e:
        print(f"Backup failed: {e}", file=sys.stderr)
        sys.exit(2)

if __name__ == "__main__":
    main()