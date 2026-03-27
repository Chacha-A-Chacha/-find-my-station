import { ImageResponse } from "next/og";

export const alt = "findmystation — Find Your IEBC Voter Registration Office";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 100%)",
          padding: "60px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
            }}
          >
            📍
          </div>
          <span style={{ fontSize: "28px", fontWeight: 700, color: "white" }}>
            findmystation
          </span>
        </div>

        {/* Center */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "56px",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.15,
              maxWidth: "800px",
            }}
          >
            Find Your IEBC Voter Registration Office
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#a7f3d0",
              lineHeight: 1.4,
              maxWidth: "700px",
            }}
          >
            Search all 290 constituencies. Drop a GPS pin. Get directions.
          </div>
        </div>

        {/* Bottom badges */}
        <div style={{ display: "flex", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(255,255,255,0.12)",
              borderRadius: "12px",
              padding: "12px 20px",
            }}
          >
            <span style={{ fontSize: "22px", fontWeight: 700, color: "white" }}>47</span>
            <span style={{ fontSize: "16px", color: "#d1fae5" }}>Counties</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(255,255,255,0.12)",
              borderRadius: "12px",
              padding: "12px 20px",
            }}
          >
            <span style={{ fontSize: "22px", fontWeight: 700, color: "white" }}>290</span>
            <span style={{ fontSize: "16px", color: "#d1fae5" }}>Constituencies</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(255,255,255,0.12)",
              borderRadius: "12px",
              padding: "12px 20px",
            }}
          >
            <span style={{ fontSize: "22px", fontWeight: 700, color: "white" }}>GPS</span>
            <span style={{ fontSize: "16px", color: "#d1fae5" }}>Community Verified</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
