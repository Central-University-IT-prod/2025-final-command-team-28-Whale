# -*- coding: utf-8 -*-

import json
from datetime import datetime
from typing import Any, Dict, List
from uuid import UUID, uuid4, uuid5

from fastapi import Request

from app.core.cache import cache
from app.core.config import settings
from app.errors.auth import InvalidLoginOrPassword, SessionWasExpire
from app.models import Mentor
from app.models.auth import SessionPayload
from app.repositories.mentor_repo import MentorRepo
from app.services.__abc_service__ import AbstractService


class MentorService(AbstractService):
    """
    Сервис для работы с менторами
    """

    def __init__(
        self,
        repo: MentorRepo = MentorRepo(),
    ) -> None:
        super().__init__(repo)

    async def get_mentor_by_id(self, id: UUID) -> Mentor | None:
        """Получить ментора по заданным критериям"""
        return await self.repo.find_one(id, load_reviews=True)

    async def get_mentor_by_email(self, email: str) -> Mentor | None:
        """Получить ментора по email"""
        return await self.repo.find_one(email)

    async def get_all_mentors(self) -> List[Mentor]:
        """Получить всех менторов"""
        return await self.repo.find_all(load_reviews=True)

    async def create_mentor(self, **kwargs) -> Mentor:
        """Создать нового ментора"""
        return await self.repo.create(**kwargs)

    async def edit_mentor(self, id: UUID, **kwargs) -> Mentor:
        """Редактирование ментора"""
        mentor: Mentor = await MentorService().get_mentor_by_id(id=id)

        if not kwargs:
            return mentor

        return await self.repo.edit(
            obj=mentor,
            email=kwargs.get("email") if kwargs.get("email") else mentor.email,
            username=(
                kwargs.get("username")
                if kwargs.get("username")
                else mentor.username
            ),
            description=kwargs.get("description", mentor.description),
            avatar_url=kwargs.get("avatar_url", mentor.avatar_url),
            links=kwargs.get("links", mentor.links),
            expertise=kwargs.get("expertise", mentor.expertise),
            tags=kwargs.get("tags", mentor.tags),
        )

    async def __get_session_payload__(self, mentor: Mentor) -> SessionPayload:
        payload: SessionPayload = SessionPayload(
            id=mentor.id,
            username=mentor.username,
            auth_date=datetime.now(),
        )

        return payload

    async def create_new_session(self, mentor: Mentor) -> str:
        """
        Сервис для создания новой сессии

        Args:
            mentor (Mentor): Пользователь для которого создаем сессию

        Returns:
            (str): ID новой сессии
        """

        session_id: str = str(uuid5(namespace=uuid4(), name=mentor.username))
        payload: SessionPayload = await self.__get_session_payload__(
            mentor=mentor
        )

        await cache.set(
            name=f"{settings.SESSION_REDIS_PATH}:{session_id}",
            value=payload.model_dump_json(),
            ex=settings.SESSION_EXP,
        )

        return session_id

    async def check_session_on_valid(self, request: Request) -> bool:
        """
        Сервис проверки сессии на валидность

        Args:
            request (Request): Реквест с куками и хедарами

        Returns:
            (bool)
        """

        session_data = await self._get_session_data(request)
        if not session_data:
            raise SessionWasExpire

        session_data: Dict[str, Any] = json.loads(
            session_data.replace("'", '"')
        )
        mentor_id: UUID = UUID(session_data.get("id"))
        mentor: Mentor = await self.get_mentor_by_id(id=mentor_id)
        if not mentor:
            raise SessionWasExpire

        return True

    async def _get_session_data(self, request: Request) -> dict | None:
        headers: str = request.headers.get("Auth")
        if headers:
            return await cache.get(f"{settings.SESSION_REDIS_PATH}:{headers}")

        return None

    async def get_mentor_by_session(self, request: Request) -> Mentor:
        """
        Сервис для получения текущего пользователя по сессии

        Args:
            request (Request): реквест с куками

        Returns:
            (Mentor): Объект студента
        """
        session_data = await self._get_session_data(request)
        if not session_data:
            raise SessionWasExpire

        session_data: Dict[str, Any] = json.loads(
            session_data.replace("'", '"')
        )
        mentor_id: UUID = UUID(session_data.get("id"))
        mentor: Mentor = await self.get_mentor_by_id(id=mentor_id)
        if not mentor:
            raise SessionWasExpire

        return mentor

    async def auth_exists_mentor(self, email: str, password: str) -> str:
        """
        Сервис для авторизации ментора

        Args:
            email (str): Email ментора
            password (str): Пароль ментора

        Returns:
            (str): ID новой сессии
        """

        mentor: Mentor = await self.get_mentor_by_email(email=email)
        if not mentor:
            raise InvalidLoginOrPassword

        if password != mentor.password_hash:
            raise InvalidLoginOrPassword

        return await self.create_new_session(mentor=mentor)
