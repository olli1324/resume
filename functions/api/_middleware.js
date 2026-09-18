import { erInnlogget, områdeFor } from "../_lib/auth.js";

// Alt under /api krever innlogging i sitt eget område, med tre unntak:
// inn- og utlogging selv, /api/status, som bare røper innloggingen til den
// som spør, og /api/innhold, som den offentlige porteføljen leser fra.
// Innholdsendepunktene skiller selv mellom offentlig og admin.
const ÅPNE = ["/api/login", "/api/logout", "/api/status"];
const ÅPNE_PREFIKS = ["/api/innhold/"];

export async function onRequest(context) {
  const sti = new URL(context.request.url).pathname;
  if (ÅPNE.includes(sti) || ÅPNE_PREFIKS.some(p => sti.startsWith(p))) return context.next();
  if (await erInnlogget(context, områdeFor(sti))) return context.next();
  return new Response(JSON.stringify({ feil: "Ikke innlogget" }), {
    status: 401,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
