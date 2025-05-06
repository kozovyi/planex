from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, status

from contextlib import asynccontextmanager
import uvicorn
import os

from core.config import settings
from core.database import async_db_helper
from api.api_v1 import api_v1

# os.environ["APP_CONFIG__DB__HOST"] = "localhost"

origins = [
    "http://localhost",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5173",
    "http://frontend:5173",     
    "http://planex-frontend:5173",  
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    yield
    # shutdown
    await async_db_helper.dispose()


app = FastAPI(lifespan=lifespan)
app.include_router(api_v1, prefix=settings.api.prefix)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.run.host,
        port=settings.run.port,
        reload=True,
        reload_delay=100,
    )
