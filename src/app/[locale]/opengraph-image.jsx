import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const alt = "Berkant Karakayış — Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const stack = ["React", "TypeScript", "Next.js", "Node.js", "WebSocket", "Redis", "Canvas"];

export default async function OpenGraphImage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "og" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #1f252d 0%, #2b323a 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: "hsl(165, 60%, 40%)",
            opacity: 0.9,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 60,
            bottom: -180,
            width: 360,
            height: 360,
            borderRadius: 9999,
            border: "2px solid rgba(255,255,255,0.15)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "hsl(165, 60%, 55%)",
              fontWeight: 700,
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: 99, background: "hsl(165,60%,50%)", display: "flex" }} />
            {t("kicker")}
          </div>
          <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1, letterSpacing: -2, display: "flex", flexDirection: "column" }}>
            <span style={{ color: "hsl(165, 60%, 50%)" }}>BERKANT</span>
            <span>KARAKAYIŞ</span>
          </div>
          <div style={{ fontSize: 28, color: "rgba(255,255,255,0.78)", maxWidth: 720, lineHeight: 1.35, display: "flex" }}>
            {t("blurb")}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 10 }}>
            {stack.map((s) => (
              <div
                key={s}
                style={{
                  display: "flex",
                  padding: "10px 18px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.25)",
                  background: "rgba(255,255,255,0.08)",
                  fontSize: 20,
                  fontWeight: 600,
                }}
              >
                {s}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 24, color: "rgba(255,255,255,0.7)", display: "flex" }}>berkant.vercel.app</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
