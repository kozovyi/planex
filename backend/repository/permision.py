from sqlalchemy import select, insert, update, and_, func, delete
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID, uuid1


from core.models.permision import Permissions
from core.models.base import PermissionStatus


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
        board_id: UUID, user_id: UUID, permission_status: PermissionStatus, session: AsyncSession
    ):
        permission = Permissions(board_id=board_id, user_id=user_id, permission_status=permission_status)
        session.add(permission)
        await session.commit()
        return permission

    @staticmethod
    async def update_permission(
        permission: Permissions, new_status: PermissionStatus, session: AsyncSession
    ):
        permission.permission_status = new_status
        await session.commit()

    @staticmethod
    async def delete_permission(permission: Permissions, session: AsyncSession):
        await session.delete(permission)
        await session.commit()