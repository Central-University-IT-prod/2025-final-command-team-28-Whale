# -*- coding: utf-8 -*

# type: ignore

from datetime import date
from typing import Dict, List, Optional
from uuid import UUID, uuid4

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSON
from sqlmodel import Field, Relationship, SQLModel


class Student(SQLModel, table=True):
    """
    Модель для студентов

    Attributes:
        id (UUID): ID студента
        email (str): Email адрес студента
        username (str): Юзернейм пользователя
        password_hash (str): Хэш пароля
        avatar_url (str): Ссылка на автарку студента
        link (str): Сылка на соцсети пользователя
        reviews (Review): Связь с оценкой
    """

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(nullable=False, max_length=128)
    username: str = Field(nullable=False, max_length=64)
    password_hash: str
    description: str | None = Field(nullable=True, default=None, max_length=256)
    avatar_url: str | None = Field(nullable=True, default=None, max_length=1024)
    links: List[Dict[str, str]] | None = Field(
        default=None, sa_column=Column(JSON)
    )

    feedbacks: List["Review"] | None = Relationship(  # noqa
        back_populates="student"
    )
    requests: Optional[List["Request"]] = Relationship(back_populates="student")
    creation_date: date = Field(default_factory=date.today)
    stars: List["Star"] = Relationship(back_populates="student")
