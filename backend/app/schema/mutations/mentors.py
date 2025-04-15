# -*- coding: utf-8 -*-

from typing import List
from uuid import UUID

from strawberry import input, mutation, type
from strawberry.scalars import JSON

from app.models.requests import RequestStatusEnum
from app.schema.types.mentors import MentorType
from app.schema.types.requests import RequestTypeStudent
from app.services.mentor_service import MentorService
from app.services.request_service import (
    RequestMentorShipForUserService,
)


@input
class EditMentorInput:
    id: UUID
    email: str | None = None
    username: str | None = None
    expertise: str | None = None
    tags: List[str] | None = None
    description: str | None = None
    avatar_url: str | None = None
    links: JSON | None = None


@type
class EditMentorMutation:
    @mutation(description="Редактирование ментора")
    async def edit_mentor(self, input: EditMentorInput) -> MentorType:
        edited_mentor = await MentorService().edit_mentor(
            id=input.id,
            email=input.email,
            expertise=input.expertise,
            tags=input.tags,
            username=input.username,
            description=input.description,
            avatar_url=input.avatar_url,
            links=input.links,
        )
        return await MentorType.from_pydantic(model=edited_mentor)


@type
class ChangeRequestStatusMutation:
    @mutation(
        description="Изменение статуса заявки",
        name="changeRequestStatusStudentMentor",
    )
    async def change_request_status(
        self, status: RequestStatusEnum, request_id: UUID
    ) -> RequestTypeStudent:
        request = await RequestMentorShipForUserService().edit_request_status(
            status=status, request_id=request_id
        )
        return await RequestTypeStudent.from_pydantic(model=request)
