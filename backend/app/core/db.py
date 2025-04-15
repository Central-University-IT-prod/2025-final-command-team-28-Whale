# -*- coding: utf-8 -*-

from sentence_transformers import SentenceTransformer
from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.config import settings


engine = create_async_engine(
    url=str(settings.SQLALCHEMY_DATABASE_URI), echo=True
)


async def initdb():
    """Подключение к базе данных"""
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


model = SentenceTransformer(
    "sentence-transformers/distiluse-base-multilingual-cased"
)

session = AsyncSession(engine)
