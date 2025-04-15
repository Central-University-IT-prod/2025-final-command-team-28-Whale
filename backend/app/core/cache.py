# -*- coding: utf-8 -*-

from redis.asyncio import Redis

from app.core.config import settings


cache: Redis = Redis(
    host=settings.REDIS_HOST,
    port=int(settings.REDIS_PORT),
    decode_responses=True,
)
