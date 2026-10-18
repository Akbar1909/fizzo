import { getDashboardStats } from "@/lib/admin-stats";
import { DashboardStatsView } from "@/components/admin/dashboard-stats-view";

export default async function PanelPage() {
  const stats = await getDashboardStats();
  return <DashboardStatsView stats={stats} reviewsLink="/panel/sharhlar" />;
}
