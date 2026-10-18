import { ImageResponse } from "next/og";

export const alt = "fizzo — fizikadan Milliy sertifikatga tayyorgarlik";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px 96px",
          background: "#1b2430",
          color: "#f6f3ec",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 84, fontWeight: 700, letterSpacing: "-0.03em" }}>
          fizzo
          <span style={{ color: "#f07a3e" }}>.</span>
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 40, fontWeight: 600, lineHeight: 1.3, maxWidth: 920 }}>
          Fizikadan Milliy sertifikatga o&apos;zbek tilida tayyorlaning
        </div>
        <div style={{ display: "flex", marginTop: 36, gap: 16 }}>
          {["Rasmiy 5 bo'lim", "45 savollik mock test", "Bepul"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: 999,
                background: "rgba(246,243,236,0.1)",
                fontSize: 26,
                fontWeight: 600,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
