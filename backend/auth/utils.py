from datetime import datetime, timedelta, timezone
from typing import Optional
from enum import Enum
import bcrypt
import jwt

from core.config import settings


class TokenType(Enum):
    ACCESS_TOKEN_TYPE = "access_token"
    REFRESH_TOKEN_TYPE = "refresh_token"


def encode_jwt(
    payload: dict,
    expire_timedelta: Optional[timedelta] = None,
    private_key: str = settings.auth_jwt.private_key_path.read_text(),
    algorithm: str = settings.auth_jwt.algorithn,
    expire_minutes: int = settings.auth_jwt.access_token_expire_minutes,
) -> str:
    now = datetime.now(timezone.utc)
    if expire_timedelta:
        expire = now + expire_timedelta
    else:
        expire = now + timedelta(minutes=expire_minutes)

    payload.update(exp=expire, iat=now)
    return jwt.encode(payload, private_key, algorithm)


def decode_jwt(
    token: str | bytes,
    public_key: str = settings.auth_jwt.public_key_path.read_text(),
    algorithm: str = settings.auth_jwt.algorithn,
) -> dict:
    return jwt.decode(token, public_key, algorithms=[algorithm])


def password_hasher(password: str) -> bytes:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())


def password_verify(password: str, hashed_password: bytes):
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password)
