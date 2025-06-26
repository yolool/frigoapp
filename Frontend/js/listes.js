const listes = JSON.parse(localStorage.getItem("listes")) || [];

const form = document.getElementById("listeForm");
const nomInput = document.getElementById("nomListe");
const contenuInput = document.getElementById("contenuListe");
const tableHead = document.getElementById("liste-noms");
const tableContenus = document.getElementById("liste-contenus");
const tableDates = document.getElementById("liste-dates");
const toutSupprimerBtn = document.getElementById("toutSupprimerBtn");


function afficherListes() {
  tableHead.innerHTML = "";
  tableContenus.innerHTML = "";
  tableDates.innerHTML = "";

  listes.forEach((liste, index) => {
    // Nom de la liste + actions
    const th = document.createElement("th");
    th.innerHTML = `
      ${liste.nom}
      <br />
      <button class="btn-modifier" onclick="modifierListe(${index})">✏️</button>
      <button class="btn-supprimer" onclick="supprimerListe(${index})">🗑️</button>
    `;
    tableHead.appendChild(th);

    // Contenu sous forme de checkbox
    const tdContenu = document.createElement("td");
    const ul = document.createElement("ul");

    liste.contenu.split("\n").forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <label class="custom-checkbox">
          <input type="checkbox" class="check-item">
          <span class="liste-item">${item}</span>
        </label>
      `;
      ul.appendChild(li);
    });

    tdContenu.appendChild(ul);
    tableContenus.appendChild(tdContenu);

    // Date
    const tdDate = document.createElement("td");
    tdDate.textContent = liste.date;
    tableDates.appendChild(tdDate);
  });

  // Activer le barré sur les checkbox
  document.querySelectorAll(".check-item").forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const span = e.target.nextElementSibling;
      span.classList.toggle("checked", e.target.checked);
    });
  });
}


function modifierElement(index, i) {
  const ancienContenu = listes[index].contenu.split("\n");
  const nouveauTexte = prompt("Modifier l’élément :", ancienContenu[i]);
  if (nouveauTexte !== null && nouveauTexte.trim() !== "") {
    ancienContenu[i] = nouveauTexte.trim();
    listes[index].contenu = ancienContenu.join("\n");
    localStorage.setItem("listes", JSON.stringify(listes));
    afficherListes();
  }
}

function supprimerElement(index, i) {
  const contenuActuel = listes[index].contenu.split("\n");
  contenuActuel.splice(i, 1);
  listes[index].contenu = contenuActuel.join("\n");
  localStorage.setItem("listes", JSON.stringify(listes));
  afficherListes();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nom = nomInput.value.trim();
  const contenu = contenuInput.value.trim();
  if (!nom || !contenu) return;

  const date = new Date().toLocaleDateString();
  listes.push({ nom, contenu, date });
  localStorage.setItem("listes", JSON.stringify(listes));
  form.reset();
  afficherListes();
});

toutSupprimerBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (confirm("Voulez-vous vraiment supprimer toutes les listes ?")) {
    localStorage.removeItem("listes");
    listes.length = 0;
    afficherListes();
  }
});

function modifierListe(index) {
  const ancienneListe = listes[index];
  const nouveauNom = prompt("Modifier le nom de la liste :", ancienneListe.nom);
  const nouveauContenu = prompt("Modifier le contenu de la liste :", ancienneListe.contenu);

  if (nouveauNom && nouveauContenu) {
    listes[index].nom = nouveauNom.trim();
    listes[index].contenu = nouveauContenu.trim();
    localStorage.setItem("listes", JSON.stringify(listes));
    afficherListes();
  }
}

function supprimerListe(index) {
  if (confirm("Supprimer cette liste ?")) {
    listes.splice(index, 1);
    localStorage.setItem("listes", JSON.stringify(listes));
    afficherListes();
  }
}


document.addEventListener("DOMContentLoaded", afficherListes);
