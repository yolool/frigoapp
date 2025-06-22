

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from db.session import get_db
from schemas.item import ItemCreate, ItemOut, ItemUpdate
from crud.inventory import (
    create_item,
    get_items,
    get_item_by_id,
    update_item,
    delete_item,
    get_soon_to_expire_items
)
from core.security import get_current_user

router = APIRouter(prefix="/items", tags=["items"])

@router.get("/soon-expired")
def get_soon_expired(
    days_ahead: int = Query(2, description="Nombre de jours avant péremption"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    items = get_soon_to_expire_items(db, current_user.id, days_ahead)
    return items
@router.post("/", response_model=ItemOut)
def create_new_item(
    item: ItemCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return create_item(db, item, current_user.id)


@router.get("/", response_model=list[ItemOut])
def read_all_items(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_items(db, current_user.id)


@router.get("/{item_id}", response_model=ItemOut)
def read_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_item = get_item_by_id(db, item_id, current_user.id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    return db_item


@router.put("/{item_id}", response_model=ItemOut)
def update_existing_item(
    item_id: int,
    item: ItemUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    updated = update_item(db, item_id, item, current_user.id)
    if not updated:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    return updated


@router.delete("/{item_id}")
def delete_existing_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    success = delete_item(db, item_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    return {"message": "Article supprimé"}


