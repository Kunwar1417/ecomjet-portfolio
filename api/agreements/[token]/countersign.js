/* POST /api/agreements/<token>/countersign
 *
 * Creator-only. Kunwar signs an agreement the brand has already signed, which
 * makes it fully executed. Both parties then see the same finished document at
 * the same link, so nobody emails a PDF back and forth.
 *
 * Order is enforced: an agreement cannot be countersigned before it is signed.
 * Sending a pre-signed contract weakens the negotiating position and puts a
 * liftable signature in every prospect's inbox, which is why the creator's
 * panel stays blank until the brand has committed.
 */
import { sql, ensureSchema, requireDb, appendEvent, clientIp, json, isCreator } from "../../_lib/db.js";

const MAX_SIG_BYTES = 400 * 1024;

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Use POST." });
  if (!isCreator(req)) return json(res, 401, { error: "Not authorised." });
  if (!requireDb(res)) return;

  const token = String(req.query.token || "");
  if (!token || token.length < 20) return json(res, 404, { error: "Not found." });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { return json(res, 400, { error: "Body is not valid JSON." }); }
  }
  const signature = body && body.signature;
  if (typeof signature !== "string" ||
      !/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(signature) ||
      signature.length > MAX_SIG_BYTES) {
    return json(res, 400, { error: "That signature could not be read." });
  }

  try {
    await ensureSchema();

    const rows = await sql`SELECT status, signed_at, countersigned_at, events FROM agreements WHERE token = ${token}`;
    const row = rows[0];
    if (!row) return json(res, 404, { error: "This link is not valid." });
    if (!row.signed_at) return json(res, 409, { error: "The brand has not signed this yet." });
    if (row.countersigned_at) return json(res, 200, { ok: true, alreadySigned: true, counterSignedAt: row.countersigned_at });

    const events = appendEvent(row.events, { t: "countersigned", by: "creator", ip: clientIp(req) });

    const updated = await sql`
      UPDATE agreements SET
        countersigned_at = now(),
        counter_signature = ${signature},
        events = ${events}::jsonb
      WHERE token = ${token} AND countersigned_at IS NULL
      RETURNING countersigned_at
    `;
    if (!updated.length) {
      const again = await sql`SELECT countersigned_at FROM agreements WHERE token = ${token}`;
      return json(res, 200, { ok: true, alreadySigned: true, counterSignedAt: again[0].countersigned_at });
    }

    return json(res, 200, { ok: true, counterSignedAt: updated[0].countersigned_at });
  } catch (e) {
    console.error("countersign failed", e);
    return json(res, 500, { error: "Could not countersign." });
  }
}
