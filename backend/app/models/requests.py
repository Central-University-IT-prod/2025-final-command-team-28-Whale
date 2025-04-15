# -*- coding: utf-8 -*
# type: ignore

import enum
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import Column, Enum, Field, Relationship, SQLModel


class RequestStatusEnum(str, enum.Enum):
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    WAITING = "WAITING"


class Request(SQLModel, table=True):
    """
    Модель для заявок пользователей менторам

    Attributes:
        student_id (UUID): ID студента
        mentor_id (UUID): ID ментора
        student (Student): Связь со студентом
        mentor (Mentor): Связь с ментором
        question (str): Вопрос студента
        status (RequestStatusEnum): REJECTed, ACCEPTED или WAITING статус заявки
    """

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    student_id: Optional[UUID] = Field(
        default=None, foreign_key="student.id", primary_key=True
    )
    mentor_id: Optional[UUID] = Field(
        default=None, foreign_key="mentor.id", primary_key=True
    )
    question: str = Field(max_length=512)
    creation_date: datetime = Field(default_factory=datetime.now)
    status: RequestStatusEnum = Field(sa_column=Column(Enum(RequestStatusEnum)))

    student: Optional["Student"] = Relationship(  # noqa
        back_populates="requests"
    )
    mentor: Optional["Mentor"] = Relationship(back_populates="requests")  # noqs


class MentorshipRequest(SQLModel, table=True):
    """
    Модель для заявок на менторство от менторов к админам

    Attributes:
        id (UUID): ID заявки
        mentor_id (UUID): ID ментора
        status (str): Статус заявки (pending, approved, rejected)
    """

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    mentor_id: UUID = Field(foreign_key="mentor.id")
    admin_id: UUID = Field(foreign_key="admin.id")
    status: RequestStatusEnum = Field(
        sa_column=Column(Enum(RequestStatusEnum, name="request_status_enum"))
    )
    mentor: Optional["Mentor"] = Relationship(back_populates="request")
    admin: Optional["Admin"] = Relationship(back_populates="requests")
