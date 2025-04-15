# -*- coding: utf-8 -*

from datetime import datetime
from uuid import UUID

from sqlmodel import SQLModel


class SessionPayload(SQLModel):
    """
    Класс для создания сессионного пейлода

    Attributes:
        id (UUID): ID пользователя
        username (str): Имя пользователя
        auth_date (datetime): Дата авторизации на сервисе
    """

    id: UUID
    username: str
    auth_date: datetime
