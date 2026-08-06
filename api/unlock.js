/* POST /api/unlock
 *
 * One-time setup for the creator's browser. Exchanges the SHARE_SECRET for a
 * long-lived cookie, so the studio never asks for a key again on this device.
 *
 * Why a cookie rather than keeping the secret in localStorage: the secret then
 * lives in one place (the server) instead of being copied into page storage
 * where any script on the page could read it. The cookie is HttpOnly, so the
 * page cannot read it either; the browser simply attaches it to /api requests.
 */
import { timingSafeEqual } from "node:crypto";
import { json } from "./_lib/db.js";

const YEAR = 60 * 60 * 24 * 365;

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Use POST." });

  const secret = process.env.SHARE_SECRET;
  // Fail closed: no secret configured must never mean "let everyone in".
  if (!secret) return json(res, 503, { error: "Sharing is not set up yet." });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { return json(res, 400, { error: "Bad request." }); }
  }
  const given = String((body && body.key) || "");

  if (given.length !== secret.length ||
      !timingSafeEqual(Buffer.from(given), Buffer.from(secret))) {
    return json(res, 401, { error: "That key is not right." });
  }

  res.setHeader("set-cookie",
    "kd_admin=" + encodeURIComponent(secret) +
    "; Path=/; Max-Age=" + YEAR + "; HttpOnly; SameSite=Strict; Secure");

  return json(res, 200, { ok: true });
}
