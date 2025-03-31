from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer

from core.config import settings
from api.api_v1.auth import router as auth_router
from api.api_v1.user import router as user_router

http_bearer = HTTPBearer(auto_error=False)

api_v1 = APIRouter(prefix=settings.api.v1.prefix, dependencies=[Depends(http_bearer)])
api_v1.include_router(auth_router, prefix=settings.api.v1.auth, tags=["Auth"])
api_v1.include_router(user_router, prefix=settings.api.v1.user, tags=["User"])
