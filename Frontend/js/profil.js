document.addEventListener("DOMContentLoaded", () => {
  // Charger depuis localStorage ou valeurs par défaut
  const utilisateur = JSON.parse(localStorage.getItem("utilisateur")) || {
    nom: "Jean Dupont",
    email: "jean.dupont@example.com",
    dateInscription: "01 avril 2024",
    gaspillageEvite: 18,
    gaspillageRealise: 4,
    photoProfil: "assets/default-profile.png",
  };

  const tauxReussite = Math.round(
    (utilisateur.gaspillageEvite /
      (utilisateur.gaspillageEvite + utilisateur.gaspillageRealise)) *
      100
  );

  // Sélection des éléments
  const nomSpan = document.getElementById("profilNom");
  const emailSpan = document.getElementById("profilEmail");
  const dateSpan = document.getElementById("profilDate");
  const eviteSpan = document.getElementById("statEvite");
  const gaspilleSpan = document.getElementById("statRealise");
  const tauxSpan = document.getElementById("statTaux");
  const image = document.getElementById("profileImage");
  const modifierBtn = document.getElementById("modifierBtn");

  // Injection des données
  nomSpan.textContent = utilisateur.nom;
  emailSpan.textContent = utilisateur.email;
  dateSpan.textContent = utilisateur.dateInscription;
  eviteSpan.textContent = `${utilisateur.gaspillageEvite} produit(s)`;
  gaspilleSpan.textContent = `${utilisateur.gaspillageRealise} produit(s)`;
  tauxSpan.textContent = `${tauxReussite}%`;
  image.src = utilisateur.photoProfil;

  // Mode édition
  let modeEdition = false;

  modifierBtn.addEventListener("click", () => {
    if (!modeEdition) {
      // Passage en mode édition
      nomSpan.innerHTML = `<input type="text" id="inputNom" value="${utilisateur.nom}" />`;
      emailSpan.innerHTML = `<input type="email" id="inputEmail" value="${utilisateur.email}" />`;
      modifierBtn.textContent = "💾 Enregistrer";
      modeEdition = true;
    } else {
      // Enregistrement
      const newNom = document.getElementById("inputNom").value.trim();
      const newEmail = document.getElementById("inputEmail").value.trim();

      if (newNom && newEmail) {
        utilisateur.nom = newNom;
        utilisateur.email = newEmail;
        localStorage.setItem("utilisateur", JSON.stringify(utilisateur));

        nomSpan.textContent = newNom;
        emailSpan.textContent = newEmail;
        modifierBtn.textContent = "✏️ Modifier";
        modeEdition = false;
      } else {
        alert("Veuillez remplir les deux champs.");
      }
    }
  });

  // Changement de photo
  document.getElementById("photoInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      image.src = e.target.result;
      utilisateur.photoProfil = e.target.result;
      localStorage.setItem("utilisateur", JSON.stringify(utilisateur));
    };
    reader.readAsDataURL(file);
  });
});
