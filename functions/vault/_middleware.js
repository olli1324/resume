import { erInnlogget } from "../_lib/auth.js";

// Selve siden er statisk og henter alt innhold via /api/vault etter innlogging.
// Middlewaret holder den ute av søkemotorer og ute av alle mellomlagre.
export async function onRequest(context) {
  const svar = await context.next();
  const ny = new Response(svar.body, svar);
  ny.headers.set("X-Robots-Tag", "noindex, nofollow");
  ny.headers.set("Referrer-Policy", "no-referrer");
  if (!(await erInnlogget(context))) ny.headers.set("Cache-Control", "no-store");
  return ny;
}
