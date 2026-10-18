import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FONT, H, NOT_FOUND, W, useHind, type ShortProps } from "./common";

const YELLOW = "#FFE600";
const RED = "#D90429";
const NAVY = "#0B1F5C";
const BRUSH =
  "polygon(0% 14%, 3% 0%, 8% 9%, 14% 0%, 22% 7%, 31% 0%, 42% 8%, 53% 0%, 63% 7%, 74% 0%, 85% 8%, 94% 0%, 100% 11%, 98% 46%, 100% 79%, 96% 100%, 88% 93%, 78% 100%, 66% 94%, 55% 100%, 44% 93%, 33% 100%, 21% 94%, 11% 100%, 4% 92%, 0% 100%, 2% 55%)";
const SHADOW = "3px 4px 0 rgba(0,0,0,0.4)";
const OUTLINE = "0 5px 0 #000, 5px 0 0 #000, -5px 0 0 #000, 0 -5px 0 #000, 4px 4px 0 #000, -4px 4px 0 #000, 0 12px 26px rgba(0,0,0,0.6)";

const BANDS: Record<string, string> = {
  recruitment: "सरकारी नौकरी",
  exam: "परीक्षा अपडेट",
  admit_card: "एडमिट कार्ड",
  result: "रिजल्ट अपडेट",
  other: "सरकारी अपडेट",
};

const TAGS: Record<string, string> = {
  recruitment: "नई भर्ती अलर्ट",
  exam: "परीक्षा अलर्ट",
  admit_card: "एडमिट कार्ड जारी",
  result: "रिजल्ट जारी",
  other: "नया अपडेट",
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

export const Thumb: React.FC<ShortProps> = ({ thumbnailText, title, info, kind, bg }) => {
  useHind();
  const k = kind && BANDS[kind] ? kind : "recruitment";
  const lb = info.labels || {};
  const clean = (v?: string) => {
    const t = (v || "").trim();
    return t && t !== NOT_FOUND ? t : "";
  };
  const all: Box[] = [
    { label: lb.totalPosts || "कुल पद", value: clean(info.totalPosts), color: "#0B3D91" },
    { label: lb.startDate || (k === "recruitment" ? "आवेदन शुरू" : "शुरू तारीख"), value: clean(info.startDate), color: "#0B6B2E" },
    { label: lb.lastDate || "अंतिम तारीख", value: clean(info.lastDate), color: RED },
    { label: "वेतन", value: clean(info.salary), color: "#5B21B6" },
    { label: "उम्र सीमा", value: clean(info.ageLimit), color: "#0E7490" },
  ];
  const boxes = all.filter((b) => b.value);
  const rows: Box[][] =
    boxes.length <= 3 ? (boxes.length ? [boxes] : []) : boxes.length === 4 ? [boxes.slice(0, 2), boxes.slice(2)] : [boxes.slice(0, 3), boxes.slice(3)];
  const GAP = 18;
  const rowH = rows.length > 1 ? 130 : 170;
  const totalH = rows.length * rowH + Math.max(0, rows.length - 1) * GAP;
  const top0 = 1415 + (285 - totalH) / 2;

  const name = (info.postName || title || thumbnailText || "").trim().slice(0, 70);
  const nameSize = pick([...name].length, [[12, 140], [18, 120], [26, 100], [36, 86]], 72);
  const bubble = (thumbnailText || "बड़ी खबर!").trim();
  const bubbleSize = pick([...bubble].length, [[10, 64], [16, 56], [24, 48]], 42);
  const cta = k === "recruitment" ? "APPLY NOW" : "CHECK NOW";

  return (
    <AbsoluteFill style={{ width: W, height: H, background: "linear-gradient(180deg, #06143a 0%, #0c2f86 34%, #1f5fd0 52%, #ff9a2e 86%, #ff7a00 100%)", fontFamily: FONT, fontWeight: 700, overflow: "hidden" }}>
      {bg ? (
        <>
          <Img src={staticFile(bg)} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, objectFit: "cover" }} />
          <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 560, background: "linear-gradient(180deg, rgba(5,16,46,0.9) 0%, rgba(5,16,46,0.7) 55%, rgba(5,16,46,0) 100%)" }} />
          <div style={{ position: "absolute", left: 0, top: 1150, width: W, height: 770, background: "linear-gradient(180deg, rgba(5,16,46,0) 0%, rgba(5,16,46,0.82) 20%, rgba(5,16,46,0.95) 100%)" }} />
        </>
      ) : (
        <>
          <div
            style={{
              position: "absolute",
              left: 540 - 900,
              top: 560 - 900,
              width: 1800,
              height: 1800,
              borderRadius: "50%",
              background: "repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.26) 0deg 7deg, rgba(255,255,255,0) 7deg 18deg)",
              WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%)",
              maskImage: "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%)",
            }}
          />
          <div style={{ position: "absolute", left: 350, top: 600, width: 380, height: 380, borderRadius: "50%", background: "#FFFFFF", border: "10px solid " + NAVY, boxShadow: "0 14px 44px rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Chakra size={330} color={NAVY} />
          </div>
        </>
      )}

      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 14, background: "#FF9933" }} />
      <div style={{ position: "absolute", left: 0, top: 14, width: W, height: 14, background: "#FFFFFF" }} />
      <div style={{ position: "absolute", left: 0, top: 28, width: W, height: 14, background: "#138808" }} />

      <div style={{ position: "absolute", left: 90, top: 75, width: 900, height: 120, boxSizing: "border-box", borderRadius: 60, background: RED, border: "7px solid #FFFFFF", boxShadow: "0 10px 30px rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", gap: 22, color: "#FFFFFF", fontSize: 64, lineHeight: 1.2 }}>
        <div style={{ width: 28, height: 28, borderRadius: 14, background: "#FFFFFF" }} />
        <div>{TAGS[k]}</div>
        <div style={{ width: 28, height: 28, borderRadius: 14, background: "#FFFFFF" }} />
      </div>

      <div style={{ position: "absolute", left: 50, top: 215, width: 980, height: 295, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", overflow: "hidden", color: YELLOW, fontSize: nameSize, lineHeight: 1.12, textShadow: OUTLINE }}>
        {name}
      </div>

      <div style={{ position: "absolute", left: 640, top: 600, width: 400, height: 190, boxSizing: "border-box", borderRadius: 40, background: "#FFFFFF", border: "8px solid #111111", boxShadow: "0 10px 30px rgba(0,0,0,0.4)", transform: "rotate(3deg)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 20px", color: RED, fontSize: bubbleSize, lineHeight: 1.2, overflow: "hidden" }}>
        {bubble}
      </div>
      <div style={{ position: "absolute", left: 662, top: 772, width: 46, height: 46, background: "#FFFFFF", borderLeft: "8px solid #111111", borderBottom: "8px solid #111111", boxSizing: "border-box", transform: "rotate(45deg)" }} />

      <div style={{ position: "absolute", left: 20, top: 1235, width: 1040, height: 160, background: RED, clipPath: BRUSH, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontSize: 112, lineHeight: 1.2, textShadow: SHADOW }}>
        {BANDS[k]}
      </div>

      {rows.map((row, r) =>
        row.map((b, i) => {
          const bw = (980 - (row.length - 1) * GAP) / row.length;
          const wide = bw > 400;
          const vs = wide ? pick([...b.value].length, [[10, 60], [16, 50], [24, 40]], 32) : pick([...b.value].length, [[6, 58], [10, 46], [16, 36], [24, 30]], 26);
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
                boxShadow: "0 8px 22px rgba(0,0,0,0.4)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                textAlign: "center",
                padding: "0 10px",
                overflow: "hidden",
              }}
            >
              <div style={{ color: "#FFFFFF", fontSize: wide ? 34 : 30, lineHeight: 1.25 }}>{b.label}</div>
              <div style={{ color: YELLOW, fontSize: vs, lineHeight: 1.2 }}>{b.value}</div>
            </div>
          );
        })
      )}

      <div style={{ position: "absolute", left: 50, top: 1710, width: 640, height: 62, background: "#111111", clipPath: BRUSH, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontSize: 38, lineHeight: 1.2 }}>
        राजस्थान सरकारी हेल्प सेंटर
      </div>
      <div style={{ position: "absolute", left: 50, top: 1785, width: 640, height: 110, boxSizing: "border-box", borderRadius: 55, background: RED, border: "6px solid #FFFFFF", boxShadow: "0 8px 22px rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontSize: 66, letterSpacing: 2 }}>
        {cta + "  >"}
      </div>
      <div style={{ position: "absolute", left: 710, top: 1745, width: 330, height: 160, background: YELLOW, clipPath: BRUSH, transform: "rotate(-5deg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#000000", fontSize: 50, lineHeight: 1.25 }}>
        <div>फॉलो करें</div>
        <div style={{ fontSize: 34, color: RED }}>रोज़ नई भर्ती</div>
      </div>
    </AbsoluteFill>
  );
};
