# -*- coding: utf-8 -*-


class RequestDoesNotExist(Exception):
    def __init__(self, message: str = "Заявка не найдена") -> None:
        self.message: str = message
