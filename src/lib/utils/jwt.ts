/** Reads user id from JWT payload (no signature verification — server validates on API calls). */
export function getUserIdFromToken(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload)) as { id?: string };
    return decoded.id ?? null;
  } catch {
    return null;
  }
}
