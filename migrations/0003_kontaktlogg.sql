-- Olivers personlige kontaktlogg på tvers av alle syretester. Egen tabell, ikke
-- i «innhold»-hvitlista: den serveres offentlig, og dette er persondata om
-- navngitte personer i Equinor, Statnett og andre selskaper.
--
-- Hvert workspace i Linear er adskilt, og API-nøkler er låst til ett workspace.
-- Tabellen er derfor et arkiv som fylles per syretest, ikke en live-visning.
-- Den overlever at tilgangen til et gammelt workspace forsvinner.
CREATE TABLE IF NOT EXISTS kontakter (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  syretest    TEXT    NOT NULL,
  kort        TEXT    NOT NULL DEFAULT '',
  navn        TEXT    NOT NULL DEFAULT '',
  selskap     TEXT    NOT NULL DEFAULT '',
  stilling    TEXT    NOT NULL DEFAULT '',
  kontaktinfo TEXT    NOT NULL DEFAULT '',
  status      TEXT    NOT NULL DEFAULT '',
  referat     TEXT    NOT NULL DEFAULT '',
  lenke       TEXT    NOT NULL DEFAULT '',
  lagt_til    TEXT    NOT NULL
);

-- En ny import av samme syretest skal oppdatere, ikke duplisere. Kort er tomt
-- for syretest 1, som ble transkribert fra rapporten, så navnet inngår i
-- nøkkelen for å skille de radene fra hverandre.
CREATE UNIQUE INDEX IF NOT EXISTS kontakter_kilde
  ON kontakter (syretest, kort, navn);

CREATE INDEX IF NOT EXISTS kontakter_syretest ON kontakter (syretest, navn);
