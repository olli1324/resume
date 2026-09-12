import { skjult, prefiks, json } from "../../_lib/vault.js";

// GET /api/vault/notat?sti=Mappe/Notat.md → rå markdown. Klienten rendrer selv.
export async function onRequestGet(context) {
  const { VAULT } = context.env;
  if (!VAULT) return json({ feil: "R2-bøtta VAULT er ikke bundet til prosjektet." }, 500);

  const sti = new URL(context.request.url).searchParams.get("sti") || "";
  // Samme filter som lista bruker. Uten det ville en håndskrevet forespørsel
  // kunne hente .obsidian/-filene som lista med vilje utelater.
  if (!sti.endsWith(".md") || sti.startsWith("/") || sti.includes("..") || skjult(sti)) {
    return json({ feil: "Ugyldig sti." }, 400);
  }

  const obj = await VAULT.get(prefiks(context.env) + sti);
  if (!obj) return json({ feil: "Notatet finnes ikke i bøtta." }, 404);

  return new Response(obj.body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Endret": obj.uploaded.toISOString(),
    },
  });
}
