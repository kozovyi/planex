import datetime
import fastapi
from sqlalchemy import Index, ForeignKey, CheckConstraint, String, text, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from uuid import UUID
from typing import TYPE_CHECKING

from core.models.base import Base, created_at, PermissionStatus, pk, TaskStatus

if TYPE_CHECKING:
    from core.models.user import Users
    from core.models.board import Boards


class Tasks(Base):
    id: Mapped[pk]
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )

    board_id: Mapped[UUID] = mapped_column(
        ForeignKey("boards.id", ondelete="CASCADE"), nullable=False
    )

    title: Mapped[str] = mapped_column(String(64), nullable=False)
    description: Mapped[str] = mapped_column(String(400))

    status: Mapped[TaskStatus] = mapped_column(
        default=TaskStatus.todo, nullable=False
    )
    tags: Mapped[str] = mapped_column(String(64), nullable=True)
    deadline: Mapped[datetime.datetime] = mapped_column(nullable=True)
    created_at: Mapped[created_at]
    assigned_user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    positional_num: Mapped[int] = mapped_column(nullable=False)

    assigned_user: Mapped["Users"] = relationship(
        back_populates="assigned_tasks", foreign_keys=[assigned_user_id]
    )

    board: Mapped["Boards"] = relationship(back_populates="tasks")
