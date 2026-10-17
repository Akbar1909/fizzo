"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { verifyDashboardCredentials, createDashboardSessionToken, dashboardCookieOptions } from "@/lib/dashboard-auth";
import { DASHBOARD_COOKIE_NAME } from "@/lib/constants";
import { rateLimit } from "@/lib/rate-limit";

export async function dashboardLoginAction(formData: FormData): Promise<void> {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`dashboard-login:${ip}`, { capacity: 8, refillPerSecond: 0.1 })) {
    redirect("/panel/login?xato=1");
  }

  const username = formData.get("username")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!verifyDashboardCredentials(username, password)) {
    redirect("/panel/login?xato=1");
  }

  const token = await createDashboardSessionToken();
  (await cookies()).set(DASHBOARD_COOKIE_NAME, token, dashboardCookieOptions());
  redirect("/panel");
}
