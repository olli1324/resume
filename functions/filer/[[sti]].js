// GET /filer/:nokkel → en opplastet fil (bilder, CV) fra R2-bøtta FILER.
//
// Nøklene inneholder et tidsstempel og en tilfeldig del, så en fil endres
// aldri under samme navn. Da kan nettleseren mellomlagre den i et år.
const NOKKEL = /^[A-Za-z0-9._-]{1,200}$/;

export async function onRequestGet(context) {
  const { FILER } = context.env;
  const deler = context.params.sti || [];
  const nokkel = Array.isArray(deler) ? deler.join("/") : String(deler);
  if (!FILER || !NOKKEL.test(nokkel)) return new Response("Ikke funnet", { status: 404 });

  const obj = await FILER.get(nokkel);
  if (!obj) return new Response("Ikke funnet", { status: 404 });

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("ETag", obj.httpEtag);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(obj.body, { headers });
}
