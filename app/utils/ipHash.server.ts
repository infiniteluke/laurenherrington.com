export async function computeIpHash(
  request: Request,
  salt: string | undefined
): Promise<string | null> {
  if (!salt) return null;
  const ip = request.headers.get("CF-Connecting-IP");
  if (!ip) return null;
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
