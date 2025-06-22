

from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ItemBase(BaseModel):
    name: str
    quantity: float
    unit: str
    category: Optional[str] = None
    location: Optional[str] = None
    expiration_date: Optional[datetime] = None

class ItemCreate(ItemBase):
    pass

class ItemUpdate(ItemBase):
    name: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None

class ItemOut(ItemBase):
    id: int
    added_at: datetime
    user_id: int

    class Config:
        orm_mode = True