# -*- coding: utf-8 -*-

import os
from typing import List, Literal
from uuid import UUID

from pydantic import PostgresDsn, computed_field
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    ADMIN_ID: UUID = UUID("a94884c1-0a19-4625-b8b6-c7ad9eceedfe")
    ADMIN_USERNAME: str = "admin@gmail.com"
    ADMIN_PASSWORD: str = "password"

    APP_DOMAIN: str | None = os.getenv("APP_DOMAIN", None)
    API_DOMAIN: str = os.getenv("API_DOMAIN", "http://localhost:5173")

    API_PATH: str = os.getenv("API_PATH", "/api")
    DEBUG: bool = os.getenv("DEBUG", "True") == "True"
    GQLIDE: str = os.getenv("GQL_IDE", "grqphiql")

    CSRF_COOKIE_KEY: str = "csrf-token"
    CSRF_COOKIE_HTTPONLY: bool = True
    CSRF_COOKIE_EXP: int = 60 * 30
    CSRF_TOKEN_SECURE: Literal["none", "strict", "lax"] = "strict"
    CSRF_HEADER_NAME: str = "X-CSRF-Token"

    SESSION_EXP: int = 24 * 60 * 60 * 14  # 14 дней
    SESSION_REDIS_PATH: str = "sessions"
    SESSION_COOKIE_KEY: str = "__session"
    SESSION_COOKIE_PATH: str = "/"
    SESSION_COOKIE_HTTP_ONLY: bool = (
        os.getenv("SESSION_COOKIE_HTTP_ONLY", "True") == "True"
    )
    SESSION_COOKIE_SECURE: bool = (
        os.getenv("SESSION_COOKIE_SECURE", "True") == "True"
    )
    SESSION_COOKIE_SAMESITE: str = os.getenv(
        "SESSION_COOKIE_SAMESITE", "None"
    )  # strict lax none
    SESSION_COOKIE_HOSTONLY: bool = True

    REDIS_HOST: str = os.getenv("REDIS_HOST", "0.0.0.0")
    REDIS_PORT: str = os.getenv("REDIS_PORT", "6379")
    REDIS_PASSWORD: str | None = os.getenv("REDIS_PASSWORD", None)

    PSQL_HOST: str = os.getenv("PSQL_HOST", "0.0.0.0")
    PSQL_PORT: str = os.getenv("PSQL_PORT", "5432")
    PSQL_USER: str = os.getenv("PSQL_USER", "postgres")
    PSQL_PASSWORD: str = os.getenv("PSQL_PASSWORD", "super-secret-password")
    PSQL_DBNAME: str = os.getenv("PSQL_PASSWORD", "prod")

    def gql_ide(self) -> str | None:
        """Возвращает настройки IDE"""

        if self.GQLIDE != "graphiql" and self.GQLIDE != "apollo-sandbox":
            return None
        else:
            return self.GQLIDE

    def get_cors(self) -> List[str | None]:
        """Возврощает корсы в зависимости от режима работы"""

        if self.DEBUG:
            return ["*"]
        else:
            return [self.API_DOMAIN]

    @computed_field  # type: ignore
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> PostgresDsn:
        url: MultiHostUrl = MultiHostUrl.build(
            scheme="postgresql+asyncpg",
            username=self.PSQL_USER,
            password=self.PSQL_PASSWORD,
            host=self.PSQL_HOST,
            port=int(self.PSQL_PORT),
            path=self.PSQL_DBNAME,
        )
        return PostgresDsn(url=url)


settings: Settings = Settings()
