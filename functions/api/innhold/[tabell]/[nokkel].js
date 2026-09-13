import { tabell, json, feil } from "../../../_lib/innhold.js";
import { erInnlogget } from "../../../_lib/auth.js";

// GET /api/innhold/:tabell/:nokkel → én rad, eller null om den ikke finnes.
// Brukes for enkeltradene profile og about, som alltid har nokkel 1.
export async function onRequestGet(context) {
  const { DB } = context.env;
  if (!DB) return feil("Databasen DB er ikke bundet til prosjektet.", 500);

  const { tabell: navn, nokkel } = context.params;
  const spec = tabell(navn);
  if (!spec) return feil("Ukjent tabell.", 404);

  const rad = await DB.prepare("SELECT data FROM rader WHERE tabell = ? AND nokkel = ?")
    .bind(navn, String(nokkel)).first();

  const admin = await erInnlogget(context, "admin");
  const data = rad ? JSON.parse(rad.data) : null;
  // Enkeltrader filtreres ikke på synlighet: About-komponenten leser selv
  // visible-feltet og skjuler seg, slik den gjorde mot Supabase.
  if (data && !spec.enkel && !admin && data.visible === false) return json(null);

  return json(data, 200, {
    "Cache-Control": admin ? "private, no-store" : "public, max-age=30",
    Vary: "Cookie",
  });
}
