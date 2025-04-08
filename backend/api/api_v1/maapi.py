from fastapi import FastAPI, APIRouter, Depends
from uuid import UUID
from schemas.board_schema import BoardCreateDTO, BoardUpdateDTO
from schemas.task_schema import TaskCreateDTO, TaskUpdateDTO
from schemas.user import UserCreate, UserRead, UserUpdate
from typing import List

router = APIRouter()

fake_users = {}
fake_boards = {}
fake_tasks = {}

# User API
@router.post("/register")
async def register_user(user_data: UserCreate):
    user_id = UUID("123e4567-e89b-12d3-a456-426614174000")
    fake_users[user_id] = user_data
    return {"id": user_id, "email": user_data.email}

@router.post("/login")
async def login_user():
    return {"access_token": "fake_token"}

@router.get("/me")
async def get_current_user():
    return {"id": "123e4567-e89b-12d3-a456-426614174000", "email": "user@example.com"}

# Board API
@router.post("/boards/")
async def add_board(board_data: BoardCreateDTO, user_id: UUID = Depends(get_current_user)):
    board_id = UUID("223e4567-e89b-12d3-a456-426614174001")
    fake_boards[board_id] = {"user_id": user_id, "title": board_data.title}
    return {"message": "Board created successfully", "id": board_id}

@router.get("/boards/{board_id}")
async def get_board(board_id: UUID):
    return fake_boards.get(board_id, {"error": "Board not found"})

@router.put("/boards/{board_id}")
async def update_board(board_id: UUID, board_data: BoardUpdateDTO):
    if board_id in fake_boards:
        fake_boards[board_id]["title"] = board_data.title
        return {"message": "Board updated successfully"}
    return {"error": "Board not found"}

@router.delete("/boards/{board_id}")
async def delete_board(board_id: UUID):
    if board_id in fake_boards:
        del fake_boards[board_id]
        return {"message": "Board deleted successfully"}
    return {"error": "Board not found"}

# Task API
@router.post("/tasks/")
async def add_task(board_id: UUID, task_data: TaskCreateDTO):
    task_id = UUID("323e4567-e89b-12d3-a456-426614174002")
    fake_tasks[task_id] = {"board_id": board_id, "title": task_data.title}
    return {"message": "Task created successfully", "id": task_id}

@router.get("/tasks/{task_id}")
async def get_task(task_id: UUID):
    return fake_tasks.get(task_id, {"error": "Task not found"})

@router.put("/tasks/{task_id}")
async def update_task(task_id: UUID, task_data: TaskUpdateDTO):
    if task_id in fake_tasks:
        fake_tasks[task_id]["title"] = task_data.title
        return {"message": "Task updated successfully"}
    return {"error": "Task not found"}

@router.delete("/tasks/{task_id}")
async def delete_task(task_id: UUID):
    if task_id in fake_tasks:
        del fake_tasks[task_id]
        return {"message": "Task deleted successfully"}
    return {"error": "Task not found"}


_boards = []
@router.get("/boards/", response_model=List[dict])
async def get_boards(user_id: UUID = Depends(lambda: UUID("123e4567-e89b-12d3-a456-426614174000"))):
    return [board for board in _boards if board["user_id"] == str(user_id)]