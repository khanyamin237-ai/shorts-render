import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FONT, H, NOT_FOUND, W, useHind, type ShortProps } from "./common";

type Pal = NonNullable<ShortProps["palette"]>;
const DEFAULT_PAL: Pal = { dark: "#071a45", mid: "#1c4fb8", accent: "#D90429", accent2: "#FFE600", headline: "#FFE600", panel: "#FFFFFF", ink: "#0B1F5C" };
const HEX = /^#[0-9a-fA-F]{6}$/;
const safePal = (p?: ShortProps["palette"]): Pal => {
  if (!p) return DEFAULT_PAL;
  const out: Pal = { ...DEFAULT_PAL };
  (Object.keys(out) as Array<keyof Pal>).forEach((k) => {
    if (typeof p[k] === "string" && HEX.test(p[k])) out[k] = p[k];
  });
  return out;
};
const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
};

const BRUSH =
  "polygon(0% 14%, 3% 0%, 8% 9%, 14% 0%, 22% 7%, 31% 0%, 42% 8%, 53% 0%, 63% 7%, 74% 0%, 85% 8%, 94% 0%, 100% 11%, 98% 46%, 100% 79%, 96% 100%, 88% 93%, 78% 100%, 66% 94%, 55% 100%, 44% 93%, 33% 100%, 21% 94%, 11% 100%, 4% 92%, 0% 100%, 2% 55%)";
const SHADOW = "3px 4px 0 rgba(0,0,0,0.4)";
const OUTLINE = "0 5px 0 #000, 5px 0 0 #000, -5px 0 0 #000, 0 -5px 0 #000, 4px 4px 0 #000, -4px 4px 0 #000, 0 12px 26px rgba(0,0,0,0.6)";
const SOFT = "0 4px 0 rgba(0,0,0,0.25)";

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
const flex = { display: "flex", alignItems: "center", justifyContent: "center" } as const;

// Info boxes ka grid (rect ke andar). themed=true: palette ke colours, warna har box ka apna purana colour.
const Boxes: React.FC<{ boxes: Box[]; x: number; y: number; w: number; cols: number; rowH: number; gap?: number; P: Pal; themed: boolean }> = ({ boxes, x, y, w, cols, rowH, gap = 16, P, themed }) => {
  if (!boxes.length) return null;
  const c = Math.min(cols, boxes.length);
  const cellW = (w - (c - 1) * gap) / c;
  const themedBg = [P.mid, P.ink, P.accent, P.mid, P.ink];
  return (
    <>
      {boxes.map((b, i) => {
        const col = i % c;
        const row = Math.floor(i / c);
        const bg = themed ? themedBg[i % themedBg.length] : b.color;
        const onAccent = themed && bg === P.accent;
        const len = [...b.value].length;
        const base = cellW > 400 ? pick(len, [[10, 60], [16, 50], [24, 40]], 32) : cellW > 260 ? pick(len, [[8, 54], [12, 46], [18, 38], [26, 30]], 26) : pick(len, [[6, 56], [10, 46], [16, 36], [24, 30]], 24);
        const vs = Math.min(base, Math.round(rowH * 0.46));
        const ls = Math.min(cellW > 400 ? 34 : 30, Math.round(rowH * 0.26));
        return (
          <div key={i} style={{ position: "absolute", left: x + col * (cellW + gap), top: y + row * (rowH + gap), width: cellW, height: rowH, boxSizing: "border-box", borderRadius: 24, background: bg, border: "4px solid " + (themed ? P.accent2 : "#FFFFFF"), boxShadow: "0 8px 22px rgba(0,0,0,0.4)", ...flex, flexDirection: "column", gap: 2, textAlign: "center", padding: "0 10px", overflow: "hidden" }}>
            <div style={{ color: themed && !onAccent ? P.accent2 : "#FFFFFF", fontSize: ls, lineHeight: 1.2 }}>{b.label}</div>
            <div style={{ color: onAccent ? "#FFFFFF" : themed ? "#FFFFFF" : "#FFE600", fontSize: vs, lineHeight: 1.15 }}>{b.value}</div>
          </div>
        );
      })}
    </>
  );
};

const Abs: React.FC<{ l: number; t: number; w: number; h: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ l, t, w, h, style, children }) => (
  <div style={{ position: "absolute", left: l, top: t, width: w, height: h, boxSizing: "border-box", ...style }}>{children}</div>
);

export const Thumb: React.FC<ShortProps> = ({ thumbnailText, title, info, kind, bg, layout, palette }) => {
  useHind();
  const P = safePal(palette);
  const themed = !!palette;
  const L = layout && ["bold-top", "center-stamp", "side-bar", "diagonal-split", "bottom-card", "news-flash"].includes(layout) ? layout : "bold-top";
  const k = kind && BANDS[kind] ? kind : "recruitment";
  const lb = info.labels || {};
  const clean = (v?: string) => {
    const t = (v || "").trim();
    return t && t !== NOT_FOUND ? t : "";
  };
  const all: Box[] = [
    { label: lb.totalPosts || "कुल पद", value: clean(info.totalPosts), color: "#0B3D91" },
    { label: lb.startDate || (k === "recruitment" ? "आवेदन शुरू" : "शुरू तारीख"), value: clean(info.startDate), color: "#0B6B2E" },
    { label: lb.lastDate || "अंतिम तारीख", value: clean(info.lastDate), color: "#D90429" },
    { label: "वेतन", value: clean(info.salary), color: "#5B21B6" },
    { label: "उम्र सीमा", value: clean(info.ageLimit), color: "#0E7490" },
  ];
  const boxes = all.filter((b) => b.value);
  const n = boxes.length;

  const name = (info.postName || title || thumbnailText || "").trim().slice(0, 70);
  const nlen = [...name].length;
  const bubble = (thumbnailText || "बड़ी खबर!").trim();
  const blen = [...bubble].length;
  const bubbleSize = pick(blen, [[10, 64], [16, 56], [24, 48]], 42);
  const cta = k === "recruitment" ? "APPLY NOW" : "CHECK NOW";
  const TAG = TAGS[k];
  const BAND = BANDS[k];
  const CHANNEL = "राजस्थान सरकारी हेल्प सेंटर";

  const fullBg = bg ? <Img src={staticFile(bg)} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, objectFit: "cover" }} /> : null;
  const grad = (top: number, h: number, from: number, to: number, dir: "down" | "up") => (
    <div style={{ position: "absolute", left: 0, top, width: W, height: h, background: "linear-gradient(" + (dir === "down" ? "180deg" : "0deg") + ", " + rgba(P.dark, from) + " 0%, " + rgba(P.dark, to) + " 100%)" }} />
  );
  const fallbackY = L === "bottom-card" ? 330 : L === "side-bar" ? 560 : L === "news-flash" ? 520 : 600;
  const fallbackX = L === "side-bar" ? 740 : 540;
  const noBg = (
    <>
      <div style={{ position: "absolute", left: fallbackX - 900, top: fallbackY - 900, width: 1800, height: 1800, borderRadius: "50%", background: "repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.26) 0deg 7deg, rgba(255,255,255,0) 7deg 18deg)", WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%)", maskImage: "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%)" }} />
      <div style={{ position: "absolute", left: fallbackX - 190, top: fallbackY - 190, width: 380, height: 380, borderRadius: "50%", background: "#FFFFFF", border: "10px solid " + P.ink, boxShadow: "0 14px 44px rgba(0,0,0,0.45)", ...flex }}>
        <Chakra size={330} color={P.ink} />
      </div>
    </>
  );

  const sticker = (l: number, t: number, w: number, h: number, rot: number) => (
    <Abs l={l} t={t} w={w} h={h} style={{ background: P.accent2, clipPath: BRUSH, transform: "rotate(" + rot + "deg)", ...flex, flexDirection: "column", color: "#000000", fontSize: 46, lineHeight: 1.25 }}>
      <div>फॉलो करें</div>
      <div style={{ fontSize: 32, color: P.accent }}>रोज़ नई भर्ती</div>
    </Abs>
  );
  const channelPill = (l: number, t: number, w: number, h: number, fs: number) => (
    <Abs l={l} t={t} w={w} h={h} style={{ background: "#111111", clipPath: BRUSH, ...flex, color: "#FFFFFF", fontSize: fs, lineHeight: 1.2 }}>{CHANNEL}</Abs>
  );
  const ctaBtn = (l: number, t: number, w: number, h: number, fs: number) => (
    <Abs l={l} t={t} w={w} h={h} style={{ borderRadius: h / 2, background: P.accent, border: "6px solid #FFFFFF", boxShadow: "0 8px 22px rgba(0,0,0,0.45)", ...flex, color: "#FFFFFF", fontSize: fs, letterSpacing: 2 }}>{cta + "  >"}</Abs>
  );
  const speech = (l: number, t: number, w: number, h: number, rot: number, scale = 1) => (
    <Abs l={l} t={t} w={w} h={h} style={{ borderRadius: 40, background: "#FFFFFF", border: "8px solid #111111", boxShadow: "0 10px 30px rgba(0,0,0,0.4)", transform: "rotate(" + rot + "deg)", ...flex, textAlign: "center", padding: "0 20px", color: P.accent, fontSize: Math.round(bubbleSize * scale), lineHeight: 1.2, overflow: "hidden" }}>{bubble}</Abs>
  );
  const tagPill = (l: number, t: number, w: number, h: number, fs: number, bgc: string, fg: string) => (
    <Abs l={l} t={t} w={w} h={h} style={{ borderRadius: h / 2, background: bgc, border: "7px solid " + (bgc === "#FFFFFF" ? P.ink : "#FFFFFF"), boxShadow: "0 10px 30px rgba(0,0,0,0.45)", ...flex, gap: 20, color: fg, fontSize: fs, lineHeight: 1.2 }}>
      <div style={{ width: 24, height: 24, borderRadius: 12, background: fg }} />
      <div>{TAG}</div>
      <div style={{ width: 24, height: 24, borderRadius: 12, background: fg }} />
    </Abs>
  );
  const tricolor = (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 14, background: "#FF9933" }} />
      <div style={{ position: "absolute", left: 0, top: 14, width: W, height: 14, background: "#FFFFFF" }} />
      <div style={{ position: "absolute", left: 0, top: 28, width: W, height: 14, background: "#138808" }} />
    </>
  );

  const root = (children: React.ReactNode) => (
    <AbsoluteFill style={{ width: W, height: H, background: "linear-gradient(180deg, " + P.dark + " 0%, " + P.mid + " 50%, " + P.accent + " 100%)", fontFamily: FONT, fontWeight: 700, overflow: "hidden" }}>{children}</AbsoluteFill>
  );

  // ---------- 1) bold-top ----------
  if (L === "bold-top") {
    const rows: Box[][] = n <= 3 ? (n ? [boxes] : []) : n === 4 ? [boxes.slice(0, 2), boxes.slice(2)] : [boxes.slice(0, 3), boxes.slice(3)];
    const rowH = rows.length > 1 ? 130 : 170;
    const totalH = rows.length * rowH + Math.max(0, rows.length - 1) * 18;
    const top0 = 1415 + (285 - totalH) / 2;
    const nameSize = pick(nlen, [[12, 140], [18, 120], [26, 100], [36, 86]], 72);
    return root(
      <>
        {bg ? (
          <>
            {fullBg}
            {grad(0, 560, 0.9, 0, "down")}
            {grad(1150, 770, 0.82, 0.95, "down")}
          </>
        ) : (
          noBg
        )}
        {tricolor}
        {tagPill(90, 75, 900, 120, 64, P.accent, "#FFFFFF")}
        <Abs l={50} t={215} w={980} h={295} style={{ ...flex, textAlign: "center", overflow: "hidden", color: P.headline, fontSize: nameSize, lineHeight: 1.12, textShadow: OUTLINE }}>{name}</Abs>
        {speech(640, 600, 400, 190, 3)}
        <Abs l={662} t={772} w={46} h={46} style={{ background: "#FFFFFF", borderLeft: "8px solid #111111", borderBottom: "8px solid #111111", transform: "rotate(45deg)" }} />
        <Abs l={20} t={1235} w={1040} h={160} style={{ background: P.accent, clipPath: BRUSH, ...flex, color: "#FFFFFF", fontSize: 112, lineHeight: 1.2, textShadow: SHADOW }}>{BAND}</Abs>
        {rows.map((row, r) => (
          <Boxes key={r} boxes={row} x={50} y={top0 + r * (rowH + 18)} w={980} cols={row.length} rowH={rowH} gap={18} P={P} themed={themed} />
        ))}
        {channelPill(50, 1710, 640, 62, 38)}
        {ctaBtn(50, 1785, 640, 110, 66)}
        {sticker(710, 1745, 330, 160, -5)}
      </>
    );
  }

  // ---------- 2) center-stamp ----------
  if (L === "center-stamp") {
    const size = pick(nlen, [[12, 128], [18, 108], [26, 90], [36, 78]], 64);
    return root(
      <>
        {bg ? (
          <>
            {fullBg}
            <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, background: "radial-gradient(circle at 50% 45%, " + rgba(P.dark, 0.1) + " 0%, " + rgba(P.dark, 0.88) + " 100%)" }} />
          </>
        ) : (
          noBg
        )}
        {tagPill(120, 90, 620, 100, 52, P.accent, "#FFFFFF")}
        {sticker(780, 60, 270, 150, 6)}
        <Abs l={60} t={540} w={960} h={560} style={{ transform: "rotate(-4deg)", background: rgba(P.dark, 0.84), border: "12px solid " + P.accent2, borderRadius: 30, boxShadow: "0 24px 60px rgba(0,0,0,0.55)" }}>
          <Abs l={150} t={-52} w={620} h={96} style={{ background: P.accent, border: "6px solid #FFFFFF", borderRadius: 18, ...flex, color: "#FFFFFF", fontSize: 54, lineHeight: 1.2 }}>{BAND}</Abs>
          <Abs l={30} t={70} w={900} h={440} style={{ ...flex, textAlign: "center", overflow: "hidden", color: P.headline, fontSize: size, lineHeight: 1.14, textShadow: OUTLINE }}>{name}</Abs>
        </Abs>
        {speech(150, 1170, 780, 140, 2, 0.9)}
        <Boxes boxes={boxes} x={60} y={1370} w={960} cols={3} rowH={n > 3 ? 150 : 190} gap={16} P={P} themed={true} />
        {channelPill(240, 1735, 600, 56, 32)}
        {ctaBtn(240, 1800, 600, 100, 60)}
      </>
    );
  }

  // ---------- 3) side-bar ----------
  if (L === "side-bar") {
    const size = pick(nlen, [[10, 124], [16, 104], [24, 88], [34, 74]], 62);
    const cell = 250;
    const boxH = n * cell + Math.max(0, n - 1) * 18;
    return root(
      <>
        {bg ? (
          <>
            {fullBg}
            <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, background: "linear-gradient(90deg, " + rgba(P.dark, 0.25) + " 0%, " + rgba(P.dark, 0.7) + " 100%)" }} />
          </>
        ) : (
          noBg
        )}
        <Abs l={0} t={0} w={430} h={H} style={{ background: "linear-gradient(180deg, " + P.mid + " 0%, " + P.dark + " 100%)", borderRight: "10px solid " + P.accent2, boxShadow: "10px 0 40px rgba(0,0,0,0.5)" }} />
        <Abs l={22} t={70} w={386} h={200} style={{ borderRadius: 34, background: P.accent, border: "7px solid #FFFFFF", ...flex, textAlign: "center", padding: "0 12px", color: "#FFFFFF", fontSize: 54, lineHeight: 1.2 }}>{TAG}</Abs>
        <Boxes boxes={boxes} x={26} y={310} w={378} cols={1} rowH={cell} gap={18} P={P} themed={true} />
        {channelPill(26, 310 + boxH + 40 > 1690 ? 1690 : 1690, 378, 66, 30)}
        {sticker(36, 1775, 360, 130, -3)}
        <Abs l={470} t={150} w={570} h={920} style={{ ...flex, textAlign: "center", overflow: "hidden", color: P.headline, fontSize: size, lineHeight: 1.14, textShadow: OUTLINE }}>{name}</Abs>
        <Abs l={470} t={1110} w={570} h={130} style={{ background: P.accent, transform: "rotate(-2deg)", border: "6px solid #FFFFFF", borderRadius: 16, ...flex, color: "#FFFFFF", fontSize: 62, lineHeight: 1.2 }}>{BAND}</Abs>
        {speech(470, 1300, 570, 240, 2, 1.05)}
        {ctaBtn(470, 1690, 570, 120, 60)}
      </>
    );
  }

  // ---------- 4) diagonal-split ----------
  if (L === "diagonal-split") {
    const size = pick(nlen, [[12, 132], [18, 112], [26, 94], [36, 80]], 66);
    return root(
      <>
        {bg ? (
          <>
            {fullBg}
            {grad(0, 480, 0.85, 0, "down")}
            {grad(1250, 670, 0.85, 0.96, "down")}
          </>
        ) : (
          noBg
        )}
        {tagPill(90, 80, 900, 110, 58, P.accent2, P.ink)}
        {speech(70, 230, 520, 150, -3, 0.85)}
        <Abs l={-120} t={620} w={1320} h={540} style={{ background: P.accent, borderTop: "14px solid " + P.accent2, borderBottom: "14px solid " + P.accent2, transform: "rotate(-7deg)", boxShadow: "0 24px 60px rgba(0,0,0,0.5)", ...flex, padding: "0 190px", textAlign: "center", overflow: "hidden", color: "#FFFFFF", fontSize: size, lineHeight: 1.12, textShadow: OUTLINE }}>{name}</Abs>
        <Abs l={290} t={1195} w={500} h={92} style={{ borderRadius: 46, background: P.ink, border: "6px solid " + P.accent2, ...flex, color: "#FFFFFF", fontSize: 50, lineHeight: 1.2 }}>{BAND}</Abs>
        <Boxes boxes={boxes} x={50} y={1330} w={980} cols={3} rowH={n > 3 ? 150 : 200} gap={16} P={P} themed={true} />
        {channelPill(50, 1690, 560, 62, 34)}
        {ctaBtn(50, 1775, 600, 110, 62)}
        {sticker(710, 1700, 320, 190, -5)}
      </>
    );
  }

  // ---------- 5) bottom-card ----------
  if (L === "bottom-card") {
    const size = pick(nlen, [[12, 124], [18, 106], [26, 90], [36, 78]], 64);
    return root(
      <>
        {bg ? (
          <>
            {fullBg}
            {grad(0, 340, 0.75, 0, "down")}
          </>
        ) : (
          noBg
        )}
        {tagPill(90, 90, 760, 100, 54, P.accent, "#FFFFFF")}
        {speech(600, 800, 430, 180, 4, 0.9)}
        <Abs l={0} t={1060} w={W} h={860} style={{ background: P.panel, borderRadius: "80px 80px 0 0", boxShadow: "0 -20px 60px rgba(0,0,0,0.5)" }} />
        <Abs l={340} t={1086} w={400} h={14} style={{ background: P.accent, borderRadius: 7 }} />
        <Abs l={60} t={1130} w={470} h={80} style={{ borderRadius: 40, background: P.accent, ...flex, color: "#FFFFFF", fontSize: 46, lineHeight: 1.2 }}>{BAND}</Abs>
        <Abs l={50} t={1225} w={980} h={280} style={{ ...flex, textAlign: "center", overflow: "hidden", color: P.ink, fontSize: size, lineHeight: 1.14, textShadow: SOFT }}>{name}</Abs>
        <Boxes boxes={boxes} x={50} y={1520} w={980} cols={3} rowH={n > 3 ? 110 : 150} gap={14} P={P} themed={true} />
        {ctaBtn(50, 1790, 520, 100, 54)}
        {channelPill(600, 1800, 430, 80, 32)}
      </>
    );
  }

  // ---------- 6) news-flash ----------
  const size = pick(nlen, [[14, 118], [20, 100], [30, 84], [40, 72]], 62);
  return root(
    <>
      {bg ? (
        <>
          {fullBg}
          {grad(0, 300, 0.8, 0, "down")}
          {grad(900, 1020, 0.0, 0.95, "down")}
        </>
      ) : (
        noBg
      )}
      <Abs l={0} t={40} w={W} h={150} style={{ background: P.accent, borderBottom: "8px solid #FFFFFF", boxShadow: "0 10px 30px rgba(0,0,0,0.45)" }} />
      <Abs l={24} t={64} w={230} h={102} style={{ background: "#FFFFFF", borderRadius: 14, ...flex, gap: 14, color: P.accent, fontSize: 56, lineHeight: 1.2 }}>
        <div style={{ width: 26, height: 26, borderRadius: 13, background: P.accent }} />
        <div>LIVE</div>
      </Abs>
      <Abs l={280} t={50} w={770} h={130} style={{ ...flex, color: "#FFFFFF", fontSize: 62, lineHeight: 1.2, textShadow: SHADOW }}>{TAG}</Abs>
      {speech(640, 270, 400, 190, 5)}
      <Abs l={40} t={940} w={470} h={84} style={{ background: P.accent, border: "6px solid #FFFFFF", borderRadius: 14, ...flex, color: "#FFFFFF", fontSize: 48, lineHeight: 1.2, zIndex: 2 }}>{BAND}</Abs>
      <Abs l={40} t={1000} w={1000} h={440} style={{ background: rgba(P.dark, 0.9), borderLeft: "28px solid " + P.accent2, ...flex, padding: "0 40px", textAlign: "left", justifyContent: "flex-start", overflow: "hidden", color: P.headline, fontSize: size, lineHeight: 1.15, textShadow: OUTLINE }}>{name}</Abs>
      <Boxes boxes={boxes} x={40} y={1470} w={1000} cols={3} rowH={n > 3 ? 100 : 170} gap={14} P={P} themed={true} />
      <Abs l={0} t={1720} w={W} h={150} style={{ background: P.dark, borderTop: "8px solid " + P.accent2 }} />
      <Abs l={30} t={1735} w={560} h={120} style={{ ...flex, color: "#FFFFFF", fontSize: 40, lineHeight: 1.2 }}>{CHANNEL}</Abs>
      {ctaBtn(620, 1740, 420, 110, 52)}
      <Abs l={0} t={1870} w={W} h={50} style={{ background: P.accent, ...flex, color: "#FFFFFF", fontSize: 32, lineHeight: 1.2 }}>फॉलो करें  •  रोज़ नई भर्ती</Abs>
    </>
  );
};
