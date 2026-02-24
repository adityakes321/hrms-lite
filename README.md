## HRMS Lite

Lightweight Human Resource Management System with:

- **Employee management** (CRUD-lite)
- **Daily attendance tracking**

This repo contains:

- `frontend` (Vite + React + TypeScript + Tailwind CSS) – lives in the project root
- `backend` (Django REST Framework + MongoDB via `djongo`) – under `backend/`

### Tech stack

- Frontend: Vite, React, TypeScript, shadcn-ui, Tailwind CSS
- Backend: Django, Django REST Framework, djongo (MongoDB)

### Running locally

#### 1. Backend (Django + MongoDB)

Prerequisites:

- Python 3.11+ installed
- MongoDB running locally (or a Mongo URI)

Steps:

```sh
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt

# Set Mongo env vars if needed (otherwise defaults to mongodb://localhost:27017/hrms_lite)
set MONGO_URI=mongodb://localhost:27017
set MONGO_DB_NAME=hrms_lite

python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

The backend will be available at `http://localhost:8000/` and the APIs under `/api/...`.

#### 2. Frontend (Vite)

In another terminal:

```sh
cd D:\hrms-lite  # or project root
npm install

# Ensure the frontend points to the Django backend
set VITE_API_BASE_URL=http://localhost:8000

npm run dev
```

Vite will start on `http://localhost:8080` (or `8081` if 8080 is taken).

### API Endpoints

- `GET  /api/employees` – list employees
- `POST /api/employees` – create employee
- `DELETE /api/employees/<employee_id>` – delete employee
- `POST /api/attendance` – mark attendance
- `GET  /api/attendance/<employee_id>` – list attendance records
- `GET  /api/attendance/<employee_id>/summary` – attendance summary (total present)

All responses follow the shape:

```json
{
  "success": true,
  "data": ...,
  "message": "optional message"
}
```

### Notes

- No authentication is implemented (single admin assumption).
- Basic validation and duplicate handling are implemented in the Django serializers.
