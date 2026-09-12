import { skjult, prefiks, json } from "../../_lib/vault.js";

// GET /api/vault → hele notatlista. Innlogging håndteres av functions/api/_middleware.js.
export async function onRequestGet(context) {
  const { VAULT } = context.env;
  if (!VAULT) return json({ feil: "R2-bøtta VAULT er ikke bundet til prosjektet." }, 500);

  const pre = prefiks(context.env);
  const notater = [];
  let cursor;
  // R2 gir maks 1000 nøkler per kall, så vi blar til det ikke er mer igjen.
  do {
    const side = await VAULT.list({ prefix: pre, cursor, limit: 1000 });
    for (const obj of side.objects) {
      const sti = obj.key.slice(pre.length);
      if (!sti.endsWith(".md") || skjult(sti)) continue;
      const skille = sti.lastIndexOf("/");
      notater.push({
        sti,
        tittel: sti.slice(skille + 1, -3),
        mappe: skille === -1 ? "" : sti.slice(0, skille),
        endret: obj.uploaded,
        storrelse: obj.size,
      });
    }
    cursor = side.truncated ? side.cursor : undefined;
  } while (cursor);

  notater.sort((a, b) => a.sti.localeCompare(b.sti, "nb"));
  return json({ notater, hentet: new Date().toISOString() });
}
