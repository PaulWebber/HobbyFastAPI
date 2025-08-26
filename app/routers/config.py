
# All imports at the top

from fastapi import APIRouter, HTTPException, Body
import logging
from app.schemas.hobby import Hobby, FieldConfig
from typing import List
import json
import os
from uuid import UUID

logging.basicConfig(level=logging.INFO)

DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "hobbies.json")
COMBO_OPTIONS_FILE = os.path.join(os.path.dirname(__file__), "..", "combo_options.json")



# Router (must be defined before endpoints)
router = APIRouter(prefix="/config", tags=["Config"])

# Utility functions for combo options
def load_combo_options():
    if os.path.exists(COMBO_OPTIONS_FILE):
        try:
            with open(COMBO_OPTIONS_FILE, "r") as f:
                data = json.load(f)
                return data.get("combo_options", {})
        except Exception:
            return {}
    return {}

def save_combo_options(options):
    with open(COMBO_OPTIONS_FILE, "w") as f:
        json.dump({"combo_options": options}, f, indent=2)



# Endpoints
@router.get("/hobbies/{hobby_id}/fields/{field_name}/options")
def get_combo_options(hobby_id: UUID, field_name: str):
    options = load_combo_options()
    key = f"{hobby_id}:{field_name}"
    # Always return a list, never raise 404
    result = options.get(key)
    if isinstance(result, list):
        return result
    return []

@router.post("/hobbies/{hobby_id}/fields/{field_name}/options")
def add_combo_option(hobby_id: UUID, field_name: str, value: str = Body(...)):
    options = load_combo_options()
    key = f"{hobby_id}:{field_name}"
    if key not in options:
        options[key] = []
    if value not in options[key]:
        options[key].append(value)
        save_combo_options(options)
    return options[key]


# Utility functions
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

# Load hobbies after function is defined
hobbies = load_hobbies()

# Endpoints
@router.get("/hobbies", response_model=List[Hobby])
def list_hobbies():
    return hobbies

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

@router.get("/hobbies/{hobby_id}/fields")
def get_fields(hobby_id: UUID):
    for h in hobbies:
        if h.id == hobby_id:
            # Remove 'options' from combo fields before returning
            fields = h.fields or []
            for f in fields:
                if isinstance(f, dict) and f.get('type') == 'combo' and 'options' in f:
                    f.pop('options', None)
                elif hasattr(f, 'type') and getattr(f, 'type') == 'combo' and hasattr(f, 'options'):
                    delattr(f, 'options')
            return fields
    raise HTTPException(status_code=404, detail="Hobby not found")

@router.post("/hobbies/{hobby_id}/fields")
def set_fields(hobby_id: UUID, fields: List[FieldConfig]):
    global hobbies
    # Remove 'options' from combo fields before saving
    cleaned_fields = []
    for f in fields:
        f_dict = f.dict() if hasattr(f, 'dict') else dict(f)
        if f_dict.get('type') == 'combo' and 'options' in f_dict:
            f_dict.pop('options', None)
        cleaned_fields.append(f_dict)
    for h in hobbies:
        if h.id == hobby_id:
            h.fields = cleaned_fields
            save_hobbies()
            logging.info(f"Updated fields for hobby {hobby_id}: {cleaned_fields}")
            hobbies = load_hobbies()
            return h.fields
    logging.warning(f"Hobby not found for fields update: {hobby_id}")
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
