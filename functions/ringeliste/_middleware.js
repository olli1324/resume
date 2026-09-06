import { erInnlogget } from "../_lib/auth.js";

// Selve siden er alltid tilgjengelig; den viser innloggingsskjemaet selv og
// henter data først etter at cookien er satt. Dette middlewaret finnes for at
// et framtidig serverrendret innhold ikke skal lekke ut.
export async function onRequest(context) {
  const svar = await context.next();
  const ny = new Response(svar.body, svar);
  ny.headers.set("X-Robots-Tag", "noindex, nofollow");
  ny.headers.set("Referrer-Policy", "no-referrer");
  if (!(await erInnlogget(context))) ny.headers.set("Cache-Control", "no-store");
  return ny;
}
