import { tabell, nokkelFelt, jsonSet, feil, json, lesKropp } from "../../../_lib/innhold.js";

function oppslag(context) {
  const { DB } = context.env;
  if (!DB) return { svar: feil("Databasen DB er ikke bundet til prosjektet.", 500) };
  const { tabell: navn, nokkel } = context.params;
  const spec = tabell(navn);
  if (!spec) return { svar: feil("Ukjent tabell.", 404) };
  return { DB, navn, nokkel: String(nokkel), spec };
}

// PATCH → slå sammen feltene med raden som finnes. Identitetsfeltet kan ikke
// endres her, for da ville det sluttet å stemme med nokkel-kolonnen.
export async function onRequestPatch(context) {
  const o = oppslag(context);
  if (o.svar) return o.svar;
  const kropp = await lesKropp(context.request);
  if (!kropp) return feil("Ugyldig forespørsel.", 400);

  let sett;
  try {
    sett = jsonSet("data", kropp, [nokkelFelt(o.spec), "created_at"]);
  } catch (e) {
    return feil(e.message, 400);
  }

  const rad = await o.DB.prepare(
    `UPDATE rader SET data = ${sett.uttrykk} WHERE tabell = ? AND nokkel = ? RETURNING data`,
  ).bind(...sett.verdier, o.navn, o.nokkel).first();

  // Supabase svarte uten feil også når ingen rad ble truffet; det gjør vi og.
  return json(rad ? JSON.parse(rad.data) : null, 200, { "Cache-Control": "no-store" });
}

// PUT → sett inn eller oppdater. Brukes av sections, som identifiseres av key.
export async function onRequestPut(context) {
  const o = oppslag(context);
  if (o.svar) return o.svar;
  const kropp = await lesKropp(context.request);
  if (!kropp) return feil("Ugyldig forespørsel.", 400);

  const felt = nokkelFelt(o.spec);
  const dokument = { ...kropp, [felt]: felt === "id" ? Number(o.nokkel) : o.nokkel };

  let sett;
  try {
    sett = jsonSet("rader.data", kropp, [felt]);
  } catch (e) {
    return feil(e.message, 400);
  }

  const rad = await o.DB.prepare(
    `INSERT INTO rader (tabell, nokkel, data) VALUES (?, ?, ?)
     ON CONFLICT (tabell, nokkel) DO UPDATE SET data = ${sett.uttrykk}
     RETURNING data`,
  ).bind(o.navn, o.nokkel, JSON.stringify(dokument), ...sett.verdier).first();

  return json(JSON.parse(rad.data), 200, { "Cache-Control": "no-store" });
}

export async function onRequestDelete(context) {
  const o = oppslag(context);
  if (o.svar) return o.svar;
  if (o.spec.enkel) return feil("Enkeltrader kan ikke slettes.", 405);
  await o.DB.prepare("DELETE FROM rader WHERE tabell = ? AND nokkel = ?").bind(o.navn, o.nokkel).run();
  return json({ ok: true }, 200, { "Cache-Control": "no-store" });
}
