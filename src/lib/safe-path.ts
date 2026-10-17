/** Guards a redirect target against open-redirect payloads like "//evil.com" or absolute URLs. */
export function sanitizeInternalPath(path: string | null | undefined): string {
  if (!path) return "/";
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) {
    return "/";
  }
  return path;
}
