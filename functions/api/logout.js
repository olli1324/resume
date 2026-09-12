import { erOmråde, slettCookie } from "../_lib/auth.js";

// Cookien er HttpOnly, så den kan ikke ryddes fra skriptet i nettleseren.
// Serveren setter den derfor til tom med utløpt levetid. Endepunktet står
// utenfor innloggingskravet: å logge ut uten å være innlogget skader ingen.
export async function onRequestPost(context) {
  const body = await context.request.json().catch(() => ({}));
  const område = body?.område || "ringeliste";
  if (!erOmråde(område)) return new Response("Ukjent område.", { status: 400 });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Set-Cookie": slettCookie(område),
    },
  });
}
