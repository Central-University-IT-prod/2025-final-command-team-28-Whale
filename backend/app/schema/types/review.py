# -*- coding: utf-8 -*-

from uuid import UUID

from strawberry import type

from app.models import Review


@type
class ReviewType:
    student_id: UUID
    mentor_id: UUID
    text: str
    stars: int

    @classmethod
    async def from_pydantic(cls, model: Review) -> "ReviewType":
        return cls(
            student_id=model.student_id,
            mentor_id=model.mentor_id,
            text=model.text,
            stars=model.stars,
        )


@type
class StarType:
    student_id: UUID
    mentor_id: UUID
    stars: int

    @classmethod
    async def from_pydantic(cls, model: Review) -> "ReviewType":
        return cls(
            student_id=model.student_id,
            mentor_id=model.mentor_id,
            stars=model.stars,
        )
