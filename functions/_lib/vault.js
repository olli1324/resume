// Felles hjelpere for vault-endepunktene. Notatene ligger i en R2-bøtte som
// remotely-save i Obsidian synker til; vi leser dem, men skriver aldri tilbake.

// Mapper Obsidian og verktøyene våre eier selv. De sier ingenting for en leser,
// og .obsidian inneholder plugin-nøkler som ikke skal ut av maskinen.
const SKJULTE = [".obsidian/", ".claudian/", ".trash/", ".git/", ".stfolder/"];

export function skjult(sti) {
  return SKJULTE.some(m => sti === m.slice(0, -1) || sti.startsWith(m)) ||
    sti.split("/").some(d => d.startsWith("._"));
}

// remotely-save kan legge vaulten under en egen mappe i bøtta. Vi normaliserer
// prefikset til «» eller «noe/» slik at resten av koden slipper å tenke på det.
export function prefiks(env) {
  const raw = (env.VAULT_PREFIX || "").trim().replace(/^\/+/, "");
  if (!raw) return "";
  return raw.endsWith("/") ? raw : `${raw}/`;
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // Notatene er private, så ingen mellomlagring noe sted på veien.
      "Cache-Control": "no-store",
    },
  });
}
