# -*- coding: utf-8 -*-

from typing import List
from uuid import UUID

from sqlmodel import select

from app.core.db import session
from app.errors.requests import RequestDoesNotExist
from app.models import MentorshipRequest, Request
from app.models.requests import RequestStatusEnum
from app.repositories.request_mentor_student_repo import RequestMentorShipRepo
from app.services.__abc_service__ import AbstractService


class RequestMentorShipForUserService(AbstractService):
    """Сервисы для работы с заявками на менторство от студентов менторам"""

    def __init__(
        self, repo: RequestMentorShipRepo = RequestMentorShipRepo()
    ) -> None:
        super().__init__(repo)

    async def get_request_by_id(self, id: UUID) -> Request | None:
        return await self.repo.find_one(id)

    async def create_request(self, **kwargs) -> Request:
        return await self.repo.create(**kwargs)

    async def __update_request_status__(
        self, request: Request, status: RequestStatusEnum
    ):
        async with session:
            request.status = status
            session.add(request)
            await session.commit()
            await session.refresh(request)

    async def edit_request_status(
        self, request_id: UUID, status: RequestStatusEnum
    ) -> Request | None:
        request = await self.get_request_by_id(request_id)
        if request is None:
            raise RequestDoesNotExist

        await self.__update_request_status__(request, status)
        return request

    async def get_all_requests_by_mentor_id(
        self, mentor_id: UUID
    ) -> List[Request]:
        async with session:
            return (await session.exec(
                select(Request).where(Request.mentor_id == mentor_id)
            )).all()

    async def get_all_requests_by_student_id(
        self, student_id: UUID
    ) -> List[Request]:
        async with session:
            return (await session.exec(
                select(Request).where(Request.student_id == student_id)
            )).all()
