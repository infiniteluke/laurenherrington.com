import { useEffect, useRef } from "react";
import { Form, useNavigation } from "react-router";
import { loadTurnstile } from "~/utils/turnstile.client";

interface Props {
  /** Signed render timestamp; absent when no FORM_SECRET is configured. */
  formToken: string | null;
  turnstileSiteKey: string | null;
  error?: string | null;
}

const fieldsetClass =
  "border-2 border-t-win95-shadow border-l-win95-shadow border-b-win95-highlight border-r-win95-highlight bg-win95-silver px-3 py-2";

const inputClass =
  "border-2 border-t-win95-shadow border-l-win95-shadow border-b-win95-highlight border-r-win95-highlight bg-white px-2 py-1 w-full text-sm";

const buttonClass = [
  "px-3 py-1 select-none bg-win95-silver",
  "border-2 border-t-win95-highlight border-l-win95-highlight border-b-win95-shadow border-r-win95-shadow",
  "shadow-[1px_1px_0_black]",
  "active:border-t-win95-shadow active:border-l-win95-shadow active:border-b-win95-highlight active:border-r-win95-highlight",
  "active:shadow-none active:translate-x-px active:translate-y-px",
  "disabled:opacity-50 disabled:cursor-not-allowed",
].join(" ");

export function ContactForm({ formToken, turnstileSiteKey, error }: Props) {
  const busy = useNavigation().state !== "idle";
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!turnstileSiteKey) return;
    let cancelled = false;

    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !widgetContainerRef.current) return;
        widgetIdRef.current =
          turnstile.render(widgetContainerRef.current, {
            sitekey: turnstileSiteKey,
          }) ?? null;
      })
      .catch((cause) => console.error("Could not render Turnstile", cause));

    return () => {
      cancelled = true;
      const widgetId = widgetIdRef.current;
      if (widgetId && window.turnstile) {
        window.turnstile.remove(widgetId);
        widgetIdRef.current = null;
      }
    };
  }, [turnstileSiteKey]);

  // Tokens are single-use, so a rejected submission needs a fresh challenge or
  // the next attempt fails verification for a second, misleading reason.
  useEffect(() => {
    if (error && widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, [error]);

  return (
    <Form method="post" className="flex flex-col gap-3 w-full max-w-md">
      {formToken && <input type="hidden" name="formToken" value={formToken} />}

      {/* Honeypot: hidden from people, irresistible to bots that fill every field. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] w-px h-px overflow-hidden"
      >
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset className={fieldsetClass}>
        <label className="flex flex-col gap-1 text-sm">
          Name
          <input
            type="text"
            name="name"
            maxLength={80}
            placeholder="Your name (optional)"
            autoComplete="name"
            className={inputClass}
            disabled={busy}
          />
        </label>
      </fieldset>

      <fieldset className={fieldsetClass}>
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            name="email"
            required
            maxLength={254}
            placeholder="So I can write back"
            autoComplete="email"
            className={inputClass}
            disabled={busy}
          />
        </label>
      </fieldset>

      <fieldset className={fieldsetClass}>
        <label className="flex flex-col gap-1 text-sm">
          Message
          <textarea
            name="body"
            required
            rows={6}
            maxLength={4000}
            placeholder="Say hi, ask about a piece, commission something..."
            className={inputClass}
            disabled={busy}
          />
        </label>
      </fieldset>

      {/* Filled in by turnstile.render() after mount; empty in server markup. */}
      {turnstileSiteKey && <div ref={widgetContainerRef} />}

      {error && (
        <p className="text-sm bg-win95-silver border-2 border-t-win95-shadow border-l-win95-shadow border-b-win95-highlight border-r-win95-highlight p-2">
          {error}
        </p>
      )}

      <button type="submit" className={buttonClass} disabled={busy}>
        {busy ? "Sending..." : "Send message"}
      </button>
    </Form>
  );
}
