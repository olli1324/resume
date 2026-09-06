import { lagToken, settCookie } from "../_lib/auth.js";

export async function onRequestPost(context) {
  const { SITE_PASSWORD, SESSION_SECRET } = context.env;
  if (!SITE_PASSWORD || !SESSION_SECRET) {
    return json({ feil: "Siden mangler konfigurasjon på serveren." }, 500);
  }
  let body;
  try {
    body = await context.request.json();
  } catch {
    return json({ feil: "Ugyldig forespørsel." }, 400);
  }
  // Liten forsinkelse gjør gjetting dyrere uten å plage en ekte bruker.
  await new Promise(r => setTimeout(r, 250));
  if (body?.passord !== SITE_PASSWORD) {
    return json({ feil: "Feil passord." }, 401);
  }
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Set-Cookie": settCookie(await lagToken(SESSION_SECRET)),
    },
  });
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
