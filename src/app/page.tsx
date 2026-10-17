import { getCurrentUser } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import { TodayView } from "@/components/today-view";
import { LandingPage } from "@/components/landing/landing-page";
import { TelegramMiniAppLogin } from "@/components/telegram-mini-app-login";

export default async function RootPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <>
        <TelegramMiniAppLogin keyin="/" />
        <LandingPage />
      </>
    );
  }

  return (
    <AppShell user={user}>
      <TodayView user={user} />
    </AppShell>
  );
}
