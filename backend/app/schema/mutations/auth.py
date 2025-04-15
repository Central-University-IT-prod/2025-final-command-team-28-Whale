# -*- coding: utf-8 -*-

from fastapi import Response
from strawberry import Info, input, mutation, type

from app.core.config import settings
from app.core.db import session
from app.schema.types import LoginOutput
from app.schema.types.requests import RequestTypeAdmin
from app.services.mentor_service import MentorService
from app.services.student_service import StudentService
from app.services.verify_mentor_service import RequestMentorshipService


@input
class RegisterStudentInput:
    email: str
    password: str
    username: str


@input
class RegisterMentorInput:
    email: str
    password: str
    username: str
    expertise: str


@type
class AuthStudentMutations:
    @mutation(description="Регистрация студента")
    async def register_student(
        info: Info, input: RegisterStudentInput
    ) -> LoginOutput:
        student = await StudentService().create_student(
            password_hash=input.password,
            username=input.username,
            email=input.email,
        )
        session: str = await StudentService().create_new_session(
            student=student
        )
        auth_type = "student"
        response: Response = info.context["response"]
        response.headers["Auth"] = session

        return LoginOutput(
            session_id=session, user_id=student.id, auth_type=auth_type
        )


@type
class RegisterMentor:
    @mutation(description="Регистрация ментора")
    async def register_mentor(
        info: Info, input: RegisterMentorInput
    ) -> RequestTypeAdmin:
        mentor = await MentorService().create_mentor(
            password_hash=input.password,
            username=input.username,
            email=input.email,
            expertise=input.expertise,
        )
        request = await RequestMentorshipService().create_request(
            mentor_id=mentor.id, admin_id=settings.ADMIN_ID
        )
        return await RequestTypeAdmin.from_pydantic(model=request)
