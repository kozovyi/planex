from typing import TYPE_CHECKING
from fastapi_users.db import SQLAlchemyBaseUserTableUUID, SQLAlchemyUserDatabase


if TYPE_CHECKING:
    from sqlalchemy.ext.asyncio import AsyncSession

from core.models.base import Base


class Users(Base, SQLAlchemyBaseUserTableUUID):

    @classmethod
    def get_db(cls, session: "AsyncSession"):
        return SQLAlchemyUserDatabase(session, cls)
