from fastapi import APIRouter

from api.api_v1.dependencies.user import fastapi_users
from api.api_v1.dependencies.auth import authentication_backend
from schemas.user import UserCreate, UserRead

router = APIRouter()

# /register
router.include_router(fastapi_users.get_register_router(UserRead, UserCreate))

# /login
# /logout
router.include_router(
    fastapi_users.get_auth_router(
        authentication_backend,
        # requires_verification=True
    ),
)

# /request-verify-token
# /verify
router.include_router(fastapi_users.get_verify_router(UserRead))

# /reset-password
# /forgot-password
router.include_router(fastapi_users.get_reset_password_router())
