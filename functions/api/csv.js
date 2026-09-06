import { hentRecords, tilCsv } from "../_lib/records.js";

// CSV-en inneholder alle gyldige, ikke-arkiverte kort, ikke bare de som er
// synlige på nettsiden.
export async function onRequestGet(context) {
  const token = context.env.LINEAR_API_TOKEN;
  if (!token) return new Response("LINEAR_API_TOKEN mangler", { status: 500 });
  try {
    const { records } = await hentRecords(token);
    const dato = new Date().toISOString().slice(0, 10);
    return new Response(tilCsv(records), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="contact-log-${dato}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return new Response(`Klarte ikke hente fra Linear: ${e.message}`, { status: 502 });
  }
}
