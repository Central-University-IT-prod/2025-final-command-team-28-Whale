# -*- coding: utf-8 -*-
# type: ignore

from typing import List
from uuid import UUID

from strawberry import field, type
from strawberry.scalars import JSON

from app.models.students import Student


@type
class StudentType:
    id: UUID
    email: str
    username: str
    password_hash: str
    description: str | None = None
    avatar_url: str | None = None
    links: List[JSON] | None = field(default_factory=list)
    is_admin: bool = False

    @classmethod
    async def from_pydantic(cls, model: Student) -> "StudentType":
        return cls(
            id=model.id,
            email=model.email,
            username=model.username,
            password_hash=model.password_hash,
            description=model.description,
            avatar_url=model.avatar_url,
            links=model.links,
        )
