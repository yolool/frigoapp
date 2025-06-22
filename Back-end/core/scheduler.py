
from apscheduler.schedulers.background import BackgroundScheduler



scheduler = BackgroundScheduler()


def start_scheduler(app, notifier):
    from datetime import datetime
    from fastapi import BackgroundTasks

    def scheduled_job():
        print(f" Vérification quotidienne des produits expirant bientôt ({datetime.now()})")
        try:
            notifier.notify_users_of_expiring_items(BackgroundTasks())
        except Exception as e:
            print(f" Erreur lors de la vérification quotidienne : {e}")


    scheduler.add_job(scheduled_job, 'interval', hours=24)

    if not scheduler.running:
        scheduler.start()
        print(" Planificateur démarré : Notifications quotidiennes activées")