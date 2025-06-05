# Parasol Insurance Claims Management System

This project is an insurance claims management system with a React frontend and a FastAPI backend.

## Technical Stack

### Frontend

- **Framework:** React 18
- **Language:** TypeScript
- **UI Library:** PatternFly
- **Bundler:** Webpack

### Backend

- **Framework:** FastAPI
- **Language:** Python 3.8+
- **ORM:** SQLAlchemy
- **Database (Development):** SQLite
- **Database (Production):** PostgreSQL
- **Other:** Pydantic for data validation, CORS enabled

## Setup and Running

### Prerequisites

- Python 3.8+
- Node.js and npm/yarn

### 1. Clone the repository

```bash
git clone <repository_url>
cd parasol_insurance
```

### 2. Backend Setup

Navigate to the `backend` directory and set up a Python virtual environment.

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
```

*Note: A `requirements.txt` file should be created if it doesn't exist, listing the backend dependencies (fastapi, uvicorn, sqlalchemy, pydantic, python-dotenv, python-multipart, aiofiles).* If you don't have one, you can generate it after installing the dependencies using `pip freeze > requirements.txt`.

Create the initial database (SQLite for development):

```bash
# Ensure you are in the backend directory and virtual environment is active
python -c "from app.database import create_db_and_tables; create_db_and_tables()"
```

Run the backend server:

```bash
uvicorn app.main:app --reload
```

The backend will be running at `http://localhost:8000`.

### 3. Frontend Setup

Navigate to the `frontend` directory and install dependencies.

```bash
cd ../frontend
yarn install # or npm install
```

Run the frontend development server:

```bash
yarn start # or npm start
```

The frontend will typically open at `http://localhost:3000` (or another available port).

## API Endpoints

The backend provides the following key endpoints:

- `POST /api/db/claims`: Create a new claim.
- `GET /api/db/claims`: Get a list of all claims.
- `GET /api/db/claims/{claim_id}`: Get details for a specific claim.
- `POST /api/db/images/upload`: Upload an image.
- `GET /api/db/images/{image_id}`: Get a specific image.

*(Note: More endpoints for updating/deleting claims, and WebSocket for chat, are planned or can be added based on project needs.)*

## Project Structure

- `backend/`: Contains the FastAPI backend code.
  - `app/`: Main backend application code (main.py, models.py, schemas.py, database.py).
  - `venv/`: Python virtual environment.
  - `requirements.txt`: Backend dependencies.
- `frontend/`: Contains the React frontend code.
  - `src/`: Source files (App.tsx, etc.).
  - `package.json`: Frontend dependencies and scripts.
- `data/`: Directory for storing data (e.g., images). 