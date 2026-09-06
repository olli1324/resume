import { hentRecords } from "../_lib/records.js";

// Kort cache så gjentatte lastinger ikke slår mot Linear hver gang.
// Manuell oppdatering på nettsiden sender ?fersk=1 og hopper over den.
const CACHE_SEKUNDER = 120;

export async function onRequestGet(context) {
  const token = context.env.LINEAR_API_TOKEN;
  if (!token) {
    return json({ feil: "LINEAR_API_TOKEN mangler på serveren." }, 500);
  }
  const url = new URL(context.request.url);
  const fersk = url.searchParams.get("fersk") === "1";
  const cache = caches.default;
  const nokkel = new Request(`${url.origin}/api/ringeliste`, { method: "GET" });

  if (!fersk) {
    const truffet = await cache.match(nokkel);
    if (truffet) return truffet;
  }

  try {
    const data = await hentRecords(token);
    const svar = json(data, 200, {
      "Cache-Control": `public, max-age=${CACHE_SEKUNDER}`,
    });
    context.waitUntil(cache.put(nokkel, svar.clone()));
    return svar;
  } catch (e) {
    return json({ feil: String(e.message || e) }, 502);
  }
}

function json(data, status, ekstra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...ekstra },
  });
}
