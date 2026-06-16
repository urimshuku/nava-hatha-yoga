import { ImageResponse } from "next/og";

import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export const alt = `${SITE_NAME} — Classical Hatha Yoga`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAF6EE",
          color: "#211C16",
          padding: "80px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "#B08D57",
          }}
        >
          Nava
        </div>
        <div style={{ fontSize: 88, marginTop: 16, fontWeight: 600 }}>
          {SITE_NAME}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginTop: 36,
          }}
        >
          <div style={{ width: 80, height: 2, backgroundColor: "#D8CCB6" }} />
          <div style={{ width: 10, height: 10, backgroundColor: "#C9A86A", transform: "rotate(45deg)" }} />
          <div style={{ width: 80, height: 2, backgroundColor: "#D8CCB6" }} />
        </div>
        <div style={{ fontSize: 34, marginTop: 36, color: "#6B5D4C", maxWidth: 820 }}>
          {SITE_TAGLINE}
        </div>
        <div style={{ fontSize: 26, marginTop: 28, color: "#6B5D4C" }}>
          Saranda, Albania
        </div>
      </div>
    ),
    { ...size },
  );
}
