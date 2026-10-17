import { requireDashboardAuth } from "@/lib/dashboard-auth";
import { getDashboardStats } from "@/lib/admin-stats";
import { DashboardStatsView } from "@/components/admin/dashboard-stats-view";
import { Logo } from "@/components/logo";
import { panelLogoutAction } from "./actions";

export default async function PanelPage() {
  await requireDashboardAuth();
  const stats = await getDashboardStats();

  return (
    <div style={{ minHeight: "100dvh" }}>
      <header style={{ borderBottom: "1px solid var(--line)", padding: "16px 20px" }}>
        <div className="page-wide" style={{ display: "flex", alignItems: "center", gap: 20, padding: 0 }}>
          <Logo height={20} />
          <h1 className="display" style={{ fontSize: 16, margin: 0 }}>
            Dashboard
          </h1>
          <form action={panelLogoutAction} style={{ marginLeft: "auto" }}>
            <button type="submit" className="btn btn-ghost" style={{ fontSize: 13 }}>
              Chiqish
            </button>
          </form>
        </div>
      </header>
      <div className="page-wide stack" style={{ paddingTop: 24, paddingBottom: 40 }}>
        <DashboardStatsView stats={stats} />
      </div>
    </div>
  );
}
