# test_main.py
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_default_users():
    r = client.get("/api/users")
    assert r.status_code == 200
    body = r.json()
    assert "data" in body
    assert "pagination" in body
    assert body["pagination"]["page"] == 1
    assert body["pagination"]["per_page"] == 10

def test_filter_status():
    r = client.get("/api/users?status=active")
    assert r.status_code == 200
    body = r.json()
    assert all(u["status"] == "active" for u in body["data"])

def test_filter_role():
    r = client.get("/api/users?role=admin")
    assert r.status_code == 200
    body = r.json()
    assert all(u["role"] == "admin" for u in body["data"])

def test_combined_filters():
    r = client.get("/api/users?status=active&role=admin")
    assert r.status_code == 200
    body = r.json()
    assert all(u["status"] == "active" and u["role"] == "admin" for u in body["data"])

def test_pagination():
    r = client.get("/api/users?page=2&per_page=5")
    assert r.status_code == 200
    body = r.json()
    assert body["pagination"]["page"] == 2
    assert body["pagination"]["per_page"] == 5
    assert len(body["data"]) <= 5

def test_invalid_page():
    r = client.get("/api/users?page=0")
    assert r.status_code == 422

def test_invalid_role():
    r = client.get("/api/users?role=manager")
    assert r.status_code == 422