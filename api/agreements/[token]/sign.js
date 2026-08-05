/* POST /api/agreements/<token>/sign
 *
 * The brand signs. Public, because the counterparty has no account: the token
 * is the credential.
 *
 * THE CENTRAL RULE OF THIS FILE: it accepts SIGNER FIELDS ONLY. Terms are
 * never read from the request. They were frozen when the link was created and
 * are re-hashed here, so what gets signed is provably what was sent. A request
 * body claiming a different fee has no effect whatsoever.
 *
 * Idempotent on the token. If the network drops after the row is written, the
 * retry returns the same success rather than a confusing "already signed"
 * error, and a leaked link cannot be signed a second time by someone else.
 */
import { sql, ensureSchema, requireDb, hashTerms, appendEvent, clientIp, json } from "../../_lib/db.js";

// A drawn signature is a trimmed PNG; a few hundred KB is already generous.
// The cap stops a hostile client filling the database through this endpoint.
const MAX_SIG_BYTES = 400 * 1024;

function validSignature(v) {
  return typeof v === "string" &&
    /^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(v) &&
    v.length <= MAX_SIG_BYTES;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Use POST." });
  if (!requireDb(res)) return;

  const token = String(req.query.token || "");
  if (!token || token.length < 20) return json(res, 404, { error: "Not found." });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { return json(res, 400, { error: "Body is not valid JSON." }); }
  }
  body = body || {};

  const name = String(body.signerName || "").trim().slice(0, 120);
  const title = String(body.signerTitle || "").trim().slice(0, 120);
  const kind = body.signatureKind === "drawn" ? "drawn" : "typed";
  const signature = body.signature;

  if (!name) return json(res, 400, { error: "Please enter the name of the person signing." });
  if (!validSignature(signature)) return json(res, 400, { error: "That signature could not be read. Please try again." });

  try {
    await ensureSchema();

    const rows = await sql`
      SELECT token, num, terms, terms_sha256, status, first_viewed_at, expires_at, events,
             signed_at, signer_name, signer_title, signature_img, signature_kind,
             countersigned_at, counter_signature
      FROM agreements WHERE token = ${token}
    `;
    const row = rows[0];
    if (!row) return json(res, 404, { error: "This link is not valid." });

    // Already signed: return the existing record rather than an error, so a
    // retry after a dropped connection lands softly. The first signature wins.
    if (row.status === "signed" || row.signed_at) {
      return json(res, 200, alreadySigned(row));
    }

    if (new Date(row.expires_at).getTime() < Date.now()) {
      return json(res, 410, { error: "This link has expired, so it can no longer be signed. Please ask for a fresh one." });
    }

    // Re-verify the terms have not drifted since the link was created. If this
    // ever fails something is badly wrong, and signing must not proceed.
    const digest = hashTerms(row.terms);
    if (digest !== row.terms_sha256) {
      console.error("terms hash mismatch on sign", token);
      return json(res, 409, { error: "This agreement could not be verified. Please contact Kunwar before signing." });
    }

    const events = appendEvent(row.events, {
      t: "signed",
      name,
      title,
      method: kind,
      ip: clientIp(req),
      ua: String(req.headers["user-agent"] || "").slice(0, 300),
      terms_sha256: digest
    });

    const updated = await sql`
      UPDATE agreements SET
        status = 'signed',
        signed_at = now(),
        signer_name = ${name},
        signer_title = ${title},
        signature_img = ${signature},
        signature_kind = ${kind},
        signer_ip = ${clientIp(req)},
        signer_ua = ${String(req.headers["user-agent"] || "").slice(0, 300)},
        events = ${events}::jsonb
      WHERE token = ${token} AND signed_at IS NULL
      RETURNING signed_at, first_viewed_at, terms_sha256
    `;

    // Lost the race against a concurrent request: read back what won.
    if (!updated.length) {
      const again = await sql`SELECT * FROM agreements WHERE token = ${token}`;
      return json(res, 200, alreadySigned(again[0]));
    }

    return json(res, 200, {
      ok: true,
      status: "signed",
      exec: {
        signerName: name,
        signerTitle: title,
        signature,
        signatureKind: kind,
        signedAt: updated[0].signed_at,
        firstViewedAt: updated[0].first_viewed_at,
        termsSha256: updated[0].terms_sha256
      }
    });
  } catch (e) {
    console.error("sign failed", e);
    return json(res, 500, { error: "The signature could not be saved. Please try again." });
  }
}

function alreadySigned(row) {
  return {
    ok: true,
    status: "signed",
    alreadySigned: true,
    exec: {
      signerName: row.signer_name,
      signerTitle: row.signer_title,
      signature: row.signature_img,
      signatureKind: row.signature_kind,
      signedAt: row.signed_at,
      firstViewedAt: row.first_viewed_at,
      counterSignature: row.counter_signature,
      counterSignedAt: row.countersigned_at,
      termsSha256: row.terms_sha256
    }
  };
}
