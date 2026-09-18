"use strict";

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const vis = (el, på) => { el.hidden = !på; };

// Områdene ett passord kan åpne. Vault og admin deler passord, ringeliste har
// sitt eget, så vi prøver alle tre og låser opp dem som svarer ja.
const OMRÅDER = ["admin", "vault", "ringeliste"];

// --- Søk -----------------------------------------------------------------

function filtrer() {
  const søk = $("#sok").value.trim().toLowerCase();
  let treff = 0;
  for (const kort of $$(".kort-lenke")) {
    const passer = !søk || kort.textContent.toLowerCase().includes(søk);
    vis(kort, passer);
    if (passer) treff++;
  }
  // Skjul en gruppe som ikke har noen synlige kort igjen.
  for (const gruppe of $$("[data-gruppe]")) {
    if (gruppe.id === "mine" && !mineSider.length) continue;
    vis(gruppe, gruppe.querySelectorAll(".kort-lenke:not([hidden])").length > 0);
  }
  vis($("#tomt"), treff === 0);
}

$("#sok").addEventListener("input", filtrer);

$("#sok").addEventListener("keydown", e => {
  if (e.key === "Escape") { $("#sok").value = ""; filtrer(); return; }
  // Enter åpner det første treffet, så søkefeltet blir en hurtigvelger.
  if (e.key === "Enter") {
    const første = $(".kort-lenke:not([hidden])");
    if (første) første.click();
  }
});

// «/» hopper til søkefeltet, som i de fleste andre søkbare sider.
document.addEventListener("keydown", e => {
  if (e.key === "/" && document.activeElement !== $("#sok")) {
    e.preventDefault();
    $("#sok").focus();
  }
});

// --- Lukkede sider -------------------------------------------------------

let mineSider = [];

function tegnMine() {
  $("#mine-kort").innerHTML = mineSider.map(s => `
    <a class="kort-lenke" href="${attr(s.sti)}">
      <span class="kort-tittel">${esc(s.tittel)}</span>
      <span class="kort-tekst">${esc(s.tekst)}</span>
      <span class="kort-sti">${esc(s.sti)}</span>
    </a>`).join("");
  vis($("#mine"), mineSider.length > 0);
  vis($("#logg-ut"), mineSider.length > 0);
  vis($("#laas-opp"), mineSider.length === 0);
}

async function hentStatus() {
  try {
    const svar = await fetch("/api/status");
    const data = await svar.json();
    mineSider = data.sider || [];
  } catch {
    mineSider = [];
  }
  tegnMine();
}

// --- Inn- og utlogging ---------------------------------------------------

$("#laas-opp").addEventListener("click", () => {
  vis($("#login"), true);
  $("#passord").focus();
});

$("#avbryt").addEventListener("click", () => {
  vis($("#login"), false);
  $("#passord").value = "";
  vis($("#login-feil"), false);
});

$("#login").addEventListener("submit", async e => {
  e.preventDefault();
  const feil = $("#login-feil");
  vis(feil, false);
  const passord = $("#passord").value;

  // Passordet prøves mot hvert område. Ett passord kan åpne flere, så vi
  // stopper ikke ved første treff.
  let noen = false;
  for (const område of OMRÅDER) {
    const svar = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ område, passord }),
    }).catch(() => null);
    if (svar && svar.ok) noen = true;
  }

  $("#passord").value = "";
  if (!noen) {
    feil.textContent = "Passordet passet ingen av sidene.";
    vis(feil, true);
    return;
  }
  vis($("#login"), false);
  await hentStatus();
  filtrer();
});

$("#logg-ut").addEventListener("click", async () => {
  for (const område of OMRÅDER) {
    await fetch("/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ område }),
    }).catch(() => {});
  }
  await hentStatus();
  filtrer();
});

// --- Småverktøy ----------------------------------------------------------

function esc(t) {
  return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function attr(t) {
  return esc(t).replace(/"/g, "&quot;");
}

hentStatus();
