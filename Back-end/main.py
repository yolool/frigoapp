# main.py

from fastapi import FastAPI, Depends
from api.users import router as users_router
from api.inventory import router as inventory_router
from api.expiration import router as expiration_router
from api.grocery import router as grocery_router
from core.scheduler import start_scheduler, scheduler

app = FastAPI()



app.include_router(users_router)
app.include_router(inventory_router)
app.include_router(expiration_router)
app.include_router(grocery_router)


@app.get("/")
def read_root():
    return {"message": "Welcome to Fridge Manager API"}


from services.notifier import Notifier

notifier = Notifier()


@app.on_event("startup")
async def startup_event():

    try:
        start_scheduler(app, notifier)
        print("Planificateur démarré : Notifications quotidiennes activées")
    except Exception as e:
        print(f" Échec de démarrage du planificateur : {e}")


@app.on_event("shutdown")
async def shutdown_event():
    try:
        if scheduler.running:
            scheduler.shutdown()
        print(" Planificateur arrêté")
    except Exception as e:
        print(f" Échec d'arrêt du planificateur : {e}")