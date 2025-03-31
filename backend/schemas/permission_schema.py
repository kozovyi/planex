from pydantic import BaseModel
from typing import TypedDict
from uuid import UUID


from core.models.base import PermissionStatus


class PermissionCreate(TypedDict):
    permission_status: PermissionStatus

class PermissionCreateDTO(BaseModel):   
    permission_status: PermissionStatus

class PermissionUpdateDTO(PermissionCreateDTO):
    pass