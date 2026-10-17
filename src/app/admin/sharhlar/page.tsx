import { listReviewsForAdmin } from "@/lib/reviews";
import { decideReviewAction } from "./actions";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("uz-UZ", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

export default async function AdminSharhlarPage() {
  const reviews = await listReviewsForAdmin();

  const pending = reviews.filter((r) => r.status === "PENDING");
  const decided = reviews.filter((r) => r.status !== "PENDING");

  return (
    <div className="stack">
      <h1 className="display" style={{ fontSize: 22 }}>
        Sharhlar
      </h1>

      <section className="stack-sm">
        <h2 style={{ fontSize: 15 }}>Kutilmoqda ({pending.length})</h2>
        {pending.length === 0 && <p style={{ color: "var(--muted)", fontSize: 14 }}>Yangi sharhlar yo&apos;q.</p>}
        {pending.map((review) => (
          <div key={review.id} className="card stack-sm">
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--muted)" }}>
              <span>
                {review.user.firstName} {review.user.lastName ?? ""}
                {review.user.username ? ` (@${review.user.username})` : ""}
              </span>
              <span>{formatDate(review.createdAt)}</span>
            </div>
            <p style={{ fontSize: 15 }}>{review.text}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <form action={decideReviewAction}>
                <input type="hidden" name="id" value={review.id} />
                <input type="hidden" name="status" value="APPROVED" />
                <button type="submit" className="btn" style={{ color: "var(--good)", borderColor: "var(--good)" }}>
                  Tasdiqlash
                </button>
              </form>
              <form action={decideReviewAction}>
                <input type="hidden" name="id" value={review.id} />
                <input type="hidden" name="status" value="REJECTED" />
                <button type="submit" className="btn" style={{ color: "var(--bad)", borderColor: "var(--bad)" }}>
                  Rad etish
                </button>
              </form>
            </div>
          </div>
        ))}
      </section>

      <section className="stack-sm">
        <h2 style={{ fontSize: 15 }}>Hal qilingan</h2>
        {decided.length === 0 && <p style={{ color: "var(--muted)", fontSize: 14 }}>Hali yo&apos;q.</p>}
        {decided.map((review) => (
          <div key={review.id} className="card" style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <div>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>
                {review.user.firstName} {review.user.lastName ?? ""}
              </span>
              <p style={{ fontSize: 14 }}>{review.text}</p>
            </div>
            <span
              className="badge"
              style={
                review.status === "APPROVED"
                  ? { borderColor: "var(--good)", color: "var(--good)" }
                  : { borderColor: "var(--bad)", color: "var(--bad)" }
              }
            >
              {review.status === "APPROVED" ? "Tasdiqlangan" : "Rad etilgan"}
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}
