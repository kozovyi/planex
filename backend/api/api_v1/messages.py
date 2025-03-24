from fastapi import APIRouter, Depends
from core.models.user import Users
from api.api_v1.dependencies.user import current_superuser_user, current_user
from schemas.user import UserRead
from typing import Annotated

router = APIRouter()


@router.get("")
def get_user_masseges(user: Annotated[Users, Depends(current_user)]):
    return {
        "masseges": [
            "m1",
        ],
        "user": UserRead.model_validate(user),
    }


@router.get("/secrets")
def get_superuser_masseges(user: Annotated[Users, Depends(current_superuser_user)]):
    return {
        "masseges": [
            "s-m1",
        ],
        "user": UserRead.model_validate(user),
    }
