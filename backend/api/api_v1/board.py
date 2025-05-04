from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated
from uuid import UUID

from core.database import async_db_helper
from schemas.board_schema import BoardCreateDTO, BoardUpdateDTO
from services.board_service import BoardService
from core.models.user import Users
from schemas.user import UserRead
from api.api_v1.dependencies.user import current_user

router = APIRouter()



@router.get("/get-all")
async def get_boards_by_user_id(
    user: UserRead = Depends(current_user),
    session: AsyncSession = Depends(async_db_helper.session_getter),
):
    return await BoardService.get_boards_by_user_id(user.id, session)


@router.post("/")
async def add_board(
    board_data: BoardCreateDTO,
    current_user: UserRead = Depends(current_user),
    session: AsyncSession = Depends(async_db_helper.session_getter)
):
    user_id = current_user.id
    await BoardService.add_board(user_id, board_data, session)
    return {"message": "Board created successfully"}
    
@router.post("/add-permission")
async def add_board_permission(
    board_id: UUID,
    current_user: UserRead = Depends(current_user),
    session: AsyncSession = Depends(async_db_helper.session_getter)
):
    user_id = current_user.id
    await BoardService.add_board_permission(user_id, board_id, session)
    return {"message": "Board permission added"}
    

@router.get("/{board_id}")
async def get_board(board_id: UUID, session: AsyncSession = Depends(async_db_helper.session_getter)):
    return await BoardService.get_board(board_id, session)

@router.put("/{board_id}")
async def update_board(
    board_id: UUID,
    board_data: BoardUpdateDTO,
    session: AsyncSession = Depends(async_db_helper.session_getter)
):
    await BoardService.update_board(board_id, board_data, session)
    return {"message": "Board updated successfully"}


@router.delete("/{board_id}")
async def delete_board(board_id: UUID, session: AsyncSession = Depends(async_db_helper.session_getter)):
    await BoardService.delete_board(board_id, session)
    return {"message": "Board deleted successfully"}
