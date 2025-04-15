# -*- coding: utf-8 -*-


class SessionWasExpire(Exception):
    def __init__(
        self, message: str = "Сессия просрочена или пользователь не авторизован"
    ) -> None:
        self.message: str = message


class InvalidLoginOrPassword(Exception):
    def __init__(self, message: str = "Неверный логин или пароль") -> None:
        self.message: str = message
