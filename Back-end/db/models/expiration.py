from sqlalchemy import Column, Integer, DateTime, ForeignKey, Boolean
from datetime import datetime
from db.base import Base

class ExpirationAlert(Base):
    __tablename__ = "expiration_alerts"

    id = Column(Integer, primary_key=True)
    item_id = Column(Integer, ForeignKey("items.id"))
    alert_date = Column(DateTime)
    notified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)