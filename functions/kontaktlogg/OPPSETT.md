# /kontaktlogg — oppsett

Olivers personlige kontaktlogg på tvers av alle syretester, på
`olivere.no/kontaktlogg`. Bare personer han selv har snakket med.

## Hvorfor det er et arkiv og ikke en live-visning

`/ringeliste` leser fra Linear ved hvert kall. Det går ikke her, av to grunner:
hver syretest får sitt eget workspace, og en personlig API-nøkkel er låst til
ett workspace. Tilgangen til syretest 1 er allerede borte.

Radene importeres derfor én gang per syretest og blir liggende i D1. Arkivet
overlever at et gammelt workspace blir utilgjengelig.

## Kilder

| Syretest | Hentet fra |
|---|---|
| 1 — Clean the Cup | Rapportens vedlegg B, transkribert. CSV-en ble overskrevet 10.09.2026 |
| 1 — Parkinson og Flåtestyring | `contact-log-parkinson.csv` og `contact-log-car.csv` i Typst-prosjektet |
| 2 — Undervann | Linear, workspace `syretest-2` |

## Filene

| Fil | Rolle |
|---|---|
| `migrations/0003_kontaktlogg.sql` | Tabellen `kontakter` |
| `functions/_lib/kontaktlogg.js` | Validering, søkevilkår, JSON-svar |
| `functions/api/kontaktlogg/index.js` | Leser arkivet |
| `functions/api/kontaktlogg/import.js` | Legger inn en ny syretest |
| `functions/kontaktlogg/_middleware.js` | Holder siden ute av søkemotorer og mellomlagre |
| `public/kontaktlogg/` | Siden: innlogging, søk, filter per syretest |
| `scripts/kontaktlogg/bygg-seed.py` | Bygger `seed.json` fra de tre kildene |
| `scripts/kontaktlogg/oppsett.sql` | Skjema og de 45 første radene, til D1-konsollet |

## Passord

Eget område med egen cookie, som `/vault` og `/leseliste`:

| Område | Passordvariabel | Cookie |
|---|---|---|
| `/kontaktlogg` | `KONTAKTLOGG_PASSWORD`, ellers `VAULT_PASSWORD` | `kontaktlogg_session` |

Aldri `SITE_PASSWORD`. Det deles med gruppa, og dette er en privat samling.

## Sette det opp

1. Kjør skjema og data mot databasen `portfolio`. Fila er trygg å kjøre flere
   ganger; radene oppdateres i stedet for å dupliseres.

   ```bash
   npx wrangler d1 execute portfolio --remote --file=scripts/kontaktlogg/oppsett.sql
   ```
2. Sett `KONTAKTLOGG_PASSWORD` som secret på Pages-prosjektet. Uten den faller
   området tilbake på `VAULT_PASSWORD`.

## Legge til en ny syretest senere

```bash
# 1. Bytt aktivt workspace i syretest-CLI-en, og bygg datasettet på nytt
python3 scripts/kontaktlogg/bygg-seed.py

# 2. Send det inn (krever innlogget sesjon på /kontaktlogg)
curl -X POST https://olivere.no/api/kontaktlogg/import \
  -H 'Content-Type: application/json' \
  -b 'kontaktlogg_session=<cookie>' \
  -d "{\"kontakter\": $(cat scripts/kontaktlogg/seed.json)}"
```

Nøkkelen er `(syretest, kort, navn)`, så en ny import oppdaterer eksisterende
rader i stedet for å doble dem.
