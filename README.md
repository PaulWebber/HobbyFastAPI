# HobbyFastAPI

A starter FastAPI web application.

## Quick Start

1. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
2. Run the app:
   ```powershell
   uvicorn main:app --reload
   ```

## Structure
- `main.py`: Entrypoint
- `app/routers/`: Route definitions
- `app/models/`: Database models
- `app/schemas/`: Pydantic schemas
- `app/core/`: Core logic/config
