function showSection(id, e) {
  document.querySelectorAll(".content-section").forEach((sec) => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  document.querySelectorAll(".nav-link").forEach((link) => link.classList.remove("active"));
  e.target.classList.add("active");

  document.querySelector(".page-title").textContent = e.target.textContent.trim();
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

function toggleFridge() {
  const fridgeClosed = document.getElementById("fridgeClosed");
  const fridgeOpen = document.getElementById("fridgeOpen");
  const interior = document.getElementById("fridgeInterior");

  const isOpen = !fridgeOpen.classList.contains("hidden");

  fridgeOpen.classList.toggle("hidden", isOpen);
  fridgeClosed.classList.toggle("hidden", !isOpen);
  interior.classList.toggle("hidden", isOpen);
}

// === GESTION DE LA RECHERCHE ===
const alias = {
  carotte: "carottes",
  carottes: "carottes",
  pomme: "pomme",
  pommes: "pomme",
  riz: "riz",
  banane: "banane",
  bananes: "banane",
  oeufs : "oeufs",
  oeuf : "oeufs",
  lait : "lait",
  poisson : "poisson",
  viande :"viande",
  "salade de riz": "salade-riz",
  "salade riz": "salade-riz",
  "saladeriz": "salade-riz",
  "riz salade": "salade-riz"
};

function rechercherAliment() {
  const input = document.getElementById("searchInput");
  const results = document.getElementById("resultatsRecherche");
  const query = input.value.trim().toLowerCase();

  results.innerHTML = "";

  const imageKey = alias[query];
  if (imageKey) {
    const img = document.createElement("img");
    img.src = `assets/${imageKey}.png`;
    img.alt = imageKey;
    img.className = "movable-item";
    img.id = `item-${imageKey}-${Date.now()}`;
    img.style.top = "200px";
    img.style.left = "100px";
    img.style.position = "absolute";
    img.style.zIndex = "1000";
    img.style.width = "100px";
    img.style.height = "auto";
    img.style.objectFit = "contain";
    document.body.appendChild(img);
    rendreDeplacable(img);
    sauvegarderAliments(); // Sauvegarde après ajout
  } else if (query) {
    results.innerHTML = "<p>Aucun résultat trouvé.</p>";
  }
}

// === DRAG & DROP DANS LE FRIGO ===
function rendreDeplacable(el) {
  let isDragging = false;
  let offsetX = 0, offsetY = 0;
  const fridgeZone = document.getElementById("fridgeDropZone");

  el.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    el.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const x = e.pageX - offsetX;
    const y = e.pageY - offsetY;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
  });

  document.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    el.style.cursor = "grab";
    sauvegarderAliments();
  });

  el.addEventListener("dblclick", () => {
    el.remove();
    sauvegarderAliments();
  });
}

function playDropEffect() {
  const audio = document.getElementById("dropSound");
  if (audio) audio.play();
}

function sauvegarderAliments() {
  const items = [...document.querySelectorAll(".movable-item")].map(el => ({
    id: el.id,
    src: el.src,
    left: el.style.left,
    top: el.style.top,
  }));
  localStorage.setItem("fridgeItems", JSON.stringify(items));
}

// === AFFICHAGE DES RÉSULTATS (optionnel) ===
function afficherResultats(liste) {
  const container = document.getElementById("resultatsRecherche");
  container.innerHTML = "";

  if (liste.length === 0) {
    container.innerHTML = "<p>Aucun aliment trouvé.</p>";
    return;
  }

  liste.forEach(aliment => {
    const div = document.createElement("div");
    div.className = "result-card";
    div.innerHTML = `<h3>${aliment.nom}</h3><p>Catégorie : ${aliment.categorie}</p>`;
    container.appendChild(div);
  });
}

// === INITIALISATION DE LA PAGE ===
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (token) {
    fetch("https://api.fridge-manager.com/v1/me", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((user) => {
        document.getElementById("userEmail").textContent = user.email;
        document.getElementById("userName").textContent = `Bienvenue ${user.name || ""} !`;
      })
      .catch(() => logout());
  }

  const savedItems = JSON.parse(localStorage.getItem("fridgeItems")) || [];
  if (window.location.pathname.includes("dashboard.html")) {
    savedItems.forEach(item => {
      const img = document.createElement("img");
      img.src = item.src;
      img.className = "movable-item";
      img.id = item.id;
      img.style.position = "absolute";
      img.style.left = item.left;
      img.style.top = item.top;
      img.style.width = "100px";
      img.style.height = "auto";
      img.style.objectFit = "contain";
      document.body.appendChild(img);
      rendreDeplacable(img);
    });
  }

  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearSearch");

  if (searchInput && clearBtn) {
    searchInput.addEventListener("input", () => {
      clearBtn.classList.toggle("hidden", searchInput.value.trim() === "");
    });

    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      clearBtn.classList.add("hidden");
      document.getElementById("resultatsRecherche").innerHTML = "";
      searchInput.focus();
    });
  }

  const listeAliments = [
    "carottes", "pomme", "pommes", "banane", "bananes", "lait", "viande",
    "riz", "brocoli", "concombre", "yaourt", "tomates", "oeuf", "fromage", "poisson", "salade riz"
  ];

  const input = document.getElementById("searchInput");
  const suggestions = document.getElementById("suggestions");

  input.addEventListener("input", () => {
    const val = input.value.toLowerCase();
    suggestions.innerHTML = "";

    if (!val) {
      suggestions.classList.add("hidden");
      return;
    }

    const filtres = listeAliments.filter(aliment =>
      aliment.toLowerCase().startsWith(val)
    );

    if (filtres.length === 0) {
      suggestions.classList.add("hidden");
      return;
    }

    filtres.forEach(aliment => {
      const li = document.createElement("li");
      li.textContent = aliment;
      li.addEventListener("click", () => {
        input.value = aliment;
        suggestions.classList.add("hidden");
        rechercherAliment();
      });
      suggestions.appendChild(li);
    });

    suggestions.classList.remove("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-bar") && !e.target.closest("#suggestions")) {
      suggestions.classList.add("hidden");
    }
  });
});