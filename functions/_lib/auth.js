// Signert sesjonscookie. Passordet sammenlignes server-side og forlater
// aldri Cloudflare; cookien inneholder bare område, utløpstid og en signatur.
//
// Hvert område har sitt eget passord og sin egen cookie. Området er dessuten
// signert inn i selve tokenet, slik at en gyldig ringeliste-cookie ikke kan
// døpes om til en vault-cookie og slippe inn et sted den ikke hører hjemme.

const OMRÅDER = {
  ringeliste: "SITE_PASSWORD",
  vault: "VAULT_PASSWORD",
};

const MAX_ALDER = 60 * 60 * 24 * 30; // 30 dager

const enc = new TextEncoder();

// Hvilket område en forespørsel hører til. Vi fjerner et eventuelt /api-ledd
// først, så både siden («/vault/app.js») og endepunktene («/api/vault/notat»)
// treffer samme regel. Alt annet er ringeliste-siden, som var her først.
export function områdeFor(sti) {
  const uten = sti.replace(/^\/api/, "");
  return uten === "/vault" || uten.startsWith("/vault/") ? "vault" : "ringeliste";
}

export function erOmråde(navn) {
  return Object.prototype.hasOwnProperty.call(OMRÅDER, navn);
}

// Passordet for et område, med fall tilbake til SITE_PASSWORD. Fallbacken gjør
// at vault virker også før VAULT_PASSWORD er satt i Cloudflare — da deler den
// passord med ringeliste, slik den gjorde før områdene ble skilt.
export function passordFor(env, område) {
  return env[OMRÅDER[område]] || env.SITE_PASSWORD || "";
}

export function cookieNavn(område) {
  return `${område}_session`;
}

async function nokkel(hemmelighet) {
  return crypto.subtle.importKey(
    "raw", enc.encode(hemmelighet), { name: "HMAC", hash: "SHA-256" },
    false, ["sign", "verify"],
  );
}

function b64url(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function lagToken(område, hemmelighet) {
  const utloper = Math.floor(Date.now() / 1000) + MAX_ALDER;
  const nyttelast = `${område}.${utloper}`;
  const sig = await crypto.subtle.sign("HMAC", await nokkel(hemmelighet), enc.encode(nyttelast));
  return `${nyttelast}.${b64url(sig)}`;
}

export async function gyldigToken(token, område, hemmelighet) {
  if (!token) return false;
  const deler = token.split(".");
  if (deler.length !== 3) return false;
  const [tokenOmråde, utloper, sig] = deler;
  // Området sjekkes før signaturen: et token utstedt for ett område skal
  // aldri kunne gjenbrukes på et annet.
  if (tokenOmråde !== område) return false;

  const nyttelast = `${tokenOmråde}.${utloper}`;
  const forventet = await crypto.subtle.sign("HMAC", await nokkel(hemmelighet), enc.encode(nyttelast));
  // Tidskonstant sammenligning, så signaturen ikke kan gjettes byte for byte.
  const a = b64url(forventet);
  if (a.length !== sig.length) return false;
  let ulik = 0;
  for (let i = 0; i < a.length; i++) ulik |= a.charCodeAt(i) ^ sig.charCodeAt(i);
  if (ulik !== 0) return false;
  return Number(utloper) > Math.floor(Date.now() / 1000);
}

export function lesCookie(request, område) {
  const navn = cookieNavn(område);
  const raw = request.headers.get("Cookie") || "";
  const treff = raw.split(";").map(s => s.trim()).find(s => s.startsWith(`${navn}=`));
  return treff ? treff.slice(navn.length + 1) : "";
}

export function settCookie(område, token) {
  return `${cookieNavn(område)}=${token}; Path=/; Max-Age=${MAX_ALDER}; HttpOnly; Secure; SameSite=Lax`;
}

export function slettCookie(område) {
  return `${cookieNavn(område)}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}

export async function erInnlogget(context, område) {
  const { SESSION_SECRET } = context.env;
  if (!SESSION_SECRET) return false;
  const omr = område || områdeFor(new URL(context.request.url).pathname);
  return gyldigToken(lesCookie(context.request, omr), omr, SESSION_SECRET);
}
