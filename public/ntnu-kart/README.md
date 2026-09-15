# NTNU Robotikk og AI-kart

Statisk enkeltside (index.html, all data inline) som viser 696 NTNU-forskere innen robotikk, autonomi og AI med publikasjoner 2016–2026, temaer, kontaktinfo, patenter og spin-offs. Bygget 15.09.2026 fra Cristin API, ntnu.no/ansatte, Google Patents og NTNU TTO/AMOS.

## Innhold

- `index.html` – hele appen, ingen byggesteg, ingen eksterne avhengigheter utover Google Fonts.
- `data/platform_data.json` – datagrunnlaget siden er bygget fra (forskere, publikasjoner, patenter, spin-offs).
- `data/ntnu_forskere.csv` – én rad per forsker med kontaktinfo og temaer.
- `data/ntnu_publikasjoner.csv` – én rad per publikasjon.

## Oppgave for Claude Code

1. Mappa ligger allerede i `public/ntnu-kart/`, og `public/_routes.json` har fått ruter for `/ntnu-kart` og `/ntnu-kart/*` etter samme mønster som `/convopt` og `/CVDL`.
2. Legg til en lenke til `/ntnu-kart` i porteføljen (trolig `src/components/Projects.js`), med en kort beskrivelse.
3. Verifiser at `npm run build` tar med mappa (CRA kopierer `public/` rett inn i `build/`) og at siden åpner på olivere.no/ntnu-kart etter deploy.
4. Vurder om `index.html` bør laste `data/platform_data.json` med fetch i stedet for inline JSON (5,3 MB) hvis siden føles treg; strukturen er `{researchers, results, patents, spinoffs, themes, depts}` og koden leser den fra `<script id="data" type="application/json">`.

## Kjente begrensninger

Kolonnene «problem» og «oppsummering» per publikasjon er generert av en språkmodell fra tittel og abstract (abstract fantes for 4 208 av 5 038); rader uten abstract er merket «lav» sikkerhet.

Temaene er satt automatisk på tittel og kanal, så det er noe støy. Siteringstall mangler. Koblingen forsker → spin-off er fra offentlige lister og bør sjekkes før den siteres.
