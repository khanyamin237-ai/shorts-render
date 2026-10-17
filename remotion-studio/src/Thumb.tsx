import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT, H, NOT_FOUND, W, useHind, type ShortProps } from "./common";

const YELLOW = "#FFE600";
const RED = "#D90429";
const NAVY = "#0B1F5C";
const BRUSH =
  "polygon(0% 14%, 3% 0%, 8% 9%, 14% 0%, 22% 7%, 31% 0%, 42% 8%, 53% 0%, 63% 7%, 74% 0%, 85% 8%, 94% 0%, 100% 11%, 98% 46%, 100% 79%, 96% 100%, 88% 93%, 78% 100%, 66% 94%, 55% 100%, 44% 93%, 33% 100%, 21% 94%, 11% 100%, 4% 92%, 0% 100%, 2% 55%)";
const SHADOW = "3px 4px 0 rgba(0,0,0,0.35)";

const BANDS: Record<string, string> = {
  recruitment: "सरकारी नौकरी",
  exam: "परीक्षा अपडेट",
  admit_card: "एडमिट कार्ड",
  result: "रिजल्ट अपडेट",
  other: "सरकारी अपडेट",
};

const pick = (n: number, steps: Array<[number, number]>, min: number) => {
  for (const [limit, size] of steps) if (n <= limit) return size;
  return min;
};

const Chakra: React.FC<{ size: number; color: string }> = ({ size, color }) => {
  const c = size / 2;
  const spokes = Array.from({ length: 24 }, (_, i) => {
    const a = (i * 15 * Math.PI) / 180;
    return (
      <line
        key={i}
        x1={c + Math.cos(a) * size * 0.12}
        y1={c + Math.sin(a) * size * 0.12}
        x2={c + Math.cos(a) * size * 0.43}
        y2={c + Math.sin(a) * size * 0.43}
        stroke={color}
        strokeWidth={size * 0.022}
        strokeLinecap="round"
      />
    );
  });
  return (
    <svg width={size} height={size} viewBox={"0 0 " + size + " " + size}>
      <circle cx={c} cy={c} r={size * 0.46} fill="none" stroke={color} strokeWidth={size * 0.04} />
      <circle cx={c} cy={c} r={size * 0.07} fill={color} />
      {spokes}
    </svg>
  );
};

type Box = { label: string; value: string; color: string };

export const Thumb: React.FC<ShortProps> = ({ thumbnailText, title, info, kind }) => {
  useHind();
  const k = kind && BANDS[kind] ? kind : "recruitment";
  const lb = info.labels || {};
  const clean = (v?: string) => {
    const t = (v || "").trim();
    return t && t !== NOT_FOUND ? t : "";
  };
  const all: Box[] = [
    { label: lb.totalPosts || "कुल पद", value: clean(info.totalPosts), color: "#0D3B8E" },
    { label: lb.startDate || (k === "recruitment" ? "आवेदन शुरू" : "शुरू तारीख"), value: clean(info.startDate), color: "#0B6B2E" },
    { label: lb.lastDate || "अंतिम तारीख", value: clean(info.lastDate), color: RED },
    { label: "वेतन", value: clean(info.salary), color: "#5B21B6" },
    { label: "उम्र सीमा", value: clean(info.ageLimit), color: "#0E7490" },
  ];
  const boxes = all.filter((b) => b.value);
  const rows: Box[][] = !boxes.length
    ? []
    : boxes.length <= 3
      ? [boxes]
      : boxes.length === 4
        ? [boxes.slice(0, 2), boxes.slice(2)]
        : [boxes.slice(0, 3), boxes.slice(3)];
  const GAP = 24;
  const rowH = rows.length > 1 ? 160 : 180;
  const totalH = rows.length * rowH + Math.max(0, rows.length - 1) * GAP;
  const top0 = 1235 + (385 - totalH) / 2;

  const name = (info.postName || title || thumbnailText || "").trim().slice(0, 70);
  const nameSize = pick([...name].length, [[14, 150], [22, 128], [32, 108], [44, 90]], 76);
  const bubble = (thumbnailText || "बड़ी खबर!").trim();
  const bubbleSize = pick([...bubble].length, [[10, 76], [16, 62]], 50);
  const cta = k === "recruitment" ? "APPLY NOW" : "CHECK NOW";

  return (
    <AbsoluteFill style={{ width: W, height: H, background: "linear-gradient(180deg, #1b5fc4 0%, #4ea3ee 30%, #bfe0ff 55%, #5b8f4a 82%, #2d5e2a 100%)", fontFamily: FONT, fontWeight: 700 }}>
      <div
        style={{
          position: "absolute",
          left: 540 - 800,
          top: 440 - 800,
          width: 1600,
          height: 1600,
          borderRadius: "50%",
          background: "repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.30) 0deg 8deg, rgba(255,255,255,0) 8deg 20deg)",
          WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 62%)",
          maskImage: "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 62%)",
        }}
      />
      <div style={{ position: "absolute", left: -200, top: 1500, width: 1480, height: 700, borderRadius: "50%", background: "#2f6b2a", opacity: 0.55 }} />

      {[
        { top: 40, color: "#FF9933" },
        { top: 118, color: "#FFFFFF" },
        { top: 196, color: "#138808" },
      ].map((b, i) => (
        <div key={i} style={{ position: "absolute", left: -170, top: b.top, width: 760, height: 86, background: b.color, clipPath: BRUSH, transform: "rotate(-18deg)", filter: "drop-shadow(2px 3px 2px rgba(0,0,0,0.3))" }} />
      ))}
      <div style={{ position: "absolute", left: 60, top: 70, width: 150, height: 150, borderRadius: "50%", background: "#FFFFFF", border: "6px solid " + NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Chakra size={128} color={NAVY} />
      </div>

      <div style={{ position: "absolute", left: 500, top: 90, width: 540, height: 250, boxSizing: "border-box", borderRadius: 44, background: "#FFFFFF", border: "7px solid #111111", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px", color: RED, fontSize: bubbleSize, lineHeight: 1.25, overflow: "hidden" }}>
        {bubble}
      </div>
      <div style={{ position: "absolute", left: 560, top: 318, width: 56, height: 56, background: "#FFFFFF", borderRight: "7px solid #111111", borderBottom: "7px solid #111111", transform: "rotate(45deg)" }} />

      <div style={{ position: "absolute", left: 540 - 205, top: 440 - 205, width: 410, height: 410, borderRadius: "50%", background: "#FFFFFF", border: "10px solid " + NAVY, boxShadow: "0 12px 40px rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Chakra size={350} color={NAVY} />
      </div>

      <div style={{ position: "absolute", left: 20, top: 650, width: 1040, height: 170, background: RED, clipPath: BRUSH, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontSize: 118, lineHeight: 1.2, textShadow: SHADOW }}>
        {BANDS[k]}
      </div>
      <div style={{ position: "absolute", left: 40, top: 800, width: 1000, height: 290, background: YELLOW, clipPath: BRUSH, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 70px", boxSizing: "border-box", overflow: "hidden", color: "#000000", fontSize: nameSize, lineHeight: 1.12 }}>
        {name}
      </div>
      <div style={{ position: "absolute", left: 60, top: 1085, width: 960, height: 110, background: "#111111", clipPath: BRUSH, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontSize: 54, lineHeight: 1.2 }}>
        राजस्थान सरकारी हेल्प सेंटर
      </div>

      {rows.map((row, r) =>
        row.map((b, i) => {
          const bw = (980 - (row.length - 1) * GAP) / row.length;
          const vs = pick([...b.value].length, [[8, 64], [14, 52], [22, 42]], 34);
          return (
            <div
              key={r + "-" + i}
              style={{
                position: "absolute",
                left: 50 + i * (bw + GAP),
                top: top0 + r * (rowH + GAP),
                width: bw,
                height: rowH,
                boxSizing: "border-box",
                borderRadius: 26,
                background: b.color,
                border: "4px solid #FFFFFF",
                boxShadow: "0 8px 22px rgba(0,0,0,0.35)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                textAlign: "center",
                padding: "0 10px",
                overflow: "hidden",
              }}
            >
              <div style={{ color: "#FFFFFF", fontSize: 34, lineHeight: 1.25 }}>{b.label}</div>
              <div style={{ color: YELLOW, fontSize: vs, lineHeight: 1.2 }}>{b.value}</div>
            </div>
          );
        })
      )}

      <div style={{ position: "absolute", left: 40, top: 1635, width: 640, height: 100, background: YELLOW, clipPath: BRUSH, display: "flex", alignItems: "center", justifyContent: "center", color: "#000000", fontSize: 50, lineHeight: 1.2 }}>
        सभी जानकारी यहां देखें
      </div>
      <div style={{ position: "absolute", left: 50, top: 1745, width: 640, height: 120, boxSizing: "border-box", borderRadius: 60, background: RED, border: "6px solid #FFFFFF", boxShadow: "0 8px 22px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontSize: 70, letterSpacing: 2 }}>
        {cta + "  >"}
      </div>
      <div style={{ position: "absolute", left: 710, top: 1700, width: 330, height: 170, background: RED, clipPath: BRUSH, transform: "rotate(-5deg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontSize: 50, lineHeight: 1.25, textShadow: SHADOW }}>
        <div>फॉलो करें</div>
        <div style={{ fontSize: 34, color: YELLOW }}>रोज़ नई भर्ती</div>
      </div>
    </AbsoluteFill>
  );
};
