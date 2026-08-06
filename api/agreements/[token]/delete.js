/* POST /api/agreements/<token>/delete
 *
 * Creator-only. Removes a share link and everything stored with it.
 *
 * Why this exists: without it the only way to clear a test row is a psql
 * session, which means the tool is not actually self-contained. It is also
 * the GDPR erasure route for the one piece of personal data this system
 * holds (the signer's name, address, IP and user agent).
 *
 * THE EXECUTED-CONTRACT GUARD. A countersigned agreement is a binding
 * contract, and this row is the only record that it was signed: the
 * signature image, the timestamps and the audit trail exist nowhere else.
 * Deleting one destroys the evidence, so it requires an explicit
 * confirm=true. A stray click cannot do it, which is the whole point of
 * making the destructive case opt-in rather than merely warned about.
 */
import { sql, ensureSchema, requireDb, json, isCreator } from "../../_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Use POST." });
  if (!isCreator(req)) return json(res, 401, { error: "Not authorised." });
  if (!requireDb(res)) return;

  const token = String(req.query.token || "");
  if (!token || token.length < 20) return json(res, 404, { error: "Not found." });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const confirmed = Boolean(body && body.confirm);

  try {
    await ensureSchema();

    const rows = await sql`SELECT num, countersigned_at FROM agreements WHERE token = ${token}`;
    const row = rows[0];
    /* Already gone is the outcome the caller wanted, so this succeeds rather
       than erroring. Makes the button safe to double-click. */
    if (!row) return json(res, 200, { ok: true, alreadyGone: true });

    if (row.countersigned_at && !confirmed) {
      return json(res, 409, {
        error: "This agreement is fully executed. Deleting it destroys the only record of the signature.",
        needsConfirm: true,
        num: row.num
      });
    }

    await sql`DELETE FROM agreements WHERE token = ${token}`;
    return json(res, 200, { ok: true, num: row.num });
  } catch (e) {
    console.error("delete failed", e);
    return json(res, 500, { error: "Could not delete." });
  }
}
