const COOKIE_NAME = "lh_uid";
const TWO_YEARS_SECONDS = 60 * 60 * 24 * 365 * 2;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export function getOrSetUserUuid(
  request: Request,
  responseHeaders: Headers
): string {
  const cookieHeader = request.headers.get("Cookie") ?? "";
  for (const part of cookieHeader.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === COOKIE_NAME) {
      const value = rest.join("=");
      if (UUID_RE.test(value)) return value;
    }
  }

  const uid = crypto.randomUUID();
  responseHeaders.append(
    "Set-Cookie",
    `${COOKIE_NAME}=${uid}; Path=/; Max-Age=${TWO_YEARS_SECONDS}; HttpOnly; Secure; SameSite=Lax`
  );
  return uid;
}
