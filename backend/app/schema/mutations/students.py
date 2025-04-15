# -*- coding: utf-8 -*-

from uuid import UUID

from strawberry import input, mutation, type
from strawberry.scalars import JSON

from app.models.requests import RequestStatusEnum
from app.schema.types.requests import RequestTypeStudent
from app.schema.types.students import StudentType
from app.services.request_service import (
    RequestMentorShipForUserService,
)
from app.services.student_service import StudentService


@input
class EditStudentInput:
    id: UUID
    email: str | None = None
    username: str | None = None
    description: str | None = None
    avatar_url: str | None = None
    links: JSON | None = None


@input
class RequestMentorshipInput:
    student_id: UUID
    mentor_id: UUID
    question: str


@type
class StudentEditMutation:
    @mutation(name="editStudent")
    async def create_student_mutation(
        self, input: EditStudentInput
    ) -> StudentType:
        edited_student = await StudentService().edit_student(
            id=input.id,
            email=input.email,
            username=input.username,
            description=input.description,
            avatar_url=input.avatar_url,
            links=input.links,
        )
        return await StudentType.from_pydantic(model=edited_student)


@type
class CreateRequestMentorshipMutation:
    @mutation(
        description="Создать заявку на менторство от студента",
        name="createMentorshipRequest",
    )
    async def create_request(
        self, input: RequestMentorshipInput
    ) -> RequestTypeStudent:
        request = await RequestMentorShipForUserService().create_request(
            student_id=input.student_id,
            mentor_id=input.mentor_id,
            question=input.question,
            status=RequestStatusEnum.WAITING,
        )
        return await RequestTypeStudent.from_pydantic(model=request)
