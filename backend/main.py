from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse
from fastapi import FastAPI, status

from contextlib import asynccontextmanager
import uvicorn

from core.config import settings
from core.database import async_db_helper

origins = [
    "http://localhost",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    yield
    # shutdown
    await async_db_helper.dispose()


app = FastAPI(lifespan=lifespan, default_response_class=ORJSONResponse)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def default():
    return {"status": status.HTTP_200_OK}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.run.host,
        port=settings.run.port,
        reload=True,
        reload_delay=100,
    )
