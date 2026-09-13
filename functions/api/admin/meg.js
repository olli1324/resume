import { json } from "../../_lib/innhold.js";

// GET /api/admin/meg → 200 når admin-cookien er gyldig. Kommer man hit, har
// middlewaret i functions/api allerede godkjent den; admin-panelet bruker
// svaret til å velge mellom innlogging og dashbord.
export function onRequestGet() {
  return json({ innlogget: true }, 200, { "Cache-Control": "no-store" });
}
