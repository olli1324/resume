# /vault — oppsett

Passordbeskyttet leser for Obsidian-vaulten på `olivere.no/vault`.
Notatene ligger i en Cloudflare R2-bøtte som Obsidian synker til; siden leser
derfra og skriver aldri tilbake. Ingenting av innholdet ligger i dette repoet,
som er offentlig.

```
Obsidian  ──remotely-save──▶  R2-bøtte  ──▶  /api/vault  ──▶  /vault
 (Mac)         (S3 API)        «vault»      (innlogget)     (leseren)
```

## Hva som allerede er på plass

| Fil | Rolle |
|---|---|
| `functions/vault/_middleware.js` | Holder siden ute av søkemotorer og mellomlagre |
| `functions/api/vault/index.js` | Lister notatene i bøtta |
| `functions/api/vault/notat.js` | Serverer ett notat som rå markdown |
| `functions/api/logout.js` | Tømmer sesjonscookien |
| `functions/_lib/vault.js` | Filtrering av skjulte mapper, prefiks, JSON-svar |
| `public/vault/` | Selve leseren (login, notatliste, søk, render, baklenker) |
| `public/_routes.json` | Slipper `/vault` gjennom til Functions |

Innloggingen gjenbruker `functions/_lib/auth.js`, `/api/login` og
`functions/api/_middleware.js` — de samme som `/ringeliste` bruker, men med
hvert sitt passord og hver sin cookie:

| Område | Passordvariabel | Cookie |
|---|---|---|
| `/ringeliste` | `SITE_PASSWORD` | `ringeliste_session` |
| `/vault` | `VAULT_PASSWORD` | `vault_session` |

Området er signert inn i selve tokenet, så en gyldig ringeliste-cookie slipper
ikke inn på `/vault` selv om den døpes om. Er `VAULT_PASSWORD` ikke satt,
faller `/vault` tilbake på `SITE_PASSWORD`, slik at siden ikke låser seg ute
før variabelen er på plass.

`/admin` hører ikke til her — den bruker Supabase Auth med e-post og passord,
og styres fra Supabase-dashbordet.

## Det som gjenstår (krever Cloudflare-kontoen)

### 1. Lag R2-bøtta

Cloudflare dashboard → **R2** → *Create bucket*.

- Navn: `vault`
- Location: *Automatic* (eller EU hvis du vil holde dataene i Europa)

R2 har 10 GB gratis lagring. Vaulten er på noen få MB.

### 2. Bind bøtta til Pages-prosjektet

Dashboard → **Workers & Pages** → prosjektet for `olivere.no` → **Settings** →
**Bindings** → *Add* → **R2 bucket**.

- Variable name: `VAULT`  ← må hete akkurat dette
- R2 bucket: `vault`

Legg den til for **både Production og Preview**. Deploy på nytt etterpå —
bindinger slår ikke inn før neste deploy.

### 3. Lag S3-nøkler til Obsidian

Dashboard → **R2** → **API** → *Manage API tokens* → *Create API token*.

- Permissions: **Object Read & Write**
- Scope: bare bøtta `vault`

Noter **Access Key ID**, **Secret Access Key** og **endpoint**-URL-en
(`https://<konto-id>.r2.cloudflarestorage.com`). Secret-en vises bare én gang.

### 4. Sett opp remotely-save i Obsidian

Plugin-en er allerede installert i vaulten, men ikke konfigurert.
Obsidian → Innstillinger → **Remotely Save**:

| Felt | Verdi |
|---|---|
| Remote service | **S3 or compatible** |
| Endpoint | `https://<konto-id>.r2.cloudflarestorage.com` |
| Region | `auto` |
| Access Key ID | fra steg 3 |
| Secret Access Key | fra steg 3 |
| Bucket name | `vault` |
| S3 URL style | **Path style** |
| **End-to-end encryption** | **AV** |

> Kryptering må være av. Med den på ligger notatene som krypterte blobs i
> bøtta, og funksjonen har ingen nøkkel til å lese dem.

Under *Advanced*: skru på **Auto sync** (f.eks. hvert 5. minutt) hvis du vil at
siden skal oppdatere seg av seg selv.

Valgfritt: legg `.obsidian`, `.claudian` og `.trash` i ignoreringslista, så
slipper du å synke pluginfiler. Siden filtrerer dem bort uansett, så det er
bare for å spare plass.

Kjør **Start sync** én gang til slutt.

### 5. Sjekk at det virker

Gå til `https://olivere.no/vault`, logg inn med `VAULT_PASSWORD`, og se at
notatene dukker opp. Står det «Bøtta er tom — har Obsidian synket ennå?», har
ikke steg 4 kjørt ferdig.

## Hvis remotely-save legger notatene i en undermappe

Noen oppsett legger alt under en mappe med vaultens navn, slik at nøklene blir
`Obsidian Vault/Woolero.md` i stedet for `Woolero.md`. Da: legg til en vanlig
miljøvariabel i Pages-innstillingene:

```
VAULT_PREFIX = Obsidian Vault
```

## Sette passordene

Dashboard → **Workers & Pages** → prosjektet → **Settings** →
**Variables and Secrets**. Legg dem inn som **Secret**, ikke som plaintext
variabel, og for både Production og Preview:

- `SITE_PASSWORD` — passordet til `/ringeliste` (deles med andre)
- `VAULT_PASSWORD` — passordet til `/vault` (bare ditt)
- `SESSION_SECRET` — tilfeldig streng, signerer cookiene. Endrer du den, blir
  alle innlogginger på begge områder ugyldige.

Verdiene står med vilje ikke i dette repoet: det er offentlig.

Et nytt passord slår inn ved neste deploy. Allerede utstedte cookier fortsetter
å virke i inntil 30 dager — skal de kastes med én gang, bytt `SESSION_SECRET`
samtidig.

## Lokal testing

```bash
npx wrangler pages dev public --r2=VAULT \
  --binding SITE_PASSWORD=test-ringeliste VAULT_PASSWORD=test-vault \
  SESSION_SECRET=lokal-hemmelighet
```

Den lokale R2-bøtta starter tom. Merk at `wrangler pages dev` skriver
bøtteinnholdet til `.wrangler/state/` — den mappa er nå i `.gitignore`, og må
bli der, siden repoet er offentlig.
