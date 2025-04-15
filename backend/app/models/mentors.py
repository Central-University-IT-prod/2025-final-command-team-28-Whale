# -*- coding: utf-8 -*
# type: ignore

from datetime import datetime
from typing import Dict, List, Optional
from uuid import UUID, uuid4

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, Relationship, SQLModel


class Mentor(SQLModel, table=True):
    """
    Модель для менторов

    Attributes:
        id (UUID): ID ментора
        email (str): Email адрес ментора
        username (str): Юзернейм ментора
        password_hash (str): Хэш пароля
        avatar_url (str): Ссылка на автарку ментора
        link (str): Сылка на соцсети ментора
        reviews (Review): Связь с оценкой
    """

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(nullable=False, max_length=128)
    username: str = Field(nullable=False, max_length=64)
    password_hash: str
    expertise: str = Field(nullable=False)
    tags: List[str] | None = Field(None, sa_column=Column(JSONB))
    description: str | None = Field(nullable=True, default=None, max_length=256)
    avatar_url: str | None = Field(nullable=True, max_length=1024)
    links: List[Dict[str, str]] | None = Field(
        default_factory=dict, sa_column=Column(JSONB)
    )
    approved: bool = Field(default=False)

    reviews: Optional[List["Review"]] = Relationship(back_populates="mentor")
    requests: Optional[List["Request"]] = Relationship(back_populates="mentor")
    request: Optional[List["MentorshipRequest"]] = Relationship(
        back_populates="mentor"
    )
    stars: List["Star"] = Relationship(back_populates="mentor")
    creation_date: datetime = Field(default_factory=datetime.now)
