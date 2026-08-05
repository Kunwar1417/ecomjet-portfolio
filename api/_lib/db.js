/* Shared database access for the agreement links.
 *
 * The only server-side state in this project. Everything else on the site is
 * static. Backed by Neon Postgres (the Vercel Postgres successor), reached
 * over HTTP so it works from serverless functions with no connection pool.
 *
 * Design rule this file exists to enforce: the AGREEMENT TERMS ARE SERVER
 * STATE. The brand's browser never supplies them, it only reads them. That is
 * what makes tampering structurally impossible rather than merely unnoticed.
 */
import { neon } from "@neondatabase/serverless";
import { createHash, randomBytes } from "node:crypto";

const CONNECTION =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL_UNPOOLED;

/* neon() throws if the connection string is missing, and at module scope that
 * crashes the whole function with an opaque FUNCTION_INVOCATION_FAILED. The
 * database is provisioned separately from the deploy, so "not configured yet"
 * is a state this code must survive: handlers call requireDb() and return a
 * clean 503 instead. */
export const dbConfigured = Boolean(CONNECTION);
export const sql = dbConfigured ? neon(CONNECTION) : null;

/* Returns true when the request can proceed; otherwise answers it and
 * returns false, so callers can `if (!requireDb(res)) return;`. */
export function requireDb(res) {
  if (dbConfigured) return true;
  console.error("DATABASE_URL is not set. Link a Neon database in the Vercel project.");
  json(res, 503, { error: "Sharing is not set up yet." });
  return false;
}

/* One-time schema creation, run lazily on first use.
 * Cheap (IF NOT EXISTS) and keeps this project true to its no-build-step,
 * no-migration-tooling character. If the schema ever grows complex enough
 * that this is uncomfortable, that is the signal to add real migrations. */
let ready = null;
export function ensureSchema() {
  if (!ready) {
    ready = sql`
      CREATE TABLE IF NOT EXISTS agreements (
        token           text PRIMARY KEY,
        num             text NOT NULL,
        terms           jsonb NOT NULL,
        terms_sha256    text NOT NULL,
        status          text NOT NULL DEFAULT 'sent',
        created_at      timestamptz NOT NULL DEFAULT now(),
        first_viewed_at timestamptz,
        expires_at      timestamptz NOT NULL,
        events          jsonb NOT NULL DEFAULT '[]'::jsonb
      )
    `
      /* Signing columns are added separately rather than being folded into the
         CREATE above, because the table already exists in production and
         CREATE TABLE IF NOT EXISTS would silently skip them. ADD COLUMN IF NOT
         EXISTS is safe to run on both a fresh and an existing database. */
      .then(() => sql`
        ALTER TABLE agreements
          ADD COLUMN IF NOT EXISTS signed_at         timestamptz,
          ADD COLUMN IF NOT EXISTS signer_name       text,
          ADD COLUMN IF NOT EXISTS signer_title      text,
          ADD COLUMN IF NOT EXISTS signer_email      text,
          ADD COLUMN IF NOT EXISTS signature_img     text,
          ADD COLUMN IF NOT EXISTS signature_kind    text,
          ADD COLUMN IF NOT EXISTS signer_ip         text,
          ADD COLUMN IF NOT EXISTS signer_ua         text,
          ADD COLUMN IF NOT EXISTS countersigned_at  timestamptz,
          ADD COLUMN IF NOT EXISTS counter_signature text
      `)
      .then(() => sql`CREATE INDEX IF NOT EXISTS agreements_created_idx ON agreements (created_at DESC)`)
      .catch((e) => { ready = null; throw e; });
  }
  return ready;
}

/* URL-safe token. 32 bytes of CSPRNG entropy, well past the 128-bit floor.
 * Never derive this from the agreement number or the brand name: the token is
 * the only credential protecting the document. */
export function newToken() {
  return randomBytes(24).toString("base64url");
}

/* Hash of the terms as sent. Keys are sorted so the digest is stable across
 * JSON key ordering, which lets it prove "these are the terms the brand saw"
 * even if the object is re-serialised on the way in or out. */
export function hashTerms(terms) {
  return createHash("sha256").update(canonical(terms)).digest("hex");
}

function canonical(v) {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map(canonical).join(",") + "]";
  return "{" + Object.keys(v).sort().map((k) => JSON.stringify(k) + ":" + canonical(v[k])).join(",") + "}";
}

/* Client IP as seen by Vercel's edge. Weak evidence on its own (corporate NAT,
 * VPNs, carrier NAT) and personal data under GDPR, so it is stored for
 * corroboration and deliberately never printed on the document. */
export function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length) return fwd.split(",")[0].trim();
  return req.socket?.remoteAddress || null;
}

/* Append to the audit trail. Server-timestamped and append-only: entries are
 * never edited or removed, because a rewritable log is not an audit log. */
export function appendEvent(events, entry) {
  const list = Array.isArray(events) ? events.slice() : [];
  list.push(Object.assign({ at: new Date().toISOString() }, entry));
  return JSON.stringify(list);
}

export function json(res, status, body) {
  res.status(status).setHeader("content-type", "application/json; charset=utf-8");
  res.send(JSON.stringify(body));
}
