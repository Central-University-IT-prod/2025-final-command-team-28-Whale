# -*- coding: utf-8 -*-

from abc import ABC

from app.repositories.__abc_repos__ import AbstractRepo


class AbstractService(ABC):
    """
    Абстрактный сервис

    Args:
        repo (AbstractRepo): Репозиторий, котрый мы используем
    """

    def __init__(self, repo: AbstractRepo) -> None:
        self.repo = repo
