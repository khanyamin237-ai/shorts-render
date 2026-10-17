import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT, H, NOT_FOUND, W, useHind, type ShortProps } from "./common";

const YELLOW = "#FFE600";
const RED = "#D90429";
const NAVY = "#0B1F5C";
const BRUSH =
  "polygon(0% 14%, 3% 0%, 8% 9%, 14% 0%, 22% 7%, 31% 0%, 42% 8%, 53% 0%, 63% 7%, 74% 0%, 85% 8%, 94% 0%, 100% 11%, 98% 46%, 100% 79%, 96% 100%, 88% 93%, 78% 100%, 66% 94%, 55% 100%, 44% 93%, 33% 100%, 21% 94%, 11% 100%, 4% 92%, 0% 100%, 2% 55%)";
const SHADOW = "3px 4px 0 rgba(0,0,0,0.4)";

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

export const Thumb: React.FC<ShortProps> = ({ thumbnailText, title, info, kind }) => {
  useHind();
  const k = kind && BANDS[kind] ? kind : "recruitment";
  const lb = info.labels || {};
  const clean = (v?: string) => {
    const t = (v || "").trim();
    return t && t !== NOT_FOUND ? t : "";
  };
  const posts = clean(info.totalPosts);
  const all: Box[] = [
    { label: lb.startDate || (k === "recruitment" ? "आवेदन शुरू" : "शुरू तारीख"), value: clean(info.startDate), color: "#0B6B2E" },
    { label: lb.lastDate || "अंतिम तारीख", value: clean(info.lastDate), color: RED },
    { label: "वेतन", value: clean(info.salary), color: "#5B21B6" },
    { label: "उम्र सीमा", value: clean(info.ageLimit), color: "#0E7490" },
  ];
  const boxes = all.filter((b) => b.value);
  const rows: Box[][] = !boxes.length ? [] : boxes.length <= 3 ? [boxes] : [boxes.slice(0, 2), boxes.slice(2)];
  const GAP = 22;
  const rowH = rows.length > 1 ? 150 : 175;
  const totalH = rows.length * rowH + Math.max(0, rows.length - 1) * GAP;
  const top0 = 1365 + (330 - totalH) / 2;

  const name = (info.postName || title || thumbnailText || "").trim().slice(0, 70);
  const nameSize = pick([...name].length, [[14, 150], [22, 128], [32, 108], [44, 90]], 76);
  const bubble = (thumbnailText || "बड़ी खबर!").trim();
  const bubbleSize = pick([...bubble].length, [[14, 88], [24, 72], [34, 60]], 50);
  const cta = k === "recruitment" ? "APPLY NOW" : "CHECK NOW";
  const postsSize = pick([...posts].length, [[4, 96], [7, 74], [11, 56]], 44);

  return (
    <AbsoluteFill style={{ width: W, height: H, background: "linear-gradient(180deg, #06143a 0%, #0c2f86 34%, #1f5fd0 52%, #ff9a2e 86%, #ff7a00 100%)", fontFamily: FONT, fontWeight: 700 }}>
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

      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 14, background: "#FF9933" }} />
      <div style={{ position: "absolute", left: 0, top: 14, width: W, height: 14, background: "#FFFFFF" }} />
      <div style={{ position: "absolute", left: 0, top: 28, width: W, height: 14, background: "#138808" }} />

      <div style={{ position: "absolute", left: 90, top: 75, width: 900, height: 120, boxSizing: "border-box", borderRadius: 60, background: RED, border: "7px solid #FFFFFF", boxShadow: "0 10px 30px rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", gap: 22, color: "#FFFFFF", fontSize: 64, lineHeight: 1.2 }}>
        <div style={{ width: 28, height: 28, borderRadius: 14, background: "#FFFFFF" }} />
        <div>{TAGS[k]}</div>
        <div style={{ width: 28, height: 28, borderRadius: 14, background: "#FFFFFF" }} />
      </div>

      <div style={{ position: "absolute", left: 50, top: 230, width: 980, height: 170, boxSizing: "border-box", borderRadius: 40, background: "#FFFFFF", border: "8px solid #111111", boxShadow: "0 10px 30px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 30px", color: RED, fontSize: bubbleSize, lineHeight: 1.2, overflow: "hidden" }}>
        {bubble}
      </div>

      <div style={{ position: "absolute", left: 150 - 20, top: 440, width: 380, height: 380, borderRadius: "50%", background: "#FFFFFF", border: "10px solid " + NAVY, boxShadow: "0 14px 44px rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Chakra size={330} color={NAVY} />
      </div>

      {posts ? (
        <div style={{ position: "absolute", left: 540, top: 450, width: 440, height: 360, boxSizing: "border-box", borderRadius: 48, background: YELLOW, border: "8px solid #111111", boxShadow: "0 14px 40px rgba(0,0,0,0.45)", transform: "rotate(4deg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, textAlign: "center", padding: "0 16px", overflow: "hidden" }}>
          <div style={{ color: RED, fontSize: 60, lineHeight: 1.2 }}>{lb.totalPosts || "कुल पद"}</div>
          <div style={{ color: "#000000", fontSize: postsSize, lineHeight: 1.1 }}>{posts}</div>
        </div>
      ) : (
        <div style={{ position: "absolute", left: 540, top: 450, width: 440, height: 360, boxSizing: "border-box", borderRadius: 48, background: YELLOW, border: "8px solid #111111", boxShadow: "0 14px 40px rgba(0,0,0,0.45)", transform: "rotate(4deg)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 20px", color: RED, fontSize: 76, lineHeight: 1.2 }}>
          पूरी जानकारी
        </div>
      )}

      <div style={{ position: "absolute", left: 20, top: 840, width: 1040, height: 160, background: RED, clipPath: BRUSH, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontSize: 112, lineHeight: 1.2, textShadow: SHADOW }}>
        {BANDS[k]}
      </div>
      <div style={{ position: "absolute", left: 40, top: 975, width: 1000, height: 280, background: YELLOW, clipPath: BRUSH, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 70px", boxSizing: "border-box", overflow: "hidden", color: "#000000", fontSize: nameSize, lineHeight: 1.12 }}>
        {name}
      </div>
      <div style={{ position: "absolute", left: 60, top: 1250, width: 960, height: 100, background: "#111111", clipPath: BRUSH, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontSize: 52, lineHeight: 1.2 }}>
        राजस्थान सरकारी हेल्प सेंटर
      </div>

      {rows.map((row, r) =>
        row.map((b, i) => {
          const bw = (980 - (row.length - 1) * GAP) / row.length;
          const vs = pick([...b.value].length, [[8, 62], [14, 50], [22, 40]], 32);
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

      <div style={{ position: "absolute", left: 40, top: 1700, width: 640, height: 88, background: YELLOW, clipPath: BRUSH, display: "flex", alignItems: "center", justifyContent: "center", color: "#000000", fontSize: 48, lineHeight: 1.2 }}>
        सभी जानकारी यहां देखें
      </div>
      <div style={{ position: "absolute", left: 50, top: 1795, width: 640, height: 110, boxSizing: "border-box", borderRadius: 55, background: RED, border: "6px solid #FFFFFF", boxShadow: "0 8px 22px rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontSize: 66, letterSpacing: 2 }}>
        {cta + "  >"}
      </div>
      <div style={{ position: "absolute", left: 710, top: 1725, width: 330, height: 170, background: RED, clipPath: BRUSH, transform: "rotate(-5deg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontSize: 50, lineHeight: 1.25, textShadow: SHADOW }}>
        <div>फॉलो करें</div>
        <div style={{ fontSize: 34, color: YELLOW }}>रोज़ नई भर्ती</div>
      </div>
    </AbsoluteFill>
  );
};
