import { Logo } from "@/components/logo";
import { dashboardLoginAction } from "./actions";

export default async function PanelLoginPage({ searchParams }: PageProps<"/panel/login">) {
  const params = await searchParams;
  const hasError = typeof params.xato === "string";

  return (
    <main
      className="page"
      style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 48, paddingBottom: 48 }}
    >
      <div className="stack pop-in" style={{ alignItems: "center", textAlign: "center" }}>
        <Logo height={36} />

        <h1 className="display" style={{ fontSize: 22, marginTop: 8 }}>
          Boshqaruv paneli
        </h1>

        {hasError && (
          <p role="alert" style={{ color: "var(--bad)", fontSize: 14 }}>
            Login yoki parol xato.
          </p>
        )}

        <form action={dashboardLoginAction} className="stack-sm" style={{ width: "100%", maxWidth: 280, marginTop: 16 }}>
          <input name="username" placeholder="Login" autoComplete="username" required className="input" />
          <input name="password" type="password" placeholder="Parol" autoComplete="current-password" required className="input" />
          <button type="submit" className="btn btn-primary btn-block">
            Kirish
          </button>
        </form>
      </div>
    </main>
  );
}
