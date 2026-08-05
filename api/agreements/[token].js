/* GET /api/agreements/<token>
 *
 * Public, and the only endpoint the brand's browser calls. Returns the frozen
 * terms so sign.html can render the document.
 *
 * The token is the credential, so what comes back is deliberately narrow:
 * terms, status and the agreement number. The audit trail, the IP addresses
 * and the creator's other agreements are never exposed here.
 *
 * Side effect: the first successful read stamps first_viewed_at and moves the
 * status to 'viewed'. That is a real, server-observed event, which is why the
 * creator may be shown it. Nothing is inferred or backfilled.
 */
import { sql, ensureSchema, requireDb, appendEvent, clientIp, json } from "../_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return json(res, 405, { error: "Use GET." });
  if (!requireDb(res)) return;

  const token = String(req.query.token || "");
  if (!token || token.length < 20) return json(res, 404, { error: "Not found." });

  try {
    await ensureSchema();

    const rows = await sql`
      SELECT token, num, terms, terms_sha256, status, created_at, first_viewed_at, expires_at, events
      FROM agreements WHERE token = ${token}
    `;
    const row = rows[0];

    // Same response for "never existed" and "wrong token", so the endpoint
    // cannot be used to confirm that a given token is real.
    if (!row) return json(res, 404, { error: "This link is not valid." });

    if (new Date(row.expires_at).getTime() < Date.now()) {
      return json(res, 410, { error: "This link has expired. Ask for a fresh one.", expired: true });
    }

    if (!row.first_viewed_at) {
      const events = appendEvent(row.events, {
        t: "viewed",
        ip: clientIp(req),
        ua: String(req.headers["user-agent"] || "").slice(0, 300)
      });
      // Only promote 'sent' -> 'viewed'. A signed agreement stays signed.
      await sql`
        UPDATE agreements
        SET first_viewed_at = now(),
            status = CASE WHEN status = 'sent' THEN 'viewed' ELSE status END,
            events = ${events}::jsonb
        WHERE token = ${token} AND first_viewed_at IS NULL
      `;
    }

    // No caching: status changes, and a stale contract is worse than a slow one.
    res.setHeader("cache-control", "no-store");
    return json(res, 200, {
      num: row.num,
      terms: row.terms,
      status: row.status === "sent" ? "viewed" : row.status,
      termsSha256: row.terms_sha256,
      expiresAt: row.expires_at
    });
  } catch (e) {
    console.error("fetch failed", e);
    return json(res, 500, { error: "Could not load this agreement." });
  }
}
