import { json, feil, ryddUrl, ryddMerkelapper, tekst, hentTittel } from "../../_lib/leseliste.js";

// Innlogging er allerede sjekket av functions/api/_middleware.js, som kjenner
// /api/leseliste som sitt eget område.

// GET /api/leseliste → hele lista, uleste først og nyeste øverst.
export async function onRequestGet(context) {
  const { DB } = context.env;
  if (!DB) return feil("Databasen DB er ikke bundet til prosjektet.", 500);

  const { results } = await DB.prepare(
    `SELECT id, url, tittel, notat, merkelapper, lest, lagt_til, lest_tid
     FROM leseliste ORDER BY lest, lagt_til DESC, id DESC`,
  ).all();

  return json(results.map(r => ({
    ...r,
    lest: r.lest === 1,
    merkelapper: r.merkelapper ? r.merkelapper.split(",") : [],
  })));
}

// POST /api/leseliste {url, tittel?, notat?, merkelapper?} → ny lenke.
export async function onRequestPost(context) {
  const { DB } = context.env;
  if (!DB) return feil("Databasen DB er ikke bundet til prosjektet.", 500);

  const kropp = await context.request.json().catch(() => null);
  const url = ryddUrl(kropp?.url);
  if (!url) return feil("Trenger en gyldig http- eller https-adresse.", 400);

  // Tittelen hentes fra siden når den ikke er oppgitt. Slår det feil, lagres
  // lenken uansett — en tom tittel er bedre enn en tapt lenke.
  const tittel = tekst(kropp?.tittel, 200) || await hentTittel(url);

  const rad = await DB.prepare(
    `INSERT INTO leseliste (url, tittel, notat, merkelapper, lagt_til)
     VALUES (?, ?, ?, ?, ?)
     RETURNING id, url, tittel, notat, merkelapper, lest, lagt_til, lest_tid`,
  ).bind(
    url,
    tittel,
    tekst(kropp?.notat, 2000),
    ryddMerkelapper(kropp?.merkelapper),
    new Date().toISOString(),
  ).first();

  return json({
    ...rad,
    lest: rad.lest === 1,
    merkelapper: rad.merkelapper ? rad.merkelapper.split(",") : [],
  }, 201);
}
