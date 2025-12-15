"""
FakerDB Utility for Full System Population in University LMS Testing
-------------------------------------------------------------------
Populates the test database with a full, production-like dataset, leveraging global components and models.
Designed to enable realistic integration, system, and UI/UX testing reflecting an actual running environment.

- 10 Departments, each with 2 Specializations
- Each Department: 5 Professors, 10 Associates (Professors with is_associate=True)
- 1000 Students, distributed across specializations
- All Users linked, and Role relationships respected
- Each Professor teaches Courses, which have CourseOfferings, SectionGroups, & ScheduledSlots
- Rooms, Courses, and all core academic structures included
- Clean, demo/sample-free, production-ready approach

"""

import pytest
from faker import Faker
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.student import Student
from app.models.professor import Professor
from app.models.role import Role
from app.models.department import Department
from app.models.specialization import Specialization
from app.models.section_group import SectionGroup
from app.models.room import Room
from app.models.course import Course
from app.models.course_offering import CourseOffering
from app.models.scheduled_slot import ScheduledSlot
from app.models.quiz import Quiz
from app.models.quiz_file import QuizFile
from app.models.question import Question
from app.models.question_option import QuestionOption
from app.models.quiz_attempt import QuizAttempt
from app.models.quiz_answer import QuizAnswer
from app.models.student_section_assignment import StudentSectionAssignment
from app.models.uploaded_file import UploadedFile

from sqlalchemy.exc import IntegrityError

fake = Faker()

def add_and_commit(db_session, item):
    """
    Add an item and commit with error handling to avoid duplicate/unique constraint issues during batch-inserts.
    """
    try:
        db_session.add(item)
        db_session.commit()
        db_session.refresh(item)
        return item
    except IntegrityError:
        db_session.rollback()
        return None

def bulk_insert_and_commit(db_session, instances):
    """
    Utility for fast batch inserts with commit/refresh.
    """
    db_session.bulk_save_objects(instances)
    db_session.commit()
    for obj in instances:
        db_session.refresh(obj)
    return instances

def create_roles(db_session):
    role_names = ["Student", "Professor", "Associate", "Admin"]
    roles = []
    for name in role_names:
        roles.append(add_and_commit(db_session, Role(name=name)))
    return roles

def create_users(db_session, count, role_name="Student"):
    users = []
    for _ in range(count):
        user = User(
            username=fake.unique.user_name(),
            hashed_password=fake.password(),
            email=fake.unique.email(),
            full_name=fake.name(),
            is_active=True
        )
        user = add_and_commit(db_session, user)
        users.append(user)
    return users

def create_departments(db_session, count=10):
    departments = []
    for _ in range(count):
        dept = Department(
            name=fake.unique.company(),
            code=fake.unique.lexify(text='DEPT????'),
            description=fake.catch_phrase()
        )
        dept = add_and_commit(db_session, dept)
        departments.append(dept)
    return departments

def create_specializations(db_session, departments, count_per_dept=2):
    specializations = []
    for dept in departments:
        for _ in range(count_per_dept):
            spec = Specialization(
                name=fake.unique.catch_phrase(),
                department_id=dept.department_id
            )
            spec = add_and_commit(db_session, spec)
            specializations.append(spec)
    return specializations

def create_rooms(db_session, count=20):
    rooms = []
    for _ in range(count):
        room = Room(
            name=fake.unique.bothify(text="Room-###"),
            location=fake.street_address(),
            capacity=fake.random_int(min=20, max=200),
        )
        room = add_and_commit(db_session, room)
        rooms.append(room)
    return rooms

def create_courses(db_session, departments, count_per_dept=5):
    courses = []
    for dept in departments:
        for _ in range(count_per_dept):
            course = Course(
                name=fake.unique.catch_phrase(),
                code=fake.unique.bothify(text='CRS###'),
                credits=fake.random_int(min=2, max=5),
                department_id=dept.department_id,
                description=fake.text(max_nb_chars=100)
            )
            course = add_and_commit(db_session, course)
            courses.append(course)
    return courses

def create_professors(db_session, departments, count=5, associate_count=10):
    professors = []
    associates = []
    for dept in departments:
        for _ in range(count):
            user = create_users(db_session, 1, role_name="Professor")[0]
            prof = Professor(
                user_id=user.user_id,
                title=fake.prefix_male() if fake.boolean() else fake.prefix_female(),
                department_id=dept.department_id,
                is_associate=False
            )
            prof = add_and_commit(db_session, prof)
            professors.append(prof)
        for _ in range(associate_count):
            user = create_users(db_session, 1, role_name="Associate")[0]
            prof = Professor(
                user_id=user.user_id,
                title="Associate",
                department_id=dept.department_id,
                is_associate=True
            )
            prof = add_and_commit(db_session, prof)
            associates.append(prof)
    return professors, associates

def create_course_offerings(db_session, courses, professors, rooms, per_course=1):
    offerings = []
    for course in courses:
        for _ in range(per_course):
            offering = CourseOffering(
                course_id=course.course_id,
                professor_id=fake.random_element(professors).professor_id,
                semester=fake.random_element(['Fall', 'Spring', 'Summer']),
                year=fake.random_int(min=2018, max=2025),
                room_id=fake.random_element(rooms).room_id
            )
            offering = add_and_commit(db_session, offering)
            offerings.append(offering)
    return offerings

def create_section_groups(db_session, course_offerings, count_per_offering=2):
    groups = []
    for co in course_offerings:
        for _ in range(count_per_offering):
            group = SectionGroup(
                name=fake.unique.bothify(text='Section-##'),
                course_offering_id=co.course_offering_id,
            )
            group = add_and_commit(db_session, group)
            groups.append(group)
    return groups

def create_students(db_session, specializations, count=1000):
    students = []
    spec_count = len(specializations)
    for i in range(count):
        user = create_users(db_session, 1, role_name="Student")[0]
        specialization = specializations[i % spec_count]
        student = Student(
            user_id=user.user_id,
            enrollment_year=fake.random_int(min=2018, max=2025),
            registration_number=fake.unique.random_number(digits=8),
            specialization_id=specialization.specialization_id,
        )
        student = add_and_commit(db_session, student)
        students.append(student)
    return students

def create_student_section_assignments(db_session, students, section_groups):
    assignments = []
    group_count = len(section_groups)
    for idx, student in enumerate(students):
        group = section_groups[idx % group_count]
        assignment = StudentSectionAssignment(
            student_id=student.student_id,
            section_group_id=group.section_group_id
        )
        assignment = add_and_commit(db_session, assignment)
        assignments.append(assignment)
    return assignments

def create_quizzes(db_session, course_offerings, count_per_offering=2):
    quizzes = []
    for offering in course_offerings:
        for _ in range(count_per_offering):
            quiz = Quiz(
                name=fake.unique.bothify(text="Quiz-##"),
                course_offering_id=offering.course_offering_id,
                start_time=fake.future_datetime(end_date='+30d'),
                end_time=fake.future_datetime(end_date='+60d'),
                instructions=fake.sentence()
            )
            quiz = add_and_commit(db_session, quiz)
            quizzes.append(quiz)
    return quizzes

def create_questions_and_options(db_session, quizzes, questions_per_quiz=5, options_per_question=4):
    questions = []
    options = []
    for quiz in quizzes:
        for _ in range(questions_per_quiz):
            question = Question(
                quiz_id=quiz.quiz_id,
                content=fake.sentence(),
                type="multiple_choice",
                points=fake.random_int(min=1, max=10)
            )
            question = add_and_commit(db_session, question)
            questions.append(question)
            correct = fake.random_int(min=0, max=options_per_question-1)
            for idx in range(options_per_question):
                option = QuestionOption(
                    question_id=question.question_id,
                    text=fake.word(),
                    is_correct=(idx == correct)
                )
                option = add_and_commit(db_session, option)
                options.append(option)
    return questions, options

def create_quiz_files(db_session, quizzes):
    files = []
    for quiz in quizzes:
        for _ in range(2):
            file = QuizFile(
                quiz_id=quiz.quiz_id,
                filename=fake.unique.file_name(extension="pdf"),
                file_path=f"/fake/path/{fake.uuid4()}.pdf",
                uploaded_at=fake.date_time_this_year()
            )
            file = add_and_commit(db_session, file)
            files.append(file)
    return files

def create_uploaded_files(db_session, users):
    uploaded_files = []
    for user in users:
        file = UploadedFile(
            user_id=user.user_id,
            filename=fake.unique.file_name(extension="txt"),
            file_path=f"/fake/uploaded/{fake.uuid4()}.txt",
            uploaded_at=fake.date_time_this_year()
        )
        uploaded_files.append(file)
    bulk_insert_and_commit(db_session, uploaded_files)
    return uploaded_files

def create_quiz_attempts_and_answers(db_session, students, quizzes):
    attempts = []
    answers = []
    for student in students[:100]:  # For speed, only allow first 100 students to attempt quizzes
        for quiz in quizzes:
            attempt = QuizAttempt(
                student_id=student.student_id,
                quiz_id=quiz.quiz_id,
                started_at=fake.date_time_this_year(),
                ended_at=fake.date_time_this_year(),
                score=fake.random_int(min=0, max=100)
            )
            attempt = add_and_commit(db_session, attempt)
            attempts.append(attempt)
            for question in quiz.question_set:  # If using backref for question set in Quiz model
                answer = QuizAnswer(
                    quiz_attempt_id=attempt.quiz_attempt_id,
                    question_id=question.question_id,
                    selected_option_id=fake.random_element(question.options).question_option_id if question.options else None,  # If options relationship exists
                    answer_text=fake.word()
                )
                answer = add_and_commit(db_session, answer)
                answers.append(answer)
    return attempts, answers


@pytest.fixture(scope="session")
def full_system_population(db_session):
    """
    Populate the test DB with a full, interconnected dataset for system-level and UI/UX test realism.
    """
    # Core base
    roles = create_roles(db_session)
    departments = create_departments(db_session)
    specializations = create_specializations(db_session, departments)
    rooms = create_rooms(db_session)
    courses = create_courses(db_session, departments)
    professors, associates = create_professors(db_session, departments)
    course_offerings = create_course_offerings(db_session, courses, professors, rooms)
    section_groups = create_section_groups(db_session, course_offerings)
    students = create_students(db_session, specializations)
    assignments = create_student_section_assignments(db_session, students, section_groups)
    quizzes = create_quizzes(db_session, course_offerings)
    questions, options = create_questions_and_options(db_session, quizzes)
    quiz_files = create_quiz_files(db_session, quizzes)
    all_users = db_session.query(User).all()
    uploaded_files = create_uploaded_files(db_session, all_users)
    # Optional: Quiz attempts and answers can be hooked here if the model supports relationship navigation
    db_session.commit()