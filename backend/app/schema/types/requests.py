# -*- coding: utf-8 -*-

from uuid import UUID

from strawberry import type

from app.models.requests import MentorshipRequest, Request


@type
class RequestTypeAdmin:
    request_id: UUID
    mentor_id: UUID
    admin_id: UUID
    status: str

    @classmethod
    async def from_pydantic(
        cls, model: MentorshipRequest
    ) -> "RequestTypeAdmin":
        return cls(
            request_id=model.id,
            mentor_id=model.mentor_id,
            admin_id=model.admin_id,
            status=model.status,
        )


@type
class RequestTypeStudent:
    request_id: UUID
    mentor_id: UUID
    student_id: UUID
    status: str

    @classmethod
    async def from_pydantic(cls, model: Request) -> "RequestTypeStudent":
        return cls(
            request_id=model.id,
            mentor_id=model.mentor_id,
            student_id=model.student_id,
            status=model.status,
        )
