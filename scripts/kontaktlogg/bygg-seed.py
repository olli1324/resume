"""Samler Olivers egne kontakter fra alle syretester til ett seed-datasett.

Tre kilder, fordi de tre syretestene ikke ligger samme sted:
  - Syretest 1, hovedlista: transkribert fra rapportens vedlegg B. CSV-en ble
    overskrevet, så PDF-en er eneste gjenværende kilde.
  - Syretest 1, idé 1 og 2: CSV-ene som fortsatt finnes i Typst-prosjektet.
  - Syretest 2: direkte fra Linear.

Bare kort der Oliver står som ansvarlig og det finnes en dokumentert kontakt.
"""
from __future__ import annotations

import csv
import json
import sys
from pathlib import Path

DEP = Path.home() / "Downloads/syretest-rapport-mal-typst/dependencies"
UT = Path(__file__).parent / "seed.json"

INGEN_KONTAKT = ("ingen dokumentert kontakt", "ingen dokumentert samtale")


def har_kontakt(notat: str) -> bool:
    n = (notat or "").strip().lower()
    return bool(n) and not n.startswith(INGEN_KONTAKT)


# Vedlegg B i Syretest 1-rapporten, side 18-24. Transkribert fra PDF.
SYRETEST1_HOVED = [
    ("Starbucks Brand Manager", "Ann Kristin Nomerstad", "930 60 349", "Avsluttet",
     "Kort telefonsamtale; hun var ikke riktig kontaktperson. Saken ble videresendt "
     "til presseansvarlig i Starbucks."),
    ("Avinor", "Rita Jonyer", "", "Avsluttet",
     "Møte med Rita Jonyer i Avinor er avtalt til neste uke."),
    ("Starbucks Oslo", "Helena Douglas", "", "Avsluttet",
     "Omtrent ti kunder per dag tar med egen kopp. En rask vaskeløsning ble vurdert "
     "som interessant fordi skitne kundekopper bruker tid og kan føre til bruk av "
     "engangskopp."),
    ("Twoday", "Sebastian Hegreberg", "", "Venter på svar",
     "Sebastian er kontaktet for å identifisere leverandøren av gjenbrukskopper hos "
     "UDI; svar avventes."),
    ("Momentium", "Karoline Kalvø", "", "Venter på svar",
     "Markedsføringskoordinator. Hun skulle undersøke internt hvem som kan svare om "
     "bærekraft ved Momentiums festivaler."),
    ("Momentium", "Simon Mørk Pedersen", "986 33 510", "Avsluttet",
     "Festivalprodusent. Han svarte, men hadde ikke anledning til samtale før i "
     "september på grunn av festivalarbeid."),
    ("Vinjerock", "Eskild Røe", "905 70 409", "Avsluttet",
     "Områdesjef. Han svarte på telefonen og la på uten samtale."),
    ("TOMRA Reuse", "Henning Storhaug", "482 26 469", "Avsluttet",
     "TOMRA opplyste at ombruk ikke er lønnsomt så lenge engangsemballasje er "
     "billigere, og peker på avgift eller lovendring som nødvendig virkemiddel. "
     "Stadioner er enklere enn festivaler, og den norske løsningen er fortsatt et "
     "finansiert testprosjekt."),
    ("Sircular Rescale", "Emma Skattum", "913 97 173", "Avsluttet",
     "Samtalen pekte på at et system må være svært tilgjengelig og enklere enn dagens "
     "vane for å få folk til å returnere koppene. Et avgrenset startområde som en "
     "arbeidsplass eller arena ble anbefalt før eventuell skalering, med tydelig "
     "ansvar for vask og drift."),
    ("Joe & the Juice Sverige", "Ella Bergwitz", "", "Avsluttet",
     "Hun opplever medbrakt kopp som tungvint og uhygienisk, særlig ved påfyll av "
     "vann eller kaffe. Hun viste også til at plastkopper blir forbudt i EU."),
]


def fra_csv(fil: Path, syretest: str) -> list[dict]:
    if not fil.exists():
        print(f"  mangler: {fil.name}", file=sys.stderr)
        return []
    ut = []
    for rad in csv.DictReader(fil.open(newline="")):
        if not rad["Ansvarlig"].strip().lower().startswith("oliver"):
            continue
        if not har_kontakt(rad["Notater"]):
            continue
        ut.append({
            "syretest": syretest,
            "kort": rad.get("Kort", "").strip(),
            "navn": rad["Kontaktperson"].strip(),
            "selskap": rad["Selskap"].strip(),
            "stilling": rad.get("Stilling", "").strip(),
            "kontaktinfo": rad["Kontaktinfo"].strip(),
            "status": rad["Status"].strip(),
            "referat": rad["Notater"].strip(),
            "lenke": "",
        })
    return ut


def main() -> int:
    rader: list[dict] = []

    for selskap, navn, kontakt, status, referat in SYRETEST1_HOVED:
        rader.append({
            "syretest": "Syretest 1 – Clean the Cup",
            "kort": "", "navn": navn, "selskap": selskap, "stilling": "",
            "kontaktinfo": kontakt, "status": status, "referat": referat, "lenke": "",
        })

    rader += fra_csv(DEP / "contact-log-parkinson.csv", "Syretest 1 – Parkinson")
    rader += fra_csv(DEP / "contact-log-car.csv", "Syretest 1 – Flåtestyring")

    try:
        sys.path.insert(0, str(Path.home() / "Documents/Code_projects/syretest/src"))
        from syretest.config import keychain_service, read_secret
        from syretest.linear import LinearClient
        c = LinearClient(read_secret(keychain_service("syretest-2")), timeout=60.0)
        from syretest import kontaktkort
        from syretest.ringekort import Ringekort
        team = c.team_by_name("Ringeliste")
        for i in c.issues(team.id):
            if kontaktkort.er_ekskludert(i):
                continue
            card = Ringekort.parse(i.description, identifier=i.identifier, title=i.title)
            m = kontaktkort.metadata_for(i, card)
            if not m["Owner"].strip().lower().startswith("oliver"):
                continue
            ai = [k for k in (i.comments or []) if k.get("body", "").startswith("[AI-CONTACT-LOG")]
            referat = ai[0]["body"].split("\n", 2)[2].strip() if ai else ""
            if not har_kontakt(referat):
                continue
            rader.append({
                "syretest": "Syretest 2 – Undervann",
                "kort": i.identifier,
                "navn": m["Contact"], "selskap": m["Company"], "stilling": card.rolle,
                "kontaktinfo": m["ContactInfo"], "status": i.state,
                "referat": referat,
                "lenke": i.url or "",
            })
    except Exception as exc:  # noqa: BLE001
        print(f"  Linear feilet, syretest 2 utelatt: {exc}", file=sys.stderr)

    UT.write_text(json.dumps(rader, ensure_ascii=False, indent=2))
    fordelt: dict[str, int] = {}
    for r in rader:
        fordelt[r["syretest"]] = fordelt.get(r["syretest"], 0) + 1
    for k, v in fordelt.items():
        print(f"  {v:3}  {k}")
    print(f"\n{len(rader)} kontakter skrevet til {UT.name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
