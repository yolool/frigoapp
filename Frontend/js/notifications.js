// notifications.js

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const expiredList = document.getElementById("expiredList");
  const soonExpiredList = document.getElementById("soonExpiredList");

  const produits = JSON.parse(localStorage.getItem("produits")) || [];
  const today = new Date();

  let hasExpired = false;
  let hasSoonExpired = false;

  produits.forEach((produit) => {
    const rawDate = produit.datePeremption || produit.date;
    if (!rawDate) return;

    const [year, month, day] = rawDate.split("-").map(Number);
    const datePeremption = new Date(year, month - 1, day);
    const diffJours = Math.ceil((datePeremption - today) / (1000 * 60 * 60 * 24));

    if (expiredList || soonExpiredList) {
      const li = document.createElement("li");
      li.textContent = `${produit.nom} – ${produit.quantite} unité(s), à consommer avant le ${rawDate}`;

      if (diffJours < 0) {
        li.classList.add("expired");
        expiredList && expiredList.appendChild(li);
        hasExpired = true;
      } else if (diffJours <= 3) {
        li.classList.add("soon-expired");
        soonExpiredList && soonExpiredList.appendChild(li);
        hasSoonExpired = true;
      }
    } else {
      if (diffJours < 0) hasExpired = true;
      if (diffJours <= 3) hasSoonExpired = true;
    }
  });

  const notifLink = document.querySelector(".nav-link[href='notifications.html']");
  const isOnNotificationsPage = window.location.pathname.includes("notifications.html");

  const shouldShowDot = (hasExpired || hasSoonExpired) && !isOnNotificationsPage;

  if (notifLink) {
    const existing = notifLink.querySelector(".notif-indicator");
    if (shouldShowDot) {
      if (!existing) {
        const dot = document.createElement("span");
        dot.className = "notif-indicator";
        notifLink.appendChild(dot);
      }
    } else {
      if (existing) existing.remove();
    }
  }
});