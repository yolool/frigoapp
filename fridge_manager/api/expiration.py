from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_db
from schemas.expiration import ExpirationAlertOut
from crud.expiration import get_expiring_items
from core.security import get_current_user

router = APIRouter(prefix="/expirations", tags=["expirations"])


@router.get("/soon", response_model=list[ExpirationAlertOut])
def list_soon_to_expire(days_ahead: int = 2, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return get_expiring_items(db, days_ahead=days_ahead)