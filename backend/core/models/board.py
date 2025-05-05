from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from uuid import UUID
from typing import TYPE_CHECKING

from core.models.base import Base, created_at, pk

if TYPE_CHECKING:
    from core.models.user import Users
    from core.models.task import Tasks


class Boards(Base):
    id: Mapped[pk]
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(String(400))
    created_at: Mapped[created_at]

    users: Mapped[list["Users"]] = relationship(
        back_populates="boards", secondary="permissions"
    )

    tasks: Mapped[list["Tasks"]] = relationship(
        back_populates="board",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
