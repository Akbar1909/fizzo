import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { Logo } from "@/components/logo";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  await requireAdmin();

  return (
    <div style={{ minHeight: "100dvh" }}>
      <header style={{ borderBottom: "1px solid var(--line)", padding: "16px 20px" }}>
        <div className="page-wide" style={{ display: "flex", alignItems: "center", gap: 20, padding: 0 }}>
          <Logo height={20} />
          <nav style={{ display: "flex", gap: 16 }}>
            <Link href="/admin/savollar" style={{ fontSize: 14, fontWeight: 600 }}>
              Savollar
            </Link>
            <Link href="/admin/sharhlar" style={{ fontSize: 14, fontWeight: 600 }}>
              Sharhlar
            </Link>
          </nav>
          <Link href="/" style={{ marginLeft: "auto", fontSize: 13, color: "var(--muted)" }}>
            Ilovaga qaytish
          </Link>
        </div>
      </header>
      <div className="page-wide" style={{ paddingTop: 24, paddingBottom: 40 }}>
        {children}
      </div>
    </div>
  );
}
