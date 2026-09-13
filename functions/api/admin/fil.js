import { feil, json } from "../../_lib/innhold.js";

// POST /api/admin/fil (multipart, felt «fil») → laster opp til R2 og svarer med
// en adresse under /filer/. Bare bilder og PDF: det er alt skjemaene trenger,
// og en åpen opplasting til eget domene kunne ellers blitt brukt til å servere
// skadelig innhold fra olivere.no.
const TILLATT = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp",
  "image/gif": "gif", "image/avif": "avif", "application/pdf": "pdf",
};
const MAKS_BYTES = 15 * 1024 * 1024;

export async function onRequestPost(context) {
  const { FILER } = context.env;
  if (!FILER) return feil("R2-bøtta FILER er ikke bundet til prosjektet.", 500);

  let skjema;
  try {
    skjema = await context.request.formData();
  } catch {
    return feil("Forventet multipart/form-data.", 400);
  }
  const fil = skjema.get("fil");
  if (!fil || typeof fil === "string") return feil("Mangler fil.", 400);

  const ext = TILLATT[fil.type];
  if (!ext) return feil(`Filtypen ${fil.type || "(ukjent)"} er ikke tillatt.`, 415);
  if (fil.size > MAKS_BYTES) return feil("Filen er større enn 15 MB.", 413);

  // Samme navneskjema som Supabase-opplastingene, så gamle og nye filer ser likt ut.
  const nokkel = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  await FILER.put(nokkel, fil.stream(), { httpMetadata: { contentType: fil.type } });

  return json({ url: `/filer/${nokkel}` }, 201, { "Cache-Control": "no-store" });
}
