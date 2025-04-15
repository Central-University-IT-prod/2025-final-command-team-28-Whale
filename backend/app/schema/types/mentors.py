# -*- coding: utf-8 -*-

from typing import List
from uuid import UUID

from strawberry import field, type
from strawberry.scalars import JSON

from app.models import Mentor
from app.schema.types.review import ReviewType


@type
class MentorType:
    id: UUID
    email: str | None
    username: str
    password_hash: str
    expertise: str
    tags: List[str] | None
    description: str | None
    avatar_url: str | None
    links: List[JSON] | None = field(default_factory=list)
    is_admin: bool = False
    reviews: List[ReviewType]
    rating: float

    @classmethod
    async def from_pydantic(cls, model: Mentor) -> "MentorType":
        reviews = [
            await ReviewType.from_pydantic(model=review)
            for review in model.reviews
        ]
        if len(reviews) > 0:
            rating = sum([review.stars for review in reviews]) / len(reviews)
        else:
            rating = 0
        reviews = [
            await ReviewType.from_pydantic(model=review) for review in reviews
        ]
        return cls(
            id=model.id,
            email=model.email,
            username=model.username,
            password_hash=model.password_hash,
            expertise=model.expertise,
            tags=model.tags,
            description=model.description,
            avatar_url=model.avatar_url,
            links=model.links,
            reviews=reviews,
            rating=rating,
        )
