const rewards=[{visits:3,label:"Café de la casa"},{visits:6,label:"Entrante para compartir"},{visits:10,label:"Cena para dos"}];
let visits=Number(localStorage.getItem("mesa-viva-visits")||4);
const nameInput=document.querySelector("#name");
const cardName=document.querySelector("#card-name");
function render(){
  const row=document.querySelector("#visit-row"); row.innerHTML="";
  for(let i=1;i<=10;i++){const dot=document.createElement("i");dot.textContent=i;if(i<=visits)dot.className="filled";row.append(dot)}
  document.querySelector("#visit-count").textContent=`${visits} ${visits===1?"visita":"visitas"}`;
  const next=rewards.find(r=>r.visits>visits);
  document.querySelector("#next-reward").textContent=next?`Próximo premio: ${next.label}`:"¡Todas las recompensas desbloqueadas!";
  document.querySelectorAll("[data-visits]").forEach(card=>{const needed=Number(card.dataset.visits),open=visits>=needed;card.classList.toggle("unlocked",open);card.querySelector("small").textContent=open?"DESBLOQUEADO":`${needed} VISITAS`});
}
nameInput.addEventListener("input",()=>{cardName.textContent=nameInput.value.trim()||"Invitado"});
document.querySelector("#add-visit").addEventListener("click",()=>{visits=Math.min(10,visits+1);localStorage.setItem("mesa-viva-visits",visits);render()});
document.querySelector("#register-form").addEventListener("submit",event=>{event.preventDefault();cardName.textContent=nameInput.value.trim();event.currentTarget.hidden=true;document.querySelector("#success-copy").textContent=`Hola, ${nameInput.value.trim()}. Tu tarjeta digital ya está activa en este dispositivo.`;document.querySelector("#success").hidden=false;localStorage.setItem("mesa-viva-name",nameInput.value.trim())});
document.querySelector("#google-wallet").addEventListener("click",()=>{document.querySelector("#wallet-note").hidden=false});
const savedName=localStorage.getItem("mesa-viva-name");if(savedName){nameInput.value=savedName;cardName.textContent=savedName}render();
