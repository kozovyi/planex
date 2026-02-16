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


from fastapi import APIRouter
from  sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from fastapi import Depends, HTTPException, status


from api.api_v1.dependencies.user import current_user, fastapi_users
from schemas.user import UserRead, UserUpdate
from core.database import async_db_helper
from repository.permision_repo import PermissionRepo
from services.user_service import UserService
from services.permision_service import PermissionService


router = APIRouter()



@router.get("/get-all")
async def get_boards_by_user_id(
    user: UserRead = Depends(current_user),
    session: AsyncSession = Depends(async_db_helper.session_getter),
):
    return await BoardService.get_boards_by_user_id(user.id, session)


@router.get("/by-board", response_model=list[dict])
async def get_users_by_board(
    board_id: UUID,
    session: AsyncSession = Depends(async_db_helper.session_getter),
    
):
    return await UserService.get_users_by_board_id(board_id=board_id, session=session)

@router.get("/delete-user")
async def delete_user_from_board(
    user_id: UUID,
    board_id: UUID,
    session: AsyncSession = Depends(async_db_helper.session_getter),
):
    await PermissionService.delete_permission(board_id, user_id, session)
    return {"message": "User removed from board successfully"}


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

