# -*- coding: utf-8 -*-

from uuid import UUID

from strawberry import type


@type
class LoginOutput:
    session_id: str
    user_id: UUID
    auth_type: str
