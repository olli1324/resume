import { json, feil, ryddMerkelapper, tekst } from "../../_lib/leseliste.js";

// PATCH /api/leseliste/:id → endre lest, tittel, notat eller merkelapper.
export async function onRequestPatch(context) {
  const { DB } = context.env;
  if (!DB) return feil("Databasen DB er ikke bundet til prosjektet.", 500);

  const id = Number(context.params.id);
  if (!Number.isInteger(id)) return feil("Ugyldig id.", 400);

  const kropp = await context.request.json().catch(() => null);
  if (!kropp || typeof kropp !== "object") return feil("Ugyldig forespørsel.", 400);

  // Bare disse feltene kan endres, og hvert av dem vaskes før det lagres.
  const felt = [];
  const verdier = [];
  if ("lest" in kropp) {
    felt.push("lest = ?", "lest_tid = ?");
    verdier.push(kropp.lest ? 1 : 0, kropp.lest ? new Date().toISOString() : null);
  }
  if ("tittel" in kropp) { felt.push("tittel = ?"); verdier.push(tekst(kropp.tittel, 200)); }
  if ("notat" in kropp) { felt.push("notat = ?"); verdier.push(tekst(kropp.notat, 2000)); }
  if ("merkelapper" in kropp) { felt.push("merkelapper = ?"); verdier.push(ryddMerkelapper(kropp.merkelapper)); }
  if (!felt.length) return feil("Ingenting å endre.", 400);

  const rad = await DB.prepare(
    `UPDATE leseliste SET ${felt.join(", ")} WHERE id = ?
     RETURNING id, url, tittel, notat, merkelapper, lest, lagt_til, lest_tid`,
  ).bind(...verdier, id).first();

  if (!rad) return feil("Fant ikke lenken.", 404);
  return json({
    ...rad,
    lest: rad.lest === 1,
    merkelapper: rad.merkelapper ? rad.merkelapper.split(",") : [],
  });
}

export async function onRequestDelete(context) {
  const { DB } = context.env;
  if (!DB) return feil("Databasen DB er ikke bundet til prosjektet.", 500);
  const id = Number(context.params.id);
  if (!Number.isInteger(id)) return feil("Ugyldig id.", 400);
  await DB.prepare("DELETE FROM leseliste WHERE id = ?").bind(id).run();
  return json({ ok: true });
}
