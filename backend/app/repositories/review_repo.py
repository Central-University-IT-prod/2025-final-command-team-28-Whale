# -*- coding: utf-8 -*-

from app.models import Review
from app.repositories.__abc_repos__ import SQLModelRepo


class ReviewRepo(SQLModelRepo):
    model = Review
