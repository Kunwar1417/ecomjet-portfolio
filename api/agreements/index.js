/* GET /api/agreements
 *
 * Creator-only. Backs the "Sent" list in the agreement studio, so Kunwar can
 * see which links have been opened without asking the brand.
 *
 * Returns summaries, not full terms: the local archive already holds the
 * drafts, and this list only needs to answer "what did I send, and has it
 * been read". Includes the token so each row can rebuild its share link.
 */
import { sql, ensureSchema, requireDb, json, isCreator } from "../_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return json(res, 405, { error: "Use GET." });
  if (!isCreator(req)) return json(res, 401, { error: "Not authorised." });
  if (!requireDb(res)) return;

  try {
    await ensureSchema();
    const rows = await sql`
      SELECT token, num, status, created_at, first_viewed_at, expires_at,
             signed_at, signer_name, countersigned_at,
             terms->>'brand' AS brand,
             terms->>'fee' AS fee,
             terms->>'currency' AS currency
      FROM agreements
      ORDER BY created_at DESC
      LIMIT 50
    `;
    res.setHeader("cache-control", "no-store");
    return json(res, 200, { agreements: rows });
  } catch (e) {
    console.error("list failed", e);
    return json(res, 500, { error: "Could not load sent agreements." });
  }
}
