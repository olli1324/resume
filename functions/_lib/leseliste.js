// Hjelpere for leselista.

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "private, no-store",
    },
  });
}

export function feil(melding, status) {
  return json({ feil: melding }, status);
}

// Bare http og https. En javascript:- eller data:-adresse ville blitt en
// lenke vi selv gjengir, og den skal ikke kunne kjøre noe i leseren.
export function ryddUrl(rå) {
  const tekst = String(rå || "").trim();
  if (!tekst) return null;
  // Uten protokoll gjetter vi https, slik man forventer når man limer inn.
  const med = /^[a-z][a-z0-9+.-]*:/i.test(tekst) ? tekst : `https://${tekst}`;
  let url;
  try {
    url = new URL(med);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  return url.toString();
}

// Merkelapper lagres som én tekst. Vi normaliserer til små bokstaver og
// fjerner duplikater, så «AI» og «ai» ikke blir to ulike filtre.
export function ryddMerkelapper(rå) {
  const deler = Array.isArray(rå) ? rå : String(rå || "").split(",");
  const rene = [];
  for (const d of deler) {
    const m = d.trim().toLowerCase().replace(/\s+/g, " ").slice(0, 40);
    if (m && !rene.includes(m)) rene.push(m);
  }
  return rene.slice(0, 12).join(",");
}

export function tekst(rå, maks) {
  return String(rå ?? "").replace(/\s+/g, " ").trim().slice(0, maks);
}

// Henter <title> fra siden, så man slipper å skrive den inn selv. Feiler den,
// står tittelen tom og brukeren kan fylle den ut — det skal aldri hindre at
// lenken blir lagret.
export async function hentTittel(url) {
  try {
    const svar = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "olivere.no-leseliste/1.0", Accept: "text/html,*/*" },
      signal: AbortSignal.timeout(6000),
    });
    if (!svar.ok) return "";
    const type = svar.headers.get("Content-Type") || "";
    if (!type.includes("html")) return "";
    // Bare starten av dokumentet: <title> står i <head>, og vi vil ikke
    // laste ned en hel artikkel for å finne den.
    const biter = [];
    let lengde = 0;
    for await (const bit of svar.body.pipeThrough(new TextDecoderStream())) {
      biter.push(bit);
      lengde += bit.length;
      if (lengde > 60000 || biter.join("").includes("</title>")) break;
    }
    const treff = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(biter.join(""));
    if (!treff) return "";
    return tekst(treff[1]
      .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " "), 200);
  } catch {
    return "";
  }
}
