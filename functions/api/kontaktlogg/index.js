import { json, feil, sokVilkaar } from "../../_lib/kontaktlogg.js";

// Innlogging er allerede sjekket av functions/api/_middleware.js.

// GET /api/kontaktlogg?sok=&syretest= → arkivet, nyeste syretest først.
export async function onRequestGet(context) {
  const { DB } = context.env;
  if (!DB) return feil("Databasen DB er ikke bundet til prosjektet.", 500);

  const url = new URL(context.request.url);
  const sok = (url.searchParams.get("sok") || "").trim();
  const syretest = (url.searchParams.get("syretest") || "").trim();

  const { klausul, binding } = sokVilkaar(sok);
  const filter = syretest ? "AND syretest = ?" : "";

  const { results } = await DB.prepare(
    `SELECT id, syretest, kort, navn, selskap, stilling, kontaktinfo,
            status, referat, lenke, lagt_til
     FROM kontakter
     WHERE 1=1 ${klausul} ${filter}
     ORDER BY syretest DESC, selskap COLLATE NOCASE, navn COLLATE NOCASE`,
  ).bind(...binding, ...(syretest ? [syretest] : [])).all();

  const { results: grupper } = await DB.prepare(
    `SELECT syretest, COUNT(*) AS antall FROM kontakter
     GROUP BY syretest ORDER BY syretest DESC`,
  ).all();

  return json({ kontakter: results, syretester: grupper });
}
