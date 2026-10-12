import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT, NOT_FOUND, useHind, type ShortProps } from "./common";

// Thumbnail me sirf wahi cheezein jo officially verified hain (NOT_FOUND ya khali ho to chhod do).
export const Thumb: React.FC<ShortProps> = ({ thumbnailText, title, info }) => {
  useHind();
  const text = (thumbnailText || title || "").trim();
  const lb = info.labels || {};
  const parts = [
    info.totalPosts && info.totalPosts !== NOT_FOUND ? (lb.totalPosts || "कुल पद") + ": " + info.totalPosts : "",
    info.lastDate && info.lastDate !== NOT_FOUND ? (lb.lastDate || "अंतिम तारीख") + ": " + info.lastDate : "",
  ].filter(Boolean);
  const joined = parts.join(" • ");
  const chip = [...joined].length > 38 ? parts[0] ?? "" : joined;
  const n = [...text].length;
  const size = n <= 12 ? 138 : n <= 20 ? 118 : n <= 28 ? 96 : 80;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #1d4ed8, #0f172a)", fontFamily: FONT, fontWeight: 700 }}>
      <div style={{ position: "absolute", right: -160, top: -180, width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle, rgba(56,189,248,0.45) 0%, rgba(0,0,0,0) 70%)" }} />
      <div style={{ position: "absolute", left: -120, bottom: -220, width: 640, height: 640, borderRadius: "50%", background: "radial-gradient(circle, rgba(217,4,41,0.35) 0%, rgba(0,0,0,0) 70%)" }} />
      <div style={{ position: "absolute", left: 70, top: 62, fontSize: 34, letterSpacing: 3, color: "#93c5fd" }}>RAJASTHAN SARKARI HELP CENTER</div>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 130,
          width: 1140,
          height: chip ? 400 : 520,
          display: "flex",
          alignItems: "center",
          fontSize: size,
          lineHeight: 1.22,
          color: "#fde047",
          textShadow: "3px 4px 0 #000",
        }}
      >
        {text}
      </div>
      {chip ? (
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 560,
            padding: "8px 30px",
            borderRadius: 40,
            background: "#dc2626",
            color: "#ffffff",
            fontSize: 46,
            lineHeight: 1.4,
          }}
        >
          {chip}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
