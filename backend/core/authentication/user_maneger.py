from typing import Optional
import logging

from fastapi import Depends, Request
from fastapi_users import BaseUserManager, UUIDIDMixin

from core.models.user import Users
from core.types.user import UserIdType
from core.config import settings

log = logging.getLogger(__name__)


class UserManager(UUIDIDMixin, BaseUserManager[Users, UserIdType]):
    reset_password_token_secret = settings.access_token.reset_password_token_secret
    verification_token_secret = settings.access_token.verification_token_secret

    async def on_after_register(
        self,
        user: Users,
        request: Optional[Request] = None,
    ):
        log.warning("User %r has registered.", user.id)

    async def on_after_forgot_password(
        self,
        user: Users,
        token: str,
        request: Optional[Request] = None,
    ):
        log.warning(
            "User %r has forgot their password. Reset token: %r", user.id, token
        )

    async def on_after_request_verify(
        self,
        user: Users,
        token: str,
        request: Optional[Request] = None,
    ):
        log.warning(
            "Verification requested for user %r. Verification token: %r", user.id, token
        )
