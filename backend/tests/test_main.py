import pytest
from httpx import AsyncClient
from httpx import ASGITransport
from main import app
from uuid import uuid4
from datetime import datetime, timedelta

@pytest.mark.asyncio
async def test_register_user():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        user_data = {"email": "oleg@example.com", "password": "password123"}
        response = await client.post("/api/api_v1/main/register", json=user_data)
        assert response.status_code == 200
        assert "id" in response.json()
        assert response.json()["email"] == user_data["mail"]


@pytest.mark.asyncio
async def test_login_user():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        user_data = {"email": "oleg@example.com", "password": "password123"}
        response = await client.post("/api/api_v1/main/login", json=user_data)
        assert response.status_code == 200
        assert "access_token" in response.json()

@pytest.mark.asyncio
async def test_create_board():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        user_data = {"email": "oleg@example.com", "password": "password123"}
        await client.post("/api/api_v1/main/register", json=user_data)
        token_response = await client.post("/api/api_v1/main/login", json=user_data)
        token = token_response.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}

        board_data = {"title": "My Board", "description": "This is a test board."}
        response = await client.post("/api/api_v1/main/boards/", json=board_data, headers=headers)

        print(response.json())

        assert response.status_code == 200
        assert "id" in response.json()
        board_id = response.json()["id"]

        response = await client.get(f"/api/api_v1/main/boards/{board_id}", headers=headers)
        assert response.status_code == 200
        assert response.json()["title"] == "My Board"

@pytest.mark.asyncio
async def test_get_board():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        user_data = {"email": "oleg@example.com", "password": "password123"}
        await client.post("/api/api_v1/main/register", json=user_data)
        token_response = await client.post("/api/api_v1/main/login", json=user_data)
        token = token_response.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}

        board_data = {"title": "Test Board", "description": "This is a test board."}
        create_response = await client.post("/api/api_v1/main/boards/", json=board_data, headers=headers)
        board_id = create_response.json()["id"]

        response = await client.get(f"/api/api_v1/main/boards/{board_id}", headers=headers)
        assert response.status_code == 200
        assert response.json()["title"] == "Test Board"

@pytest.mark.asyncio
async def test_update_board():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        user_data = {"email": "oleg@example.com", "password": "password123"}
        await client.post("/api/api_v1/main/register", json=user_data)
        token_response = await client.post("/api/api_v1/main/login", json=user_data)
        token = token_response.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}

        board_data = {"title": "Old Board", "description": "This is an old board."}
        create_response = await client.post("/api/api_v1/main/boards/", json=board_data, headers=headers)
        board_id = create_response.json()["id"]

        updated_board_data = {"title": "Updated Board", "description": "This is an updated board."}
        update_response = await client.put(f"/api/api_v1/main/boards/{board_id}", json=updated_board_data, headers=headers)
        assert update_response.status_code == 200
        assert update_response.json()["message"] == "Board updated successfully"

@pytest.mark.asyncio
async def test_delete_board():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        user_data = {"email": "oleg@example.com", "password": "password123"}
        await client.post("/api/api_v1/main/register", json=user_data)
        token_response = await client.post("/api/api_v1/main/login", json=user_data)
        token = token_response.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}

        board_data = {"title": "Board to delete", "description": "This board will be deleted."}
        create_response = await client.post("/api/api_v1/main/boards/", json=board_data, headers=headers)
        board_id = create_response.json()["id"]

        delete_response = await client.delete(f"/api/api_v1/main/boards/{board_id}", headers=headers)
        assert delete_response.status_code == 200
        assert delete_response.json()["message"] == "Board deleted successfully"

@pytest.mark.asyncio
async def test_create_task():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        user_data = {"email": "oleg@example.com", "password": "password123"}
        await client.post("/api/api_v1/main/register", json=user_data)
        token_response = await client.post("/api/api_v1/main/login", json=user_data)
        token = token_response.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}

        board_data = {"title": "Board for Tasks", "description": "This board is for tasks."}
        create_response = await client.post("/api/api_v1/main/boards/", json=board_data, headers=headers)
        board_id = create_response.json()["id"]

        task_data = {
            "title": "Test Task",
            "description": "This is a test task.",
            "assigned_user_id": str(uuid4()),
            "status": "planned",
            "tags": "test, example",
            "deadline": (datetime.utcnow() + timedelta(days=1)).isoformat(),
            "positional_num": 1
        }
        response = await client.post(f"/api/api_v1/main/tasks/?board_id={board_id}", json=task_data, headers=headers)

        # Логування відповіді для налагодження
        print(response.json())

        assert response.status_code == 200
        task_id = response.json()["id"]

        task_response = await client.get(f"/api/api_v1/main/tasks/{task_id}", headers=headers)
        assert task_response.status_code == 200
        assert task_response.json()["title"] == "Test Task"

@pytest.mark.asyncio
async def test_get_task():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        user_data = {"email": "oleg@example.com", "password": "password123"}

        await client.post("/api/api_v1/main/register", json=user_data)
        token_response = await client.post("/api/api_v1/main/login", json=user_data)
        token = token_response.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}

        board_data = {"title": "Board for Tasks", "description": "This board is for tasks."}
        create_board_response = await client.post("/api/api_v1/main/boards/", json=board_data, headers=headers)
        board_id = create_board_response.json()["id"]

        task_data = {
            "title": "Test Task",
            "description": "This is a test task.",
            "assigned_user_id": str(uuid4()),
            "status": "planned",
            "tags": "test, example",
            "deadline": (datetime.utcnow() + timedelta(days=1)).isoformat(),
            "positional_num": 1
        }
        create_task_response = await client.post(f"/api/api_v1/main/tasks/?board_id={board_id}", json=task_data, headers=headers)
        task_id = create_task_response.json()["id"]

        task_response = await client.get(f"/api/api_v1/main/tasks/{task_id}", headers=headers)
        assert task_response.status_code == 200
        assert task_response.json()["title"] == "Test Task"

@pytest.mark.asyncio
async def test_get_boards_empty():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        user_data = {"email": "oleg@example.com", "password": "password123"}
        await client.post("/api/api_v1/main/register", json=user_data)
        token_response = await client.post("/api/api_v1/main/login", json=user_data)
        token = token_response.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}

        response = await client.get("/api/api_v1/main/boards/", headers=headers)
        assert response.status_code == 200
        assert response.json() == []  # Припускаємо, що список дошок порожній