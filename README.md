# HobbyFastAPI

A starter FastAPI web application.

## Quick Start

1. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
2. Run the app:
   ```powershell
   .venv/Scripts/Activate.ps1; python -m uvicorn main:app --reload  > app.log 2>&1

   ```

## Structure
- `main.py`: Entrypoint
- `app/routers/`: Route definitions
- `app/models/`: Database models
- `app/schemas/`: Pydantic schemas
- `app/core/`: Core logic/config

## To Do
1. Generate log file from terminal
2. --Convert JSON file to a DB, possibly Postgrest--
3. Try to generate a Android APK app
4. Make sure Combo Boxes cannot have the same value. Maybe validate with UPPER()
5. manual test, build PW suite
6. Make sure Edit Hobby does not allow if the Hobby already exists.

# Clean test
A clean hobbies.json is
[]

A clean combo_options is
{
  "combo_options": {
  }
}