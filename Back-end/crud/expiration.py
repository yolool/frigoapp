from sqlalchemy.orm import Session
from db.models.expiration import ExpirationAlert
from schemas.expiration import ExpirationAlertCreate

def create_expiration_alert(db: Session, alert: ExpirationAlertCreate):
    db_alert = ExpirationAlert(**alert.dict())
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert

def get_expiring_items(db: Session, days_ahead: int = 2):
    from datetime import datetime, timedelta
    today = datetime.utcnow()
    limit_date = today + timedelta(days=days_ahead)
    return db.query(ExpirationAlert).filter(ExpirationAlert.alert_date <= limit_date).all()