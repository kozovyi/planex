from sqlalchemy import Index, ForeignKey, CheckConstraint, String, text, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from uuid import UUID

from core.models.base import Base, PermissionStatus


class Permissions(Base):

    board_id: Mapped[UUID] = mapped_column(
        ForeignKey("boards.id", ondelete="CASCADE"), primary_key=True
    )
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    permission_status: Mapped[PermissionStatus] = mapped_column(nullable=False)
