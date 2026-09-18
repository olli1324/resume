// Olivers personlige kontaktlogg på tvers av syretester.
//
// Arkiv, ikke live-visning: hvert Linear-workspace er adskilt og nøkler er
// låst til ett workspace, så en samlet live-spørring er ikke mulig. Radene
// importeres per syretest og blir liggende når tilgangen forsvinner.

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export function feil(melding, status = 400) {
  return json({ feil: melding }, status);
}

const FELT = ["syretest", "kort", "navn", "selskap", "stilling",
              "kontaktinfo", "status", "referat", "lenke"];

export function tekst(verdi, maks = 20000) {
  return String(verdi ?? "").trim().slice(0, maks);
}

// Tar imot én rad fra importen og gjør den trygg å lagre.
export function rydd(rad) {
  const ut = {};
  for (const f of FELT) ut[f] = tekst(rad?.[f]);
  return ut.syretest && ut.navn ? ut : null;
}

// Søket går mot navn, selskap, stilling og referat. Referatene er hele
// samtalereferater, så fritekstsøket der er hele poenget med arkivet.
export function sokVilkaar(sok) {
  if (!sok) return { klausul: "", binding: [] };
  const m = `%${sok.toLowerCase()}%`;
  return {
    klausul: `AND (lower(navn) LIKE ? OR lower(selskap) LIKE ?
                   OR lower(stilling) LIKE ? OR lower(referat) LIKE ?
                   OR lower(kort) LIKE ?)`,
    binding: [m, m, m, m, m],
  };
}
