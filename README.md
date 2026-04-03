# Job Tracker

A full-stack job application tracker. Backend: Python FastAPI + PostgreSQL. Frontend: React + Vite.

## Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL running locally

---

## Backend Setup

```bash
cd backend

# 1. Create a virtual environment
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create the database in PostgreSQL
psql -U postgres -c "CREATE DATABASE jobtracker;"

# 4. Set up environment variables
cp .env.example .env
# Edit .env and set your DATABASE_URL and a SECRET_KEY

# 5. Start the server (tables are created automatically on first run)
uvicorn main:app --reload
```

API will be available at http://localhost:8000
Interactive docs at http://localhost:8000/docs

---

## Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

App will be available at http://localhost:5173

---

## API Endpoints

| Method | Path | Description | Auth required |
|--------|------|-------------|---------------|
| POST | /auth/signup | Register a new user | No |
| POST | /auth/login | Log in, receive JWT | No |
| GET | /jobs | Get all your jobs | Yes |
| POST | /jobs | Add a new job | Yes |
| PUT | /jobs/{id} | Update a job | Yes |
| DELETE | /jobs/{id} | Delete a job | Yes |

## Job Statuses

`Not Applied` → `Applied` → `Phone Screen` → `Technical` → `Onsite` → `Offer` / `Rejected`
