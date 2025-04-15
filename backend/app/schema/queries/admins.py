# -*- coding: utf-8 -*-

from typing import List

from strawberry import field, type

from app.schema.types.requests import RequestTypeAdmin
from app.services.verify_mentor_service import RequestMentorshipService


@type
class AdminQuery:
    @field
    async def get_all_requests(self) -> List[RequestTypeAdmin]:
        requests = await RequestMentorshipService().get_all_requests()
        return [
            await RequestTypeAdmin.from_pydantic(model=request)
            for request in requests
        ]
