from sqlalchemy import select, insert, update, and_, func, delete
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from typing import TypedDict
from uuid import UUID, uuid1


from core.config import settings
from core.models.board import Boards
from exceptions.board_exc import bad_filter_exc, board_not_found_exc

class BoardCreate(TypedDict):
    title: str
    description: str | None


class BoardUpdate(TypedDict, total=False):
    title: str
    description: str


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
    async def get_boards_by_filter(filter, session: AsyncSession) -> list[Boards]:
        try:
            query = select(Boards).where(filter)
            response = await session.execute(query)
            res = list(response.scalars().all())
        except SQLAlchemyError:
            raise bad_filter_exc
        return res

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
        await session.commit()
        return {"Message": "Board deleted", "board_id": board_id}

    @staticmethod
    async def update_board(
        board: Boards,
        board_data: BoardUpdate,
        session: AsyncSession,
    ) -> None:
        await session.execute(update(Boards).where(Boards.id == board.id).values(**board_data))
        await session.commit()
