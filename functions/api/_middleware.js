import { erInnlogget, områdeFor } from "../_lib/auth.js";

// Alt under /api krever innlogging i sitt eget område, unntatt inn- og
// utlogging selv.
const ÅPNE = ["/api/login", "/api/logout"];

export async function onRequest(context) {
  const sti = new URL(context.request.url).pathname;
  if (ÅPNE.includes(sti)) return context.next();
  if (await erInnlogget(context, områdeFor(sti))) return context.next();
  return new Response(JSON.stringify({ feil: "Ikke innlogget" }), {
    status: 401,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
