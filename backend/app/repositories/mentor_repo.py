# -*- coding: utf-8 -*-

from app.models import Mentor
from app.repositories.__abc_repos__ import SQLModelRepo


class MentorRepo(SQLModelRepo):
    model = Mentor
