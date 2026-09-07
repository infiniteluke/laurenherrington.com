/**
 * Signed timestamps for form renders. Pairing one with a submission gives the
 * action a trustworthy "how long did this take to fill out" signal: bots post
 * instantly, humans don't. Signing is what makes it worth anything — an
 * unsigned timestamp is just another field a bot can set to whatever passes.
 */

const encoder = new TextEncoder();

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return [...new Uint8Array(mac)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function equalsConstantTime(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/** Returns null when no secret is configured, which disables the timing check. */
export async function createFormToken(
  secret: string | undefined,
  issuedAt: number = Date.now()
): Promise<string | null> {
  if (!secret) return null;
  const payload = String(issuedAt);
  return `${payload}.${await sign(payload, secret)}`;
}

export type FormTokenResult = "ok" | "too_fast" | "expired" | "invalid";

export async function verifyFormToken(
  token: string,
  secret: string | undefined,
  { minAgeMs, maxAgeMs }: { minAgeMs: number; maxAgeMs: number }
): Promise<FormTokenResult> {
  if (!secret) return "ok";

  const [payload, mac] = token.split(".");
  if (!payload || !mac) return "invalid";
  if (!equalsConstantTime(mac, await sign(payload, secret))) return "invalid";

  const issuedAt = Number(payload);
  if (!Number.isFinite(issuedAt)) return "invalid";

  const age = Date.now() - issuedAt;
  if (age < minAgeMs) return "too_fast";
  if (age > maxAgeMs) return "expired";
  return "ok";
}
