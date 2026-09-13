-- Innholdet i porteføljen, flyttet hit fra Supabase.
--
-- Hver rad lagres som ett JSON-dokument i stedet for egne kolonner per tabell.
-- Admin-skjemaene har fått nye felt flere ganger (se scripts/migrate-*.sql);
-- med dokumenter trenger et nytt felt ingen migrering.
--
-- «nokkel» er radens identitet innen tabellen: id-en som tekst for vanlige
-- tabeller, og «key» for sections, som ikke har noen id.
CREATE TABLE IF NOT EXISTS rader (
  tabell TEXT NOT NULL,
  nokkel TEXT NOT NULL,
  data   TEXT NOT NULL CHECK (json_valid(data)),
  PRIMARY KEY (tabell, nokkel)
);
