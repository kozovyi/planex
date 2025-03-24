from typing import TYPE_CHECKING
from fastapi import Depends
from fastapi_users.db import SQLAlchemyUserDatabase
from fastapi_users_db_sqlalchemy.access_token import (
    SQLAlchemyAccessTokenDatabase,
    SQLAlchemyBaseAccessTokenTable,
)

from sqlalchemy import ForeignKey
from sqlalchemy.orm import mapped_column, Mapped
from core.types.user import UserIdType

if TYPE_CHECKING:
    from sqlalchemy.ext.asyncio import AsyncSession

from core.models.base import Base


class AccessToken(Base, SQLAlchemyBaseAccessTokenTable[UserIdType]):
    user_id: Mapped[UserIdType] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )

    @classmethod
    def get_db(cls, session: "AsyncSession"):
        return SQLAlchemyAccessTokenDatabase(session, cls)
