from sqlalchemy import Index, ForeignKey, CheckConstraint, String, text, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING
from fastapi_users.db import SQLAlchemyBaseUserTableUUID, SQLAlchemyUserDatabase
from typing import TYPE_CHECKING


if TYPE_CHECKING:
    from sqlalchemy.ext.asyncio import AsyncSession
    from core.models.board import Boards

from core.models.task import Tasks
from core.models.base import Base


class Users(Base, SQLAlchemyBaseUserTableUUID):

    name: Mapped[str] = mapped_column(String(50), nullable=True)
    account_photo_path: Mapped[str] = mapped_column(String(255), nullable=True)

    @classmethod
    def get_db(cls, session: "AsyncSession"):
        return SQLAlchemyUserDatabase(session, cls)

    boards: Mapped[list["Boards"]] = relationship(
        back_populates="users", secondary="permissions"
    )

    assigned_tasks: Mapped[list["Tasks"]] = relationship(
        back_populates="assigned_user", foreign_keys=[Tasks.assigned_user_id]
    )
