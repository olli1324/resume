// Kontaktloggen henter hele arkivet én gang og filtrerer i nettleseren.
// Det er noen titalls rader, så et rundturs-søk per tastetrykk ville kostet
// mer enn det smaker.

const $ = id => document.getElementById(id);
const login = $("login");
const app = $("app");

let alle = [];
let valgtSyretest = "";

const OMRÅDE = "kontaktlogg";

async function api(sti, valg = {}) {
  const svar = await fetch(sti, { credentials: "same-origin", ...valg });
  if (svar.status === 401) { visLogin(); throw new Error("Ikke innlogget"); }
  if (!svar.ok) throw new Error((await svar.json().catch(() => ({}))).feil || `Feil ${svar.status}`);
  return svar.json();
}

function visLogin() {
  login.hidden = false;
  app.hidden = true;
}

function visApp() {
  login.hidden = true;
  app.hidden = false;
}

$("login-form").addEventListener("submit", async e => {
  e.preventDefault();
  const feil = $("login-feil");
  feil.hidden = true;
  try {
    const svar = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ passord: $("passord").value, område: OMRÅDE }),
    });
    if (!svar.ok) throw new Error((await svar.json().catch(() => ({}))).feil || "Feil passord");
    $("passord").value = "";
    visApp();
    await last();
  } catch (e2) {
    feil.textContent = e2.message;
    feil.hidden = false;
  }
});

$("logg-ut").addEventListener("click", async () => {
  await fetch("/api/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ område: OMRÅDE }),
  }).catch(() => {});
  visLogin();
});

async function last() {
  $("status").textContent = "Henter …";
  const data = await api("/api/kontaktlogg");
  alle = data.kontakter;
  tegnFiltre(data.syretester);
  tegn();
}

function tegnFiltre(grupper) {
  const boks = $("filtre");
  boks.innerHTML = "";
  const knapp = (tekst, verdi) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = tekst;
    b.setAttribute("aria-pressed", String(valgtSyretest === verdi));
    b.addEventListener("click", () => {
      valgtSyretest = valgtSyretest === verdi ? "" : verdi;
      tegnFiltre(grupper);
      tegn();
    });
    boks.append(b);
  };
  knapp(`Alle (${alle.length})`, "");
  for (const g of grupper) knapp(`${g.syretest} (${g.antall})`, g.syretest);
}

// Trygg utheving: teksten settes som tekstnoder, aldri som HTML, så et
// referat som inneholder < eller & ikke kan bryte ut i markup.
function uthev(tekst, sok) {
  const ut = document.createDocumentFragment();
  if (!sok) { ut.append(tekst); return ut; }
  const lav = tekst.toLowerCase();
  const nal = sok.toLowerCase();
  let i = 0;
  for (;;) {
    const treff = lav.indexOf(nal, i);
    if (treff === -1) { ut.append(tekst.slice(i)); break; }
    ut.append(tekst.slice(i, treff));
    const m = document.createElement("mark");
    m.append(tekst.slice(treff, treff + nal.length));
    ut.append(m);
    i = treff + nal.length;
  }
  return ut;
}

function passer(k, sok) {
  if (valgtSyretest && k.syretest !== valgtSyretest) return false;
  if (!sok) return true;
  const s = sok.toLowerCase();
  return [k.navn, k.selskap, k.stilling, k.referat, k.kort]
    .some(f => (f || "").toLowerCase().includes(s));
}

function rad(k, sok) {
  const d = document.createElement("details");
  d.className = "person";

  const s = document.createElement("summary");
  const navn = document.createElement("span");
  navn.className = "navn";
  navn.append(uthev(k.navn, sok));
  const merke = document.createElement("span");
  merke.className = "merke";
  merke.textContent = k.syretest.replace(/^Syretest /, "S");
  const sted = document.createElement("span");
  sted.className = "sted";
  sted.append(uthev([k.selskap, k.stilling].filter(Boolean).join(" · "), sok));
  s.append(navn, merke, sted);

  const brod = document.createElement("div");
  brod.className = "brod";
  const p = document.createElement("p");
  p.className = "referat";
  p.append(uthev(k.referat, sok));
  brod.append(p);

  const meta = document.createElement("div");
  meta.className = "meta";
  if (k.kontaktinfo) {
    const c = document.createElement("span");
    c.className = "kontaktinfo";
    c.textContent = k.kontaktinfo;
    meta.append(c);
  }
  if (k.status) {
    const st = document.createElement("span");
    st.textContent = k.status;
    meta.append(st);
  }
  if (k.lenke) {
    const a = document.createElement("a");
    a.href = k.lenke;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = k.kort || "Linear";
    meta.append(a);
  } else if (k.kort) {
    const kk = document.createElement("span");
    kk.textContent = k.kort;
    meta.append(kk);
  }
  if (meta.childElementCount) brod.append(meta);

  d.append(s, brod);
  return d;
}

function tegn() {
  const sok = $("sok").value.trim();
  const treff = alle.filter(k => passer(k, sok));
  const liste = $("liste");
  liste.innerHTML = "";
  for (const k of treff) liste.append(rad(k, sok));
  $("status").textContent = treff.length === alle.length
    ? ""
    : `${treff.length} av ${alle.length}`;
  $("oppsummering").textContent =
    `${alle.length} personer jeg har snakket med i syretestene`;
}

$("sok").addEventListener("input", tegn);

(async () => {
  try {
    const { innlogget } = await (await fetch("/api/status",
      { credentials: "same-origin" })).json();
    if (innlogget?.[OMRÅDE]) { visApp(); await last(); } else visLogin();
  } catch { visLogin(); }
})();
