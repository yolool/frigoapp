document.addEventListener("DOMContentLoaded", () => {
  const isNotificationPage = window.location.pathname.includes("notifications.html");
  const notifLink = document.querySelector('a[href="notifications.html"]');
  if (!notifLink) return;

  const produits = JSON.parse(localStorage.getItem("produits")) || [];
  const today = new Date();
  let showAlert = false;

  produits.forEach(produit => {
    const dateStr = produit.date || produit.datePeremption;
    if (!dateStr) return;

    const peremption = new Date(dateStr);
    const diffJours = Math.ceil((peremption - today) / (1000 * 60 * 60 * 24));
    if (diffJours < 0 || diffJours <= 3) {
      showAlert = true;
    }
  });

  // Affichage ou non du point rouge
  const existingDot = notifLink.querySelector(".notif-indicator");

  if (showAlert && !isNotificationPage) {
    if (!existingDot) {
      const dot = document.createElement("span");
      dot.className = "notif-indicator";
      notifLink.appendChild(dot);
    }
  } else {
    if (existingDot) existingDot.remove();
  }
});
