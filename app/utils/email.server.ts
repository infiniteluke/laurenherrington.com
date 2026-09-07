/**
 * Cloudflare Email Workers only accepts raw RFC-5322, and hand-building it is
 * cheaper than a MIME dependency for a single plain-text notification. The
 * rules that matter: CRLF line endings, and Date + Message-ID are required or
 * the binding rejects the message.
 */

const CRLF = "\r\n";

/** Header values can't contain line breaks, or a submitter could inject headers. */
function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/** Strict enough that anything passing is safe to put in a header. */
const EMAIL_PATTERN =
  /^[^\s@<>,;:"()[\]\\]+@[^\s@<>,;:"()[\]\\.]+(\.[^\s@<>,;:"()[\]\\.]+)+$/;

export function isPlausibleEmail(value: string): boolean {
  return value.length <= 254 && EMAIL_PATTERN.test(value);
}

function base64Utf8(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const encoded = btoa(binary);
  return (encoded.match(/.{1,76}/g) ?? []).join(CRLF);
}

interface PlainTextEmail {
  from: string;
  to: string;
  subject: string;
  body: string;
  /** Only set when it passed `isPlausibleEmail`. */
  replyTo?: string;
}

function buildRawEmail({
  from,
  to,
  subject,
  body,
  replyTo,
}: PlainTextEmail): string {
  const domain = from.split("@")[1] ?? "localhost";
  const headers = [
    `From: ${sanitizeHeaderValue(from)}`,
    `To: ${sanitizeHeaderValue(to)}`,
    `Subject: ${sanitizeHeaderValue(subject)}`,
    `Message-ID: <${crypto.randomUUID()}@${domain}>`,
    `Date: ${new Date().toUTCString()}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    // Base64 keeps emoji and long lines from tripping 8-bit / line-length limits.
    "Content-Transfer-Encoding: base64",
  ];
  if (replyTo) headers.push(`Reply-To: ${sanitizeHeaderValue(replyTo)}`);

  return `${headers.join(CRLF)}${CRLF}${CRLF}${base64Utf8(body)}${CRLF}`;
}

/**
 * Sends via the `send_email` binding, which is unavailable in local dev and
 * unset until the destination address is verified in Email Routing. Returns
 * false instead of throwing in those cases: the submission is already in D1,
 * so a missing notification is a degraded state, not a lost message.
 */
export async function sendPlainTextEmail(
  binding: SendEmail | undefined,
  message: PlainTextEmail
): Promise<boolean> {
  if (!binding) {
    console.warn("SEND_EMAIL binding unavailable; skipping notification");
    return false;
  }

  try {
    // Imported lazily: the prerender step loads this bundle in Node, which
    // can't resolve the `cloudflare:` scheme at module load time.
    const { EmailMessage } = await import("cloudflare:email");
    await binding.send(
      new EmailMessage(message.from, message.to, buildRawEmail(message))
    );
    return true;
  } catch (error) {
    console.error("Failed to send notification email", error);
    return false;
  }
}
