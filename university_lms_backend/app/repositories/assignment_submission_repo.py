"""
AssignmentSubmission Repository (Production)
--------------------------------------------
Handles database operations related to students' assignment submissions.

- No sample, demo, or test code.
- Fully unified with global models and SQLAlchemy session usage.
"""

from sqlalchemy.orm import Session
from app.models.assignment_submission import AssignmentSubmission

class AssignmentSubmissionRepository:
    """
    Repository for handling CRUD operations and business logic for assignment submissions.
    """

    @staticmethod
    def create(db: Session, assignment_id: int, student_id: int, file_path: str, submitted_at=None, grade: int = None, feedback: str = None):
        """
        Create a new assignment submission record.
        """
        submission = AssignmentSubmission(
            assignment_id=assignment_id,
            student_id=student_id,
            file_path=file_path,
            submitted_at=submitted_at,
            grade=grade,
            feedback=feedback,
        )
        db.add(submission)
        db.commit()
        db.refresh(submission)
        return submission

    @staticmethod
    def get_by_id(db: Session, submission_id: int):
        """
        Retrieve a submission by its primary key.
        """
        return db.query(AssignmentSubmission).filter(AssignmentSubmission.submission_id == submission_id).first()

    @staticmethod
    def list_by_assignment(db: Session, assignment_id: int):
        """
        List all submissions for a given assignment.
        """
        return db.query(AssignmentSubmission).filter(AssignmentSubmission.assignment_id == assignment_id).all()

    @staticmethod
    def list_by_student(db: Session, student_id: int):
        """
        List all submissions made by a specific student.
        """
        return db.query(AssignmentSubmission).filter(AssignmentSubmission.student_id == student_id).all()

    @staticmethod
    def update(db: Session, submission_id: int, **kwargs):
        """
        Update fields of a submission, such as grade or feedback.
        """
        submission = db.query(AssignmentSubmission).filter(AssignmentSubmission.submission_id == submission_id).first()
        if not submission:
            return None
        for key, value in kwargs.items():
            setattr(submission, key, value)
        db.commit()
        db.refresh(submission)
        return submission

    @staticmethod
    def delete(db: Session, submission_id: int):
        """
        Permanently remove a submission by primary key.
        """
        submission = db.query(AssignmentSubmission).filter(AssignmentSubmission.submission_id == submission_id).first()
        if not submission:
            return False
        db.delete(submission)
        db.commit()
        return True