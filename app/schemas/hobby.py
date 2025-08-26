from pydantic import BaseModel
from uuid import UUID

from typing import List, Dict, Any

from typing import Optional


class FieldConfig(BaseModel):
    name: str
    type: str
    # options removed; combo options are managed in combo_options.json only

class Hobby(BaseModel):
    id: UUID
    name: str
    items: List[Dict[str, Any]] = []
    fields: Optional[List[FieldConfig]] = None
