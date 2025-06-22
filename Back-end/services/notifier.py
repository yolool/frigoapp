

import smtplib
from email.mime.text import MIMEText
from datetime import datetime, timedelta
from fastapi import BackgroundTasks
from sqlalchemy.orm import Session

from db.session import get_db
from db.models.item import Item
from db.models.user import User


class Notifier:
    def __init__(self):

        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        self.smtp_user = "adamoulehiane2@gmail.com"
        self.smtp_password = "cpsq eaeq tlkl nfeh"
        self.days_before_expiration = 2

    def send_email(self, to: str, subject: str, body: str) -> bool:

        try:
            msg = MIMEText(body)
            msg["Subject"] = subject
            msg["From"] = self.smtp_user
            msg["To"] = to

            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.sendmail(self.smtp_user, [to], msg.as_string())

            print(f" Email envoyé à {to}")
            return True

        except Exception as e:
            print(f" Échec d'envoi à {to} | Erreur : {str(e)}")
            return False

    def notify_users_of_expiring_items(self, background_tasks: BackgroundTasks):

        db = next(get_db())
        try:
            today = datetime.utcnow()
            limit_date = today + timedelta(days=self.days_before_expiration)


            items = (
                db.query(Item, User)
                .join(User)
                .filter(Item.expiration_date <= limit_date)
                .filter(Item.expiration_date > today)
                .all()
            )

            if not items:
                print(" Aucun produit bientôt périmé trouvé.")
                return

            # Grouper les items par utilisateur
            user_alerts = {}

            for item, user in items:
                if user.id not in user_alerts:
                    user_alerts[user.id] = {"user": user, "items": []}
                user_alerts[user.id]["items"].append(item)


            for alert in user_alerts.values():
                user = alert["user"]
                items = alert["items"]

                subject = " Produits bientôt périmés dans votre frigo"
                body = "Voici la liste des produits qui vont bientôt expirer :\n\n"
                for item in items:
                    body += f"- {item.name} ({item.expiration_date.strftime('%Y-%m-%d')})\n"


                success = self.send_email(user.email, subject, body)

                if success:
                    print(f" Notification envoyée à {user.email}")
                else:
                    print(f" Impossible d'envoyer à {user.email}")

        finally:
            db.close()