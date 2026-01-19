# Technical Specification

## Tech Stack
- **Backend:** Python 3.12, FastAPI, SQLModel.
- **Frontend:** Next.js 15, Tailwind CSS, Shadcn/UI.
- **Database:** SQLite (Persistent via Docker Volumes).
- **Deployment:** Docker & Docker Compose.

## Infrastructure & Storage
- **Containerization:** The app runs in two services: `backend` and `frontend`.
- **Database Persistence:** The SQLite database file (`insights.db`) is stored in a named Docker volume (`db-data`) to ensure data persists across container restarts.

## API Endpoints (REST)
- `POST /api/v1/analyze`: Accepts raw text/URL; returns insight object.
- `GET /api/v1/insights`: Returns list of all analyzed records.