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
from core.models.user import Users


class UserRepo:

    @staticmethod
    async def get_all_users_id_list(session: AsyncSession):
        try:
            query = select(Users.id) # type: ignore
            result = await session.execute(query)  
            return result.scalars().all()
        except Exception as e:
            print(f"Database error: {e}")
            return []
        
