const produits = JSON.parse(localStorage.getItem("produits")) || [];
const tableBody = document.querySelector("#produitsTable tbody");
const form = document.getElementById("produitForm");

function getJoursRestants(datePeremption) {
  const aujourdHui = new Date();
  const dateP = new Date(datePeremption);
  const diff = dateP - aujourdHui;
  const jours = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return jours;
}

function afficherProduits() {
  tableBody.innerHTML = "";
  produits.forEach((produit, index) => {
    const joursRestants = getJoursRestants(produit.date);
    const tr = document.createElement("tr");

    let dureeHTML = "";
    if (joursRestants < 0) {
      dureeHTML = `<span style="color: red; font-weight: bold;">&#9888; Produit périmé</span>`; // triangle + texte rouge
    } else {
      dureeHTML = `${joursRestants} j`;
    }

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${produit.nom}</td>
      <td>${produit.quantite}</td>
      <td>${produit.dateAjout}</td>
      <td>${produit.date}</td>
      <td>${dureeHTML}</td>
      <td><button class="btn-modifier" onclick="modifierProduit(${index})">Modifier</button>
          <button class="btn-supprimer" onclick="supprimerProduit(${index})">Supprimer</button></td>
    `;
    tableBody.appendChild(tr);
  });
}


function supprimerProduit(index) {
  produits.splice(index, 1);
  localStorage.setItem("produits", JSON.stringify(produits));
  afficherProduits();
}

function modifierProduit(index) {
  const produit = produits[index];
  const nouveauNom = prompt("Nouveau nom :", produit.nom);
  const nouvelleQuantite = prompt("Nouvelle quantité :", produit.quantite);
  const nouvelleDate = prompt("Nouvelle date de péremption (YYYY-MM-DD) :", produit.date);

  if (nouveauNom && nouvelleQuantite && nouvelleDate) {
    produits[index] = {
      ...produit,
      nom: nouveauNom,
      quantite: parseInt(nouvelleQuantite),
      date: nouvelleDate,
    };
    localStorage.setItem("produits", JSON.stringify(produits));
    afficherProduits();
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nom = document.getElementById("nomProduit").value;
  const quantite = parseInt(document.getElementById("quantiteProduit").value);
  const date = document.getElementById("datePeremption").value;

  // Date du jour (automatique) pour date d’ajout
  const aujourdHui = new Date();
  const dateAjout = aujourdHui.toISOString().split("T")[0]; // format AAAA-MM-JJ

  produits.push({ nom, quantite, dateAjout, date });
  localStorage.setItem("produits", JSON.stringify(produits));
  form.reset();
  afficherProduits();
});


document.addEventListener("DOMContentLoaded", afficherProduits);
