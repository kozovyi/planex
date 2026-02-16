from datetime import timedelta
from sqlalchemy.ext.asyncio import AsyncSession
import typing
from uuid import UUID

from core.database import async_db_helper
from repository.board_repo import BoardRepo
from schemas.board_schema import BoardCreate, BoardUpdate, BoardCreateDTO, BoardUpdateDTO
from core.models.board import Boards
from repository.permision_repo import PermissionRepo
from schemas.permission_schema import PermissionCreate
from core.models.base import PermissionStatus

class BoardService:

    @staticmethod
    async def get_board(board_id: UUID, session: AsyncSession) -> Boards | None:
        return await BoardRepo.get_board(board_id, session, exception=True)

    @staticmethod
    async def get_boards_by_user_id(user_id: UUID, session: AsyncSession) -> list[Boards]:
        return await PermissionRepo.get_boards_by_user(user_id, session)

    @staticmethod
    async def add_board(user_id: UUID, board_data: BoardCreateDTO, session: AsyncSession) -> None:
        board = BoardCreate(**board_data.model_dump(exclude_none=True))
        created_board = await BoardRepo.add_board(user_id, board, session)
        await PermissionRepo.add_permission(board_id=created_board.id, user_id=user_id, permission_data = {"permission_status": PermissionStatus.admin}, session=session)
        await session.commit()

    @staticmethod
    async def add_board_permission(user_id: UUID, board_id: UUID, session: AsyncSession) -> None:
        await PermissionRepo.add_permission(board_id=board_id, user_id=user_id, permission_data = {"permission_status": PermissionStatus.admin}, session=session)
        await session.commit()

    @staticmethod
    async def update_board(board_id: UUID, board_data: BoardUpdateDTO, session: AsyncSession) -> None:
        board = await BoardRepo.get_board(board_id, session, exception=True)
        new_board_data = BoardUpdate(**board_data.model_dump(exclude_unset=True))
        await BoardRepo.update_board(board, new_board_data, session) #type: ignore
        await session.commit()

    @staticmethod
    async def delete_board(board_id: UUID, session: AsyncSession) -> None:
        await BoardRepo.delete_board(board_id, session)
        await session.commit()
