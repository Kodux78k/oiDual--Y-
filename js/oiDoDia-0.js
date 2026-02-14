
/* === Tema dinâmico manhã/tarde/noite === */
function updateMood(h){
  const mood = h < 12 ? "manha" : (h < 19 ? "tarde" : "noite");
  document.body.dataset.mood = mood;

  const greeting = mood==="manha"?"Bom dia, Dual":
                   mood==="tarde"?"Boa tarde, Dual":
                   "Boa noite, Dual";

  document.getElementById("heroGreeting").textContent = greeting;

  const subtitle = mood==="manha"?"Sua dose de hoje já está organizada":
                   mood==="tarde"?"Seguimos produtivos na sua tarde":
                   "Noite tranquila para seu 1%";

  document.getElementById("heroSubtitle").textContent = subtitle;

  const moods = {
    manha:"Manhã focada",
    tarde:"Tarde produtiva",
    noite:"Noite tranquila"
  };
  document.getElementById("moodLabel").textContent = moods[mood];

  const rangeFill = document.getElementById("rangeFill");
  const span = (h - 6) / (23-6);
  rangeFill.style.transform = `scaleX(${span})`;
}

/* sincronizar slider */
document.getElementById("timeRange").addEventListener("input", e=>{
  updateMood(parseInt(e.target.value));
});

/* inicial */
updateMood(9);
