import { hentRecords } from "../_lib/records.js";

// Kort cache så gjentatte lastinger ikke slår mot Linear hver gang.
// Manuell oppdatering på nettsiden sender ?fersk=1 og hopper over den.
const CACHE_SEKUNDER = 120;

// Cachen nøkles på URL alene, så en lagret payload overlever en utrulling.
// Da vi la til statusen «Fysiske møter» ble den gamle sorteringen liggende
// i edge-cachen. Bump denne når feltene eller rekkefølgen endres.
const CACHE_VERSJON = "2";

export async function onRequestGet(context) {
  const token = context.env.LINEAR_API_TOKEN;
  if (!token) {
    return json({ feil: "LINEAR_API_TOKEN mangler på serveren." }, 500);
  }
  const url = new URL(context.request.url);
  const fersk = url.searchParams.get("fersk") === "1";
  const cache = caches.default;
  const nokkel = new Request(
    `${url.origin}/api/ringeliste?v=${CACHE_VERSJON}`, { method: "GET" });

  if (!fersk) {
    const truffet = await cache.match(nokkel);
    if (truffet) return medKlientheader(truffet);
  }

  try {
    const data = await hentRecords(token);
    const forEdge = json(data, 200, {
      "Cache-Control": `public, max-age=${CACHE_SEKUNDER}`,
    });
    context.waitUntil(cache.put(nokkel, forEdge.clone()));
    return medKlientheader(forEdge);
  } catch (e) {
    return json({ feil: String(e.message || e) }, 502);
  }
}

// Nettleseren skal aldri holde på svaret. Uten dette lå en tre dager gammel
// payload igjen i disk-cachen selv etter at edge-cachen var oppdatert.
function medKlientheader(svar) {
  const ut = new Response(svar.body, svar);
  ut.headers.set("Cache-Control", "no-store");
  return ut;
}

function json(data, status, ekstra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...ekstra },
  });
}
