import { json, feil, rydd } from "../../_lib/kontaktlogg.js";

// POST /api/kontaktlogg/import {kontakter: [...]} → legger inn eller oppdaterer.
//
// Kjøres når en syretest er ferdig. Nøkkelen (syretest, kort, navn) gjør at en
// ny import av samme syretest oppdaterer radene i stedet for å doble dem, så
// den er trygg å kjøre flere ganger.
export async function onRequestPost(context) {
  const { DB } = context.env;
  if (!DB) return feil("Databasen DB er ikke bundet til prosjektet.", 500);

  const kropp = await context.request.json().catch(() => null);
  const inn = Array.isArray(kropp?.kontakter) ? kropp.kontakter : null;
  if (!inn) return feil("Trenger {kontakter: [...]}.", 400);

  const rader = inn.map(rydd).filter(Boolean);
  if (!rader.length) return feil("Ingen gyldige rader. Hver rad må ha syretest og navn.", 400);

  const naa = new Date().toISOString();
  const setning = DB.prepare(
    `INSERT INTO kontakter
       (syretest, kort, navn, selskap, stilling, kontaktinfo, status, referat, lenke, lagt_til)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (syretest, kort, navn) DO UPDATE SET
       selskap = excluded.selskap,
       stilling = excluded.stilling,
       kontaktinfo = excluded.kontaktinfo,
       status = excluded.status,
       referat = excluded.referat,
       lenke = excluded.lenke`,
  );

  await DB.batch(rader.map(r => setning.bind(
    r.syretest, r.kort, r.navn, r.selskap, r.stilling,
    r.kontaktinfo, r.status, r.referat, r.lenke, naa,
  )));

  const { antall } = await DB.prepare("SELECT COUNT(*) AS antall FROM kontakter").first();
  return json({ lagret: rader.length, totalt: antall });
}
