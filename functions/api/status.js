import { erInnlogget } from "../_lib/auth.js";

// De lukkede sidene. Lista ligger på serveren, ikke i hub-ens HTML eller
// JavaScript: da kan ingen lese ut hvilke private sider som finnes ved å se
// på kildekoden. Hver side sendes bare til den som er innlogget i sitt område.
const LUKKEDE = {
  admin: [
    { sti: "/admin", tittel: "CMS", tekst: "Rediger innholdet på porteføljen — profil, erfaring, prosjekter." },
  ],
  vault: [
    { sti: "/vault/", tittel: "Vault", tekst: "Obsidian-notatene, synket fra maskinen." },
  ],
  ringeliste: [
    { sti: "/ringeliste/", tittel: "Ringeliste", tekst: "Kontaktlogg for syretesten, hentet fra Linear." },
  ],
};

// GET /api/status → hvilke områder denne nettleseren er innlogget i, og
// sidene som hører til dem. Åpent endepunkt: det forteller bare den som
// spør om sine egne cookier.
export async function onRequestGet(context) {
  const innlogget = {};
  const sider = [];
  for (const område of Object.keys(LUKKEDE)) {
    innlogget[område] = await erInnlogget(context, område);
    if (innlogget[område]) sider.push(...LUKKEDE[område]);
  }
  return new Response(JSON.stringify({ innlogget, sider }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "private, no-store",
    },
  });
}
