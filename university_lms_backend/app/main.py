"""
University LMS Backend - Main Application Entrypoint (Production)
-----------------------------------------------------------------
Creates and configures the FastAPI app.

- Loads global production settings from config.
- Registers all unified domain routers (no demo/sample).
- Sets up error handling, event hooks, and middleware.
- Provides a single `create_app()` factory for both ASGI servers and CLI tools.
"""

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.config import get_settings

# Import unified domain routers (all production, no samples or demos)
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.roles import router as roles_router
from app.api.v1.courses import router as courses_router
from app.api.v1.offerings import router as offerings_router
from app.api.v1.departments import router as departments_router
from app.api.v1.sessions import router as sessions_router
from app.api.v1.assignments import router as assignments_router
from app.api.v1.assignment_files import router as assignment_files_router
from app.api.v1.assignment_submissions import router as assignment_submissions_router
from app.api.v1.quizzes import router as quizzes_router
from app.api.v1.quiz_attempts import router as quiz_attempts_router
from app.api.v1.quiz_files import router as quiz_files_router
from app.api.v1.quiz_answers import router as quiz_answers_router
from app.api.v1.grades import router as grades_router
from app.api.v1.enrollments import router as enrollments_router
from app.api.v1.section_groups import router as section_groups_router
from app.api.v1.student_section_assignments import router as student_section_assignments_router
from app.api.v1.rooms import router as rooms_router
from app.api.v1.files import router as files_router
from app.api.v1.notifications import router as notifications_router

def create_app(environment: str = None) -> FastAPI:
    """
    App factory that creates and configures the FastAPI app,
    registering all real production routers and core middlewares.
    """
    settings = get_settings()
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
    )

    # Set up CORS from settings
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS
            if isinstance(settings.ALLOWED_ORIGINS, list)
            else [settings.ALLOWED_ORIGINS],
        allow_methods=settings.ALLOWED_METHODS.split(","),
        allow_headers=settings.ALLOWED_HEADERS.split(","),
    )

    # Healthcheck endpoint (simple, no auth)
    @app.get("/healthz", tags=["System"])
    def healthcheck():
        return {"status": "ok"}

    # Register API routers under /api/v1
    app.include_router(auth_router, prefix="/api/v1/auth", tags=["Auth"])
    app.include_router(users_router, prefix="/api/v1/users", tags=["Users"])
    app.include_router(roles_router, prefix="/api/v1/roles", tags=["Roles"])
    app.include_router(courses_router, prefix="/api/v1/courses", tags=["Courses"])
    app.include_router(offerings_router, prefix="/api/v1/offerings", tags=["Offerings"])
    app.include_router(departments_router, prefix="/api/v1/departments", tags=["Departments"])
    app.include_router(sessions_router, prefix="/api/v1/sessions", tags=["Sessions"])
    app.include_router(assignments_router, prefix="/api/v1/assignments", tags=["Assignments"])
    app.include_router(assignment_files_router, prefix="/api/v1/assignment-files", tags=["AssignmentFiles"])
    app.include_router(assignment_submissions_router, prefix="/api/v1/assignment-submissions", tags=["AssignmentSubmissions"])
    app.include_router(quizzes_router, prefix="/api/v1/quizzes", tags=["Quizzes"])
    app.include_router(quiz_attempts_router, prefix="/api/v1/quiz-attempts", tags=["QuizAttempts"])
    app.include_router(quiz_files_router, prefix="/api/v1/quiz-files", tags=["QuizFiles"])
    app.include_router(quiz_answers_router, prefix="/api/v1/quiz-answers", tags=["QuizAnswers"])
    app.include_router(grades_router, prefix="/api/v1/grades", tags=["Grades"])
    app.include_router(enrollments_router, prefix="/api/v1/enrollments", tags=["Enrollments"])
    app.include_router(section_groups_router, prefix="/api/v1/section-groups", tags=["SectionGroups"])
    app.include_router(student_section_assignments_router, prefix="/api/v1/student-section-assignments", tags=["StudentSectionAssignments"])
    app.include_router(rooms_router, prefix="/api/v1/rooms", tags=["Rooms"])
    app.include_router(files_router, prefix="/api/v1/files", tags=["Files"])
    app.include_router(notifications_router, prefix="/api/v1/notifications", tags=["Notifications"])

    # Add production-ready error handlers, event hooks, background tasks here as needed.

    return app

# Entry point for running with `python -m app.main` (for dev only)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:create_app", host="0.0.0.0", port=8000, factory=True)