import { ImageResponse } from "next/og";

// §13.1 — the link preview a recruiter sees. Minimal sun mark + name, on-palette.
export const alt = "Aryan Malhotra — Software · Data · Product";
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
          justifyContent: "flex-end",
          background: "linear-gradient(180deg, #14100B 0%, #2E4C5C 55%, #EBA13A 130%)",
          padding: 72,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 110,
            top: 150,
            width: 190,
            height: 190,
            borderRadius: 999,
            background: "#EBA13A",
            boxShadow: "0 0 120px 40px rgba(235,161,58,0.55)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 60,
            top: 330,
            width: 290,
            height: 3,
            background: "rgba(241,230,206,0.85)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              fontSize: 26,
              letterSpacing: 10,
              color: "#9C8A6C",
              textTransform: "uppercase",
            }}
          >
            Software Engineer · Data · Product
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 800,
              letterSpacing: 2,
              color: "#F1E6CE",
              textTransform: "uppercase",
              lineHeight: 1.05,
            }}
          >
            Aryan Malhotra
          </div>
        </div>
      </div>
    ),
    size
  );
}
