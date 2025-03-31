import datetime
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column,
    relationship,
    declared_attr,
)
from datetime import datetime
from sqlalchemy import Index, ForeignKey, CheckConstraint, String, text, Float, MetaData
from sqlalchemy.dialects.postgresql import UUID
from typing import Annotated
from enum import Enum
import uuid

from utils import camel_case_to_snake_case
from core.config import settings


# --------/ Base /--------------
class Base(DeclarativeBase):

    metadata = MetaData(naming_convention=settings.db.naming_convention)
    repr_cols_num = 3
    repr_cols = tuple()

    @declared_attr.directive
    def __tablename__(cls) -> str:
        return camel_case_to_snake_case(cls.__name__)

    def __repr__(self):
        cols = []
        for idx, col in enumerate(self.__table__.columns.keys()):
            if col in self.repr_cols or idx < self.repr_cols_num:
                cols.append(f"{col}={getattr(self, col)}")

        return f"<{self.__class__.__name__} {', '.join(cols)}\n>"


# --------/ Annotated /---------

pk = Annotated[
    uuid.UUID,
    mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    ),
]


created_at = Annotated[
    datetime, mapped_column(server_default=text("TIMEZONE('utc', now())"))
]

# --------/ Enum types /--------


class PermissionStatus(Enum):
    owner = "owner"
    super_admin = "super_admin"  # може змінювати іншим статус доступу
    admin = "admin"
    only_add = "only_add"
    only_check = "only_check"
    reader = "reader"


class TaskStatus(Enum):
    planned = "planned"
    in_progress = "in_progress"
    finished = "finished"
    overdue = "overdue"
