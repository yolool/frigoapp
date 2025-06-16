from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from datetime import datetime

from sqlalchemy.orm import relationship

from db.base import Base

class GroceryList(Base):
    __tablename__ = "grocery_lists"

    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))

    # Relation vers les items
    items = relationship("GroceryListItem", back_populates="grocery_list")


class GroceryListItem(Base):
    __tablename__ = "grocery_list_items"

    id = Column(Integer, primary_key=True)
    item_name = Column(String(255))
    quantity = Column(Float)
    unit = Column(String(50))
    checked = Column(Boolean, default=False)
    grocery_list_id = Column(Integer, ForeignKey("grocery_lists.id"))


    grocery_list = relationship("GroceryList", back_populates="items")