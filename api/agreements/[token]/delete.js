/* POST /api/agreements/<token>/delete
 *
 * Creator-only. Deletes an UNSIGNED shared link, and nothing else.
 *
 * Unsigned links are meant to be disposable: a brand often asks for revisions
 * after reading, so the draft gets deleted and a fresh link sent. Nothing is
 * lost, because nobody has committed to anything yet.
 *
 * THE RULE: once anyone has signed, the row is permanent. It holds the only
 * copy of the signature image, the signing timestamps and the audit trail,
 * and nothing reconstructs them. So there is no confirm flag, no force
 * parameter and no override: a signed agreement cannot be deleted through
 * this API at all, whatever the caller sends. A destructive path a client can
 * unlock is not a guard.
 *
 * That includes the one-party case. A brand that has signed has committed; if
 * the record vanishes, so does the proof they ever did.
 */
import { sql, ensureSchema, requireDb, json, isCreator } from "../../_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Use POST." });
  if (!isCreator(req)) return json(res, 401, { error: "Not authorised." });
  if (!requireDb(res)) return;

  const token = String(req.query.token || "");
  if (!token || token.length < 20) return json(res, 404, { error: "Not found." });

  try {
    await ensureSchema();

    const rows = await sql`SELECT num, signed_at, countersigned_at FROM agreements WHERE token = ${token}`;
    const row = rows[0];
    /* Already gone is the outcome the caller wanted, so this succeeds rather
       than erroring. Makes the button safe to double-click. */
    if (!row) return json(res, 200, { ok: true, alreadyGone: true });

    if (row.signed_at || row.countersigned_at) {
      return json(res, 409, {
        error: "This agreement has been signed, so it cannot be deleted.",
        signed: true,
        num: row.num
      });
    }

    /* The WHERE clause repeats the guard on purpose. If a signature lands
       between the SELECT and the DELETE, the delete matches nothing and the
       contract survives, rather than the race quietly winning. */
    await sql`
      DELETE FROM agreements
      WHERE token = ${token} AND signed_at IS NULL AND countersigned_at IS NULL
    `;
    const still = await sql`SELECT 1 FROM agreements WHERE token = ${token}`;
    if (still.length) {
      return json(res, 409, {
        error: "That agreement was signed a moment ago, so it was not deleted.",
        signed: true, num: row.num
      });
    }

    return json(res, 200, { ok: true, num: row.num });
  } catch (e) {
    console.error("delete failed", e);
    return json(res, 500, { error: "Could not delete." });
  }
}
