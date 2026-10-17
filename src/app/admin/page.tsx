import { getDashboardStats } from "@/lib/admin-stats";
import { DashboardStatsView } from "@/components/admin/dashboard-stats-view";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="stack">
      <h1 className="display" style={{ fontSize: 22 }}>
        Dashboard
      </h1>
      <DashboardStatsView stats={stats} reviewsLink="/admin/sharhlar" />
    </div>
  );
}
