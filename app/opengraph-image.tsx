import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "QA.TestingHub — Professional QA Testing Platform | O'zbekiston";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #09090C 0%, #16161D 50%, #1F1212 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "64px 80px",
          fontFamily: "sans-serif",
          color: "#FAFAF8",
          position: "relative",
        }}
      >
        {/* Subtle background glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "550px",
            height: "550px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255, 107, 71, 0.28) 0%, rgba(255, 107, 71, 0) 70%)",
          }}
        />

        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "#FF6B47",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              fontWeight: 900,
              color: "#FFFFFF",
              boxShadow: "0 8px 24px rgba(255, 107, 71, 0.4)",
            }}
          >
            🧪
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "30px", fontWeight: 800, letterSpacing: "-0.5px" }}>
              QA.<span style={{ color: "#FF6B47" }}>TestingHub</span>
            </span>
            <span style={{ fontSize: "14px", color: "#A1A1AA", fontWeight: 500 }}>
              testinghub.uz • O&apos;zbekiston
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "980px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 20px",
              borderRadius: "9999px",
              background: "rgba(255, 107, 71, 0.15)",
              border: "1px solid rgba(255, 107, 71, 0.35)",
              color: "#FF8E72",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            ✦ Professional Dasturiy Ta&apos;minot Sinov Xizmati
          </div>

          <h1
            style={{
              fontSize: "52px",
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: "-1.5px",
              margin: 0,
              color: "#FFFFFF",
            }}
          >
            Dasturingizdagi kritik bug&apos;larni foydalanuvchilar topmasidan oldin aniqlang
          </h1>

          <p
            style={{
              fontSize: "22px",
              color: "#D4D4D8",
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            Manual & Automated QA • ISTQB Standartlari • API & Security Testing • 24/7 Monitoring
          </p>
        </div>

        {/* Bottom stats row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "54px",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "30px", fontWeight: 900, color: "#FF6B47" }}>28+</span>
            <span style={{ fontSize: "13px", color: "#A1A1AA", fontWeight: 600 }}>Faol Loyihalar</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "30px", fontWeight: 900, color: "#10B981" }}>99.4%</span>
            <span style={{ fontSize: "13px", color: "#A1A1AA", fontWeight: 600 }}>Aniq Natija</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "30px", fontWeight: 900, color: "#FF6B47" }}>1 400+</span>
            <span style={{ fontSize: "13px", color: "#A1A1AA", fontWeight: 600 }}>Topilgan Buglar</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "30px", fontWeight: 900, color: "#60A5FA" }}>ISTQB</span>
            <span style={{ fontSize: "13px", color: "#A1A1AA", fontWeight: 600 }}>Xalqaro Standart</span>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: "18px", color: "#FFFFFF", fontWeight: 700 }}>
              https://testinghub.uz
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
