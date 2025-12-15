"""
AssignmentSubmission Service (Production)
-----------------------------------------
Service layer for managing AssignmentSubmission entities, handling CRUD operations and business logic
for assignment submissions in the LMS.

- No sample, demo, or test code.
- Utilizes global models, schemas, and unification best practices for maintainability and clarity.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.assignment_submission import AssignmentSubmission
from app.schemas.assignment_submission import (
    AssignmentSubmissionCreate,
    AssignmentSubmissionUpdate,
)
from app.schemas.assignment_submission import AssignmentSubmission as AssignmentSubmissionSchema

class AssignmentSubmissionService:
    """
    Handles all CRUD and business logic for assignment submissions.
    """

    @staticmethod
    def get_by_id(db: Session, submission_id: int) -> Optional[AssignmentSubmissionSchema]:
        """
        Retrieve an assignment submission by its unique identifier.
        """
        submission_obj = db.query(AssignmentSubmission).filter(AssignmentSubmission.assignment_submission_id == submission_id).first()
        return AssignmentSubmissionSchema.from_orm(submission_obj) if submission_obj else None

    @staticmethod
    def get_by_assignment_id(db: Session, assignment_id: int) -> List[AssignmentSubmissionSchema]:
        """
        Retrieve all submission records for a specific assignment.
        """
        submissions = db.query(AssignmentSubmission).filter(AssignmentSubmission.assignment_id == assignment_id).all()
        return [AssignmentSubmissionSchema.from_orm(s) for s in submissions]

    @staticmethod
    def get_by_student_id(db: Session, student_id: int) -> List[AssignmentSubmissionSchema]:
        """
        Retrieve all assignment submissions by a specific student.
        """
        submissions = db.query(AssignmentSubmission).filter(AssignmentSubmission.student_id == student_id).all()
        return [AssignmentSubmissionSchema.from_orm(s) for s in submissions]

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[AssignmentSubmissionSchema]:
        """
        Retrieve all assignment submissions, paginated.
        """
        submissions = db.query(AssignmentSubmission).offset(skip).limit(limit).all()
        return [AssignmentSubmissionSchema.from_orm(s) for s in submissions]

    @staticmethod
    def create(db: Session, submission_in: AssignmentSubmissionCreate) -> AssignmentSubmissionSchema:
        """
        Create and persist a new assignment submission.
        """
        submission_obj = AssignmentSubmission(**submission_in.dict())
        db.add(submission_obj)
        db.commit()
        db.refresh(submission_obj)
        return AssignmentSubmissionSchema.from_orm(submission_obj)

    @staticmethod
    def update(
        db: Session,
        submission_id: int,
        submission_in: AssignmentSubmissionUpdate
    ) -> Optional[AssignmentSubmissionSchema]:
        """
        Update an existing assignment submission record.
        """
        submission_obj = db.query(AssignmentSubmission).filter(AssignmentSubmission.assignment_submission_id == submission_id).first()
        if not submission_obj:
            return None
        for field, value in submission_in.dict(exclude_unset=True).items():
            setattr(submission_obj, field, value)
        db.commit()
        db.refresh(submission_obj)
        return AssignmentSubmissionSchema.from_orm(submission_obj)

    @staticmethod
    def delete(db: Session, submission_id: int) -> bool:
        """
        Delete an assignment submission by its ID.
        Returns True if deleted, False if not found.
        """
        submission_obj = db.query(AssignmentSubmission).filter(AssignmentSubmission.assignment_submission_id == submission_id).first()
        if not submission_obj:
            return False
        db.delete(submission_obj)
        db.commit()
        return True