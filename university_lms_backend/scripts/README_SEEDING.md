# Database Seeding Guide

This directory contains scripts for seeding the University LMS database with initial and test data.

## Available Scripts

### 1. `seed_users.py` - Basic User Seeding
Creates a minimal set of users (admin, professor, student, associate) for testing purposes.

**Usage:**
```bash
python scripts/seed_users.py
```

### 2. `seed_database.py` - Comprehensive Data Seeding (NEW)
Creates a complete dataset with 1000+ records using the Faker library for realistic data generation.

**Features:**
- ✅ 1 Admin user
- ✅ 50 Professors  
- ✅ 80 Associate Teachers
- ✅ 900 Students
- ✅ 15 Departments
- ✅ 20 Specializations
- ✅ 8 Academic Sessions
- ✅ 100 Courses in catalog
- ✅ 200+ Course offerings
- ✅ 2700+ Student enrollments
- ✅ 600+ Assignments
- ✅ 15000+ Grades
- ✅ 100+ Quizzes

**Usage:**
```bash
python scripts/seed_database.py
```

## Automatic Seeding on Application Startup

The application can automatically run the comprehensive seeding script when it starts.

### Enable Auto-Seeding

Set the `SEED_ON_STARTUP` environment variable:

```bash
# In your .env file
SEED_ON_STARTUP=true

# Or export directly
export SEED_ON_STARTUP=true
```

Then start the application:
```bash
python -m app.main
# or
uvicorn app.main:app --reload
```

### Disable Auto-Seeding

```bash
# In your .env file
SEED_ON_STARTUP=false

# Or unset the variable
unset SEED_ON_STARTUP
```

## Sample Credentials

After running `seed_database.py`, you can use these credentials:

### Admin
- **Username:** `admin_user`
- **Password:** `Admin@12345!`

### Professors
- **Username:** `prof_[lastname]_[number]` (e.g., `prof_smith_0`)
- **Password:** `prof_[lastname]_[number]@Pass123!`

### Students
- **Username:** `student_[lastname]_[number]` (e.g., `student_jones_0`)
- **Password:** `student_[lastname]_[number]@Pass123!`

### Associate Teachers
- **Username:** `ta_[lastname]_[number]` (e.g., `ta_williams_0`)
- **Password:** `ta_[lastname]_[number]@Pass123!`

## Database Requirements

Both scripts require:
- A running PostgreSQL database (or SQLite for local testing)
- Properly configured `DATABASE_URL` in your environment
- Database tables created (run Alembic migrations first)

## Running Migrations First

Before seeding, ensure database tables exist:

```bash
# Run Alembic migrations
alembic upgrade head
```

## Notes

- The seeding scripts are **idempotent** - they check for existing records before inserting
- Running multiple times will skip existing users/data
- The comprehensive script (`seed_database.py`) uses a fixed seed (42) for reproducible data
- All generated data is realistic but fake (using Faker library)

## Troubleshooting

### "Table does not exist" error
Run Alembic migrations first:
```bash
alembic upgrade head
```

### "Connection refused" error
Ensure your database is running and `DATABASE_URL` is correctly configured.

### "Import error" for Faker
Install the required package:
```bash
pip install Faker
```

## Development Tips

- For local development, use `seed_database.py` to get a full dataset
- For CI/CD testing, use `seed_users.py` for minimal setup
- For production, run seeding manually and DO NOT use `SEED_ON_STARTUP=true`
