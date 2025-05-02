from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from core.database import async_db_helper
from schemas.task_schema import TaskCreateDTO, TaskUpdateDTO
from services.task_service import TaskService
from schemas.user import UserRead
from api.api_v1.dependencies.user import current_user

router = APIRouter()


@router.post("/")
async def add_task(
    board_id: UUID,
    task_data: TaskCreateDTO,
    current_user: UserRead = Depends(current_user),
    session: AsyncSession = Depends(async_db_helper.session_getter)
):
    user_id = current_user.id
    await TaskService.add_task(user_id, board_id, task_data, session)
    return {"message": "Task created successfully"}

@router.get("/tasks-by-board")
async def tasks_by_board(
        board_id: UUID,
        current_user: UserRead = Depends(current_user),
        session: AsyncSession = Depends(async_db_helper.session_getter)
    ):
    return await TaskService.get_tasks_by_board_id(board_id, session)


@router.get("/{task_id}")
async def get_task(task_id: UUID, session: AsyncSession = Depends(async_db_helper.session_getter)):
    return await TaskService.get_task(task_id, session)

@router.put("/{task_id}")
async def update_task(
    task_id: UUID,
    task_data: TaskUpdateDTO,
    session: AsyncSession = Depends(async_db_helper.session_getter)
):
    await TaskService.update_task(task_id, task_data, session)
    return {"message": "Task updated successfully"}


@router.delete("/{task_id}")
async def delete_task(task_id: UUID, session: AsyncSession = Depends(async_db_helper.session_getter)):
    await TaskService.delete_task(task_id, session)
    return {"message": "Task deleted successfully"}
