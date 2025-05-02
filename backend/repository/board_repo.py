from sqlalchemy import select, insert, update, and_, func, delete
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID, uuid1
from typing import Optional


from core.config import settings
from core.models.board import Boards
from exceptions.board_exc import bad_filter_exc, board_not_found_exc
from schemas.board_schema import BoardCreate, BoardUpdate


class BoardRepo:
    
    @staticmethod
    async def get_board(
        board_id: UUID, session: AsyncSession, exception=False
    ) -> Boards | None:
        board = await session.get(Boards, board_id)
        if not board and exception:
            raise board_not_found_exc
        return board

    @staticmethod
    async def get_boards_by_filter(
        session: AsyncSession,
        owner_id: Optional[UUID] = None,
    ) -> list[Boards]:
        try:
            filters = []
            if owner_id is not None:
                filters.append(Boards.user_id == owner_id)

            query = select(Boards)
            if filters:
                query = query.where(*filters)

            result = await session.execute(query)
            return list(result.scalars().all())
        except SQLAlchemyError:
            raise bad_filter_exc

    @staticmethod
    async def add_board(
        user_id: UUID,
        board_data: BoardCreate,
        session: AsyncSession,
    ) -> Boards:
        board = Boards(user_id=user_id, **board_data)
        session.add(board)
        await session.commit() 
        await session.refresh(board)
        return board

    @staticmethod
    async def delete_board(board_id: UUID, session: AsyncSession):
        board = await BoardRepo.get_board(board_id, session, exception=True)
        await session.delete(board)
        return {"Message": "Board deleted", "board_id": board_id}

    @staticmethod
    async def update_board(
        board: Boards,
        board_data: BoardUpdate,
        session: AsyncSession,
    ) -> None:
        await session.execute(update(Boards).where(Boards.id == board.id).values(**board_data))
