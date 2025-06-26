// === DONNÉES DES RECETTES ===
const recettesData = [
  {
    "nom": "Salade de riz",
    "image": "salade-riz.png",
    "ingredients": ["riz", "thon", "maïs", "tomates", "œufs durs", "vinaigrette"],
    "etapes": [
      "Fais cuire le riz et laisse-le refroidir.",
      "Coupe les tomates et les œufs durs en morceaux.",
      "Dans un saladier, mélange le riz, le maïs, le thon émietté, les tomates et les œufs.",
      "Ajoute la vinaigrette, mélange bien et mets au frais avant de servir."
    ]
  },
  {
    "nom": "Omelette aux légumes",
    "image": "omelette-legumes.png",
    "ingredients": ["œufs", "poivrons", "oignons", "sel", "poivre", "huile"],
    "etapes": [
      "Bats les œufs dans un bol avec du sel et du poivre.",
      "Fais revenir les légumes dans une poêle avec un peu d'huile.",
      "Verse les œufs battus sur les légumes et laisse cuire à feu doux.",
      "Retourne l'omelette à mi-cuisson, puis sers chaud."
    ]
  },
  {
    "nom": "Pasta Carbonara",
    "image": "pasta-carbonara.png",
    "ingredients": ["spaghetti", "œufs", "parmesan", "lardons", "poivre", "ail"],
    "etapes": [
      "Fais cuire les pâtes selon les instructions du paquet.",
      "Dans une poêle, fais revenir les lardons jusqu'à ce qu'ils soient dorés.",
      "Mélange les œufs avec le parmesan râpé dans un bol.",
      "Égoute les pâtes et mélange immédiatement avec les œufs et le fromage.",
      "Ajoute les lardons et serve aussitôt."
    ]
  },
  {
    "nom": "Ratatouille",
    "image": "ratatouille.png",
    "ingredients": ["aubergines", "courgettes", "tomates", "poivrons", "oignons", "ail", "herbes de Provence"],
    "etapes": [
      "Coupe tous les légumes en dés de taille similaire.",
      "Fais revenir l'oignon et l'ail dans une grande poêle.",
      "Ajoute les aubergines et laisse cuire 5 minutes.",
      "Incorpore les courgettes, poivrons et tomates.",
      "Assaisonne avec les herbes de Provence, sel et poivre.",
      "Laisse mijoter 20-25 minutes à feu doux."
    ]
  },
  {
    "nom": "Quiche Lorraine",
    "image": "quiche-lorraine.png",
    "ingredients": ["pâte brisée", "œufs", "crème fraîche", "lardons", "gruyère", "sel", "poivre", "muscade"],
    "etapes": [
      "Préchauffez le four à 200°C.",
      "Étalez la pâte dans un moule à tarte.",
      "Faites revenir les lardons dans une poêle.",
      "Battez les œufs avec la crème, sel, poivre et muscade.",
      "Répartissez les lardons et le gruyère sur la pâte.",
      "Versez l'appareil œufs-crème par-dessus.",
      "Enfournez 30-35 minutes jusqu'à ce que le dessus soit doré."
    ]
  }
];

// === VARIABLES GLOBALES ===
let recettesActuelles = [];

// === INITIALISATION ===
document.addEventListener("DOMContentLoaded", () => {
  initializeEventListeners();
  loadRecettesClassiques();
});

// === GESTION DES ÉVÉNEMENTS ===
function initializeEventListeners() {
  const btnClassiques = document.getElementById("btnClassiques");
  const btnFrigo = document.getElementById("btnFrigo");
  const searchBtn = document.getElementById("searchRecettesBtn");
  const searchInput = document.getElementById("searchIngredients");
  const closeModal = document.getElementById("closeModal");

  // Navigation entre les sections
  btnClassiques.addEventListener("click", () => {
    showSection("classiques");
  });

  btnFrigo.addEventListener("click", () => {
    showSection("frigo");
  });

  // Recherche d'ingrédients
  searchBtn.addEventListener("click", genererRecettesAvecFrigo);
  
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      genererRecettesAvecFrigo();
    }
  });

  // Fermeture de la modale
  closeModal.addEventListener("click", fermerModale);

  // Fermeture modale en cliquant à l'extérieur
  document.addEventListener("click", (e) => {
    const modal = document.getElementById("recetteModal");
    const content = document.querySelector(".modal-content");

    if (!modal.classList.contains("hidden") && 
        !content.contains(e.target) && 
        !e.target.closest(".recette-card")) {
      fermerModale();
    }
  });
}

// === NAVIGATION ENTRE SECTIONS ===
function showSection(section) {
  const btnClassiques = document.getElementById("btnClassiques");
  const btnFrigo = document.getElementById("btnFrigo");
  const sectionClassiques = document.getElementById("recettesClassiques");
  const sectionFrigo = document.getElementById("recettesFrigo");

  if (section === "classiques") {
    btnClassiques.classList.add("active");
    btnFrigo.classList.remove("active");
    sectionClassiques.classList.remove("hidden");
    sectionFrigo.classList.add("hidden");
    loadRecettesClassiques();
  } else {
    btnFrigo.classList.add("active");
    btnClassiques.classList.remove("active");
    sectionFrigo.classList.remove("hidden");
    sectionClassiques.classList.add("hidden");
    genererRecettesAvecFrigo();
  }
}

// === CHARGEMENT DES RECETTES CLASSIQUES ===
function loadRecettesClassiques() {
  const container = document.getElementById("classiquesContainer");
  recettesActuelles = [...recettesData];
  afficherRecettes(recettesActuelles, container);
}

// === AFFICHAGE DES RECETTES ===
function afficherRecettes(recettes, container) {
  container.innerHTML = "";

  if (recettes.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <h3>Aucune recette trouvée</h3>
        <p>Essayez avec d'autres ingrédients</p>
      </div>
    `;
    return;
  }

  recettes.forEach((recette, index) => {
    const card = createRecetteCard(recette, index);
    container.appendChild(card);
  });
}

// === CRÉATION D'UNE CARTE DE RECETTE ===
function createRecetteCard(recette, index) {
  const card = document.createElement("div");
  card.className = "recette-card";
  card.setAttribute("data-index", index);

  const imageSrc = `assets/${recette.image}`;
  const placeholderSVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDIwMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjVGN0ZBIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+SW1hZ2UgaW5kaXNwb25pYmxlPC90ZXh0Pgo8L3N2Zz4K';

  card.innerHTML = `
    <img src="${imageSrc}" alt="${recette.nom}" onerror="this.src='${placeholderSVG}'" />
    <h3>${recette.nom}</h3>
  `;

  card.addEventListener("click", () => {
    ouvrirModale(recette);
  });

  return card;
}

// === GÉNÉRATION DE RECETTES AVEC FRIGO ===
function genererRecettesAvecFrigo() {
  const searchInput = document.getElementById("searchIngredients");
  const frigoContainer = document.getElementById("frigoSuggestions");
  const ingredient = searchInput.value.toLowerCase().trim();

  if (!ingredient) {
    // Afficher toutes les recettes si pas de recherche
    recettesActuelles = [...recettesData];
    afficherRecettes(recettesActuelles, frigoContainer);
    return;
  }

  // Filtrer les recettes qui contiennent l'ingrédient recherché
  const recettesFiltrees = recettesData.filter(recette => 
    recette.ingredients.some(ing => 
      ing.toLowerCase().includes(ingredient)
    )
  );

  recettesActuelles = recettesFiltrees;
  
  if (recettesFiltrees.length === 0) {
    frigoContainer.innerHTML = `
      <div class="no-results">
        <h3>Aucune recette trouvée avec "${ingredient}"</h3>
        <p>Essayez avec un autre ingrédient comme : œufs, tomates, riz, etc.</p>
      </div>
    `;
  } else {
    afficherRecettes(recettesFiltrees, frigoContainer);
  }
}

// === GESTION DE LA MODALE ===
function ouvrirModale(recette) {
  const modal = document.getElementById("recetteModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalImage = document.getElementById("modalImage");
  const modalIngredients = document.getElementById("modalIngredients");
  const modalInstructions = document.getElementById("modalInstructions");

  // Remplir les informations de la modale
  modalTitle.textContent = recette.nom;
  
  // Gestion de l'image avec fallback
  const imageSrc = `assets/${recette.image}`;
  const placeholderSVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjVGN0ZBIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTI1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkltYWdlIGluZGlzcG9uaWJsZTwvdGV4dD4KPHN2Zz4K';
  
  modalImage.src = imageSrc;
  modalImage.alt = recette.nom;
  modalImage.onerror = function() {
    this.src = placeholderSVG;
  };

  // Afficher les ingrédients
  modalIngredients.innerHTML = recette.ingredients
    .map((ingredient) => `<li>${ingredient}</li>`)
    .join("");

  // Afficher les étapes
  modalInstructions.innerHTML = recette.etapes
    .map((etape, index) => `<p><strong>Étape ${index + 1}:</strong> ${etape}</p>`)
    .join("");

  // Afficher la modale
  modal.classList.remove("hidden");
  
  // Empêcher le scroll du body
  document.body.style.overflow = "hidden";
}

function fermerModale() {
  const modal = document.getElementById("recetteModal");
  modal.classList.add("hidden");
  
  // Réactiver le scroll du body
  document.body.style.overflow = "auto";
}

// === FONCTIONS UTILITAIRES ===
function logout() {
  if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
    // Ici vous pouvez ajouter la logique de déconnexion
    alert("Déconnexion effectuée");
    // window.location.href = "login.html";
  }
}

// === CHARGEMENT DEPUIS UN FICHIER JSON (OPTIONNEL) ===
function chargerRecettesDepuisJSON() {
  fetch("data/recettes.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Impossible de charger les recettes");
      }
      return response.json();
    })
    .then(recettes => {
      // Remplacer les données par celles du fichier JSON
      recettesData.length = 0;
      recettesData.push(...recettes);
      
      // Recharger l'affichage
      loadRecettesClassiques();
    })
    .catch(error => {
      console.error("Erreur lors du chargement des recettes:", error);
      // Utiliser les données par défaut en cas d'erreur
    });
}

// === FONCTIONS D'EXPORT (POUR USAGE EXTERNE) ===
window.RecettesManager = {
  chargerRecettes: chargerRecettesDepuisJSON,
  ajouterRecette: function(recette) {
    recettesData.push(recette);
    loadRecettesClassiques();
  },
  obtenirRecettes: function() {
    return [...recettesData];
  }
};