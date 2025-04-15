# -*- coding: utf-8 -*-

from abc import ABC, abstractmethod
from typing import Generic, List, TypeVar
from uuid import UUID

from sqlalchemy.orm import selectinload
from sqlmodel import SQLModel, select

from app.core.db import session


T = TypeVar("T", bound=SQLModel)


class AbstractRepo(ABC, Generic[T]):
    """
    Абстрактный класс для наследования новых
    репозиториев

    Info:
        Новые методы по мере разработки

    Raises:
        (NotImplementedError)
    """

    @abstractmethod
    async def find_one(
        self, field: UUID | str, load_reviews: bool = False
    ) -> T | None:
        raise NotImplementedError

    @abstractmethod
    async def find_all(self, load_reviews: bool = False) -> List[T]:
        raise NotImplementedError

    @abstractmethod
    async def create(self, **kwargs) -> T:
        raise NotImplementedError

    @abstractmethod
    async def get_or_create(self, **kwargs) -> tuple[T, bool]:
        raise NotImplementedError

    @abstractmethod
    async def edit(self, obj: T, **kwargs) -> T:
        raise NotImplementedError


class SQLModelRepo(AbstractRepo[T]):
    model: type[T]

    async def find_one(
        self, field: UUID | str, load_reviews: bool = False
    ) -> T | None:
        async with session:
            query = select(self.model)
            if load_reviews:
                query = query.options(selectinload(self.model.reviews))
            if isinstance(field, UUID):
                query = query.where(self.model.id == field)
            elif isinstance(field, str):
                query = query.where(self.model.email == field)
            else:
                return None

            obj: T = await session.exec(query)
            return obj.first()

    async def find_all(self, load_reviews: bool = False) -> List[T]:
        async with session:
            if load_reviews:
                return (
                    await session.exec(
                        select(self.model).options(
                            selectinload(self.model.reviews)
                        )
                    )
                ).all()
            return (await session.exec(select(self.model))).all()

    async def create(self, **kwargs) -> T:
        async with session:
            obj: T = self.model(**kwargs)
            print(obj)
            session.add(obj)
            await session.commit()
            await session.refresh(obj)
        return obj

    async def get_or_create(self, **kwargs) -> tuple[T, bool]:
        async with session:
            existing_obj: T | None = await self.find_one(session, **kwargs)
            if existing_obj:
                return existing_obj, False
            else:
                new_obj: T = await self.create(**kwargs)
                return new_obj, True

    async def edit(self, obj: T, **kwargs):
        async with session:
            obj.sqlmodel_update(obj=kwargs)
            session.add(obj)
            await session.commit()
            await session.refresh(obj)
        return obj
