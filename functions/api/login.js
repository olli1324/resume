import { lagToken, settCookie, erOmråde, passordFor } from "../_lib/auth.js";

export async function onRequestPost(context) {
  const { SESSION_SECRET } = context.env;
  let body;
  try {
    body = await context.request.json();
  } catch {
    return json({ feil: "Ugyldig forespørsel." }, 400);
  }

  // Ringeliste-siden ble skrevet før områdene ble skilt og sender ingen
  // «område», så den er standardvalget.
  const område = body?.område || "ringeliste";
  if (!erOmråde(område)) return json({ feil: "Ukjent område." }, 400);

  const passord = passordFor(context.env, område);
  if (!passord || !SESSION_SECRET) {
    return json({ feil: "Siden mangler konfigurasjon på serveren." }, 500);
  }

  // Liten forsinkelse gjør gjetting dyrere uten å plage en ekte bruker.
  await new Promise(r => setTimeout(r, 250));
  if (body?.passord !== passord) {
    return json({ feil: "Feil passord." }, 401);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Set-Cookie": settCookie(område, await lagToken(område, SESSION_SECRET)),
    },
  });
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
