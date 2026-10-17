import type { Metadata, Viewport } from "next";
import { Onest, STIX_Two_Text, Unbounded } from "next/font/google";
import Script from "next/script";
import { TelegramBootstrap } from "@/components/telegram-bootstrap";
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

export const metadata: Metadata = {
  title: "fizzo — fizikadan Milliy sertifikatga tayyorgarlik",
  description: "Fizikani har kuni oz-ozdan: Milliy sertifikat va DTM uchun animatsiyali yechimlar bilan mashq qiling.",
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
      </head>
      <body>
        <TelegramBootstrap />
        {children}
      </body>
    </html>
  );
}
