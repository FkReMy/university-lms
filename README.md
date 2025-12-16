# University LMS

**University LMS** is a production-grade, full-stack Learning Management System. This **monorepo** contains both the React frontend and FastAPI backend needed to run the full application.

It streamlines academic workflows, such as course management, student enrollment, grading, and assessments.

---

## 📂 Project Structure

The project consists of two main applications that must both be set up.

```
university-lms/
├── university-lms-frontend/    # 🎨 Frontend (React + Vite)
│   ├── src/                    # Pages, components, and state management
│   └── README.md               # Frontend-specific docs
│
├── university_lms_backend/     # ⚙️ Backend (FastAPI)
│   ├── app/                    # API routes, models, and logic
│   └── README.md               # Backend-specific docs
│
└── README.md                   # 📄 Root documentation (this file)
```

## 🚀 Key Features

- **Role-Based Access Control (RBAC)**: Separate portals for Students, Professors, Teaching Associates, and Admins.
- **Academic Management**: Departments, Specializations, Courses, and Sections.
- **Assessment Engine**: Quizzes and assignments with auto/manual grading.
- **Resource Management**: Secure file uploads and course materials.
- **Scheduling**: Room booking and conflict-free timetables.

## 🛠 Tech Stack

| Component  | Technology             | Description                                           |
|------------|------------------------|-------------------------------------------------------|
| Frontend   | React 18 + Vite        | Modern, high-performance user interface               |
| State      | Zustand                | Lightweight global state management                   |
| Backend    | Python 3.11+ + FastAPI | Async, high-performance API framework                  |
| Database   | PostgreSQL 16          | Robust relational database                            |
| ORM        | SQLAlchemy 2.0         | Powerful SQL toolkit and Object-Relational Mapper     |
| Auth       | JWT + Argon2id         | Secure authentication and password hashing            |

## 🏁 Getting Started

You can run the project either with **Docker** (recommended for quick setup) or **locally** (for development).

### Prerequisites

#### For Docker Setup (Recommended)
- Docker and Docker Compose
- Node.js v18+ and npm (for frontend development)

#### For Local Setup
- Node.js v18+ and npm
- Python v3.9+ and pip
- PostgreSQL 16+ (local installation)

---

## 🐳 Docker Setup (Recommended)

### Quick Start with Docker

1. **Clone the Repository**
   ```bash
   git clone https://github.com/FkReMy/university-lms.git
   cd university-lms
   ```

2. **Configure Environment Variables**
   ```bash
   # Root-level configuration
   cp .env.example .env
   # Edit .env and set POSTGRES_PASSWORD
   
   # Backend configuration
   cp university_lms_backend/.env.example university_lms_backend/.env
   # Edit university_lms_backend/.env and update:
   # - POSTGRES_PASSWORD (match root .env)
   # - JWT_SECRET_KEY (generate a secure random key)
   # - DATABASE_URL will be auto-configured for Docker
   ```

3. **Start Database and Backend**
   ```bash
   # Start all services (database, redis, backend, migrations)
   docker-compose up -d
   
   # View logs
   docker-compose logs -f backend
   
   # Verify services are running
   docker-compose ps
   ```
   
   The backend API will be available at `http://localhost:8000`
   - API documentation: `http://localhost:8000/docs`
   - Health check: `http://localhost:8000/healthz`

4. **Setup and Run Frontend**
   ```bash
   cd university-lms-frontend
   
   # Install dependencies
   npm install
   
   # Configure environment
   cp .env.example .env
   # Verify VITE_API_BASE_URL=http://localhost:8000/api
   
   # Start development server
   npm run dev
   ```
   
   The frontend will be available at `http://localhost:5173`

### Docker Management Commands

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes all data)
docker-compose down -v

# Rebuild containers after code changes
docker-compose up -d --build

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f database

# Run database migrations manually
docker-compose run --rm migration

# Access database shell
docker-compose exec database psql -U lms_user -d lms

# Restart a specific service
docker-compose restart backend
```

### Testing with Docker

```bash
# Backend tests (requires database)
docker-compose exec backend pytest

# Or run tests in a temporary container
docker-compose run --rm backend pytest
```

---

## 💻 Local Development Setup

For local development without Docker, follow these steps:

### 1️⃣ Setup Local PostgreSQL Database

Install PostgreSQL 16+ on your system, then create a database:

```bash
# Create database (adjust credentials as needed)
psql -U postgres
CREATE DATABASE lms;
CREATE USER lms_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE lms TO lms_user;
\q
```

### 2️⃣ Backend Setup

```bash
cd university_lms_backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
# source venv/bin/activate

pip install -r requirements.txt

# Configure .env
cp .env.example .env
# Edit .env → Update POSTGRES_PASSWORD and JWT_SECRET_KEY
# DATABASE_URL is already configured for localhost (no changes needed for local dev)

# Apply migrations
alembic upgrade head

# (Optional) Seed test data
pytest --setup-show

# Run server (http://localhost:8000)
uvicorn app.main:app --reload
```

### 2️⃣ Backend Setup

```bash
cd university_lms_backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt

# Configure .env
cp .env.example .env
# Edit .env → Update:
# - POSTGRES_PASSWORD (match your database password)
# - JWT_SECRET_KEY (generate a secure random key)
# - DATABASE_URL=postgresql+psycopg2://lms_user:your_password@localhost:5432/lms

# Apply migrations
alembic upgrade head

# (Optional) Seed test data
python scripts/seed_users.py

# Run server (http://localhost:8000)
uvicorn app.main:app --reload
```

### 3️⃣ Frontend Setup

```bash
cd university-lms-frontend

npm install

# Configure .env
cp .env.example .env
# Verify VITE_API_BASE_URL=http://localhost:8000/api

# Start dev server (usually http://localhost:5173)
npm run dev
```

## 🧪 Running Tests

### Backend

```bash
cd university_lms_backend
pytest
```

### Frontend (build check)

```bash
cd university-lms-frontend
npm run build
```

## 📄 License

University LMS © 2025–present Global Academic Solutions Inc.