from datetime import timedelta
from  sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from core.database import async_db_helper
from repository.task_repo import TaskRepo
from schemas.task_schema import TaskCreate, TaskUpdate, TaskCreateDTO, TaskUpdateDTO
from core.models.task import Tasks
from core.models.user import Users
from repository.permision_repo import PermissionRepo
from repository.board_repo import BoardRepo
from schemas.user import UserRead



class UserService:
    @staticmethod
    async def get_users_by_board_id(board_id: UUID, session: AsyncSession) -> list[dict]:
        board = await BoardRepo.get_board(board_id, session)
        users = await PermissionRepo.get_users_by_board_id(board_id, session)

        result = [UserRead.model_validate(user).model_dump() for user in users]
        
        # Додаємо власника (user_id: "Owner")
        result.append({"user_id": str(board.user_id), "role": "Owner"}) #type: ignore

        return result