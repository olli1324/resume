// Felles regler for porteføljeinnholdet i D1. Tabellnavnene er en hvitliste:
// alt annet avvises, så API-et ikke kan brukes til å lagre vilkårlige data.

export const TABELLER = {
  profile:      { enkel: true },
  about:        { enkel: true },
  sections:     { nokkelFelt: "key" },
  activities:   { standard: { skills: [] } },
  competitions: { standard: { skills: [], image_urls: [] } },
  education:    { standard: { skills: [] } },
  experiences:  { standard: { skills: [] } },
  projects:     { standard: { tech_stack: [], image_urls: [] } },
  references:   {},
};

export function tabell(navn) {
  return Object.prototype.hasOwnProperty.call(TABELLER, navn) ? TABELLER[navn] : null;
}

export function nokkelFelt(spec) {
  return spec.nokkelFelt || "id";
}

// Feltnavn går rett inn i en JSON-sti i SQL. Bare enkle navn slipper gjennom,
// så et felt aldri kan skrive utenfor sitt eget ledd i dokumentet.
const FELTNAVN = /^[a-z_][a-z0-9_]{0,63}$/;

// Bygger «json_set(data, '$.a', json(?), '$.b', json(?))» for en patch.
// Verdiene sendes som JSON-tekst, slik at null blir lagret som null. Den
// innebygde json_patch ville i stedet slettet feltet.
export function jsonSet(grunnlag, patch, fjern = []) {
  const ledd = [];
  const verdier = [];
  for (const [felt, verdi] of Object.entries(patch)) {
    if (fjern.includes(felt)) continue;
    if (!FELTNAVN.test(felt)) throw new Error(`Ugyldig feltnavn: ${felt}`);
    ledd.push(`'$.${felt}', json(?)`);
    verdier.push(JSON.stringify(verdi === undefined ? null : verdi));
  }
  if (!ledd.length) return { uttrykk: grunnlag, verdier };
  return { uttrykk: `json_set(${grunnlag}, ${ledd.join(", ")})`, verdier };
}

export function json(data, status = 200, ekstra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...ekstra },
  });
}

export function feil(melding, status) {
  return json({ feil: melding }, status, { "Cache-Control": "no-store" });
}

export async function lesKropp(request) {
  try {
    const kropp = await request.json();
    return kropp && typeof kropp === "object" && !Array.isArray(kropp) ? kropp : null;
  } catch {
    return null;
  }
}
