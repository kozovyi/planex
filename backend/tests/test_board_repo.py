import pytest
import asyncio
from uuid import uuid4
from sqlalchemy.ext.asyncio import AsyncSession
from repository.task_repo import TaskRepo
from utils.reset_db import reset_database
from schemas.task_schema import TaskCreate, TaskUpdate
from core.database import async_db_helper
from datetime import datetime
from core.models.base import TaskStatus

@pytest.mark.asyncio
class TestTaskRepo:
    
    @pytest.fixture(scope="function", autouse=True)
    async def setup_database(self):
        await reset_database()
        yield

    @pytest.fixture
    async def session(self):
        async with async_db_helper.session_factory() as session:
            yield session
    
    @pytest.mark.asyncio
    async def test_add_task(self, session: AsyncSession):
        user_id = uuid4()
        board_id = uuid4()
        task_data = TaskCreate(
            assigned_user_id=uuid4(),
            title="Test Task",
            description="This is a test task",
            status=TaskStatus.in_progress.value,
            tags="urgent",
            deadline=datetime.utcnow(),
            created_at=datetime.utcnow(),
            positional_num=1
        )
        
        task = await TaskRepo.add_task(user_id, board_id, task_data, session)
        await asyncio.sleep(0.1)  # Уникаємо конфлікту підключень
        
        assert task is not None
        assert task.title == "Test Task"
    
    @pytest.mark.asyncio
    async def test_get_task(self, session: AsyncSession):
        user_id = uuid4()
        board_id = uuid4()
        task_data = TaskCreate(
            assigned_user_id=uuid4(),
            title="Fetch Test",
            description="Fetch test task",
            status=TaskStatus.in_progress.value,
            tags="important",
            deadline=datetime.utcnow(),
            created_at=datetime.utcnow(),
            positional_num=2
        )
        
        task = await TaskRepo.add_task(user_id, board_id, task_data, session)
        await asyncio.sleep(0.1)
        
        fetched_task = await TaskRepo.get_task(task.id, session)
        assert fetched_task is not None
        assert fetched_task.title == "Fetch Test"
    
    @pytest.mark.asyncio
    async def test_update_task(self, session: AsyncSession):
        user_id = uuid4()
        board_id = uuid4()
        task_data = TaskCreate(
            assigned_user_id=uuid4(),
            title="Update Test",
            description="Before update",
            status=TaskStatus.in_progress.value,
            tags="medium",
            deadline=datetime.utcnow(),
            created_at=datetime.utcnow(),
            positional_num=3
        )
        
        task = await TaskRepo.add_task(user_id, board_id, task_data, session)
        update_data = TaskUpdate(title="Updated Title")
        await asyncio.sleep(0.1)
        
        await TaskRepo.update_task(task, update_data)
        await asyncio.sleep(0.1)
        
        updated_task = await TaskRepo.get_task(task.id, session)
        assert updated_task.title == "Updated Title"
    
    @pytest.mark.asyncio
    async def test_delete_task(self, session: AsyncSession):
        user_id = uuid4()
        board_id = uuid4()
        task_data = TaskCreate(
            assigned_user_id=uuid4(),
            title="Delete Test",
            description="Task to delete",
            status=TaskStatus.in_progress.value,
            tags="low",
            deadline=datetime.utcnow(),
            created_at=datetime.utcnow(),
            positional_num=4
        )
        
        task = await TaskRepo.add_task(user_id, board_id, task_data, session)
        await asyncio.sleep(0.1)
        
        response = await TaskRepo.delete_task(task.id, session)
        assert response == {"Message": "Task deleted", "task_id": task.id}
        
        deleted_task = await TaskRepo.get_task(task.id, session)
        assert deleted_task is None