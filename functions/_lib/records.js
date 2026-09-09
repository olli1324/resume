import { erFersk, fraTittel, hentIssues, hentStatuser, hentTeam, lesAiKommentar } from "./linear.js";

export const TEAM = "Ringeliste";

// Rekkefølgen radene står i. Den skrinlagte casen ligger nederst, under de
// ukontaktede, fordi den hører til et case gruppa har lagt bort.
export const STATUS_REKKEFOLGE = [
  "Fullført lead",
  "Fysiske møter",
  "Venter på svar",
  "Follow up / Ring igjen",
  "Skal ringe",
  "Ikke tatt",
  "Ukontaktet",
];
export const NEDERST = ["Ikke relevante leads", "Ikke nyttig lead"];

export const CSV_KOLONNER = [
  "Ansvarlig", "Selskap", "Kontaktperson", "Stilling", "Kontaktinfo", "Status", "Notater",
];

export function statusIndeks(status) {
  const i = STATUS_REKKEFOLGE.findIndex(s => s.toLowerCase() === status.toLowerCase());
  if (i !== -1) return i;
  const j = NEDERST.findIndex(s => s.toLowerCase() === status.toLowerCase());
  if (j !== -1) return STATUS_REKKEFOLGE.length + 1 + j;
  return STATUS_REKKEFOLGE.length; // ukjent status, rett over skrinlagt case
}

function fornavn(navn) {
  return navn ? String(navn).trim().split(/\s+/)[0] : "";
}

function ekskludert(issue) {
  if (issue.state?.type === "duplicate") return "duplikat";
  if (/^TEST\s/i.test(issue.title || "")) return "testkort";
  if (!(issue.title || "").trim()) return "tom tittel";
  return null;
}

const EPOST = /[\w.+-]+@[\w-]+\.[\w.-]+/;

function kontaktinfoFra(beskrivelse, tittel) {
  const tekst = `${beskrivelse || ""}\n${tittel || ""}`;
  const deler = [];
  const e = tekst.match(EPOST);
  if (e) deler.push(e[0].replace(/[.,;]$/, ""));
  const tlf = tekst.match(/(?:\+47[\s]?)?(?:\d[\s]?){7}\d/);
  if (tlf) deler.push(tlf[0].trim());
  return deler.join("\n");
}

function relevans(rec) {
  if (rec.notater && rec.notater !== "Ingen dokumentert samtale.") return 0;
  if (rec.antallKommentarer > 0) return 1;
  if (["skal ringe", "follow up / ring igjen"].includes(rec.status.toLowerCase())) return 2;
  if (["venter på svar", "ikke tatt"].includes(rec.status.toLowerCase())) return 3;
  return 4;
}

export async function hentRecords(token) {
  const team = await hentTeam(token, TEAM);
  if (!team) throw new Error(`Fant ikke teamet ${TEAM}`);
  const [statuser, issues] = await Promise.all([
    hentStatuser(token, team.id),
    hentIssues(token, team.id),
  ]);

  const records = [];
  const utelatt = [];
  const advarsler = [];
  const ukjenteStatuser = new Set();

  for (const issue of issues) {
    const grunn = ekskludert(issue);
    if (grunn) {
      utelatt.push({ id: issue.identifier, grunn });
      continue;
    }

    const kommentarer = issue.comments?.nodes || [];
    const ai = [];
    const menneskelige = [];
    for (const k of kommentarer) {
      const p = lesAiKommentar(k.body, k.id, k.createdAt);
      if (p) ai.push(p); else menneskelige.push(k);
    }
    const nyest = ai.length
      ? ai.reduce((a, b) => (Date.parse(b.createdAt) > Date.parse(a.createdAt)
          || (Date.parse(b.createdAt) === Date.parse(a.createdAt) && b.id > a.id) ? b : a))
      : null;

    const status = issue.state?.name || "";
    if (statusIndeks(status) === STATUS_REKKEFOLGE.length) ukjenteStatuser.add(status);

    const fallback = fraTittel(issue.title);
    const forventet = {
      Owner: fornavn(issue.assignee?.name),
      Company: nyest?.metadata?.Company ?? fallback.selskap,
      Contact: nyest?.metadata?.Contact ?? fallback.navn,
      ContactInfo: nyest?.metadata?.ContactInfo ?? kontaktinfoFra(issue.description, issue.title),
      Status: status,
    };
    const fersk = nyest
      ? erFersk(nyest, menneskelige, issue.updatedAt, {
          ...forventet,
          Company: nyest.metadata.Company,
          Contact: nyest.metadata.Contact,
          ContactInfo: nyest.metadata.ContactInfo,
        })
      : { fersk: false, grunn: "ingen oppsummering" };

    if (nyest && !fersk.fersk) {
      advarsler.push({ id: issue.identifier, grunn: fersk.grunn });
    }

    const rec = {
      id: issue.identifier,
      url: issue.url,
      status,
      statusType: issue.state?.type || "",
      ansvarlig: forventet.Owner,
      selskap: nyest?.metadata?.Company || fallback.selskap,
      kontaktperson: nyest?.metadata?.Contact || fallback.navn,
      stilling: fallback.stilling,
      kontaktinfo: nyest?.metadata?.ContactInfo || forventet.ContactInfo,
      notater: fersk.fersk ? nyest.sammendrag : "",
      beskrivelse: issue.description || "",
      labels: (issue.labels?.nodes || []).map(l => l.name),
      sistAktiv: nyest?.createdAt || issue.updatedAt,
      antallKommentarer: menneskelige.length,
      utdatert: Boolean(nyest) && !fersk.fersk,
    };
    rec.relevans = relevans(rec);
    records.push(rec);
  }

  records.sort((a, b) =>
    statusIndeks(a.status) - statusIndeks(b.status)
    || a.relevans - b.relevans
    || Date.parse(b.sistAktiv || 0) - Date.parse(a.sistAktiv || 0)
    || a.kontaktperson.localeCompare(b.kontaktperson, "nb"));

  return {
    records,
    statuser: statuser.map(s => ({ navn: s.name, type: s.type })),
    utelatt,
    advarsler,
    ukjenteStatuser: [...ukjenteStatuser],
    hentet: new Date().toISOString(),
  };
}

export function tilCsv(records) {
  const felt = r => [r.ansvarlig, r.selskap, r.kontaktperson, r.stilling,
                     r.kontaktinfo, r.status, r.notater];
  const escape = v => {
    const s = String(v ?? "");
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const linjer = [CSV_KOLONNER.join(",")];
  for (const r of records) linjer.push(felt(r).map(escape).join(","));
  // Uten BOM: Typst sin csv() tar BOM-en med inn i første kolonneoverskrift.
  return linjer.join("\r\n") + "\r\n";
}
