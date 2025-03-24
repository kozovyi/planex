from typing import TYPE_CHECKING
from fastapi_users import schemas
from pydantic import ConfigDict, BaseModel

from core.types.user import UserIdType


class UserRead(schemas.BaseUser[UserIdType]):
    pass


class UserCreate(schemas.BaseUserCreate):
    pass


class UserUpdate(schemas.BaseUserUpdate):
    pass
