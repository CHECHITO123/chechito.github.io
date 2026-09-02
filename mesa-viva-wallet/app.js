const rewards = [
  { visits: 3, label: "Café de la casa" },
  { visits: 6, label: "Entrante para compartir" },
  { visits: 10, label: "Cena para dos" },
];

const memberId = "MV-0248";
const visitsKey = `mesa-viva-${memberId}-visits-v2`;
const nameKey = `mesa-viva-${memberId}-name-v2`;
let visits = Math.max(
  0,
  Math.min(10, Number(localStorage.getItem(visitsKey) || 0)),
);
const nameInput = document.querySelector("#name");
const cardName = document.querySelector("#card-name");

function render() {
  const row = document.querySelector("#visit-row");
  row.innerHTML = "";
  for (let i = 1; i <= 10; i += 1) {
    const dot = document.createElement("i");
    dot.textContent = i;
    if (i <= visits) dot.className = "filled";
    row.append(dot);
  }
  document.querySelector("#visit-count").textContent =
    `${visits} ${visits === 1 ? "visita" : "visitas"}`;
  const next = rewards.find((reward) => reward.visits > visits);
  document.querySelector("#next-reward").textContent = next
    ? `Próximo premio: ${next.label}`
    : "¡Todas las recompensas desbloqueadas!";
  document.querySelectorAll("[data-visits]").forEach((card) => {
    const needed = Number(card.dataset.visits);
    const open = visits >= needed;
    card.classList.toggle("unlocked", open);
    card.querySelector("small").textContent = open
      ? "DISPONIBLE"
      : `${needed} VISITAS`;
  });
}

nameInput.addEventListener("input", () => {
  cardName.textContent = nameInput.value.trim() || "Invitado";
});

document.querySelector("#register-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = nameInput.value.trim() || "Invitado";
  cardName.textContent = name;
  event.currentTarget.hidden = true;
  document.querySelector("#success-copy").textContent =
    `Hola, ${name}. Tu tarjeta digital ya está activa en este dispositivo.`;
  document.querySelector("#success").hidden = false;
  localStorage.setItem(nameKey, name);
});

document.querySelector("#google-wallet").addEventListener("click", () => {
  document.querySelector("#wallet-note").hidden = false;
});

window.addEventListener("storage", (event) => {
  if (event.key === visitsKey) {
    visits = Math.max(0, Math.min(10, Number(event.newValue) || 0));
    render();
  }
});

const savedName = localStorage.getItem(nameKey);
if (savedName) {
  nameInput.value = savedName;
  cardName.textContent = savedName;
}
render();
