// Leser Ringeliste fra Linear. Tokenet ligger som Cloudflare-secret og
// forlater aldri serveren.
const ENDPOINT = "https://api.linear.app/graphql";
export const TAG = "[AI-CONTACT-LOG:v2]";
// v1 hadde ingen nøkkelpunkter. Den leses, men regnes aldri som fersk.
export const TAG_V1 = "[AI-CONTACT-LOG:v1]";
export const NOKKELPUNKTER = "[NØKKELPUNKTER]";

const ISSUE_FELT = `
  id identifier title description url updatedAt
  state { name type position }
  team { name }
  labels { nodes { name } }
  assignee { name }
  comments { nodes { id body createdAt updatedAt } }
`;

async function sporring(token, query, variables = {}) {
  const svar = await fetch(ENDPOINT, {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (!svar.ok) throw new Error(`Linear svarte ${svar.status}`);
  const data = await svar.json();
  if (data.errors) throw new Error(data.errors.map(e => e.message).join("; "));
  return data.data;
}

export async function hentTeam(token, navn) {
  const d = await sporring(token, "{ teams { nodes { id key name } } }");
  return d.teams.nodes.find(t => t.name.toLowerCase() === navn.toLowerCase()) || null;
}

// Alle team som begynner med navnet. Gruppa døper om teamet når caset
// skifter retning («Ringeliste gammel», «Ringeliste robotikk»).
export async function hentTeamMedPrefiks(token, prefiks) {
  const d = await sporring(token, "{ teams { nodes { id key name } } }");
  const p = prefiks.toLowerCase();
  return d.teams.nodes.filter(t => t.name.toLowerCase().startsWith(p));
}

export async function hentStatuser(token, teamId) {
  const d = await sporring(
    token,
    "query($id:String!){ team(id:$id){ states { nodes { id name type position } } } }",
    { id: teamId },
  );
  return d.team.states.nodes.sort((a, b) => a.position - b.position);
}

export async function hentIssues(token, teamId) {
  const ut = [];
  let cursor = null;
  do {
    const d = await sporring(
      token,
      `query($team:ID!,$after:String){ issues(filter:{team:{id:{eq:$team}}}, first:100, after:$after){
         nodes { ${ISSUE_FELT} } pageInfo { hasNextPage endCursor } } }`,
      { team: teamId, after: cursor },
    );
    ut.push(...d.issues.nodes);
    cursor = d.issues.pageInfo.hasNextPage ? d.issues.pageInfo.endCursor : null;
  } while (cursor);
  return ut;
}

// --- AI-kommentaren ------------------------------------------------------

export function lesAiKommentar(body, id, createdAt) {
  if (!body) return null;
  const versjon = body.includes(TAG) ? 2 : body.includes(TAG_V1) ? 1 : 0;
  if (!versjon) return null;
  const etter = body.split(versjon === 2 ? TAG : TAG_V1)[1].replace(/^\n+/, "");
  const linjer = etter.split("\n");
  let metadata;
  try {
    metadata = JSON.parse(linjer[0]);
  } catch {
    return null;
  }
  if (typeof metadata !== "object" || metadata === null) return null;
  let tekst = linjer.slice(1).join("\n");
  let nokkelpunkter = "";
  if (versjon === 2 && tekst.includes(NOKKELPUNKTER)) {
    const i = tekst.indexOf(NOKKELPUNKTER);
    nokkelpunkter = tekst.slice(i + NOKKELPUNKTER.length);
    tekst = tekst.slice(0, i);
  }
  return { id, createdAt, metadata, versjon, sammendrag: tekst.trim(), nokkelpunkter: nokkelpunkter.trim() };
}

function tid(iso) {
  const t = Date.parse(iso || "");
  return Number.isNaN(t) ? null : t;
}

// Samme ferskhetsregler som oppsummereren. Avgjøres av Linears egne
// tidsstempler, aldri av noe vi har skrevet inn selv.
export function erFersk(ai, menneskelige, issueUpdatedAt, forventet) {
  if (!ai) return { fersk: false, grunn: "ingen AI-kommentar" };
  if ((ai.versjon ?? 2) < 2) return { fersk: false, grunn: "gammelt format uten nøkkelpunkter" };
  const aiTid = tid(ai.createdAt);
  if (aiTid === null) return { fersk: false, grunn: "ugyldig createdAt" };

  for (const felt of ["Owner", "Company", "Contact", "ContactInfo", "Status"]) {
    if (String(ai.metadata[felt] ?? "") !== String(forventet[felt] ?? "")) {
      return { fersk: false, grunn: `${felt} er endret` };
    }
  }
  const iTid = tid(issueUpdatedAt);
  if (iTid !== null && iTid > aiTid) return { fersk: false, grunn: "kortet er endret etterpå" };
  for (const k of menneskelige) {
    for (const n of ["createdAt", "updatedAt"]) {
      const t = tid(k[n]);
      if (t !== null && t > aiTid) return { fersk: false, grunn: "nyere menneskelig kommentar" };
    }
  }
  return { fersk: true, grunn: "" };
}

// --- Lett tittelparsing for kort uten oppsummering -----------------------

const ROLLEORD = /\b(daglig leder|adm\.? dir|gruppeleder|driftsleder|avdelingsleder|seksjonsleder|prosjektleder|programleder|forskningssjef|operasjonssjef|seniorforsker|seniorrådgiver|overingeniør|saksbehandler|styreleder|koordinator|konsulent|rådgiver|professor|forsker|ingeniør|direktør|leder|sjef|manager|ceo|cto|coo|md|vta|phd)\b/i;

export function fraTittel(tittel) {
  let t = (tittel || "").trim();
  // Parentesen bakerst er stillingen, uansett om tittelen har strek eller ikke.
  let stilling = "";
  const paren = t.match(/\(([^)]+)\)\s*$/);
  if (paren) {
    stilling = paren[1].trim();
    t = t.replace(/\s*\([^)]+\)\s*$/, "").trim();
  }
  let [navn, ...rest] = t.split(/\s+[–—-]\s+/);
  let resten = rest.join(" - ").trim();
  if (!resten && t.includes(", ")) {
    const deler = t.split(", ");
    navn = deler[0];
    resten = deler.slice(1).join(", ");
  }
  const rolleTreff = resten.match(ROLLEORD);
  let selskap = resten;
  if (stilling && rolleTreff === null) {
    // Stillingen kom fra parentesen, resten er selskapet.
  } else if (rolleTreff) {
    const i = resten.toLowerCase().indexOf(rolleTreff[0].toLowerCase());
    if (i > 0) {
      selskap = resten.slice(0, i).trim().replace(/[,\s]+$/, "");
      stilling = resten.slice(i).trim();
    } else {
      stilling = rolleTreff[0];
      selskap = resten.slice(rolleTreff[0].length).trim().replace(/^[,\s]+/, "");
    }
  }
  return { navn: navn.trim(), selskap: selskap.trim(), stilling: stilling.trim() };
}
