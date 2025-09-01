# build.md

## Step-by-Step Guide: Building the HobbyFastAPI App from Scratch

### 1. Project Setup
- Create a new project folder (e.g., `HobbyFastAPI`).
- Initialize a Python virtual environment:
  ```sh
  python -m venv .venv
  .venv\Scripts\activate  # Windows
  # or
  source .venv/bin/activate  # Linux/Mac
  ```
- Install required packages:
  ```sh
  pip install fastapi uvicorn sqlalchemy pydantic
  ```

### 2. Create Project Structure
- Create the following folders:
  - `app/`
  - `app/static/`
  - `app/routers/`
  - `app/schemas/`
- Create empty `__init__.py` files in each Python package folder.

### 3. Database Models
- In `app/models.py`, define SQLAlchemy models for Hobby, Field, Item, ItemValue, ComboOption.
- In `app/database.py`, set up SQLAlchemy engine, session, and Base.

### 4. API Routers
- In `app/routers/config_sqlite.py`, implement all CRUD endpoints for hobbies, fields, items, and combo options.
- Use dependency injection for DB sessions.
- Return data in frontend-friendly formats (e.g., item lists show field names and values).

### 5. Pydantic Schemas
- In `app/schemas/hobby.py`, define Pydantic models for Hobby and FieldConfig.

### 6. Static Frontend
- In `app/static/`, create:
  - `config.html`, `config.js`, `config.css` for the main config UI.
  - `items.html`, `items.js` for the item management UI.
  - `combo_options.html`, `combo_options.js` for combo option management.
  - Use modal dialogs for all CRUD actions (no browser dialogs).
  - Add a favicon (e.g., `cartoon picture of a.png`).

### 7. FastAPI App Entrypoint
- In `main.py` (project root):
  - Create the FastAPI app.
  - Mount static files.
  - Include routers.
  - Serve HTML pages for `/`, `/config`, and `/items/{hobby_id}`.

### 8. Database Initialization
- Optionally, create `app/init_db.py` to initialize or migrate the database.
- Run migrations or create tables as needed.

### 9. Testing
- Write Playwright tests in `tests/` to cover all major workflows.
- Ensure tests do not rely on hardcoded UUIDs; select by label or fetch IDs dynamically.

### 10. Documentation
- Write `README.md` for project overview and quickstart.
- Write `Instructions.md` to document all files and database structure.
- (This file) `build.md` for step-by-step build instructions.

### 11. Run the App
- Start the server:
  ```sh
  uvicorn main:app --reload
  ```
- Open `http://127.0.0.1:8000/` in your browser.

---

## Notes
- All CRUD actions use modal dialogs for a modern, testable UI.
- The database is SQLite and can be reset at any time.
- The app is modular and easy to extend.
