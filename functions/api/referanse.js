// Lager én Hayagriva-oppføring fra en lenke, til bibliography.yml i Typst.
// Metadata hentes deterministisk fra sidens egne tagger. Felt som ikke lar
// seg verifisere står tomme og markeres, i stedet for å gjettes.

const BLOKKERTE_VERTER = /^(localhost|127\.|0\.|10\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?|metadata\.)/i;

export async function onRequestPost(context) {
  let body;
  try {
    body = await context.request.json();
  } catch {
    return json({ feil: "Ugyldig forespørsel." }, 400);
  }
  const rå = String(body?.url || "").trim();
  if (!rå) return json({ feil: "Mangler lenke." }, 400);

  let url;
  try {
    url = new URL(rå);
  } catch {
    return json({ feil: "Ikke en gyldig URL." }, 400);
  }
  // En server som henter vilkårlige adresser kan ellers brukes til å nå
  // tjenester på innsiden av nettverket.
  if (!["http:", "https:"].includes(url.protocol)) {
    return json({ feil: "Bare http og https støttes." }, 400);
  }
  if (BLOKKERTE_VERTER.test(url.hostname)) {
    return json({ feil: "Interne adresser er ikke tillatt." }, 400);
  }

  let html = "";
  let status = 0;
  try {
    const svar = await fetch(url.toString(), {
      redirect: "follow",
      headers: { "User-Agent": "syretest-referanse/1.0", Accept: "text/html,*/*" },
      signal: AbortSignal.timeout(12000),
    });
    status = svar.status;
    url = new URL(svar.url || url);
    const type = svar.headers.get("Content-Type") || "";
    if (type.includes("text/html")) html = (await svar.text()).slice(0, 400000);
  } catch (e) {
    return json({ feil: `Klarte ikke hente siden: ${e.message}` }, 502);
  }

  const m = lesMetadata(html);
  const tilgang = new Date().toISOString().slice(0, 10);
  const oppslag = {
    tittel: m.title || "",
    forfatter: m.author || "",
    organisasjon: m.site || url.hostname.replace(/^www\./, ""),
    dato: m.date || "",
    type: m.type || "Web",
    sprak: m.lang || "",
  };
  const nokkel = lagNokkel(oppslag, url);
  const mangler = [];
  if (!oppslag.tittel) mangler.push("tittel");
  if (!oppslag.forfatter) mangler.push("forfatter");
  if (!oppslag.dato) mangler.push("publiseringsdato");

  return json({
    nokkel,
    sitering: `@${nokkel}`,
    yaml: byggYaml(nokkel, oppslag, url, tilgang),
    mangler,
    kilde: { url: url.toString(), status },
  });
}

function tag(html, re) {
  const t = html.match(re);
  return t ? avkod(t[1].trim()) : "";
}

const NAVNGITTE = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function avkod(s) {
  return String(s)
    // Numeriske entiteter først: «N&#230;rings-» skal bli «Nærings-».
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => NAVNGITTE[n.toLowerCase()] ?? m);
}

function lesMetadata(html) {
  if (!html) return {};
  const meta = navn => tag(html, new RegExp(
    `<meta[^>]+(?:property|name)=["']${navn}["'][^>]+content=["']([^"']+)["']`, "i"))
    || tag(html, new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${navn}["']`, "i"));

  const dato = meta("article:published_time") || meta("datePublished")
    || meta("citation_publication_date") || meta("date") || meta("dc.date");
  return {
    title: meta("og:title") || meta("twitter:title") || tag(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
    author: meta("author") || meta("citation_author") || meta("article:author"),
    site: meta("og:site_name") || meta("application-name"),
    date: (dato || "").slice(0, 10).match(/^\d{4}(-\d{2}(-\d{2})?)?/)?.[0] || "",
    lang: tag(html, /<html[^>]+lang=["']([a-zA-Z-]{2,5})["']/i).slice(0, 2).toLowerCase(),
    type: meta("og:type") === "article" ? "Article" : "Web",
  };
}

function skli(s) {
  return (s || "").toLowerCase()
    .replace(/[æ]/g, "ae").replace(/[ø]/g, "o").replace(/[å]/g, "a")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function lagNokkel(o, url) {
  const eier = skli(o.forfatter || o.organisasjon || url.hostname).split("-").slice(0, 2).join("-");
  const aar = (o.dato || "").slice(0, 4);
  const korttittel = skli(o.tittel).split("-").filter(Boolean).slice(0, 3).join("-");
  return [eier, aar, korttittel].filter(Boolean).join("-") || skli(url.hostname);
}

function sitat(s) {
  return `"${String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function byggYaml(nokkel, o, url, tilgang) {
  const l = [`${nokkel}:`, `  type: ${o.type}`];
  l.push(`  title: ${sitat(o.tittel || "MÅ FYLLES INN")}`);
  if (o.forfatter) l.push(`  author: ${sitat(o.forfatter)}`);
  else l.push(`  author:`, `    name: ${sitat(o.organisasjon)}`);
  if (o.dato) l.push(`  date: ${o.dato}`);
  if (o.sprak) l.push(`  language: ${o.sprak}`);
  l.push(`  url:`, `    value: ${sitat(url.toString())}`, `    date: ${tilgang}`);
  return l.join("\n");
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
