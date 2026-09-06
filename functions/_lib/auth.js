// Signert sesjonscookie. Passordet sammenlignes server-side og forlater
// aldri Cloudflare; cookien inneholder bare utløpstid og en signatur.
const COOKIE = "ringeliste_session";
const MAX_ALDER = 60 * 60 * 24 * 30; // 30 dager

const enc = new TextEncoder();

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

export async function lagToken(hemmelighet) {
  const utloper = Math.floor(Date.now() / 1000) + MAX_ALDER;
  const nyttelast = String(utloper);
  const sig = await crypto.subtle.sign("HMAC", await nokkel(hemmelighet), enc.encode(nyttelast));
  return `${nyttelast}.${b64url(sig)}`;
}

export async function gyldigToken(token, hemmelighet) {
  if (!token || !token.includes(".")) return false;
  const [nyttelast, sig] = token.split(".");
  const forventet = await crypto.subtle.sign("HMAC", await nokkel(hemmelighet), enc.encode(nyttelast));
  // Tidskonstant sammenligning, så signaturen ikke kan gjettes byte for byte.
  const a = b64url(forventet);
  if (a.length !== sig.length) return false;
  let ulik = 0;
  for (let i = 0; i < a.length; i++) ulik |= a.charCodeAt(i) ^ sig.charCodeAt(i);
  if (ulik !== 0) return false;
  return Number(nyttelast) > Math.floor(Date.now() / 1000);
}

export function lesCookie(request) {
  const raw = request.headers.get("Cookie") || "";
  const treff = raw.split(";").map(s => s.trim()).find(s => s.startsWith(`${COOKIE}=`));
  return treff ? treff.slice(COOKIE.length + 1) : "";
}

export function settCookie(token) {
  return `${COOKIE}=${token}; Path=/; Max-Age=${MAX_ALDER}; HttpOnly; Secure; SameSite=Lax`;
}

export async function erInnlogget(context) {
  const { SESSION_SECRET } = context.env;
  if (!SESSION_SECRET) return false;
  return gyldigToken(lesCookie(context.request), SESSION_SECRET);
}
