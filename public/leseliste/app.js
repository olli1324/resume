"use strict";

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const vis = (el, på) => { el.hidden = !på; };

let lenker = [];
let fane = "ulest";
let valgtMerke = null;

// --- Innlogging ----------------------------------------------------------

$("#login-form").addEventListener("submit", async e => {
  e.preventDefault();
  const feil = $("#login-feil");
  vis(feil, false);
  const svar = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ område: "leseliste", passord: $("#passord").value }),
  });
  if (!svar.ok) {
    feil.textContent = (await svar.json().catch(() => ({}))).feil || "Innlogging feilet.";
    vis(feil, true);
    return;
  }
  $("#passord").value = "";
  start();
});

$("#logg-ut").addEventListener("click", async () => {
  await fetch("/api/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ område: "leseliste" }),
  });
  location.reload();
});

function tilLogin() {
  vis($("#app"), false);
  vis($("#login"), true);
}

async function start(forhåndshentet) {
  vis($("#login"), false);
  vis($("#app"), true);
  await last(forhåndshentet);
}

// --- Data ----------------------------------------------------------------

async function kall(sti, { metode = "GET", data } = {}) {
  const svar = await fetch(sti, {
    method: metode,
    headers: data !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });
  if (svar.status === 401) { tilLogin(); throw new Error("Ikke innlogget"); }
  const tekst = await svar.text();
  const json = tekst ? JSON.parse(tekst) : null;
  if (!svar.ok) throw new Error(json?.feil || `Feil ${svar.status}`);
  return json;
}

async function last(forhåndshentet) {
  vis($("#laster"), true);
  try {
    lenker = forhåndshentet || await kall("/api/leseliste");
  } catch (e) {
    $("#laster").textContent = `Klarte ikke hente lista: ${e.message}`;
    return;
  }
  vis($("#laster"), false);
  tegn();
}

// --- Legg til ------------------------------------------------------------

$("#ny").addEventListener("submit", async e => {
  e.preventDefault();
  const feil = $("#ny-feil");
  vis(feil, false);
  const knapp = $("#legg-til");
  knapp.disabled = true;
  // Tittelen hentes av serveren, så dette tar et lite øyeblikk.
  knapp.textContent = "Henter …";
  try {
    const ny = await kall("/api/leseliste", {
      metode: "POST",
      data: { url: $("#url").value, merkelapper: $("#merkelapper").value },
    });
    lenker.unshift(ny);
    $("#url").value = "";
    $("#merkelapper").value = "";
    // En ny lenke er ulest, så vi går dit brukeren vil se den.
    if (fane === "lest") fane = "ulest";
    oppdaterFaner();
    tegn();
    $("#url").focus();
  } catch (e) {
    feil.textContent = e.message;
    vis(feil, true);
  } finally {
    knapp.disabled = false;
    knapp.textContent = "Legg til";
  }
});

// --- Filtre --------------------------------------------------------------

$("#faner").addEventListener("click", e => {
  const knapp = e.target.closest(".fane");
  if (!knapp) return;
  fane = knapp.dataset.fane;
  oppdaterFaner();
  tegn();
});

function oppdaterFaner() {
  for (const k of $$(".fane")) k.classList.toggle("aktiv", k.dataset.fane === fane);
}

$("#sok").addEventListener("input", tegn);
$("#sok").addEventListener("keydown", e => {
  if (e.key === "Escape") { $("#sok").value = ""; tegn(); }
});

$("#merkefilter").addEventListener("click", e => {
  const knapp = e.target.closest("[data-merke]");
  if (!knapp) return;
  valgtMerke = valgtMerke === knapp.dataset.merke ? null : knapp.dataset.merke;
  tegn();
});

function synlige() {
  const søk = $("#sok").value.trim().toLowerCase();
  return lenker.filter(l => {
    if (fane === "ulest" && l.lest) return false;
    if (fane === "lest" && !l.lest) return false;
    if (valgtMerke && !l.merkelapper.includes(valgtMerke)) return false;
    if (!søk) return true;
    return `${l.tittel} ${l.url} ${l.notat} ${l.merkelapper.join(" ")}`.toLowerCase().includes(søk);
  });
}

// --- Tegning -------------------------------------------------------------

function tegn() {
  const rader = synlige();
  const uleste = lenker.filter(l => !l.lest).length;
  $("#teller").textContent = lenker.length
    ? `${uleste} ulest${uleste === 1 ? "" : "e"} av ${lenker.length}`
    : "";

  tegnMerker();

  $("#liste").innerHTML = rader.map(l => `
    <li class="rad${l.lest ? " lest" : ""}" data-id="${l.id}">
      <input type="checkbox" class="av" ${l.lest ? "checked" : ""}
             aria-label="Marker som lest" title="Marker som lest">
      <div class="innhold">
        <a class="lenke" href="${attr(l.url)}" target="_blank" rel="noopener noreferrer">${
          esc(l.tittel || l.url)}</a>
        <div class="under">
          <span class="vert">${esc(vertFra(l.url))}</span>
          <span class="dato">${esc(dato(l.lagt_til))}</span>
          ${l.merkelapper.map(m => `<button class="merke" data-merke="${attr(m)}">${esc(m)}</button>`).join("")}
        </div>
        ${l.notat ? `<p class="notat">${esc(l.notat)}</p>` : ""}
      </div>
      <button class="slett sekundar liten" title="Slett">Slett</button>
    </li>`).join("");

  vis($("#tom"), rader.length === 0);
  $("#tom").textContent = lenker.length === 0
    ? "Lista er tom. Lim inn en adresse over."
    : "Ingen treff.";
}

function tegnMerker() {
  // Merkelapper som finnes i det som vises nå, med antall.
  const antall = new Map();
  for (const l of lenker) {
    if (fane === "ulest" && l.lest) continue;
    if (fane === "lest" && !l.lest) continue;
    for (const m of l.merkelapper) antall.set(m, (antall.get(m) || 0) + 1);
  }
  const merker = [...antall.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "nb"));
  $("#merkefilter").innerHTML = merker.map(([m, n]) =>
    `<button class="merke${valgtMerke === m ? " valgt" : ""}" data-merke="${attr(m)}">${
      esc(m)} <span class="antall">${n}</span></button>`).join("");
  vis($("#merkefilter"), merker.length > 0);
}

// --- Handlinger på en rad ------------------------------------------------

$("#liste").addEventListener("click", async e => {
  const rad = e.target.closest(".rad");
  if (!rad) return;
  const id = Number(rad.dataset.id);
  const lenke = lenker.find(l => l.id === id);
  if (!lenke) return;

  if (e.target.closest(".merke")) {
    const merke = e.target.closest(".merke").dataset.merke;
    valgtMerke = valgtMerke === merke ? null : merke;
    return tegn();
  }

  if (e.target.closest(".slett")) {
    // Lenken er borte for godt, så vi spør først.
    if (!confirm(`Slette «${lenke.tittel || lenke.url}»?`)) return;
    await kall(`/api/leseliste/${id}`, { metode: "DELETE" });
    lenker = lenker.filter(l => l.id !== id);
    return tegn();
  }
});

$("#liste").addEventListener("change", async e => {
  const boks = e.target.closest(".av");
  if (!boks) return;
  const rad = e.target.closest(".rad");
  const id = Number(rad.dataset.id);
  const oppdatert = await kall(`/api/leseliste/${id}`, {
    metode: "PATCH",
    data: { lest: boks.checked },
  });
  const i = lenker.findIndex(l => l.id === id);
  if (i !== -1) lenker[i] = oppdatert;
  tegn();
});

// --- Småverktøy ----------------------------------------------------------

function vertFra(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function dato(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const dager = Math.floor((Date.now() - d) / 86400000);
  if (dager <= 0) return "i dag";
  if (dager === 1) return "i går";
  if (dager < 30) return `for ${dager} dager siden`;
  return d.toLocaleDateString("nb-NO", { day: "numeric", month: "short", year: "numeric" });
}

function esc(t) {
  return String(t ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function attr(t) {
  return esc(t).replace(/"/g, "&quot;");
}

// Sesjonscookien kan allerede være gyldig. Vi prøver lista med én gang og
// gjenbruker svaret, så oppstarten koster én forespørsel.
(async () => {
  const svar = await fetch("/api/leseliste").catch(() => null);
  if (!svar || !svar.ok) return; // Innloggingsskjemaet står allerede fremme.
  start(await svar.json().catch(() => null));
})();
