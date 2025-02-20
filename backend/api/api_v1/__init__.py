from fastapi import APIRouter

from core.config import settings


api_v1 = APIRouter(prefix=settings.api.v1.prefix)
