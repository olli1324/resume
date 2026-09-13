import { tabell, feil, json, lesKropp } from "../../_lib/innhold.js";

// POST /api/admin/:tabell → ny rad. Serveren setter id, order_index og
// created_at, slik Supabase gjorde; verdier klienten sender for disse ignoreres.
export async function onRequestPost(context) {
  const { DB } = context.env;
  if (!DB) return feil("Databasen DB er ikke bundet til prosjektet.", 500);

  const navn = context.params.tabell;
  const spec = tabell(navn);
  if (!spec) return feil("Ukjent tabell.", 404);
  if (spec.enkel || spec.nokkelFelt) return feil("Tabellen tar ikke imot nye rader.", 405);

  const kropp = await lesKropp(context.request);
  if (!kropp) return feil("Ugyldig forespørsel.", 400);

  // Standardverdier først, så klientens felt vinner. Uten dem ville en ny rad
  // uten skills få undefined der komponentene forventer en liste.
  const dokument = { visible: true, ...(spec.standard || {}), ...kropp };

  // Neste id og plass regnes ut i samme setning som raden settes inn. Dermed kan
  // to samtidige innsettinger ikke få samme id: SQLite kjører setningen samlet.
  const rad = await DB.prepare(
    `INSERT INTO rader (tabell, nokkel, data)
     SELECT ?1,
            CAST(COALESCE(MAX(CAST(json_extract(data, '$.id') AS INTEGER)), 0) + 1 AS TEXT),
            json_set(?2,
              '$.id',          COALESCE(MAX(CAST(json_extract(data, '$.id') AS INTEGER)), 0) + 1,
              '$.order_index', COALESCE(MAX(CAST(json_extract(data, '$.order_index') AS INTEGER)), -1) + 1,
              '$.created_at',  ?3)
     FROM rader WHERE tabell = ?1
     RETURNING data`,
  ).bind(navn, JSON.stringify(dokument), new Date().toISOString()).first();

  return json(JSON.parse(rad.data), 201, { "Cache-Control": "no-store" });
}
