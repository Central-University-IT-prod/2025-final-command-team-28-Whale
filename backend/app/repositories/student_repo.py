# -*- coding: utf-8 -*-

from app.models import Student
from app.repositories.__abc_repos__ import SQLModelRepo


class StudentRepo(SQLModelRepo):
    model = Student
