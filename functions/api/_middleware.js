import { erInnlogget } from "../_lib/auth.js";

// Alt under /api krever innlogging, unntatt selve innloggingen.
export async function onRequest(context) {
  const sti = new URL(context.request.url).pathname;
  if (sti === "/api/login") return context.next();
  if (await erInnlogget(context)) return context.next();
  return new Response(JSON.stringify({ feil: "Ikke innlogget" }), {
    status: 401,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
