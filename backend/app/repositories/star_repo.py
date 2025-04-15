# -*- coding: utf-8 -*-

from app.models import Star
from app.repositories.__abc_repos__ import SQLModelRepo


class StarRepo(SQLModelRepo):
    model = Star
