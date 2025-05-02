import asyncio
from core.database import async_db_helper
from core.models.base import Base

async def reset_database():
    async with async_db_helper.engine.begin() as conn:  # type: ignore
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

if __name__ == "__main__":
    asyncio.run(reset_database())  # Запускаємо асинхронну функцію через asyncio


