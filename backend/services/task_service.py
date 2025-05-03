from datetime import timedelta
from  sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from core.database import async_db_helper
from repository.task_repo import TaskRepo
from schemas.task_schema import TaskCreate, TaskUpdate, TaskCreateDTO, TaskUpdateDTO
from core.models.task import Tasks

class TaskService:

    @staticmethod
    async def get_task(task_id: UUID, session: AsyncSession) -> Tasks|None:
        return await TaskRepo.get_task(task_id, session, exception=True)

    @staticmethod
    async def get_tasks_by_board_id(board_id: UUID, session: AsyncSession) -> list[Tasks]:
        return await TaskRepo.get_tasks_by_board_id(board_id, session)
    
    @staticmethod
    async def get_tasks_by_board_title(title_filter, board_id: UUID, session: AsyncSession) -> list[Tasks]:
        return await TaskRepo.get_tasks_by_board_title(title_filter, board_id, session)
    
    @staticmethod
    async def add_task(user_id: UUID, board_id: UUID, task_data: TaskCreateDTO, session: AsyncSession) -> None:
        task = TaskCreate(**task_data.model_dump(exclude_none=True))
        await TaskRepo.add_task(user_id, board_id, task, session)
        await session.commit()

    @staticmethod
    async def update_task(task_id: UUID, task_data: TaskUpdateDTO, session: AsyncSession) -> None:
        task = await TaskRepo.get_task(task_id, session, exception=True)
        update_task_data = TaskUpdate(**task_data.model_dump(exclude_unset=True))

        await TaskRepo.update_task(task, update_task_data) #type: ignore
        await session.commit()

    @staticmethod
    async def delete_task(task_id: UUID, session: AsyncSession) -> None:
        await TaskRepo.delete_task(task_id, session)
        await session.commit()