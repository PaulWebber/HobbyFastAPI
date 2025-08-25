
# At the end, after all function definitions:
router = APIRouter(prefix="/config", tags=["Config"])

# Add hobby endpoint
@router.post("/hobbies", response_model=Hobby)
def add_hobby(hobby: Hobby):
    global hobbies
    if any(h.id == hobby.id for h in hobbies):
        raise HTTPException(status_code=400, detail="Hobby ID already exists")
    # Ensure fields and items are always lists, not None/null
    if hobby.fields is None:
        hobby.fields = []
    if hobby.items is None:
        hobby.items = []
    hobbies.append(hobby)
    save_hobbies()
    logging.info(f"Added hobby: {hobby}")
    hobbies = load_hobbies()
    return hobby



from fastapi import APIRouter, HTTPException
import logging
from app.schemas.hobby import Hobby, FieldConfig
from typing import List
import json
import os
from uuid import UUID

logging.basicConfig(level=logging.INFO)

DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "hobbies.json")

def load_hobbies():
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, "r") as f:
                data = json.load(f)
                if isinstance(data, list):
                    return [Hobby(**h) for h in data if isinstance(h, dict)]
                else:
                    return []
        except Exception:
            return []
    return []

def save_hobbies():
    def encode(obj):
        if isinstance(obj, UUID):
            return str(obj)
        if isinstance(obj, dict):
            return {k: encode(v) for k, v in obj.items()}
        if isinstance(obj, list):
            return [encode(i) for i in obj]
        return obj
    with open(DATA_FILE, "w") as f:
        json.dump([encode(hobby.dict()) for hobby in hobbies], f, indent=2)

router = APIRouter(prefix="/config", tags=["Config"])
hobbies = load_hobbies()

# Add item endpoint
@router.post("/hobbies/{hobby_id}/items")
def add_item(hobby_id: UUID, item: dict):
    global hobbies
    for h in hobbies:
        if h.id == hobby_id:
            if not hasattr(h, 'items') or h.items is None:
                h.items = []
            h.items.append(item)
            save_hobbies()
            logging.info(f"Added item to hobby {hobby_id}: {item}")
            hobbies = load_hobbies()
            return item
    logging.warning(f"Hobby not found for item add: {hobby_id}")
    raise HTTPException(status_code=404, detail="Hobby not found")

def load_hobbies():
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, "r") as f:
                data = json.load(f)
                if isinstance(data, list):
                    return [Hobby(**h) for h in data if isinstance(h, dict)]
                else:
                    return []
        except Exception:
            return []
    return []

def save_hobbies():
    def encode(obj):
        if isinstance(obj, UUID):
            return str(obj)
        if isinstance(obj, dict):
            return {k: encode(v) for k, v in obj.items()}
        if isinstance(obj, list):
            return [encode(i) for i in obj]
        return obj
    with open(DATA_FILE, "w") as f:
        json.dump([encode(hobby.dict()) for hobby in hobbies], f, indent=2)


router = APIRouter(prefix="/config", tags=["Config"])
hobbies = load_hobbies()





@router.get("/hobbies", response_model=List[Hobby])
def list_hobbies():
    return hobbies

# Field config endpoints
@router.get("/hobbies/{hobby_id}/fields")
def get_fields(hobby_id: UUID):
    for h in hobbies:
        if h.id == hobby_id:
            return h.fields or []
    raise HTTPException(status_code=404, detail="Hobby not found")


@router.get("/hobbies/{hobby_id}/items")
def get_items(hobby_id: UUID):
    for h in hobbies:
        if h.id == hobby_id:
            return h.items if hasattr(h, 'items') else []
    raise HTTPException(status_code=404, detail="Hobby not found")

@router.post("/hobbies/{hobby_id}/items")
def add_item(hobby_id: UUID, item: dict):
    global hobbies
    for h in hobbies:
        if h.id == hobby_id:
            if not hasattr(h, 'items') or h.items is None:
                h.items = []
            h.items.append(item)
            save_hobbies()
            logging.info(f"Added item to hobby {hobby_id}: {item}")
            hobbies = load_hobbies()
            return item
    logging.warning(f"Hobby not found for item add: {hobby_id}")
    raise HTTPException(status_code=404, detail="Hobby not found")

@router.post("/hobbies/{hobby_id}/fields")
def set_fields(hobby_id: UUID, fields: List[FieldConfig]):
    global hobbies
    for h in hobbies:
        if h.id == hobby_id:
            h.fields = [f.dict() for f in fields]
            save_hobbies()
            logging.info(f"Updated fields for hobby {hobby_id}: {fields}")
            # Reload from file to ensure in-memory and file are in sync
            hobbies = load_hobbies()
            return h.fields
    logging.warning(f"Hobby not found for fields update: {hobby_id}")
    raise HTTPException(status_code=404, detail="Hobby not found")

@router.put("/hobbies/{hobby_id}", response_model=Hobby)
def edit_hobby(hobby_id: UUID, hobby: Hobby):
    for idx, h in enumerate(hobbies):
        if h.id == hobby_id:
            hobbies[idx] = hobby
            save_hobbies()
            return hobby
    raise HTTPException(status_code=404, detail="Hobby not found")

@router.delete("/hobbies/{hobby_id}")
def delete_hobby(hobby_id: UUID):
    for idx, h in enumerate(hobbies):
        if h.id == hobby_id:
            del hobbies[idx]
            save_hobbies()
            return {"detail": "Hobby deleted"}
    raise HTTPException(status_code=404, detail="Hobby not found")
