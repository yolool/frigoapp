from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime
from db.base import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String(50))
    category = Column(String(100))
    location = Column(String(100))  # e.g., fridge, freezer
    expiration_date = Column(DateTime)
    added_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))