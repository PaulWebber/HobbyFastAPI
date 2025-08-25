from pydantic import BaseModel
from uuid import UUID

from typing import List, Dict, Any

from typing import Optional

class FieldConfig(BaseModel):
    name: str
    type: str
    options: Optional[List[str]] = None  # Only for combo

class Hobby(BaseModel):
    id: UUID
    name: str
    items: List[Dict[str, Any]] = []
    fields: Optional[List[FieldConfig]] = None
