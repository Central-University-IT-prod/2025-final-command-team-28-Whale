# -*- coding: utf-8 -*-

from app.models import Review
from app.repositories.review_repo import ReviewRepo
from app.services.__abc_service__ import AbstractService


class ReviewService(AbstractService):
    def __init__(self, repo: ReviewRepo = ReviewRepo()):
        super().__init__(repo)

    async def create_review(self, **kwargs) -> Review:
        return await self.repo.create(**kwargs)
