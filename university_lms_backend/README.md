# University LMS Backend

**University LMS Backend** is the secure, high-performance API server powering the Learning Management System. It manages all business logic, data persistence, authentication, and authorization for the platform.

Built with **Python 3.11+**, **FastAPI**, and **PostgreSQL**, it follows **Clean Architecture** principles for modularity, maintainability, and testability.

---

## 🛠 Tech Stack

| Component     | Technology     | Version    | Purpose                                      |
|---------------|----------------|------------|----------------------------------------------|
| **Framework** | FastAPI        | 0.110.2    | Async, high-performance API framework        |
| **Database**  | PostgreSQL     | 16         | Primary relational database                  |
| **ORM**       | SQLAlchemy     | 2.0.29     | Database abstraction and query building      |
| **Migrations**| Alembic        | 1.13.1     | Schema version control                       |
| **Validation**| Pydantic       | 2.7.1      | Data validation and settings management      |
| **Security**  | Argon2id (passlib) | -      | Secure password hashing                      |
| **Auth**      | JWT (HS256)    | -          | Stateless authentication tokens              |
| **Testing**   | Pytest         | 8.2.2      | Unit and integration testing                 |

---

## 📂 Project Structure

The project follows a **layered Clean Architecture** pattern: Controllers → Services → Repositories → Models.

```
university_lms_backend/
├── alembic/                    # 🗄️ Database migration scripts
├── app/
│   ├── api/                    # 🌐 API routes (controllers)
│   │   ├── v1/                 # Versioned endpoints
│   │   └── deps.py             # Shared dependencies (auth, DB session)
│   │
│   ├── core/                   # ⚙️ Core configuration
│   │   ├── config.py           # Settings and env loading
│   │   └── security.py         # JWT and hashing utilities
│   │
│   ├── models/                 # 🗃️ SQLAlchemy models (database tables)
│   ├── schemas/                # 📝 Pydantic schemas (request/response)
│   ├── repositories/           # 💾 Data access layer (CRUD)
│   ├── services/               # 🧠 Business logic (use cases)
│   └── main.py                 # 🚀 FastAPI app entry point
│
├── docker/                     # 🐳 Docker configuration
├── scripts/                    # 🔧 Utility scripts (fixtures, backups)
├── requirements.txt            # 📦 Python dependencies
└── docker-compose.yml          # 🏗️ Local development stack (Postgres + API)
```

---

## 🚀 Getting Started

### Option 1: Docker (Recommended)

```bash
# Copy environment template
cp .env.example .env

# Start the full stack (API + PostgreSQL)
docker-compose up --build

# API available at:
# - Docs: http://localhost:8000/docs
# - Base: http://localhost:8000/api/v1
```

### Option 2: Manual Local Setup

#### Prerequisites
- Python 3.11+
- PostgreSQL 16 (running locally)
- Redis (optional, for future caching)

#### Steps

```bash
# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Configuration

```bash
cp .env.example .env

# Edit .env and update the required values:
# 1. Set POSTGRES_PASSWORD (replace 'REPLACE_WITH_STRONG_PASSWORD')
# 2. Set JWT_SECRET_KEY (use a secure random string)
# 3. Configure email settings for your SMTP provider
# Note: DATABASE_URL is already configured for localhost - no changes needed!
```

#### Database Setup

```bash
# Apply migrations
alembic upgrade head

# Option A: Seed with comprehensive test data (1000+ records, recommended for development)
python scripts/seed_database.py

# Option B: Seed with minimal data (basic users only)
python scripts/seed_users.py

# Option C: Load reference fixtures only (departments, courses)
python scripts/load_fixtures.py
```

**Automatic Seeding on Startup:**
You can configure the app to automatically seed the database when it starts by setting an environment variable:

```bash
# In your .env file
SEED_ON_STARTUP=true
```

This will run `seed_database.py` automatically on application startup. See [scripts/README_SEEDING.md](scripts/README_SEEDING.md) for detailed documentation on seeding options and sample credentials.

#### Run the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## 🔑 Key Environment Variables (.env)

| Variable              | Description                              | Example / Default                      |
|-----------------------|------------------------------------------|----------------------------------------|
| `DATABASE_URL`        | PostgreSQL connection string              | `postgresql+psycopg2://user:pass@localhost/lms` |
| `JWT_SECRET_KEY`      | Secret for signing JWT tokens             | **Change in production!**              |
| `JWT_ALGORITHM`       | Signing algorithm                        | `HS256`                                |
| `ACCESS_TOKEN_EXPIRE` | Token expiry (minutes)                   | `30`                                   |
| `UPLOADS_PATH`        | Directory for file uploads               | `/uploads`                             |
| `CORS_ORIGINS`        | Allowed frontend origins                 | `http://localhost:5173`                |

---

## 🗄️ Database Migrations (Alembic)

```bash
# Generate migration after model changes
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Roll back last migration
alembic downgrade -1
```

---

## 🧪 Testing

```bash
# Run all tests
pytest

# With coverage
pytest --cov=app

# Specific file
pytest tests/test_auth.py
```

---

## 🛡️ Security Features

- **Password Hashing**: Argon2id (memory-hard, GPU-resistant).
- **Authentication**: OAuth2-compatible JWT flow with role claims.
- **RBAC**: Enforced via dependency injection (e.g., `get_current_admin`).
- **Input Validation**: Strict Pydantic schemas for all requests/responses.
- **Secure File Uploads**: MIME/magic validation, stored outside web root, served via protected endpoints.

---

## 📄 License

University LMS © 2025–present Global Academic Solutions Inc.