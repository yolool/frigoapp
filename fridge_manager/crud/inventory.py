

from sqlalchemy.orm import Session
from db.models.item import Item
from schemas.item import ItemCreate, ItemUpdate


def create_item(db: Session, item: ItemCreate, user_id: int):
    db_item = Item(**item.dict(), user_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_items(db: Session, user_id: int):
    return db.query(Item).filter(Item.user_id == user_id).all()


def get_item_by_id(db: Session, item_id: int, user_id: int):
    return (
        db.query(Item)
        .filter(Item.id == item_id)
        .filter(Item.user_id == user_id)
        .first()
    )


def update_item(db: Session, item_id: int, item_update: ItemUpdate, user_id: int):
    db_item = get_item_by_id(db, item_id, user_id)
    if not db_item:
        return None

    for key, value in item_update.dict(exclude_unset=True).items():
        setattr(db_item, key, value)

    db.commit()
    db.refresh(db_item)
    return db_item


def delete_item(db: Session, item_id: int, user_id: int):
    db_item = get_item_by_id(db, item_id, user_id)
    if not db_item:
        return False

    db.delete(db_item)
    db.commit()
    return True


def get_soon_to_expire_items(db: Session, user_id: int, days_ahead: int = 2):
    from datetime import datetime, timedelta

    today = datetime.utcnow()
    limit_date = today + timedelta(days=days_ahead)

    return (
        db.query(Item)
        .filter(Item.user_id == user_id)
        .filter(Item.expiration_date <= limit_date)
        .filter(Item.expiration_date > today)
        .all()
    )