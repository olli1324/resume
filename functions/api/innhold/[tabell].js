import { tabell, json, feil } from "../../_lib/innhold.js";
import { erInnlogget } from "../../_lib/auth.js";

// GET /api/innhold/:tabell → radene sortert på order_index.
//
// Åpent for alle, fordi den offentlige siden leser herfra. Skjulte rader vises
// bare for den som er innlogget på admin; alle andre får kun synlige rader,
// uansett hva de ber om.
export async function onRequestGet(context) {
  const { DB } = context.env;
  if (!DB) return feil("Databasen DB er ikke bundet til prosjektet.", 500);

  const navn = context.params.tabell;
  const spec = tabell(navn);
  if (!spec) return feil("Ukjent tabell.", 404);

  const admin = await erInnlogget(context, "admin");
  const vilHaSynlige = new URL(context.request.url).searchParams.get("synlige") === "1";
  const kunSynlige = !admin || vilHaSynlige;

  const { results } = await DB.prepare(
    `SELECT data FROM rader
     WHERE tabell = ?
       ${kunSynlige ? "AND COALESCE(json_extract(data, '$.visible'), 1) = 1" : ""}
     ORDER BY CAST(json_extract(data, '$.order_index') AS INTEGER),
              CAST(json_extract(data, '$.id') AS INTEGER),
              nokkel`,
  ).bind(navn).all();

  // Innloggede må aldri få et offentlig mellomlagret svar, og omvendt.
  const cache = admin ? "private, no-store" : "public, max-age=30";
  return json(results.map(r => JSON.parse(r.data)), 200, { "Cache-Control": cache, Vary: "Cookie" });
}
