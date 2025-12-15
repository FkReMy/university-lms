# University LMS

**University LMS** is a fully-featured, production-grade Learning Management System designed to streamline and unify the management of academic workflows, courses, users, and assessments in higher education environments.

## Features

- User, Role, and Permission Management (Students, Professors, Associates, Admin)
- Department and Specialization Management
- Courses, Course Offering, Section Groups, and Room Scheduling
- Student Enrollment and Section Assignments
- Quiz Management (creation, grading, attempts, analytics)
- File Upload and Resource Management
- High-quality RESTful API and modular architecture

## System Architecture

- **Backend:** Python FastAPI, SQLAlchemy (modular, service-oriented)
- **Database:** Production-ready RDBMS (e.g., PostgreSQL, MySQL, SQLite for dev/test)
- **Testing:** Pytest, Factory-based Faker Data Population
- **Dependency Management:** PEP-compliant, clean global components enforcing consistency across the system

## Getting Started

### Prerequisites

- Python 3.9+
- pip (Python package manager)
- [Optional for production] PostgreSQL or MySQL database running

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/<your-organization>/university-lms.git
    cd university-lms
    ```

2. **Create and activate virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate   # On Windows: venv\Scripts\activate
    ```

3. **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

### Database Setup

1. **Configure your database URL:**  
   Edit your environment variables or `.env` file:
    ```
    DATABASE_URL=postgresql://username:password@localhost/university_lms
    # For SQLite (development): sqlite:///./app.db
    ```

2. **Initialize database schema:**
    ```bash
    alembic upgrade head
    ```

3. **(Optional) Populate test data for development:**
    ```bash
    pytest --setup-show
    ```
    > This uses high-volume, realistic data population via system-wide Faker utility.

### Running the Application

```bash
uvicorn app.main:app --reload
```

- Visit [http://localhost:8000/docs](http://localhost:8000/docs) for the automatic, interactive OpenAPI documentation.

## Testing

- Run the full test suite (with automatic fixture-based fake data population):
    ```bash
    pytest
    ```

## Folder Structure

```
university-lms/
├── app/
│   ├── api/               # API routers and route definitions
│   ├── core/              # Config, security, and utility modules
│   ├── database.py        # Database session and engine
│   ├── models/            # Global ORM models for all entities
│   ├── schemas/           # Pydantic schemas for request/response validation
│   ├── services/          # Business logic and data access layers (global/unified)
│   ├── tests/             # Pytest suites, fakerdb population, conftest, etc.
│   └── main.py            # Application entry point (FastAPI app)
├── alembic/               # Database migration folder
├── requirements.txt
└── README.md
```

## Production Readiness

- Modularized using global components, unified via single source-of-truth models and schemas
- No demo/sample/test artifacts in production code
- Full dependency injection and override-ready architecture for test/mocking/integration
- Extensively commented for maintainability and clarity

## Contributing

- Adhere to existing code style, modularization, and use **global models/components**.
- All new features require tests and schema documentation.
- Open pull requests with clear, actionable descriptions.

## License


---
**University LMS** &copy; 2025-present Global Academic Solutions Inc. All rights reserved.