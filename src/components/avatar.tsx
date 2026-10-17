/** Renders to fill whatever sized, circular wrapper the caller provides (e.g. `.nav-avatar`, `.leaderboard-avatar`). */
export function Avatar({ name, photoUrl }: { name: string; photoUrl?: string | null }) {
  if (photoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photoUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  }
  return <>{name.charAt(0).toUpperCase()}</>;
}
