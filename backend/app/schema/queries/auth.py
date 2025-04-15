# -*- coding: utf-8 -*-

from fastapi import Request, Response
from strawberry import Info, field, input, type

from app.errors.auth import InvalidLoginOrPassword, SessionWasExpire
from app.schema.types import LoginOutput
from app.schema.types.mentors import MentorType
from app.schema.types.students import StudentType
from app.services.admin_service import AdminService
from app.services.mentor_service import MentorService
from app.services.student_service import StudentService


@input
class LoginInput:
    email: str = field(description="Email пользователя", default_factory=str)
    password: str
    rembmer_me: bool = field(
        default=True, description="Ну типо кнопка 'запомнить меня'"
    )


@type
class AuthQuery:
    @field
    async def check_session(self, info: Info) -> bool:
        try:
            return await StudentService().check_session_on_valid(
                request=info.context["request"]
            )

        except SessionWasExpire:
            try:
                return await MentorService().check_session_on_valid(
                    request=info.context["request"]
                )
            except SessionWasExpire:
                raise SessionWasExpire

        except Exception as e:
            raise Exception(e)

    @field
    async def get_current_user(self, info: Info) -> StudentType | MentorType:
        request: Request = info.context["request"]

        try:
            student = await StudentService().get_student_by_session(
                request=request
            )
            return await StudentType.from_pydantic(model=student)
        except SessionWasExpire:
            try:
                mentor = await MentorService().get_mentor_by_session(
                    request=request
                )
                return await MentorType.from_pydantic(model=mentor)
            except SessionWasExpire:
                raise SessionWasExpire
        except Exception as e:
            raise Exception(e)

    @field
    async def auth_exists_user(
        self, info: Info, input: LoginInput
    ) -> LoginOutput:
        try:
            session_id: str = await AdminService().auth_exists_admin(
                username=input.email, password=input.password
            )
            user_id: str = (
                await AdminService().get_admin_by_username(username=input.email)
            ).id
            auth_type = "admin"

        except InvalidLoginOrPassword:
            try:
                session_id: str = await StudentService().auth_exists_student(
                    email=input.email, password=input.password
                )
                user_id: str = (
                    await StudentService().get_student_by_email(
                        email=input.email
                    )
                ).id
                auth_type = "student"

            except InvalidLoginOrPassword:
                try:
                    session_id: str = await MentorService().auth_exists_mentor(
                        email=input.email, password=input.password
                    )
                    user_id: str = (
                        await MentorService().get_mentor_by_email(
                            email=input.email
                        )
                    ).id
                    auth_type = "mentor"

                except InvalidLoginOrPassword:
                    raise InvalidLoginOrPassword

        response: Response = info.context["response"]

        response.headers["Auth"] = session_id
        return LoginOutput(
            session_id=session_id, user_id=user_id, auth_type=auth_type
        )
