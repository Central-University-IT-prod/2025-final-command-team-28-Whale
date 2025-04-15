# -*- coding: utf-8 -*-
from app.models import Admin
from app.repositories.__abc_repos__ import SQLModelRepo


class AdminRepo(SQLModelRepo):
    model = Admin
