"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DASHBOARD_COOKIE_NAME } from "@/lib/constants";
import { dashboardCookieOptions } from "@/lib/dashboard-auth";

export async function panelLogoutAction(): Promise<void> {
  // cookies().delete(name) clears a Path=/ cookie; this one was set with
  // Path=/panel, so it must be cleared with the same path or it lingers.
  (await cookies()).set(DASHBOARD_COOKIE_NAME, "", { ...dashboardCookieOptions(), maxAge: 0 });
  redirect("/panel/login");
}
