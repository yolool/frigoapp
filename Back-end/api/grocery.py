
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.session import get_db
from schemas.grocery import GroceryListCreate, GroceryList, GroceryListUpdate, GroceryListItemCreate, \
    GroceryListItemUpdate
from crud.grocery import create_grocery_list, get_all_grocery_lists, get_grocery_list, update_grocery_list, \
    delete_grocery_list, add_item_to_grocery_list, delete_item_from_grocery_list, update_item_in_grocery_list
from core.security import get_current_user

router = APIRouter(prefix="/grocerys", tags=["grocerys"])


@router.post("/", response_model=GroceryList)
def create_new_grocery_list(
    grocery_list: GroceryListCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return create_grocery_list(db, grocery_list, current_user.id)


@router.get("/", response_model=list[GroceryList])
def read_all_grocery_lists(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_all_grocery_lists(db, current_user.id)


@router.get("/{grocery_list_id}", response_model=GroceryList)
def read_grocery_list(
    grocery_list_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_list = get_grocery_list(db, grocery_list_id, current_user.id)
    if not db_list:
        raise HTTPException(status_code=404, detail="Liste non trouvée")
    return db_list


@router.put("/{grocery_list_id}", response_model=GroceryList)
def update_existing_grocery_list(
    grocery_list_id: int,
    grocery_list: GroceryListUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    updated = update_grocery_list(db, grocery_list_id, grocery_list, current_user.id)
    if not updated:
        raise HTTPException(status_code=404, detail="Liste non trouvée")
    return updated


@router.delete("/{grocery_list_id}")
def delete_grocery_list_route(
    grocery_list_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    success = delete_grocery_list(db, grocery_list_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Liste non trouvée")
    return {"message": "Liste supprimée"}

@router.post("/{grocery_list_id}/items/")
def add_item_to_list(
    grocery_list_id: int,
    item: GroceryListItemCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    grocery_list = get_grocery_list(db, grocery_list_id, current_user.id)
    if not grocery_list:
        raise HTTPException(status_code=404, detail="Liste non trouvée")


    new_item = add_item_to_grocery_list(db, grocery_list_id, item)

    return {"message": "Article ajouté", "item": new_item}



@router.put("/groceryitems/{item_id}")
def update_item(
    item_id: int,
    item_update: GroceryListItemUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    updated_item = update_item_in_grocery_list(db, item_id, item_update, current_user.id)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Article non trouvé ou non autorisé")
    return {"message": "Article mis à jour", "item": updated_item}


@router.delete("/groceryitems/{item_id}")
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    success = delete_item_from_grocery_list(db, item_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Article non trouvé ou non autorisé")
    return {"message": "Article supprimé"}


