# -*- coding: utf-8 -*-

from typing import List
from uuid import UUID

from app.core.db import session
from app.errors.requests import RequestDoesNotExist
from app.models import Mentor, MentorshipRequest
from app.models.requests import RequestStatusEnum
from app.repositories.request_admin_mentor_repo import RequestMentorShipRepo
from app.services.__abc_service__ import AbstractService
from app.services.mentor_service import MentorService


class RequestMentorshipService(AbstractService):
    """
    Сервис для работы с заявками на менторство от менторов
    """

    def __init__(
        self, repo: RequestMentorShipRepo = RequestMentorShipRepo()
    ) -> None:
        super().__init__(repo)

    async def get_request_by_id(self, id: UUID) -> MentorshipRequest | None:
        return await self.repo.find_one(id)

    async def create_request(
        self, mentor_id: UUID, admin_id: UUID
    ) -> MentorshipRequest:
        return await self.repo.create(
            mentor_id=mentor_id,
            status=RequestStatusEnum.WAITING,
            admin_id=admin_id,
        )

    async def get_all_requests(self) -> List[MentorshipRequest]:
        return await self.repo.find_all()

    async def __update_request_status__(
        self, request: MentorshipRequest, status: RequestStatusEnum
    ):
        async with session:
            request.status = status
            session.add(request)
            await session.commit()
            await session.refresh(request)

    async def edit_request_status(
        self, request_id: UUID, status: RequestStatusEnum
    ) -> MentorshipRequest | None:
        request = await self.get_request_by_id(request_id)
        if request is None:
            raise RequestDoesNotExist

        await self.__update_request_status__(request, status)
        return request
