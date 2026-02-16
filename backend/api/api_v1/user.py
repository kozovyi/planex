from fastapi import APIRouter
from  sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from fastapi import Depends, HTTPException, status


from api.api_v1.dependencies.user import current_user, fastapi_users
from schemas.user import UserRead, UserUpdate
from core.database import async_db_helper
from repository.permision_repo import PermissionRepo
from services.user_service import UserService


router = APIRouter()

# /me
# /{id}
router.include_router(router=fastapi_users.get_users_router(UserRead, UserUpdate))
