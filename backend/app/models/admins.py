# -*- coding: utf-8 -*

from typing import List, Optional
from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel


class Admin(SQLModel, table=True):  # type: ignore
    """
    Модель для админа

    Attributes:
        id (UUID): ID студента
        username (str): Юзернейм пользователя
        password_hash (str): Пароль
    """

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    username: str = Field(nullable=False, max_length=64, unique=True)
    password_hash: str
    requests: Optional[List["MentorshipRequest"]] = Relationship(  # type: ignore
        back_populates="admin"
    )
