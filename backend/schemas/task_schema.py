from typing import TYPE_CHECKING
from fastapi_users import schemas
from uuid import UUID
from pydantic import ConfigDict, BaseModel, Field
from datetime import datetime
from typing import TypedDict

from core.models.base import TaskStatus

class TaskCreate(TypedDict):
    assigned_user_id: UUID
    title: str
    description: str
    status: str
    tags: str
    deadline: datetime
    created_at: datetime
    positional_num: int


class TaskUpdate(TypedDict, total=False):
    assigned_user_id: UUID
    title: str
    description: str
    status: str
    tags: str
    deadline: datetime
    positional_num: int


class TaskCreateDTO(BaseModel):
    assigned_user_id: UUID | None
    title: str = Field(gt=1, lt=65)
    description: str | None = Field(gt=1, lt=401) 
    status: TaskStatus | None
    tags: str | None
    deadline: datetime | None
    positional_num: int 

class TaskUpdateDTO(TaskCreateDTO):
    pass