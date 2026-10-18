import Link from "next/link";
import { requireDashboardAuth } from "@/lib/dashboard-auth";
import { Logo } from "@/components/logo";
import { panelLogoutAction } from "./actions";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireDashboardAuth();

  return (
    <div style={{ minHeight: "100dvh" }}>
      <header style={{ borderBottom: "1px solid var(--line)", padding: "16px 20px" }}>
        <div className="page-wide" style={{ display: "flex", alignItems: "center", gap: 20, padding: 0 }}>
          <Logo height={20} />
          <nav style={{ display: "flex", gap: 16 }}>
            <Link href="/panel" style={{ fontSize: 14, fontWeight: 600 }}>
              Dashboard
            </Link>
            <Link href="/panel/sharhlar" style={{ fontSize: 14, fontWeight: 600 }}>
              Sharhlar
            </Link>
          </nav>
          <form action={panelLogoutAction} style={{ marginLeft: "auto" }}>
            <button type="submit" className="btn btn-ghost" style={{ fontSize: 13 }}>
              Chiqish
            </button>
          </form>
        </div>
      </header>
      <div className="page-wide stack" style={{ paddingTop: 24, paddingBottom: 40 }}>
        {children}
      </div>
    </div>
  );
}
