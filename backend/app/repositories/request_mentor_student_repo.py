# -*- coding: utf-8 -*-

from app.models import Request
from app.repositories.__abc_repos__ import SQLModelRepo


class RequestMentorShipRepo(SQLModelRepo):
    model = Request
