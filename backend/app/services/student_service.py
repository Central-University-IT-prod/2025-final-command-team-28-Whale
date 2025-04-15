# -*- coding: utf-8 -*-

import json
from datetime import datetime
from typing import Any, Dict, List
from uuid import UUID, uuid4, uuid5

from fastapi import Request

from app.core.cache import cache
from app.core.config import settings
from app.errors.auth import InvalidLoginOrPassword, SessionWasExpire
from app.models import Student
from app.models.auth import SessionPayload
from app.repositories.student_repo import StudentRepo
from app.services.__abc_service__ import AbstractService


class StudentService(AbstractService):
    """
    Сервис для работы со студентами
    """

    def __init__(self, repo: StudentRepo = StudentRepo()) -> None:
        super().__init__(repo)

    async def get_student_by_id(self, id: UUID) -> Student | None:
        """Получить студента по id"""
        return await self.repo.find_one(id)

    async def get_student_by_email(self, email: str) -> Student | None:
        """Получить студента по email"""
        return await self.repo.find_one(email)

    async def get_all_students(self) -> List[Student]:
        """Получить всех студентов"""
        return await self.repo.find_all()

    async def create_student(self, **kwargs) -> Student:
        """Создать нового студента"""
        return await self.repo.create(**kwargs)

    async def get_or_create_student(self, **kwargs) -> tuple[Student, bool]:
        """Получить или создать студента"""
        return await self.repo.get_or_create(**kwargs)

    async def edit_student(self, id: UUID, **kwargs) -> Student:
        """Редактирование студента"""
        student: Student = await self.get_student_by_id(id=id)

        if not kwargs:
            return student
        return await self.repo.edit(
            obj=student,
            email=kwargs.get("email") if kwargs.get("email") else student.email,
            username=(
                kwargs.get("username")
                if kwargs.get("username")
                else student.username
            ),
            description=(
                kwargs.get("description")
                if kwargs.get("description")
                else student.description
            ),
            avatar_url=kwargs.get("avatar_url", student.avatar_url),
            links=kwargs.get("links", student.links),
        )

    async def __get_session_payload__(self, student: Student) -> SessionPayload:
        payload: SessionPayload = SessionPayload(
            id=student.id,
            username=student.username,
            auth_date=datetime.now(),
        )

        return payload

    async def create_new_session(self, student: Student) -> str:
        """
        Сервис для создания новой сессии

        Args:
            student (Student): Пользователь для которого создаем сессию

        Returns:
            (str): ID новой сессии
        """

        session_id: str = str(uuid5(namespace=uuid4(), name=student.username))
        payload: SessionPayload = await self.__get_session_payload__(
            student=student
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
        student: Student = await self.get_student_by_id(id=UUID(student_id))
        if not student:
            raise SessionWasExpire

        return True

    async def get_student_by_session(self, request: Request) -> Student:
        """
        Сервис для получения текущего пользователя по сессии

        Args:
            request (Request): реквест с куками

        Returns:
            (Student): Объект студента
        """
        session_data = await self._get_session_data(request)
        if not session_data:
            raise SessionWasExpire
        session_data: Dict[str, Any] = json.loads(
            session_data.replace("'", '"')
        )
        student_id: UUID = UUID(session_data.get("id"))
        student: Student = await self.get_student_by_id(id=student_id)
        if not student:
            raise SessionWasExpire

        return student

    async def auth_exists_student(self, email: str, password: str) -> str:
        """
        Сервис для авторизации студента

        Args:
            email (str): Email пользователя
            password (str): Пароль пользователя

        Returns:
            (str): ID новой сессии
        """

        student: Student = await self.get_student_by_email(email=email)
        if not student:
            raise InvalidLoginOrPassword

        if password != student.password_hash:
            raise InvalidLoginOrPassword

        return await self.create_new_session(student=student)
