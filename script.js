setInterval(async () => {
  try {
    const res = await fetch("status.json");
    const data = await res.json();
    if (data.currentGame && data.currentGame !== "none") {
      window.location.href = data.currentGame + ".html";
    }
  } catch (e) {
    console.error("Erreur de récupération de l'état du jeu");
  }
}, 2000);
