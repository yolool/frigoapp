
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ExpirationAlertBase(BaseModel):
    item_id: int
    alert_date: datetime


class ExpirationAlertCreate(ExpirationAlertBase):
    pass


class ExpirationAlertOut(ExpirationAlertBase):
    id: int
    notified: bool
    created_at: datetime

    class Config:
        orm_mode = True