# -*- coding: utf-8 -*-

from uuid import UUID

from strawberry import type

from app.models import Admin


@type
class AdminType:
    id: UUID
    username: str
    password_hash: str
    is_admin: bool = True

    @classmethod
    async def from_pydantic(cls, model: Admin) -> "AdminType":
        return cls(
            id=model.id,
            username=model.username,
            password_hash=model.password_hash,
        )
