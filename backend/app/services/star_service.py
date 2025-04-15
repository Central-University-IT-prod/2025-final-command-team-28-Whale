# -*- coding: utf-8 -*-

from app.models import Star
from app.repositories.star_repo import StarRepo
from app.services.__abc_service__ import AbstractService


class StarService(AbstractService):
    def __init__(self, repo: StarRepo = StarRepo()):
        super().__init__(repo)

    async def create_review(self, **kwargs) -> Star:
        return await self.repo.create(**kwargs)
