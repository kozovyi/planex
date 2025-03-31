from sqlalchemy import select, insert, update, and_, func, delete
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID, uuid1


from core.models.permision import Permissions
from core.models.base import PermissionStatus
from schemas.permission_schema import PermissionCreate


class PermissionRepo:
    @staticmethod
    async def get_permission(board_id: UUID, user_id: UUID, session: AsyncSession):
        query = select(Permissions).where(
            and_(Permissions.board_id == board_id, Permissions.user_id == user_id)
        )
        response = await session.execute(query)
        return response.scalar_one_or_none()

    @staticmethod
    async def add_permission(
        board_id: UUID, user_id: UUID, permission_data: PermissionCreate, session: AsyncSession
    ):
        permission = Permissions(board_id=board_id, user_id=user_id, **permission_data)
        session.add(permission)
        return permission

    @staticmethod
    async def update_permission(
        permission: Permissions, new_status: PermissionStatus, session: AsyncSession
    ):
        permission.permission_status = new_status

    @staticmethod
    async def delete_permission(permission: Permissions, session: AsyncSession):
        await session.delete(permission)