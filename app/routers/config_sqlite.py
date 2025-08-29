from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Hobby, Field, Item, ItemValue, ComboOption
from typing import List
from uuid import uuid4

router = APIRouter(prefix="/config", tags=["Config"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/hobbies")
def list_hobbies(db: Session = Depends(get_db)):
    return db.query(Hobby).all()

@router.post("/hobbies")
def add_hobby(data: dict, db: Session = Depends(get_db)):
    hobby = Hobby(id=data.get("id", str(uuid4())), name=data["name"])
    db.add(hobby)
    db.commit()
    db.refresh(hobby)
    return hobby


# Edit Hobby
@router.put("/hobbies/{hobby_id}")
def edit_hobby(hobby_id: str, data: dict, db: Session = Depends(get_db)):
    hobby = db.query(Hobby).filter(Hobby.id == hobby_id).first()
    if not hobby:
        raise HTTPException(status_code=404, detail="Hobby not found")
    hobby.name = data.get("name", hobby.name)
    db.commit()
    db.refresh(hobby)
    return hobby

# Delete Hobby
@router.delete("/hobbies/{hobby_id}")
def delete_hobby(hobby_id: str, db: Session = Depends(get_db)):
    hobby = db.query(Hobby).filter(Hobby.id == hobby_id).first()
    if not hobby:
        raise HTTPException(status_code=404, detail="Hobby not found")
    db.delete(hobby)
    db.commit()
    return {"detail": "Hobby deleted"}

# Fields
@router.get("/hobbies/{hobby_id}/fields")
def get_fields(hobby_id: str, db: Session = Depends(get_db)):
    return db.query(Field).filter(Field.hobby_id == hobby_id).all()

@router.post("/hobbies/{hobby_id}/fields")
def set_fields(hobby_id: str, fields: List[dict], db: Session = Depends(get_db)):
    db.query(Field).filter(Field.hobby_id == hobby_id).delete()
    for f in fields:
        db.add(Field(id=f.get("id", str(uuid4())), hobby_id=hobby_id, name=f["name"], type=f["type"]))
    db.commit()
    return db.query(Field).filter(Field.hobby_id == hobby_id).all()

# Items
@router.get("/hobbies/{hobby_id}/items")
def get_items(hobby_id: str, db: Session = Depends(get_db)):
    return db.query(Item).filter(Item.hobby_id == hobby_id).all()

@router.post("/hobbies/{hobby_id}/items")
def add_item(hobby_id: str, item: dict, db: Session = Depends(get_db)):
    new_item = Item(id=str(uuid4()), hobby_id=hobby_id)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    # Save item values
    for field_id, value in item.items():
        db.add(ItemValue(id=str(uuid4()), item_id=new_item.id, field_id=field_id, value_text=str(value)))
    db.commit()
    return new_item


# Combo Options (use field.id, not field.name)
@router.get("/hobbies/{hobby_id}/fields/{field_id}/options")
def get_combo_options(hobby_id: str, field_id: str, db: Session = Depends(get_db)):
    return db.query(ComboOption).filter(ComboOption.field_id == field_id).all()

@router.post("/hobbies/{hobby_id}/fields/{field_id}/options")
def add_combo_option(hobby_id: str, field_id: str, value: str = Body(...), db: Session = Depends(get_db)):
    # Ensure field_id is a valid field.id
    field = db.query(Field).filter(Field.id == field_id, Field.hobby_id == hobby_id).first()
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    option = ComboOption(id=str(uuid4()), field_id=field_id, value=value)
    db.add(option)
    db.commit()
    db.refresh(option)
    return option
