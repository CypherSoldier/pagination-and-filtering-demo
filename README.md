# Users Filter and Pagination Demo

A full-stack demo application that displays a list of users with server-side filtering and pagination.

## Overview

The project includes:

- A **FastAPI** backend that exposes a users API.
- A **React** frontend that retrieves and displays users in a responsive table.
- Status and role filters.
- Previous/next pagination controls.
- Loading, error, empty-state, and responsive UI styling.

The backend currently uses an in-memory dataset for demonstration purposes; no database is required.

## Project Structure

```text
perplex_take_home/
├── backend/
│   └── main.py
└── frontend/
    └── src/
        ├── UsersPage.jsx
        └── UsersPage.css
```

## Backend Setup

From the project root, activate the Python environment used by the project, then install the dependencies:

```powershell
cd backend
python -m pip install fastapi uvicorn email-validator
```

Start the API server:

```powershell
python -m uvicorn main:app --reload
```

The backend runs at `http://127.0.0.1:8000`.

Interactive API documentation is available at:

- `http://127.0.0.1:8000/docs`
- `http://127.0.0.1:8000/redoc`

## API Endpoint

### `GET /api/users`

Returns a filtered, paginated list of users.

| Parameter | Type | Description |
| --- | --- | --- |
| `status` | `active` or `inactive` | Optional status filter |
| `role` | `admin` or `user` | Optional role filter |
| `page` | integer | Page number, starting at 1 |
| `per_page` | integer | Number of users per page, from 1 to 50 |

Example:

```text
http://127.0.0.1:8000/api/users?status=active&role=admin&page=1&per_page=10
```

The response contains the matching users in `data` and pagination details in `pagination`, including the total number of results and whether another page is available.

## Frontend Setup

In a separate terminal:

```powershell
cd frontend
npm install
npm run dev
```

The frontend should be available at the URL printed by the development server, commonly `http://localhost:5173`.

The frontend expects the backend to be running on `http://localhost:8000` and uses the backend's CORS configuration for local development.

## Features Demonstrated

- Query parameter construction with `URLSearchParams`.
- Server-side filtering and pagination.
- FastAPI request validation with typed query parameters.
- React state management with `useState` and `useEffect`.
- Request cancellation with `AbortController`.
- Responsive table and filter styling.
- Pagination boundary handling and empty results.
