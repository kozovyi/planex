from fastapi import APIRouter
from api.api_v1.dependencies.user import fastapi_users
from schemas.user import UserRead, UserUpdate

router = APIRouter()

# /me
# /{id}
router.include_router(router=fastapi_users.get_users_router(UserRead, UserUpdate))
