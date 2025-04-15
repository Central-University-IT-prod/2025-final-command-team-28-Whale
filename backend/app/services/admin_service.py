# -*- coding: utf-8 -*-

import json
from datetime import datetime
from typing import Any, Dict, List
from uuid import UUID, uuid4, uuid5

from fastapi import Request
from sqlmodel import select

from app.core.cache import cache
from app.core.config import settings
from app.core.db import session
from app.errors.auth import InvalidLoginOrPassword, SessionWasExpire
from app.models import Admin
from app.models.auth import SessionPayload
from app.repositories.admin_repo import AdminRepo
from app.services.__abc_service__ import AbstractService


class AdminService(AbstractService):
    """
    Сервис для работы с админами
    """

    def __init__(self, repo: AdminRepo = AdminRepo()) -> None:
        super().__init__(repo)

    async def get_admin_by_id(self, id: UUID) -> Admin | None:
        """Получить студента по id"""
        return await self.repo.find_one(id)

    async def get_admin_by_email(self, email: str) -> Admin | None:
        """Получить студента по email"""
        return await self.repo.find_one(email)

    async def get_admin_by_username(self, username: str) -> Admin | None:
        """Получить студента по username"""
        async with session:
            statement = select(Admin).where(Admin.username == username)
            admin = await session.exec(statement=statement)
            return admin.first()

    async def get_all_admins(self) -> List[Admin]:
        """Получить всех студентов"""
        return await self.repo.find_all()

    async def create_admin(self, **kwargs) -> Admin:
        """Создать нового студента"""
        return await self.repo.create(**kwargs)

    async def get_or_create_admin(self, **kwargs) -> tuple[Admin, bool]:
        """Получить или создать студента"""
        return await self.repo.get_or_create(**kwargs)

    async def edit_admin(self, id: UUID, **kwargs) -> Admin:
        """Редактирование студента"""
        admin: Admin = await self.get_admin_by_id(id=id)

        if not kwargs:
            return admin
        return await self.repo.edit(
            obj=admin,
            username=(
                kwargs.get("username")
                if kwargs.get("username")
                else admin.username
            ),
        )

    async def __get_session_payload__(self, admin: Admin) -> SessionPayload:
        payload: SessionPayload = SessionPayload(
            id=admin.id,
            username=admin.username,
            auth_date=datetime.now(),
        )

        return payload

    async def create_new_session(self, admin: Admin) -> str:
        """
        Сервис для создания новой сессии

        Args:
            admin (Admin): Пользователь для которого создаем сессию

        Returns:
            (str): ID новой сессии
        """

        session_id: str = str(uuid5(namespace=uuid4(), name=admin.username))
        payload: SessionPayload = await self.__get_session_payload__(
            admin=admin
        )
        await cache.set(
            name=f"{settings.SESSION_REDIS_PATH}:{session_id}",
            value=payload.model_dump_json(),
            ex=settings.SESSION_EXP,
        )
        return session_id

    async def _get_session_data(self, request: Request) -> dict | None:
        headers: str = request.headers.get("Auth")
        if headers:
            return await cache.get(f"{settings.SESSION_REDIS_PATH}:{headers}")

        session_id: str = request.cookies.get(settings.SESSION_COOKIE_KEY)
        if session_id:
            return await cache.get(
                f"{settings.SESSION_REDIS_PATH}:{session_id}"
            )

        return None

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
        student_id: UUID = UUID(session_data.get("id"))
        admin: Admin = await self.get_admin_by_id(id=UUID(student_id))
        if not admin:
            raise SessionWasExpire

        return True

    async def get_admin_by_session(self, request: Request) -> Admin:
        """
        Сервис для получения текущего пользователя по сессии

        Args:
            request (Request): реквест с куками

        Returns:
            (Admin): Объект студента
        """
        session_data = await self._get_session_data(request)
        if not session_data:
            raise SessionWasExpire
        session_data: Dict[str, Any] = json.loads(
            session_data.replace("'", '"')
        )
        student_id: UUID = UUID(session_data.get("id"))
        admin: Admin = await self.get_admin_by_id(id=student_id)
        if not admin:
            raise SessionWasExpire

        return admin

    async def auth_exists_admin(self, username: str, password: str) -> str:
        """
        Сервис для авторизации студента

        Args:
            email (str): Email пользователя
            password (str): Пароль пользователя

        Returns:
            (str): ID новой сессии
        """

        admin: Admin = await self.get_admin_by_username(username=username)
        if not admin:
            raise InvalidLoginOrPassword

        if password != admin.password_hash:
            raise InvalidLoginOrPassword

        return await self.create_new_session(admin=admin)
