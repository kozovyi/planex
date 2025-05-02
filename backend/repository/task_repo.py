import asyncio
from datetime import datetime
import fastapi
from sqlalchemy import select, insert, update, and_, func, delete
import sqlalchemy.dialects.postgresql
import sqlalchemy.orm
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from typing import TypedDict
from uuid import UUID, uuid1


from core.models.task import Tasks
from exceptions.task_exc import bad_filter_exc, task_not_found_exc
from schemas.task_schema import TaskCreate, TaskUpdate


class TaskRepo:

    @staticmethod
    async def get_task(
        task_id: UUID, session: AsyncSession, exception=False
    ) -> Tasks | None:
        task = await session.get(Tasks, task_id)
        if not task and exception:
            raise task_not_found_exc
        return task

    @staticmethod
    async def get_task_by_filter(filter, session: AsyncSession) -> list[Tasks]:
        try:
            query = select(Tasks).where(filter)
            response = await session.execute(query)
            res = list(response.scalars().all())
        except SQLAlchemyError:
            raise bad_filter_exc
        return res

    @staticmethod
    async def get_tasks_by_board_id(board_id: UUID, session: AsyncSession) -> list[Tasks]:
        try:
            query = select(Tasks).where(Tasks.board_id == board_id)
            response = await session.execute(query)
            return list(response.scalars().all())
        except SQLAlchemyError:
            raise bad_filter_exc
        
    @staticmethod
    async def add_task(
        user_id: UUID,
        board_id: UUID,
        task_data: TaskCreate,
        session: AsyncSession,
    ) -> Tasks:
        task = Tasks(user_id=user_id, board_id=board_id, **task_data)
        session.add(task)
        await session.commit()
        await session.refresh(task)
        return task

    @staticmethod
    async def delete_task(task_id: UUID, session: AsyncSession):
        task = await TaskRepo.get_task(task_id, session)
        await session.delete(task)
        return {"Message": "Task deleted", "task_id": task_id}

    @staticmethod
    async def update_task(
        task: Tasks,
        task_data: TaskUpdate,
    ) -> None:
        for field, value in task_data.items():
            setattr(task, field, value)



if __name__ == "__main__":
    pass
