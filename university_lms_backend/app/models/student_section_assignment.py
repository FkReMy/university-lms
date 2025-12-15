"""
StudentSectionAssignment Model (Production)
-------------------------------------------
Maps students to their assigned section groups within a course offering (e.g., for labs, recitations).

- No sample, demo, or test fields, only true production logic.
- Fully unified with global user, course offering, and section group models.
"""

from sqlalchemy import Column, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from app.models.base import Base

class StudentSectionAssignment(Base):
    """
    Database model mapping a student to a specific section group in a course offering.
    E.g., assigning student X to Lab group A for course C.
    """
    __tablename__ = "student_section_assignments"

    assignment_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    student_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    section_group_id = Column(Integer, ForeignKey("section_groups.section_group_id", ondelete="CASCADE"), nullable=False, index=True)
    course_offering_id = Column(Integer, ForeignKey("course_offerings.offering_id", ondelete="CASCADE"), nullable=False, index=True)

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    student = relationship("User")
    section_group = relationship("SectionGroup")
    course_offering = relationship("CourseOffering")

    def __repr__(self):
        return (
            f"<StudentSectionAssignment(assignment_id={self.assignment_id}, student_id={self.student_id}, section_group_id={self.section_group_id}, course_offering_id={self.course_offering_id})>"
        )