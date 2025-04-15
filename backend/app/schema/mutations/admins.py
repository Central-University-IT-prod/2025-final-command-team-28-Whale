# -*- coding: utf-8 -*-

from uuid import UUID

from strawberry import mutation, type

from app.models.requests import RequestStatusEnum
from app.schema.types.admin import AdminType
from app.schema.types.requests import RequestTypeAdmin
from app.services.verify_mentor_service import RequestMentorshipService
from app.utils.create_admin import create_or_get_default_admin


@type
class AdminMutations:
    @mutation(description="Принять заявку ментора", name="verificationMentor")
    async def change_mentorship_request_status(
        self, status: RequestStatusEnum, request_id: UUID
    ) -> RequestTypeAdmin:
        request = await RequestMentorshipService().edit_request_status(
            request_id=request_id, status=status
        )
        return await RequestTypeAdmin.from_pydantic(model=request)

    @mutation
    async def create_admin(self) -> AdminType:
        admin = await create_or_get_default_admin()
        return await AdminType.from_pydantic(model=admin)
