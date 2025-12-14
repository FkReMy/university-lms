# University LMS Backend

**A production-grade, secure, and extensible backend for a University Learning Management System (LMS). Built with Python 3.11+, FastAPI, SQLAlchemy, PostgreSQL 16, and following Clean Architecture best practices.**

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Setup and Installation](#setup-and-installation)
- [Configuration](#configuration)
- [Database Migration](#database-migration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Security and Best Practices](#security-and-best-practices)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The University LMS Backend is the core of a full-featured Learning Management System supporting:
- Multi-role access (Admin, Professor, AssociateTeacher, Student)
- Course, department, and session management
- Scheduling, timetables, and rooms
- Digital and file-based quizzes/assignments with secure submissions
- Robust grading workflows and auditability
- Secure file uploads and non-public storage
- Real-time dashboards for each role

This backend exposes a RESTful API for the React/Vite frontend, handles authentication/authorization, and enforces data integrity and business rules at every layer.

---

## Features

- **Authentication & Authorization**: JWT tokens, Argon2id password hashing, robust RBAC.
- **Academic Structure**: Departments, specializations, course catalog, academic sessions, course offerings.
- **Scheduling**: Room management, section groups, timetable and slot scheduling.
- **Assessments**: Digital quizzes, file-upload quizzes, assignments with flexible submission workflows.
- **Files & Grades**: Unified uploaded_files entity with secure handling, central grades table.
- **Dashboards**: Full coverage of progress, deadlines, and notifications per user role.
- **Audit & Logging**: Precise tracking of actions, grading, feedback, and submissions for accountability.
- **Clean Code & Security**: Pydantic validation, error handling, consistent conventions, no sample/demo logic, security by design throughout.

---

## Architecture

This backend is structured following **Clean Architecture**:
- **Routers**: Define public API endpoints, bind schemas, and enforce role-based access.
- **Services**: Business logic, use cases, all domain validation and security.
- **Repositories**: Safe, parameterized DB operations using SQLAlchemy ORM.
- **Models**: SQLAlchemy models defining the complete, normalized relational schema.
- **Schemas**: Pydantic models for safe request/response input/output.

**Security, validation, and data integrity are enforced at all layers.**

---

## Project Structure

```shell
university_lms_backend/
├── alembic/                # Database migrations (Alembic)
├── app/
│   ├── api/                # FastAPI routers (grouped by domain)
│   ├── core/               # Security, config, logging, shared utils
│   ├── models/             # SQLAlchemy models (database schema)
│   ├── repositories/       # Data access (SQLAlchemy, queries)
│   ├── schemas/            # Pydantic API schemas
│   ├── services/           # Business logic layer
│   ├── tests/              # Test suite (pytest)
│   ├── migrations/         # Manual/legacy migration scripts
│   ├── tasks/              # Background tasks (future, e.g. notifications)
│   └── static/             # Static assets for API docs
├── docker/                 # Dockerfiles and entry scripts
├── scripts/                # Utility and management scripts
├── docker-compose.yml
├── .env.example
├── README.md
```

- **No sample or demo data/scripts are included. All code is real and ready for production usage.**
- **All business logic is accessible only via global, unified API endpoints and is permission-checked.**

---

## Technology Stack

- **Python 3.11+**
- **FastAPI** (ASGI, modern, async, production ready)
- **SQLAlchemy 2.0** (ORM)
- **PostgreSQL 16**
- **Alembic** (Migrations)
- **Pydantic** (Validation/Schemas)
- **Docker & Docker Compose**
- **Redis** (Future: caching, tasks)
- **pytest** (Testing)

---

## Setup and Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/<your-org>/university_lms_backend.git
   cd university_lms_backend
   ```

2. **Copy and configure environment variables:**
   ```sh
   cp .env.example .env
   # Edit .env with your DB, JWT, and mail configuration
   ```

3. **Build and start the stack (development):**
   ```sh
   docker-compose up --build
   ```

   The backend will be available at `http://localhost:8000/api/v1`.

---

## Configuration

- All sensitive values (database, JWT secrets, email, file paths) **must** be set via the `.env` file and never committed to source control.
- Configuration is managed in `app/config.py` and loaded at startup.

---

## Database Migration

- Migrations are managed using Alembic. After editing models:
  
  ```sh
  alembic revision --autogenerate -m "Describe changes"
  alembic upgrade head
  ```

- All schema changes run through version-controlled migrations.

---

## Running the Application

- **Development/Local:** Use Docker Compose for full stack.
- **Production:** Build images and deploy via orchestrator of your choice (compose, kubernetes, etc).
- **Entry Point:** The default is `app/main.py` (see Dockerfile).

---

## Testing

- **Run all unit and integration tests:**
  ```sh
  pytest
  ```
- Coverage: All critical business logic, validation, and permissions MUST be covered.

---

## API Documentation

- **Interactive OpenAPI is auto-generated.**
- Dev: [http://localhost:8000/docs](http://localhost:8000/docs)
- Redoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

API docs always reflect the current schemas and endpoints—no out-of-date docs.

---

## Security and Best Practices

- Passwords hashed using Argon2id. No plaintext passwords stored or transmitted.
- JWT tokens for authentication (short-lived, rotating, never stored in user-visible code).
- All endpoints use role-based access control; only authorized users may access/modify data.
- File uploads are validated (magic byte check), stored outside web root, and only retrievable via secure endpoints.
- All inputs validated using Pydantic; no direct user input is ever executed in queries.
- Secret keys and configuration **must not** be checked into version control.
- Dockerized for consistent deployment and environment management.

---

## Contributing

- All enhancements and bugfixes must follow Clean Architecture and code conventions.
- All APIs must be secured, validated, and tested before merging.
- No sample/dummy/test data or UI should be committed to production branches.

---

## License

This project is provided for academic and non-commercial educational use.

---

**Production-Ready Note:**  
This codebase is 100% real backend logic—no samples, demos, or fake data.  
All APIs and modules are unified, secured, and follow best practices in code, security, and deployment.  
If you have new requirements or want to extend functionality (AI, mobile, dashboards), start by defining a new service/repository/model/schema in the relevant folder and update tests accordingly.

```