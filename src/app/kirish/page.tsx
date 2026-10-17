import { env } from "@/lib/env";
import { sanitizeInternalPath } from "@/lib/safe-path";
import { TelegramLoginWidget } from "@/components/telegram-login-widget";
import { TelegramMiniAppLogin } from "@/components/telegram-mini-app-login";
import { Logo } from "@/components/logo";
import { devLoginAction } from "./actions";

export default async function KirishPage({ searchParams }: PageProps<"/kirish">) {
  const params = await searchParams;
  const keyinRaw = typeof params.keyin === "string" ? params.keyin : undefined;
  const keyin = sanitizeInternalPath(keyinRaw);
  const hasError = typeof params.xato === "string";

  const authUrl = `/api/auth/telegram-widget?keyin=${encodeURIComponent(keyin)}`;
  const googleAuthUrl = `/api/auth/google?keyin=${encodeURIComponent(keyin)}`;

  return (
    <main className="page" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 48, paddingBottom: 48 }}>
      <TelegramMiniAppLogin keyin={keyin} />

      <div className="stack pop-in" style={{ alignItems: "center", textAlign: "center" }}>
        <Logo height={36} />

        <h1 className="display" style={{ fontSize: 26, marginTop: 8 }}>
          Fizikani har kuni oz-ozdan
        </h1>

        <p style={{ color: "var(--muted)", fontSize: 15, maxWidth: 360 }}>
          Milliy sertifikat va DTM uchun fizika masalalarini bosqichma-bosqich
          animatsiyali yechimlar bilan o&apos;rganing.
        </p>

        {hasError && (
          <p role="alert" style={{ color: "var(--bad)", fontSize: 14 }}>
            Kirishda xatolik yuz berdi. Qaytadan urinib ko&apos;ring.
          </p>
        )}

        <div style={{ marginTop: 16 }}>
          <TelegramLoginWidget botUsername={env.telegramBotUsername} authUrl={authUrl} />
        </div>

        {env.googleClientId && (
          <>
            <span style={{ color: "var(--quiet)", fontSize: 13 }}>yoki</span>
            <a href={googleAuthUrl} className="btn btn-block" style={{ maxWidth: 280 }}>
              Google bilan kirish
            </a>
          </>
        )}

        {env.devLoginEnabled && (
          <form action={devLoginAction} style={{ marginTop: 8 }}>
            <input type="hidden" name="keyin" value={keyin} />
            <button type="submit" className="btn btn-block">
              Test foydalanuvchi bilan kirish
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
