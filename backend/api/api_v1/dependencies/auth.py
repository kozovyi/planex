from fastapi import Depends
from typing import Annotated, TYPE_CHECKING

from fastapi_users.authentication import AuthenticationBackend
from fastapi_users.authentication.strategy.db import (
    AccessTokenDatabase,
    DatabaseStrategy,
)

if TYPE_CHECKING:
    from sqlalchemy.ext.asyncio import AsyncSession

from core.models.access_token import AccessTokens
from core.database import async_db_helper
from core.authentication.transport import bearer_transport
from core.config import settings


async def get_access_token_db(
    session: Annotated["AsyncSession", Depends(async_db_helper.session_getter)],
):
    yield AccessTokens.get_db(session=session)


def get_database_strategy(
    access_token_db: Annotated[
        AccessTokenDatabase["AccessTokens"], Depends(get_access_token_db)
    ],
) -> DatabaseStrategy:
    return DatabaseStrategy(
        database=access_token_db,
        lifetime_seconds=settings.access_token.lifetime_seconds,
    )


authentication_backend = AuthenticationBackend(
    name="access-tokens-db",
    transport=bearer_transport,
    get_strategy=get_database_strategy,
)
