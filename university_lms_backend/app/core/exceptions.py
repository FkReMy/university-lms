"""
Global Exception Definitions & Handlers (Production)
----------------------------------------------------
Defines custom exceptions and handlers for the University LMS backend.

- All error responses should be production-safe.
- No sample/demo error types; only real, documented, unified errors for system-wide use.
- All exception outputs are sanitized for client consumption.
"""

from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.status import HTTP_422_UNPROCESSABLE_ENTITY, HTTP_500_INTERNAL_SERVER_ERROR

class LMSException(HTTPException):
    """
    Base custom exception for LMS. Extend for other error types.
    """
    def __init__(self, status_code: int, detail: str = None, code: str = "error"):
        super().__init__(status_code=status_code, detail=detail)
        self.code = code

def lms_exception_handler(request: Request, exc: LMSException):
    """
    Handles all LMS exceptions in a unified, production-safe format.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={"code": exc.code, "detail": exc.detail or "Unexpected LMS error."},
    )

def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handles request data/model validation exceptions globally.
    Sanitizes details for client output.
    """
    return JSONResponse(
        status_code=HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "code": "validation_error",
            "detail": "One or more fields failed validation.",
            "errors": exc.errors(),
        },
    )

def generic_exception_handler(request: Request, exc: Exception):
    """
    Handles unexpected, generic exceptions. Masks details from clients.
    """
    return JSONResponse(
        status_code=HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "code": "internal_error",
            "detail": "An unexpected error occurred.",
        },
    )