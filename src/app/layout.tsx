import type { Metadata, Viewport } from "next";
import { Onest, STIX_Two_Text, Unbounded } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { TelegramBootstrap } from "@/components/telegram-bootstrap";
import { env } from "@/lib/env";
import "katex/dist/katex.min.css";
import "./globals.css";

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
});

const onest = Onest({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-ui",
});

const stixTwoText = STIX_Two_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-math",
});

const TITLE = "fizzo — fizikadan Milliy sertifikatga tayyorgarlik";
const DESCRIPTION =
  "Fizikadan Milliy sertifikat va DTM'ga bepul tayyorgarlik: rasmiy 5 bo'lim bo'yicha mashqlar, animatsiyali yechimlar va imtihon formatidagi mock testlar. Telegram ichida, o'zbek tilida.";

export const metadata: Metadata = {
  metadataBase: new URL("https://fizzo.app"),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: "https://fizzo.app",
    siteName: "fizzo",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  verification: env.googleSiteVerification ? { google: env.googleSiteVerification } : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="uz"
      className={`${unbounded.variable} ${onest.variable} ${stixTwoText.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "fizzo",
              url: "https://fizzo.app",
              description: DESCRIPTION,
              inLanguage: "uz",
              areaServed: "UZ",
            }),
          }}
        />
      </head>
      <body>
        <TelegramBootstrap />
        {children}
      </body>
      {env.gaMeasurementId && <GoogleAnalytics gaId={env.gaMeasurementId} />}
    </html>
  );
}
