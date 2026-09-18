-- Leselista. Egen tabell, ikke «rader»: den tabellen serveres offentlig via
-- /api/innhold, og private lenker skal ikke ligge én feil hvitliste unna å bli
-- lesbare for alle.
CREATE TABLE IF NOT EXISTS leseliste (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  url         TEXT    NOT NULL,
  tittel      TEXT    NOT NULL DEFAULT '',
  notat       TEXT    NOT NULL DEFAULT '',
  merkelapper TEXT    NOT NULL DEFAULT '',
  lest        INTEGER NOT NULL DEFAULT 0,
  lagt_til    TEXT    NOT NULL,
  lest_tid    TEXT
);

-- Lista sorteres nesten alltid på «ulest først, nyest først».
CREATE INDEX IF NOT EXISTS leseliste_sortering ON leseliste (lest, lagt_til DESC);
