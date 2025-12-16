# Import all models to ensure relationships are properly configured
# This must happen before any database queries
from app.models.base import Base  # noqa: F401
from app.models.role import Role  # noqa: F401
from app.models.specialization import Specialization  # noqa: F401
from app.models.user import User  # noqa: F401
from app.models.student import Student  # noqa: F401
from app.models.professor import Professor  # noqa: F401
from app.models.department import Department  # noqa: F401
from app.models.course_catalog import CourseCatalog  # noqa: F401
from app.models.academic_session import AcademicSession  # noqa: F401
from app.models.course_offering import CourseOffering  # noqa: F401
from app.models.section_group import SectionGroup  # noqa: F401
from app.models.enrollment import Enrollment  # noqa: F401
from app.models.student_section_assignment import StudentSectionAssignment  # noqa: F401
from app.models.room import Room  # noqa: F401
from app.models.scheduled_slot import ScheduledSlot  # noqa: F401
from app.models.assignment import Assignment  # noqa: F401
from app.models.assignment_file import AssignmentFile  # noqa: F401
from app.models.assignment_submission import AssignmentSubmission  # noqa: F401
from app.models.quiz import Quiz  # noqa: F401
from app.models.question import Question  # noqa: F401
from app.models.question_option import QuestionOption  # noqa: F401
from app.models.quiz_attempt import QuizAttempt  # noqa: F401
from app.models.quiz_answer import QuizAnswer  # noqa: F401
from app.models.quiz_file import QuizFile  # noqa: F401
from app.models.quiz_file_submission import QuizFileSubmission  # noqa: F401
from app.models.grade import Grade  # noqa: F401
from app.models.notification import Notification  # noqa: F401
from app.models.uploaded_file import UploadedFile  # noqa: F401
from app.models.associate_teacher import AssociateTeacher  # noqa: F401
from app.models.admin import Admin  # noqa: F401

__all__ = [
    "Base",
    "Role",
    "Specialization",
    "User",
    "Student",
    "Professor",
    "Department",
    "CourseCatalog",
    "AcademicSession",
    "CourseOffering",
    "SectionGroup",
    "Enrollment",
    "StudentSectionAssignment",
    "Room",
    "ScheduledSlot",
    "Assignment",
    "AssignmentFile",
    "AssignmentSubmission",
    "Quiz",
    "Question",
    "QuestionOption",
    "QuizAttempt",
    "QuizAnswer",
    "QuizFile",
    "QuizFileSubmission",
    "Grade",
    "Notification",
    "UploadedFile",
    "AssociateTeacher",
    "Admin",
]
