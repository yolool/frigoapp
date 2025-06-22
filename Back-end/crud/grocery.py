

from sqlalchemy.orm import Session, joinedload
from db.models.grocery import GroceryList, GroceryListItem
from schemas.grocery import GroceryListCreate, GroceryListUpdate


def create_grocery_list(db: Session, grocery_list: GroceryListCreate, user_id: int):
    db_list = GroceryList(name=grocery_list.name, user_id=user_id)
    db.add(db_list)
    db.commit()
    db.refresh(db_list)

    for item in grocery_list.items:
        db_item = GroceryListItem(**item.dict(), grocery_list_id=db_list.id)
        db.add(db_item)

    db.commit()
    db.refresh(db_list)
    return db_list


def get_grocery_list(db: Session, grocery_list_id: int, user_id: int):
    return (
        db.query(GroceryList)
        .options(joinedload(GroceryList.items))  # ← Charge les items en même temps
        .filter(GroceryList.id == grocery_list_id)
        .filter(GroceryList.user_id == user_id)
        .first()
    )


def get_all_grocery_lists(db: Session, user_id: int):
    return (
        db.query(GroceryList)
        .filter(GroceryList.user_id == user_id)
        .all()
    )


def add_item_to_grocery_list(db: Session, grocery_list_id: int, item_data):
    db_item = GroceryListItem(**item_data.dict(), grocery_list_id=grocery_list_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def update_grocery_list(db: Session, grocery_list_id: int, grocery_list_update: GroceryListUpdate, user_id: int):
    db_list = get_grocery_list(db, grocery_list_id, user_id)
    if not db_list:
        return None

    db_list.name = grocery_list_update.name or db_list.name

    # Mise à jour des articles
    for item in grocery_list_update.items:
        db_item = (
            db.query(GroceryListItem)
            .filter(GroceryListItem.id == item.id)
            .filter(GroceryListItem.grocery_list_id == grocery_list_id)
            .first()
        )
        if db_item:
            db_item.item_name = item.item_name
            db_item.quantity = item.quantity
            db_item.unit = item.unit
            db_item.checked = item.checked
            db.commit()

    db.commit()
    db.refresh(db_list)
    return db_list


def delete_grocery_list(db: Session, grocery_list_id: int, user_id: int):
    db_list = get_grocery_list(db, grocery_list_id, user_id)
    if not db_list:
        return False

    db.delete(db_list)
    db.commit()
    return True


def update_item_in_grocery_list(db: Session, item_id: int, item_data, user_id: int):
    db_item = (
        db.query(GroceryListItem)
        .join(GroceryList)
        .filter(GroceryListItem.id == item_id)
        .filter(GroceryList.user_id == user_id)
        .first()
    )

    if not db_item:
        return None

    for key, value in item_data.dict(exclude_unset=True).items():
        setattr(db_item, key, value)

    db.commit()
    db.refresh(db_item)
    return db_item

def delete_item_from_grocery_list(db: Session, item_id: int, user_id: int):
    db_item = (
        db.query(GroceryListItem)
        .join(GroceryList)
        .filter(GroceryListItem.id == item_id)
        .filter(GroceryList.user_id == user_id)
        .first()
    )

    if not db_item:
        return False

    db.delete(db_item)
    db.commit()
    return True

