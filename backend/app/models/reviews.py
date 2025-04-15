# -*- coding: utf-8 -*
# type: ignore

from datetime import datetime
from typing import Optional
from uuid import UUID

from sqlmodel import Field, Relationship, SQLModel


class Review(SQLModel, table=True):
    """
    Модель для отзывов

    Attributes:
        id (UUID): ID студента
        title (str): Заголовок
        text (str): Текст
        student (Student): Связь со студентом
        mentor (Mentor): Связь с ментором
    """

    student_id: Optional[UUID] = Field(
        default=None, foreign_key="student.id", primary_key=True
    )
    mentor_id: Optional[UUID] = Field(
        default=None, foreign_key="mentor.id", primary_key=True
    )

    student: Optional["Student"] = Relationship(  # noqa
        back_populates="feedbacks"
    )
    mentor: Optional["Mentor"] = Relationship(back_populates="reviews")  # noqs

    text: str = Field(max_length=1024)
    stars: int = Field(le=5, gt=1)
    creation_date: datetime = Field(default_factory=datetime.now)


class Star(SQLModel, table=True):
    """
    Модель для отзывов
    """

    student_id: Optional[UUID] = Field(
        default=None, foreign_key="student.id", primary_key=True
    )
    mentor_id: Optional[UUID] = Field(
        default=None, foreign_key="mentor.id", primary_key=True
    )

    student: Optional["Student"] = Relationship(back_populates="stars")  # noqa
    mentor: Optional["Mentor"] = Relationship(back_populates="stars")  # noqs

    stars: int = Field(le=5, gt=1)
    creation_date: datetime = Field(default_factory=datetime.now)
