import { data } from "react-router";
import type { Route } from "./+types/contact";
import { ButtonLink } from "~/components/ButtonLink";
import { ContactForm } from "~/components/ContactForm";
import {
  countRecentMessagesByIp,
  markMessageEmailed,
  recordMessage,
} from "~/data/messages.server";
import { isPlausibleEmail, sendPlainTextEmail } from "~/utils/email.server";
import { computeIpHash } from "~/utils/ipHash.server";
import { createFormToken, verifyFormToken } from "~/utils/formToken.server";
import { verifyTurnstile } from "~/utils/turnstile.server";

// Send-only address on the zone; no routing rule points at it, so mail sent
// back to it goes nowhere. The recipient is the CONTACT_TO secret.
const NOTIFY_FROM = "contact@laurenherrington.com";

const MIN_FILL_MS = 3_000;
const MAX_FORM_AGE_MS = 12 * 60 * 60 * 1_000;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1_000;
const RATE_LIMIT_MAX = 3;

export function meta() {
  return [{ title: "Contact" }];
}

export async function loader({ context }: Route.LoaderArgs) {
  const env = context.cloudflare.env;
  return {
    formToken: await createFormToken(env.FORM_SECRET),
    turnstileSiteKey: env.TURNSTILE_SITE_KEY ?? null,
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const env = context.cloudflare.env;
  const form = await request.formData();

  // Silently accept honeypot hits: telling a bot it failed just teaches it.
  if (String(form.get("website") ?? "").trim()) {
    return data({ ok: true as const });
  }

  const tokenResult = await verifyFormToken(
    String(form.get("formToken") ?? ""),
    env.FORM_SECRET,
    { minAgeMs: MIN_FILL_MS, maxAgeMs: MAX_FORM_AGE_MS }
  );
  if (tokenResult === "too_fast") {
    return data({
      ok: false as const,
      error: "That was quick! Give it another try.",
    });
  }
  if (tokenResult !== "ok") {
    return data({
      ok: false as const,
      error: "This form expired. Please reload the page and try again.",
    });
  }

  const turnstileOk = await verifyTurnstile(
    String(form.get("cf-turnstile-response") ?? ""),
    env.TURNSTILE_SECRET_KEY,
    request.headers.get("CF-Connecting-IP")
  );
  if (!turnstileOk) {
    return data({
      ok: false as const,
      error: "Couldn't verify you're human. Please reload and try again.",
    });
  }

  const name = String(form.get("name") ?? "")
    .trim()
    .slice(0, 80);
  const email = String(form.get("email") ?? "")
    .trim()
    .slice(0, 254);
  const body = String(form.get("body") ?? "")
    .trim()
    .slice(0, 4000);

  if (!isPlausibleEmail(email)) {
    return data({
      ok: false as const,
      error: "That email address doesn't look right.",
    });
  }
  if (!body) {
    return data({ ok: false as const, error: "Please write a message." });
  }

  const db = env.LUEBOO_DB;
  const ipHash = await computeIpHash(request, env.IP_HASH_SALT);
  if (ipHash) {
    const recent = await countRecentMessagesByIp(
      db,
      ipHash,
      Date.now() - RATE_LIMIT_WINDOW_MS
    );
    if (recent >= RATE_LIMIT_MAX) {
      return data({
        ok: false as const,
        error: "You've sent a few messages already. Try again later.",
      });
    }
  }

  const message = await recordMessage(db, {
    name: name || null,
    email,
    body,
    ipHash,
  });

  const notifyTo = env.CONTACT_TO;
  if (!notifyTo) {
    console.warn("CONTACT_TO is unset; message stored without a notification");
  }

  const sent = !notifyTo
    ? false
    : await sendPlainTextEmail(env.SEND_EMAIL, {
        from: NOTIFY_FROM,
        to: notifyTo,
        subject: "New message from laurenherrington.com",
        body: [
          `From: ${name || "(no name)"} <${email}>`,
          `Received: ${new Date(message.createdAt).toISOString()}`,
          "",
          body,
        ].join("\n"),
        replyTo: email,
      });
  if (sent) await markMessageEmailed(db, message.id);

  return data({ ok: true as const });
}

export default function Contact({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { formToken, turnstileSiteKey } = loaderData;
  const sent = actionData?.ok === true;

  return (
    <main className="flex flex-col items-center gap-6 mx-4 my-8 max-w-2xl md:mx-auto">
      <header className="text-center flex flex-col gap-2">
        <h1>Contact</h1>
      </header>

      {sent ? (
        <div className="text-center text-sm bg-win95-silver border-2 border-t-win95-shadow border-l-win95-shadow border-b-win95-highlight border-r-win95-highlight p-3 w-full max-w-md">
          Thanks! Your message is on its way.
        </div>
      ) : (
        <ContactForm
          formToken={formToken}
          turnstileSiteKey={turnstileSiteKey}
          error={actionData?.ok === false ? actionData.error : null}
        />
      )}

      <ButtonLink to="/" className="text-sm">
        Home
      </ButtonLink>
    </main>
  );
}
