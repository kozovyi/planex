from fastapi import Depends
from typing import TYPE_CHECKING, Annotated
from fastapi_users import FastAPIUsers

if TYPE_CHECKING:
    from sqlalchemy.ext.asyncio import AsyncSession
    from fastapi_users.db import SQLAlchemyUserDatabase
    from core.types.user import UserIdType

from core.database import async_db_helper
from core.authentication.user_maneger import UserManager
from api.api_v1.dependencies.auth import authentication_backend
from core.models.user import Users


async def get_user_db(
    session: Annotated["AsyncSession", Depends(async_db_helper.session_getter)],
):
    yield Users.get_db(session=session)


async def get_user_manager(
    user_db: Annotated["SQLAlchemyUserDatabase", Depends(get_user_db)],
):
    yield UserManager(user_db=user_db)


fastapi_users = FastAPIUsers[Users, "UserIdType"](
    get_user_manager=get_user_manager, auth_backends=[authentication_backend]
)

current_user = fastapi_users.current_user(False, active=True)
current_superuser_user = fastapi_users.current_user(False, active=True, superuser=True)
