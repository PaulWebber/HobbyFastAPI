from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from app.routers import root, config


app = FastAPI()

app.include_router(root.router)
app.include_router(config.router)

# Mount static files
STATIC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "app", "static"))
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")



# Serve config page at /config and /
@app.get("/config", include_in_schema=False)
@app.get("/", include_in_schema=False)
def config_page():
	return FileResponse(os.path.join(STATIC_DIR, "config.html"))

# Serve items page for a hobby
@app.get("/items/{hobby_id}", include_in_schema=False)
def items_page(hobby_id: str):
	return FileResponse(os.path.join(STATIC_DIR, "items.html"))
