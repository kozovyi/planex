from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from repository.permision_repo import PermissionRepo
from schemas.permission_schema import PermissionCreateDTO, PermissionUpdateDTO, PermissionCreate
from core.models.permision import Permissions

class PermissionService:

    @staticmethod
    async def get_permission(board_id: UUID, user_id: UUID, session: AsyncSession) -> Permissions | None:
        return await PermissionRepo.get_permission(board_id, user_id, session)

    @staticmethod
    async def add_permission(board_id: UUID, user_id: UUID, permission_data: PermissionCreateDTO, session: AsyncSession) -> None:
        permission_item = PermissionCreate(**permission_data.model_dump(exclude_none=True))
        await PermissionRepo.add_permission(board_id, user_id, permission_item, session)
        await session.commit()

    @staticmethod
    async def update_permission(board_id: UUID, user_id: UUID, permission_data: PermissionUpdateDTO, session: AsyncSession) -> None:
        permission = await PermissionRepo.get_permission(board_id, user_id, session)
        if not permission:
            raise ValueError("Permission not found")
        
        await PermissionRepo.update_permission(permission, permission_data.permission_status, session)
        await session.commit()

    @staticmethod
    async def delete_permission(board_id: UUID, user_id: UUID, session: AsyncSession) -> None:
        permission = await PermissionRepo.get_permission(board_id, user_id, session)
        if not permission:
            raise ValueError("Permission not found")
        
        await PermissionRepo.delete_permission(permission, session)
        await session.commit()
