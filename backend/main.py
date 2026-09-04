from math import ceil
from typing import Literal, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class User(BaseModel):
    user_id: int
    email: EmailStr
    name: str
    status: Literal["active", "inactive"]
    role: Literal["admin", "user"]


class PaginationMeta(BaseModel):
    page: int
    per_page: int
    total: int
    total_pages: int
    has_next_page: bool


class UsersResponse(BaseModel):
    data: list[User]
    pagination: PaginationMeta


fake_users_db = [
    {"user_id": 1, "email": "alice.johnson@example.com", "name": "Alice Johnson", "status": "active", "role": "admin"},
    {"user_id": 2, "email": "bob.smith@testmail.org", "name": "Bob Smith", "status": "active", "role": "user"},
    {"user_id": 3, "email": "charlie.brown@provider.net", "name": "Charlie Brown", "status": "inactive", "role": "user"},
    {"user_id": 4, "email": "dana.white@demo.com", "name": "Dana White", "status": "active", "role": "user"},
    {"user_id": 5, "email": "evan.wright@sample.io", "name": "Evan Wright", "status": "inactive", "role": "admin"},
    {"user_id": 6, "email": "fiona.gallagher@webmail.com", "name": "Fiona Gallagher", "status": "active", "role": "user"},
    {"user_id": 7, "email": "george.miller@tech.org", "name": "George Miller", "status": "active", "role": "admin"},
    {"user_id": 8, "email": "hannah.abbott@services.net", "name": "Hannah Abbott", "status": "inactive", "role": "user"},
    {"user_id": 9, "email": "ian.mckellen@studio.com", "name": "Ian McKellen", "status": "active", "role": "user"},
    {"user_id": 10, "email": "julia.roberts@hollywood.io", "name": "Julia Roberts", "status": "active", "role": "user"},
    {"user_id": 11, "email": "kevin.hart@comedy.com", "name": "Kevin Hart", "status": "inactive", "role": "user"},
    {"user_id": 12, "email": "laura.palmer@mystery.org", "name": "Laura Palmer", "status": "active", "role": "admin"},
    {"user_id": 13, "email": "mike.tyson@sports.net", "name": "Mike Tyson", "status": "inactive", "role": "user"},
    {"user_id": 14, "email": "nina.simone@music.com", "name": "Nina Simone", "status": "active", "role": "admin"},
    {"user_id": 15, "email": "oscar.isaac@film.io", "name": "Oscar Isaac", "status": "active", "role": "user"},
]


@app.get("/api/users", response_model=UsersResponse)
def get_users(
    status: Optional[Literal["active", "inactive"]] = Query(default=None),
    role: Optional[Literal["admin", "user"]] = Query(default=None),
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=10, ge=1, le=50),
):
    filtered = [
        u for u in fake_users_db
        if (status is None or u["status"] == status)
        and (role is None or u["role"] == role)
    ]

    total = len(filtered)
    total_pages = max(1, ceil(total / per_page)) if total else 0
    offset = (page - 1) * per_page

    if total and offset >= total:
        raise HTTPException(status_code=400, detail="Page out of range")

    items = filtered[offset : offset + per_page]

    return {
        "data": items,
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": total,
            "total_pages": total_pages,
            "has_next_page": offset + per_page < total,
        },
    }