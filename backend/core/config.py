from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import BaseModel
from pathlib import Path

BASE_DIR = Path(__file__).parent


class AuthJWT(BaseModel):
    private_key_path: Path = BASE_DIR / "certs" / "jwt-private.pem"
    public_key_path: Path = BASE_DIR / "certs" / "jwt-public.pem"
    algorithn: str = "RS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 30


class ApiV1Prefix:
    prefix: str = "/api_v1"
    users: str = "/users"


class ApiPrefix:
    prefix: str = "/api"
    v1: ApiV1Prefix = ApiV1Prefix()


class RunConfig(BaseModel):
    host: str = "127.0.0.1"
    port: int = 8000


class DatabaseConfig(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(
            "core/.env.template",
            "core/.env",
        ),
        case_sensitive=False,
        env_nested_delimiter="__",  # після цього роздільника шукати значення
        env_prefix="APP_CONFIG_DB__",  # префікс для точного знаходження значення
    )

    HOST: str
    PASS: str
    NAME: str
    PORT: str
    USER: str

    echo: bool = False
    echo_pool: bool = False
    pool_size: int = 50
    max_overflow: int = 10

    naming_convention: dict[str, str] = {
        "ix": "ix_%(column_0_label)s",
        "uq": "uq_%(table_name)s_%(column_0_name)s",
        "ck": "ck_%(table_name)s_%(constraint_name)s",
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
        "pk": "pk_%(table_name)s",
    }

    @property
    def DB_URL_ASYNCPG(self):
        return f"postgresql+asyncpg://{self.USER}:{self.PASS}@{self.HOST}:{self.PORT}/{self.NAME}"

    @property
    def DB_URL_PSYCOPG(self):
        return f"postgresql+psycopg://{self.USER}:{self.PASS}@{self.HOST}:{self.PORT}/{self.NAME}"


class Settings(BaseSettings):
    auth_jwt: AuthJWT = AuthJWT()
    run: RunConfig = RunConfig()
    api: ApiPrefix = ApiPrefix()
    db: DatabaseConfig = DatabaseConfig()  # type: ignore


settings = Settings()
