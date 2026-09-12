"use strict";

// Liten markdown-render skrevet for hånd. Vaulten er privat og innholdet er
// vårt eget, men vi escaper likevel alt først og bygger HTML-en av escapet
// tekst, slik at et notat aldri kan kjøre skript i leseren.

// Plassholdermerke. Et nulltegn kan ikke stå i et notat, så det kan ikke
// kollidere med ekte innhold slik en tekstlig markør kunne gjort.
const NUL = "\u0000";

function esc(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function attr(t) {
  return esc(t).replace(/"/g, "&quot;");
}

// Frontmatter er Obsidians metadata. Vi viser den som et eget felt i stedet for
// å la «---» bli en horisontal linje midt i notatet.
function delFrontmatter(md) {
  const treff = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(md);
  if (!treff) return { meta: null, brod: md };
  const meta = {};
  for (const linje of treff[1].split(/\r?\n/)) {
    const m = /^([A-Za-zÆØÅæøå0-9_-]+)\s*:\s*(.*)$/.exec(linje);
    if (m) meta[m[1]] = m[2].trim();
  }
  return { meta, brod: md.slice(treff[0].length) };
}

// --- Inline --------------------------------------------------------------

function inline(t, slaOpp) {
  // Kodesnutter tas ut først, ellers ville «*» inni dem bli til kursiv.
  const koder = [];
  t = t.replace(/`([^`]+)`/g, (_, k) => {
    koder.push(k);
    return NUL + "K" + (koder.length - 1) + NUL;
  });

  // ![[bilde.png]] og [[Notat|tekst]]
  t = t.replace(/(!?)\[\[([^\]|]+?)(?:\|([^\]]*?))?\]\]/g, (_, bang, mal, tekst) => {
    const treff = slaOpp ? slaOpp(mal.trim()) : null;
    const vist = esc((tekst || mal).trim());
    if (bang) return `<span class="vedlegg">${vist}</span>`;
    if (!treff) return `<span class="dodlenke" title="Finnes ikke i vaulten">${vist}</span>`;
    return `<a class="wiki" href="#${encodeURIComponent(treff)}">${vist}</a>`;
  });

  // ![alt](url) og [tekst](url)
  t = t.replace(/(!?)\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_, bang, tekst, url) => {
    if (!/^(https?:|mailto:|#|\/)/i.test(url)) {
      // Alt annet er en lokal fil vi ikke serverer. Vis teksten, ikke en død lenke.
      return bang ? `<span class="vedlegg">${esc(tekst)}</span>` : esc(tekst || url);
    }
    if (bang) return `<img src="${attr(url)}" alt="${attr(tekst)}" loading="lazy">`;
    const eksternt = /^https?:/i.test(url);
    const ekstra = eksternt ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${attr(url)}"${ekstra}>${esc(tekst) || attr(url)}</a>`;
  });

  // Naken URL som ikke allerede ligger inni en href.
  t = t.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, (_, f, url) =>
    `${f}<a href="${attr(url)}" target="_blank" rel="noopener noreferrer">${esc(url)}</a>`);

  t = t.replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>")
       .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
       .replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, "$1<em>$2</em>")
       .replace(/(^|[^_\w])_([^_\n]+)_(?!\w)/g, "$1<em>$2</em>")
       .replace(/~~([^~]+)~~/g, "<del>$1</del>")
       .replace(/==([^=]+)==/g, "<mark>$1</mark>");

  return t.replace(new RegExp(NUL + "K(\\d+)" + NUL, "g"), (_, i) => `<code>${koder[+i]}</code>`);
}

// --- Blokker -------------------------------------------------------------

function lagId(tekst) {
  return tekst.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^\wæøå\s-]/g, "")
    .trim().replace(/\s+/g, "-") || "seksjon";
}

export function rendre(md, slaOpp) {
  const { meta, brod } = delFrontmatter(md);

  // Kodeblokker tas ut før alt annet, så innholdet deres blir stående urørt.
  const blokker = [];
  let t = brod.replace(/```([^\n`]*)\n([\s\S]*?)```/g, (_, sprak, kode) => {
    blokker.push(`<pre class="kode" data-sprak="${attr(sprak.trim())}"><code>${esc(kode.replace(/\n$/, ""))}</code></pre>`);
    return NUL + "B" + (blokker.length - 1) + NUL;
  });

  t = esc(t);

  const linjer = t.split(/\r?\n/);
  const ut = [];
  const overskrifter = [];
  let avsnitt = [];
  let sitat = [];
  const lister = []; // stabel av { tag, innrykk }

  const tomAvsnitt = () => {
    if (!avsnitt.length) return;
    ut.push(`<p>${inline(avsnitt.join(" "), slaOpp)}</p>`);
    avsnitt = [];
  };
  const tomSitat = () => {
    if (!sitat.length) return;
    ut.push(`<blockquote>${inline(sitat.join(" "), slaOpp)}</blockquote>`);
    sitat = [];
  };
  const lukkLister = (tilInnrykk = -1) => {
    while (lister.length && lister[lister.length - 1].innrykk > tilInnrykk) {
      const l = lister.pop();
      // En nestet liste ble åpnet inni punktet over, så den lukker punktet også.
      ut.push(l.nestet ? `</${l.tag}></li>` : `</${l.tag}>`);
    }
  };
  // En underliste hører hjemme inni punktet over den, ikke ved siden av det.
  // Vi tar derfor bort «</li>» fra forrige punkt før vi åpner den.
  const apneNestet = tag => {
    const siste = ut.length - 1;
    if (siste >= 0 && ut[siste].endsWith("</li>")) {
      ut[siste] = ut[siste].slice(0, -"</li>".length);
      return true;
    }
    return false;
  };
  const tomAlt = () => { tomAvsnitt(); tomSitat(); lukkLister(); };

  const erPlassholder = new RegExp("^" + NUL + "B(\\d+)" + NUL + "$");

  for (let i = 0; i < linjer.length; i++) {
    const linje = linjer[i];

    if (!linje.trim()) { tomAvsnitt(); tomSitat(); continue; }

    const plassholder = erPlassholder.exec(linje.trim());
    if (plassholder) { tomAlt(); ut.push(blokker[+plassholder[1]]); continue; }

    if (/^ {0,3}(-{3,}|\*{3,}|_{3,})\s*$/.test(linje)) { tomAlt(); ut.push("<hr>"); continue; }

    const o = /^(#{1,6})\s+(.*)$/.exec(linje);
    if (o) {
      tomAlt();
      const n = o[1].length;
      const id = lagId(o[2]);
      overskrifter.push({ niva: n, tekst: o[2].trim(), id });
      ut.push(`<h${n} id="${attr(id)}">${inline(o[2].trim(), slaOpp)}</h${n}>`);
      continue;
    }

    // «>» er allerede escapet til &gt; på dette tidspunktet.
    const s = /^ {0,3}&gt;\s?(.*)$/.exec(linje);
    if (s) { tomAvsnitt(); lukkLister(); sitat.push(s[1]); continue; }

    // Tabell: en linje med rør, etterfulgt av en skillelinje.
    if (/^\s*\|/.test(linje) && /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(linjer[i + 1] || "")) {
      tomAlt();
      const celler = r => r.trim().replace(/^\||\|$/g, "").split("|").map(c => c.trim());
      const hoder = celler(linje);
      const rader = [];
      i += 2;
      while (i < linjer.length && /^\s*\|/.test(linjer[i])) rader.push(celler(linjer[i++]));
      i--;
      ut.push(`<div class="tabellramme"><table><thead><tr>${hoder.map(c => `<th>${inline(c, slaOpp)}</th>`).join("")}</tr></thead><tbody>` +
        rader.map(r => `<tr>${r.map(c => `<td>${inline(c, slaOpp)}</td>`).join("")}</tr>`).join("") +
        "</tbody></table></div>");
      continue;
    }

    const p = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(linje);
    if (p) {
      tomAvsnitt(); tomSitat();
      const innrykk = p[1].replace(/\t/g, "    ").length;
      const tag = /\d/.test(p[2]) ? "ol" : "ul";
      lukkLister(innrykk);
      const overst = lister[lister.length - 1];
      if (!overst || overst.innrykk < innrykk) {
        const nestet = lister.length > 0 && apneNestet(tag);
        lister.push({ tag, innrykk, nestet });
        ut.push(`<${tag}>`);
      } else if (overst.tag !== tag) {
        lukkLister(innrykk - 1);
        lister.push({ tag, innrykk, nestet: false });
        ut.push(`<${tag}>`);
      }
      // Avkrysningsbokser fra Obsidian vises som ekte, låste bokser.
      const boks = /^\[([ xX])\]\s+(.*)$/.exec(p[3]);
      if (boks) {
        const av = boks[1] !== " ";
        ut.push(`<li class="oppgave${av ? " gjort" : ""}"><input type="checkbox" disabled${av ? " checked" : ""}> ${inline(boks[2], slaOpp)}</li>`);
      } else {
        ut.push(`<li>${inline(p[3], slaOpp)}</li>`);
      }
      continue;
    }

    lukkLister();
    avsnitt.push(linje.trim());
  }
  tomAlt();

  return { html: ut.join("\n"), meta, overskrifter };
}

// Wiki-lenkene et notat peker på, brukt til å regne ut baklenker.
export function utgaaende(md, slaOpp) {
  const ut = new Set();
  for (const m of md.matchAll(/(?<!!)\[\[([^\]|]+?)(?:\|[^\]]*?)?\]\]/g)) {
    const treff = slaOpp(m[1].trim());
    if (treff) ut.add(treff);
  }
  return ut;
}
