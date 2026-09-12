"use strict";

import { rendre, utgaaende } from "/vault/markdown.js";

const $ = s => document.querySelector(s);
const vis = (el, på) => { el.hidden = !på; };

// Grensen for å hente alt på forhånd. Under den er vaulten liten nok til at
// fulltekstsøk og baklenker er gratis; over den henter vi notat for notat.
const FORHÅNDSGRENSE = 200;

let notater = [];
let innhold = new Map();   // sti -> rå markdown
let baklenker = new Map(); // sti -> Set(sti)
let aktiv = null;

// --- Innlogging ----------------------------------------------------------

$("#login-form").addEventListener("submit", async e => {
  e.preventDefault();
  const feil = $("#login-feil");
  vis(feil, false);
  const svar = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ område: "vault", passord: $("#passord").value }),
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
    body: JSON.stringify({ område: "vault" }),
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
  await lastIndeks(forhåndshentet);
}

// --- Indeks --------------------------------------------------------------

async function lastIndeks(forhåndshentet) {
  let json = forhåndshentet;
  if (!json) {
    const svar = await fetch("/api/vault");
    if (svar.status === 401) return tilLogin();
    json = await svar.json().catch(() => ({}));
    if (!svar.ok) {
      $("#tre").innerHTML = `<p class="feil">${json.feil || `Feil ${svar.status}`}</p>`;
      return;
    }
  }
  notater = json.notater;
  $("#oppdatert").textContent = notater.length
    ? `${notater.length} notat${notater.length === 1 ? "" : "er"}`
    : "Bøtta er tom — har Obsidian synket ennå?";

  tegnTre();
  await åpneFraAdresse();

  if (notater.length && notater.length <= FORHÅNDSGRENSE) hentAlt();
}

// Slår opp en wiki-lenke. Obsidian tillater både full sti og bare navnet, og
// faller tilbake på navnet når det er entydig.
function slåOpp(mål) {
  const rent = mål.replace(/#.*$/, "").replace(/\.md$/i, "").trim();
  if (!rent) return null;
  const lav = rent.toLowerCase();
  const eksakt = notater.find(n => n.sti.toLowerCase() === `${lav}.md`);
  if (eksakt) return eksakt.sti;
  const påNavn = notater.filter(n => n.tittel.toLowerCase() === lav);
  return påNavn.length ? påNavn[0].sti : null;
}

// --- Sidemeny ------------------------------------------------------------

function tegnTre() {
  const søk = $("#sok").value.trim().toLowerCase();
  const treff = søk ? notater.filter(n => passer(n, søk)) : notater;

  if (!treff.length) {
    $("#tre").innerHTML = `<p class="tom">${søk ? "Ingen treff." : "Ingen notater."}</p>`;
    return;
  }

  // Grupper på mappe, med rotnotatene først.
  const mapper = new Map();
  for (const n of treff) {
    if (!mapper.has(n.mappe)) mapper.set(n.mappe, []);
    mapper.get(n.mappe).push(n);
  }
  const sortert = [...mapper.keys()].sort((a, b) =>
    (a === "" ? -1 : b === "" ? 1 : a.localeCompare(b, "nb")));

  $("#tre").innerHTML = sortert.map(mappe => {
    const punkter = mapper.get(mappe).map(n =>
      `<li><a href="#${encodeURIComponent(n.sti)}"${
        n.sti === aktiv ? ' class="aktiv"' : ""}>${escHtml(n.tittel)}</a></li>`).join("");
    const tittel = mappe
      ? `<h2 class="mappe">${escHtml(mappe)}</h2>`
      : "";
    return `${tittel}<ul class="notatliste">${punkter}</ul>`;
  }).join("");
}

function passer(n, søk) {
  if (n.sti.toLowerCase().includes(søk)) return true;
  const tekst = innhold.get(n.sti);
  return tekst ? tekst.toLowerCase().includes(søk) : false;
}

$("#sok").addEventListener("input", tegnTre);
$("#sok").addEventListener("keydown", e => {
  if (e.key === "Escape") { $("#sok").value = ""; tegnTre(); }
});

// --- Notat ---------------------------------------------------------------

async function hentNotat(sti) {
  if (innhold.has(sti)) return innhold.get(sti);
  const svar = await fetch(`/api/vault/notat?sti=${encodeURIComponent(sti)}`);
  if (svar.status === 401) { tilLogin(); throw new Error("Ikke innlogget"); }
  if (!svar.ok) {
    const j = await svar.json().catch(() => ({}));
    throw new Error(j.feil || `Feil ${svar.status}`);
  }
  const tekst = await svar.text();
  innhold.set(sti, tekst);
  return tekst;
}

// Henter resten av vaulten i bakgrunnen, så søk dekker innholdet og
// baklenkene blir fullstendige. Kjører etter at første notat er vist.
async function hentAlt() {
  const mangler = notater.filter(n => !innhold.has(n.sti));
  // Litt av gangen, så vi ikke fyrer av hundre forespørsler samtidig.
  for (let i = 0; i < mangler.length; i += 8) {
    await Promise.all(mangler.slice(i, i + 8).map(n => hentNotat(n.sti).catch(() => {})));
  }
  byggBaklenker();
  $("#sok").placeholder = "Søk i titler og innhold …";
  if (aktiv) tegnBaklenker(aktiv);
}

function byggBaklenker() {
  baklenker = new Map();
  for (const [sti, tekst] of innhold) {
    for (const mål of utgaaende(tekst, slåOpp)) {
      if (mål === sti) continue;
      if (!baklenker.has(mål)) baklenker.set(mål, new Set());
      baklenker.get(mål).add(sti);
    }
  }
}

async function åpneFraAdresse() {
  const sti = decodeURIComponent(location.hash.slice(1));
  if (!sti) return visVelkomst();
  const finnes = notater.some(n => n.sti === sti);
  if (!finnes) return visFeil(`Fant ikke «${sti}» i vaulten.`);
  await åpne(sti);
}

async function åpne(sti) {
  aktiv = sti;
  tegnTre();
  const n = notater.find(x => x.sti === sti);
  $("#notat").innerHTML = '<p class="tom">Henter …</p>';

  let tekst;
  try {
    tekst = await hentNotat(sti);
  } catch (e) {
    return visFeil(e.message);
  }

  const { html, meta, overskrifter } = rendre(tekst, slåOpp);
  const endret = n?.endret ? new Date(n.endret).toLocaleString("nb-NO") : "";

  $("#notat").innerHTML = `
    <header class="notat-topp">
      <h1>${escHtml(n?.tittel || sti)}</h1>
      <p class="hjelp">${escHtml(n?.mappe ? `${n.mappe} · ` : "")}${
        endret ? `synket ${escHtml(endret)}` : ""}</p>
      ${meta ? `<dl class="meta">${Object.entries(meta).map(([k, v]) =>
        `<div><dt>${escHtml(k)}</dt><dd>${escHtml(v)}</dd></div>`).join("")}</dl>` : ""}
    </header>
    <article class="brod">${html}</article>
    <section id="baklenker"></section>`;

  // Notater begynner ofte med «# Samme navn som fila». Da står tittelen to
  // ganger etter hverandre, så vi lar overskriften i teksten vike for vår egen.
  const forste = $("#notat .brod > h1:first-child");
  if (forste && forste.textContent.trim() === (n?.tittel || "").trim()) forste.remove();

  tegnInnholdsliste(overskrifter);
  tegnBaklenker(sti);
  document.title = `${n?.tittel || sti} · Vault`;
  $("#notat").scrollTop = 0;
}

function tegnInnholdsliste(overskrifter) {
  const relevante = overskrifter.filter(o => o.niva >= 2 && o.niva <= 3);
  if (relevante.length < 2) return vis($("#omriss"), false);
  $("#omriss").innerHTML = `<h2 class="mappe">På denne siden</h2><ul>${
    relevante.map(o => `<li class="niva-${o.niva}"><a href="#${
      encodeURIComponent(aktiv)}" data-hopp="${escAttr(o.id)}">${escHtml(o.tekst)}</a></li>`)
      .join("")}</ul>`;
  vis($("#omriss"), true);
}

function tegnBaklenker(sti) {
  const boks = $("#baklenker");
  if (!boks) return;
  const inn = baklenker.get(sti);
  if (!inn || !inn.size) {
    boks.innerHTML = "";
    return;
  }
  boks.innerHTML = `<h2 class="mappe">Lenket fra</h2><ul class="notatliste">${
    [...inn].sort().map(s => {
      const n = notater.find(x => x.sti === s);
      return `<li><a href="#${encodeURIComponent(s)}">${escHtml(n?.tittel || s)}</a></li>`;
    }).join("")}</ul>`;
}

function visVelkomst() {
  aktiv = null;
  vis($("#omriss"), false);
  tegnTre();
  document.title = "Vault";
  $("#notat").innerHTML = `<div class="tom stor">
    <p>Velg et notat fra lista.</p>
    <p class="hjelp">Innholdet kommer fra Obsidian-vaulten, synket til Cloudflare R2.</p>
  </div>`;
}

function visFeil(melding) {
  vis($("#omriss"), false);
  $("#notat").innerHTML = `<div class="tom stor"><p class="feil">${escHtml(melding)}</p></div>`;
}

// Klikk på en overskrift i omrisset skal rulle, ikke bytte notat.
$("#omriss").addEventListener("click", e => {
  const a = e.target.closest("a[data-hopp]");
  if (!a) return;
  e.preventDefault();
  document.getElementById(a.dataset.hopp)?.scrollIntoView({ behavior: "smooth", block: "start" });
});

window.addEventListener("hashchange", åpneFraAdresse);

// --- Småverktøy ----------------------------------------------------------

function escHtml(t) {
  return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escAttr(t) {
  return escHtml(t).replace(/"/g, "&quot;");
}

// Sesjonscookien kan allerede være gyldig fra sist. Vi prøver indeksen med én
// gang, så slipper den som er innlogget å skrive passordet på nytt. Svaret
// gjenbrukes, slik at oppstarten bare koster én forespørsel.
(async () => {
  const svar = await fetch("/api/vault").catch(() => null);
  if (!svar || !svar.ok) return; // Innloggingsskjemaet står allerede fremme.
  start(await svar.json().catch(() => null));
})();
