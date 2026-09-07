interface TurnstileRenderOptions {
  sitekey: string;
  callback?: (token: string) => void;
  "error-callback"?: () => void;
  "expired-callback"?: () => void;
}

interface TurnstileApi {
  render(el: HTMLElement, options: TurnstileRenderOptions): string | undefined;
  remove(widgetId: string): void;
  reset(widgetId?: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/**
 * `render=explicit` disables the implicit scan for `.cf-turnstile` elements.
 * That scan is incompatible with SSR: it renders into the server-sent markup
 * before hydration, and React then discards the injected iframe as foreign DOM,
 * leaving Turnstile complaining it can't find a widget it just created.
 */
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);

  let script = document.querySelector<HTMLScriptElement>(
    `script[src="${SCRIPT_SRC}"]`
  );
  if (!script) {
    script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    document.head.appendChild(script);
  }

  const pending = script;
  return new Promise((resolve, reject) => {
    // The script may have finished between the check above and this listener.
    if (window.turnstile) return resolve(window.turnstile);
    pending.addEventListener(
      "load",
      () =>
        window.turnstile
          ? resolve(window.turnstile)
          : reject(new Error("Turnstile loaded without exposing its API")),
      { once: true }
    );
    pending.addEventListener(
      "error",
      () => reject(new Error("Turnstile script failed to load")),
      { once: true }
    );
  });
}
