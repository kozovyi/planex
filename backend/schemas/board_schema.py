from pydantic import BaseModel, Field
from typing import TypedDict


class BoardCreate(TypedDict):
    title: str
    description: str | None


class BoardUpdate(TypedDict, total=False):
    title: str
    description: str


class BoardCreateDTO(BaseModel):
    title: str
    description: str|None

class BoardUpdateDTO(BoardCreateDTO):
    pass