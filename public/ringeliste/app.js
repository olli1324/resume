"use strict";

const $ = s => document.querySelector(s);
const vis = (el, på) => { el.hidden = !på; };

let data = null;
let valgte = new Set();

// --- Innlogging ----------------------------------------------------------

$("#login-form").addEventListener("submit", async e => {
  e.preventDefault();
  const feil = $("#login-feil");
  vis(feil, false);
  const svar = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ passord: $("#passord").value }),
  });
  if (!svar.ok) {
    feil.textContent = (await svar.json().catch(() => ({}))).feil || "Innlogging feilet.";
    vis(feil, true);
    return;
  }
  start();
});

async function start() {
  vis($("#login"), false);
  vis($("#app"), true);
  await last(false);
}

// --- Data ----------------------------------------------------------------

async function last(fersk) {
  vis($("#laster"), true);
  vis($("#tabell"), false);
  vis($("#tom"), false);
  vis($("#varsel"), false);
  try {
    const svar = await fetch(`/api/ringeliste${fersk ? "?fersk=1" : ""}`);
    if (svar.status === 401) { vis($("#app"), false); vis($("#login"), true); return; }
    const json = await svar.json();
    if (!svar.ok) throw new Error(json.feil || `Feil ${svar.status}`);
    data = json;
    if (!valgte.size) standardvalg();
    tegnFilter();
    tegnVarsler();
    tegnTabell();
    $("#oppdatert").textContent =
      `Hentet ${new Date(data.hentet).toLocaleString("nb-NO")} · ${data.records.length} kontakter`;
  } catch (e) {
    $("#laster").textContent = `Klarte ikke hente data: ${e.message}`;
    return;
  }
  vis($("#laster"), false);
}

// Bare de avsluttede statusene er valgt til å begynne med.
function standardvalg() {
  const terminale = data.statuser.filter(s => s.type === "completed").map(s => s.navn);
  const brukt = new Set(data.records.map(r => r.status));
  valgte = new Set(terminale.filter(n => brukt.has(n)));
  if (!valgte.size) valgte = new Set(brukt);
}

function tegnFilter() {
  const boks = $("#statusfilter");
  boks.innerHTML = "";
  const brukt = new Map();
  for (const r of data.records) brukt.set(r.status, (brukt.get(r.status) || 0) + 1);
  for (const s of data.statuser) {
    if (!brukt.has(s.navn)) continue;
    const label = document.createElement("label");
    const boks2 = document.createElement("input");
    boks2.type = "checkbox";
    boks2.checked = valgte.has(s.navn);
    boks2.addEventListener("change", () => {
      boks2.checked ? valgte.add(s.navn) : valgte.delete(s.navn);
      tegnTabell();
    });
    label.append(boks2, `${s.navn} (${brukt.get(s.navn)})`);
    boks.append(label);
  }
}

function tegnVarsler() {
  const deler = [];
  if (data.advarsler.length) {
    deler.push(`${data.advarsler.length} kort har utdatert oppsummering og står uten notat: `
      + data.advarsler.map(a => `${a.id} (${a.grunn})`).join(", "));
  }
  if (data.ukjenteStatuser.length) {
    deler.push(`Ukjent status: ${data.ukjenteStatuser.join(", ")}. Plassert over den skrinlagte casen.`);
  }
  if (data.utelatt.length) {
    deler.push(`Utelatt: ${data.utelatt.map(u => `${u.id} (${u.grunn})`).join(", ")}.`);
  }
  const el = $("#varsel");
  el.textContent = deler.join(" ");
  vis(el, deler.length > 0);
}

function tegnTabell() {
  const rader = data.records.filter(r => valgte.has(r.status));
  $("#status-linje").textContent =
    `Viser ${rader.length} av ${data.records.length}. CSV-en inneholder alle.`;
  const kropp = $("#rader");
  kropp.innerHTML = "";
  vis($("#tom"), rader.length === 0);
  vis($("#tabell"), rader.length > 0);

  for (const r of rader) {
    const tr = document.createElement("tr");

    const id = document.createElement("td");
    const lenke = document.createElement("a");
    lenke.className = "id";
    lenke.href = r.url; lenke.target = "_blank"; lenke.rel = "noopener noreferrer";
    lenke.textContent = r.id;
    id.append(lenke);

    const kontakt = document.createElement("td");
    kontakt.append(lag("div", "navn", r.kontaktperson || "—"));
    const meta = [r.stilling, r.selskap].filter(Boolean).join(" · ");
    if (meta) kontakt.append(lag("div", "meta", meta));
    if (r.kontaktinfo) kontakt.append(lag("div", "kontakt", r.kontaktinfo));
    if (r.beskrivelse.trim()) {
      const d = document.createElement("details");
      d.className = "beskrivelse";
      const s = document.createElement("summary");
      s.textContent = "Kortet";
      const pre = document.createElement("pre");
      pre.textContent = r.beskrivelse.trim();
      d.append(s, pre);
      kontakt.append(d);
    }

    const status = document.createElement("td");
    status.append(lag("span", "pille", r.status));
    if (r.utdatert) status.append(lag("div", "utdatert", "utdatert oppsummering"));

    const notat = document.createElement("td");
    notat.className = "notat";
    notat.textContent = r.notater || "";

    tr.append(id, kontakt, status, notat);
    kropp.append(tr);
  }
}

function lag(tag, klasse, tekst) {
  const el = document.createElement(tag);
  el.className = klasse;
  el.textContent = tekst;
  return el;
}

$("#oppdater").addEventListener("click", () => last(true));

// --- Faner ---------------------------------------------------------------

for (const knapp of document.querySelectorAll(".fane")) {
  knapp.addEventListener("click", () => {
    document.querySelectorAll(".fane").forEach(k => k.classList.toggle("aktiv", k === knapp));
    vis($("#fane-liste"), knapp.dataset.fane === "liste");
    vis($("#fane-referanse"), knapp.dataset.fane === "referanse");
  });
}

// --- Referansegenerator --------------------------------------------------

$("#ref-form").addEventListener("submit", async e => {
  e.preventDefault();
  vis($("#ref-svar"), false);
  vis($("#ref-feil"), false);
  vis($("#ref-laster"), true);
  try {
    const svar = await fetch("/api/referanse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: $("#ref-url").value }),
    });
    const json = await svar.json();
    if (!svar.ok) throw new Error(json.feil || `Feil ${svar.status}`);
    $("#ref-sitering").textContent = json.sitering;
    $("#ref-yaml").textContent = json.yaml;
    const mangler = $("#ref-mangler");
    if (json.mangler.length) {
      mangler.textContent =
        `Klarte ikke verifisere: ${json.mangler.join(", ")}. Fyll inn selv før du bruker den.`;
    }
    vis(mangler, json.mangler.length > 0);
    vis($("#ref-svar"), true);
  } catch (e) {
    $("#ref-feil").textContent = e.message;
    vis($("#ref-feil"), true);
  }
  vis($("#ref-laster"), false);
});

for (const knapp of document.querySelectorAll(".kopier")) {
  knapp.addEventListener("click", async () => {
    await navigator.clipboard.writeText($(`#${knapp.dataset.mal}`).textContent);
    const før = knapp.textContent;
    knapp.textContent = "Kopiert";
    setTimeout(() => { knapp.textContent = før; }, 1200);
  });
}

// Er cookien allerede satt, hopper vi rett inn.
fetch("/api/ringeliste").then(s => { if (s.ok) start(); });
