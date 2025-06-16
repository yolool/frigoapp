

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class GroceryListItemBase(BaseModel):
    item_name: str
    quantity: float
    unit: str
    checked: bool = False

class GroceryListItemCreate(GroceryListItemBase):
    pass

class GroceryListItem(GroceryListItemBase):
    id: int
    class Config:
        orm_mode = True


class GroceryListBase(BaseModel):
    name: str

class GroceryListCreate(GroceryListBase):
    items: List[GroceryListItemCreate] = []

class GroceryListUpdate(GroceryListBase):
    name: Optional[str] = None
    items: List[GroceryListItemCreate] = []

class GroceryList(GroceryListBase):
    id: int
    created_at: datetime
    items: List[GroceryListItem] = []

    class Config:
        orm_mode = True


class GroceryListItemUpdate(BaseModel):
    item_name: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    checked: Optional[bool] = None