/* POST /api/agreements/create
 *
 * Creator-only. Freezes the current agreement into a server row and returns a
 * share token. From this moment the terms are immutable: the brand's view is
 * rendered from THIS copy, never from anything their browser supplies.
 *
 * Auth: a shared secret in the x-kd-key header, compared in constant time.
 * The rest of the private pages on this site rely on being unlisted, which is
 * fine for a page but not for a write endpoint. Without a key check anyone who
 * found this URL could mint agreements in Kunwar's name or fill the database.
 */
import { timingSafeEqual } from "node:crypto";
import { sql, ensureSchema, newToken, hashTerms, appendEvent, clientIp, json } from "../_lib/db.js";

const LINK_DAYS = 30;

function authorised(req) {
  const secret = process.env.SHARE_SECRET;
  // Fail closed. A missing secret in the environment must never mean "allow".
  if (!secret) return false;
  const given = req.headers["x-kd-key"];
  if (typeof given !== "string" || given.length !== secret.length) return false;
  return timingSafeEqual(Buffer.from(given), Buffer.from(secret));
}

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Use POST." });
  if (!authorised(req)) return json(res, 401, { error: "Not authorised." });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { return json(res, 400, { error: "Body is not valid JSON." }); }
  }
  const terms = body && body.terms;
  if (!terms || typeof terms !== "object") return json(res, 400, { error: "Missing terms." });

  const num = String(terms.num || "").trim();
  if (!num) return json(res, 400, { error: "The agreement needs a number before it can be shared." });

  try {
    await ensureSchema();

    const token = newToken();
    const digest = hashTerms(terms);
    const expires = new Date(Date.now() + LINK_DAYS * 86400000).toISOString();
    const events = appendEvent([], { t: "created", by: "creator", ip: clientIp(req), num, terms_sha256: digest });

    await sql`
      INSERT INTO agreements (token, num, terms, terms_sha256, status, expires_at, events)
      VALUES (${token}, ${num}, ${JSON.stringify(terms)}::jsonb, ${digest}, 'sent', ${expires}, ${events}::jsonb)
    `;

    return json(res, 200, { token, num, status: "sent", expiresAt: expires, termsSha256: digest });
  } catch (e) {
    console.error("create failed", e);
    return json(res, 500, { error: "Could not create the link." });
  }
}
