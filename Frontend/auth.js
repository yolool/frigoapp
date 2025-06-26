document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  // Gestion du formulaire de connexion
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (email === "" || password === "") {
      document.getElementById("loginError").textContent = "Tous les champs sont obligatoires.";
      return;
    }

    // Simule une connexion (à remplacer par un appel fetch)
    if (email === "user@example.com" && password === "123456") {
      localStorage.setItem("token", "fake-jwt-token");
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("loginError").textContent = "Email ou mot de passe incorrect.";
    }
  });

  // Gestion du formulaire d'inscription
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    if (!name || !email || !password) {
      document.getElementById("registerError").textContent = "Tous les champs sont requis.";
      return;
    }

    // Simule une inscription réussie
    localStorage.setItem("token", "fake-jwt-token");
    window.location.href = "dashboard.html";
  });
});
