// Leser Ringeliste fra Linear. Tokenet ligger som Cloudflare-secret og
// forlater aldri serveren.
const ENDPOINT = "https://api.linear.app/graphql";
export const TAG = "[AI-CONTACT-LOG:v1]";

const ISSUE_FELT = `
  id identifier title description url updatedAt
  state { name type position }
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
  if (!body || !body.includes(TAG)) return null;
  const etter = body.split(TAG)[1].replace(/^\n+/, "");
  const linjer = etter.split("\n");
  let metadata;
  try {
    metadata = JSON.parse(linjer[0]);
  } catch {
    return null;
  }
  if (typeof metadata !== "object" || metadata === null) return null;
  return { id, createdAt, metadata, sammendrag: linjer.slice(1).join("\n").trim() };
}

function tid(iso) {
  const t = Date.parse(iso || "");
  return Number.isNaN(t) ? null : t;
}

// Samme ferskhetsregler som oppsummereren. Avgjøres av Linears egne
// tidsstempler, aldri av noe vi har skrevet inn selv.
export function erFersk(ai, menneskelige, issueUpdatedAt, forventet) {
  if (!ai) return { fersk: false, grunn: "ingen AI-kommentar" };
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
