const rewards = [
  { visits: 3, label: "Café de la casa" },
  { visits: 6, label: "Entrante para compartir" },
  { visits: 10, label: "Cena para dos" },
];

const memberId = "MV-0248";
const visitsKey = "mesa-viva-" + memberId + "-visits-v2";
const nameKey = "mesa-viva-" + memberId + "-name-v2";
const profileKey = "mesa-viva-" + memberId + "-profile-v3";
let visits = Math.max(0, Math.min(10, Number(localStorage.getItem(visitsKey) || 0)));
const nameInput = document.querySelector("#name");
const surnameInput = document.querySelector("#surname");
const emailInput = document.querySelector("#email");
const birthdayInput = document.querySelector("#birthday");
const optinInput = document.querySelector("#notifications-optin");
const cardName = document.querySelector("#card-name");

function fullName() {
  return [nameInput.value.trim(), surnameInput.value.trim()].filter(Boolean).join(" ") || "Invitado";
}

function render() {
  const row = document.querySelector("#visit-row");
  row.innerHTML = "";
  for (let i = 1; i <= 10; i += 1) {
    const dot = document.createElement("i");
    dot.textContent = i;
    if (i <= visits) dot.className = "filled";
    row.append(dot);
  }
  document.querySelector("#visit-count").textContent = visits + " " + (visits === 1 ? "visita" : "visitas");
  const next = rewards.find((reward) => reward.visits > visits);
  document.querySelector("#next-reward").textContent = next ? "Próximo premio: " + next.label : "¡Todas las recompensas disponibles!";
  document.querySelectorAll("[data-visits]").forEach((card) => {
    const needed = Number(card.dataset.visits);
    const open = visits >= needed;
    card.classList.toggle("unlocked", open);
    card.querySelector("small").textContent = open ? "DISPONIBLE" : needed + " VISITAS";
  });
  const registeredVisits = document.querySelector("#registered-visits");
  if (registeredVisits) registeredVisits.textContent = visits + " " + (visits === 1 ? "visita" : "visitas") + " · Socio " + memberId;
  const cardStatus = document.querySelector("#card-status");
  if (cardStatus) cardStatus.textContent = visits + " " + (visits === 1 ? "visita registrada" : "visitas registradas") + ". El personal actualiza las visitas al escanear tu QR.";
  const rewardNotice = document.querySelector("#reward-notice");
  if (rewardNotice) rewardNotice.textContent = next ? next.label + " al completar " + next.visits + " visitas." : "Todas las recompensas están disponibles.";
}

function revealMemberArea() {
  document.querySelectorAll(".member-zone").forEach((section) => { section.hidden = false; });
  document.querySelector("#nav-card-link").href = "#mi-tarjeta";
  const heroAction = document.querySelector("#hero-action");
  heroAction.href = "#mi-tarjeta";
  heroAction.textContent = "Ver mi tarjeta";
}

function showConfirmed(profile) {
  const name = (profile.name + " " + profile.surname).trim();
  nameInput.value = profile.name;
  surnameInput.value = profile.surname;
  emailInput.value = profile.email;
  birthdayInput.value = profile.birthday;
  optinInput.checked = Boolean(profile.notifications);
  cardName.textContent = name;
  document.querySelector("#registered-name").textContent = name;
  document.querySelector("#success-title").textContent = "¡Bienvenido, " + name + "!";
  document.querySelector("#success-copy").textContent = "Tu tarjeta digital está activa y estos son tus avisos actuales.";
  document.querySelector("#birthday-notice").textContent = "Postre de la casa gratis durante tu semana de cumpleaños.";
  document.querySelector("#club-notice-status").textContent = profile.notifications ? "Avisos de recompensas y cumpleaños activados en este dispositivo." : "Los avisos están desactivados. Puedes activarlos cuando quieras.";
  document.querySelector("#register-form").hidden = true;
  document.querySelector("#success").hidden = false;
  revealMemberArea();
  render();
}

[nameInput, surnameInput].forEach((field) => field.addEventListener("input", () => { cardName.textContent = fullName(); }));

document.querySelector("#register-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const profile = {
    name: nameInput.value.trim(),
    surname: surnameInput.value.trim(),
    email: emailInput.value.trim(),
    birthday: birthdayInput.value,
    notifications: optinInput.checked,
  };
  visits = 0;
  localStorage.setItem(visitsKey, "0");
  localStorage.setItem(nameKey, (profile.name + " " + profile.surname).trim());
  localStorage.setItem(profileKey, JSON.stringify(profile));
  showConfirmed(profile);
  document.querySelector("#success").scrollIntoView({ behavior: "smooth", block: "start" });
});

const notificationButton = document.querySelector("#enable-notifications");
notificationButton.addEventListener("click", async () => {
  const output = document.querySelector("#notification-status");
  if (!("Notification" in window)) {
    output.textContent = "Este navegador no permite notificaciones. Los avisos seguirán visibles en tu tarjeta.";
    return;
  }
  let permission = Notification.permission;
  if (permission === "default") permission = await Notification.requestPermission();
  if (permission === "granted") {
    const profile = JSON.parse(localStorage.getItem(profileKey) || "{}");
    profile.notifications = true;
    localStorage.setItem(profileKey, JSON.stringify(profile));
    optinInput.checked = true;
    document.querySelector("#club-notice-status").textContent = "Avisos de recompensas y cumpleaños activados en este dispositivo.";
    output.textContent = "Notificaciones activadas correctamente.";
    new Notification("Mesa Viva", { body: "Tu tarjeta está activa. Próximo premio: Café de la casa con 3 visitas." });
  } else {
    output.textContent = "No se activaron las notificaciones. Puedes permitirlas desde los ajustes del navegador.";
  }
});

const walletUrl = window.MESA_VIVA_WALLET_URL || "";
const walletReady = /^https:\/\/pay\.google\.com\/gp\/v\/save\//.test(walletUrl);
const walletButton = document.querySelector("#google-wallet");
walletButton.addEventListener("click", () => {
  if (walletReady) { window.location.assign(walletUrl); return; }
  document.querySelector("#wallet-note").hidden = false;
});
if (walletReady) {
  const qr = document.querySelector("#wallet-qr");
  const link = document.querySelector("#wallet-link");
  if (window.MESA_VIVA_WALLET_QR) qr.src = window.MESA_VIVA_WALLET_QR;
  link.href = walletUrl;
  link.textContent = "Añadir a Google Wallet sin escanear";
  document.querySelector("#qr-title").textContent = "Escanea para añadirla a Google Wallet";
  document.querySelector("#qr-description").textContent = "El código abre el pase oficial de Mesa Viva en Google Wallet.";
}

window.addEventListener("storage", (event) => {
  if (event.key === visitsKey) {
    visits = Math.max(0, Math.min(10, Number(event.newValue) || 0));
    render();
  }
});

try {
  const savedProfile = JSON.parse(localStorage.getItem(profileKey) || "null");
  if (savedProfile && savedProfile.name && savedProfile.surname && savedProfile.email && savedProfile.birthday) showConfirmed(savedProfile);
} catch {}
render();
