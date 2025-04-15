# -*- coding: utf-8 -*

from app.core.config import settings
from app.models import Admin
from app.repositories import AdminRepo


async def create_or_get_default_admin() -> Admin:
    admin_repo = AdminRepo()
    admin: Admin | None = await admin_repo.find_one(settings.ADMIN_ID)
    if not admin:
        admin = await admin_repo.create(
            id=settings.ADMIN_ID,
            username=settings.ADMIN_USERNAME,
            password_hash=settings.ADMIN_PASSWORD,
        )
    return Admin
