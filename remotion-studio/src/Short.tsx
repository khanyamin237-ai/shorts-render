import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, FPS, H, NOT_FOUND, W, sceneFrames, useHind, type ShortProps } from "./common";

const WHITE = "#FFFFFF";
const YELLOW = "#FFE600";
const RED = "#D90429";
const SIDE = 50;

const pop = (frame: number, delay = 0, damping = 12) =>
  spring({ frame: frame - delay, fps: FPS, config: { damping, stiffness: 140, mass: 0.7 } });

const GLOWS = [
  { x: 180, y: 360, r: 520, c: "rgba(37,99,235,0.55)", s: 0.5, ax: 120, ay: 90 },
  { x: 900, y: 1100, r: 600, c: "rgba(217,4,41,0.28)", s: 0.38, ax: 140, ay: 110 },
  { x: 540, y: 1700, r: 560, c: "rgba(56,189,248,0.30)", s: 0.45, ax: 160, ay: 70 },
];

// Hamesha chalti rehne wali background animation: tairte glow + neeche ki taraf sarakti grid.
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #07152f 0%, #0f2550 50%, #07152f 100%)" }}>
      {GLOWS.map((g, i) => {
        const x = g.x + Math.sin(t * g.s * 2 + i * 1.7) * g.ax;
        const y = g.y + Math.cos(t * g.s * 1.6 + i * 2.3) * g.ay;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - g.r,
              top: y - g.r,
              width: g.r * 2,
              height: g.r * 2,
              borderRadius: "50%",
              background: "radial-gradient(circle, " + g.c + " 0%, rgba(0,0,0,0) 68%)",
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.05) 2px, transparent 2px)",
          backgroundSize: "90px 90px",
          backgroundPosition: "0px " + ((frame * 0.9) % 90) + "px",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)" }} />
    </AbsoluteFill>
  );
};

const Header: React.FC<{ postName: string }> = ({ postName }) => {
  const frame = useCurrentFrame();
  const chip = pop(frame, 0, 10);
  const channel = pop(frame, 6);
  const post = pop(frame, 12);
  const pulse = 1 + Math.sin(frame / 5) * 0.025;
  const dot = 0.55 + 0.45 * Math.sin(frame / 4);
  const title = postName.trim().split(/\s+/).slice(0, 6).join(" ");
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: (W - 640) / 2,
          top: 128,
          width: 640,
          height: 84,
          borderRadius: 42,
          background: RED,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          color: WHITE,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 44,
          letterSpacing: 2,
          transform: "scale(" + chip * pulse + ")",
          opacity: Math.min(1, chip * 1.5),
          boxShadow: "0 0 " + (30 + dot * 30) + "px rgba(217,4,41,0.7)",
        }}
      >
        <div style={{ width: 20, height: 20, borderRadius: 10, background: WHITE, opacity: dot }} />
        SARKARI ALERT
      </div>
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 250,
          width: 980,
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: WHITE,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: 1,
          opacity: Math.min(1, channel * 1.5),
          transform: "translateY(" + (1 - channel) * -30 + "px)",
        }}
      >
        RAJASTHAN SARKARI HELP CENTER
      </div>
      {title ? (
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 325,
            width: 960,
            height: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            overflow: "hidden",
            color: WHITE,
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 44,
            lineHeight: "56px",
            opacity: Math.min(1, post * 1.5),
            transform: "translateY(" + (1 - post) * 40 + "px)",
          }}
        >
          {title}
        </div>
      ) : null}
    </>
  );
};

// Scene number ke aas-paas ghoomta ring: scene kitna bacha hai ye dikhata hai.
const Badge: React.FC<{ index: number; frames: number }> = ({ index, frames }) => {
  const frame = useCurrentFrame();
  const s = pop(frame, 0, 9);
  const r = 50;
  const c = 2 * Math.PI * r;
  const prog = interpolate(frame, [0, frames], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: W / 2 - 62, top: 640 - 62, width: 124, height: 124, transform: "scale(" + s + ")" }}>
      <svg width={124} height={124} viewBox="0 0 124 124">
        <circle cx={62} cy={62} r={r} fill="#0B132B" stroke="#3A4670" strokeWidth={9} />
        <circle
          cx={62}
          cy={62}
          r={r}
          fill="none"
          stroke={YELLOW}
          strokeWidth={9}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - prog)}
          transform="rotate(-90 62 62)"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: WHITE,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 56,
        }}
      >
        {index + 1}
      </div>
    </div>
  );
};

const captionSize = (text: string, hook: boolean) => {
  const n = [...text].length;
  const base = n > 44 ? 66 : n > 30 ? 76 : n > 18 ? 88 : 96;
  return hook ? base + 6 : base;
};

// Caption: har shabd baari-baari se spring ke saath uchhalkar aata hai, scene ke end par fade-out.
const Caption: React.FC<{ text: string; hook: boolean; frames: number }> = ({ text, hook, frames }) => {
  const frame = useCurrentFrame();
  const words = text.trim().split(/\s+/);
  const size = captionSize(text, hook);
  const color = hook ? YELLOW : WHITE;
  const exit = interpolate(frame, [frames - 8, frames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const drift = interpolate(frame, [0, frames], [1, 1.045], { extrapolateRight: "clamp" });
  const bar = interpolate(frame, [4, 22], [0, 320], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 750,
        width: 960,
        height: 500,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: exit,
        transform: "scale(" + drift + ") translateY(" + (1 - exit) * -24 + "px)",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: size * 0.28, rowGap: size * 0.05 }}>
        {words.map((w, i) => {
          const p = pop(frame, 3 + i * 3, 11);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: size,
                lineHeight: 1.32,
                color,
                opacity: Math.min(1, p * 1.6),
                transform: "translateY(" + (1 - p) * 60 + "px) scale(" + (0.75 + 0.25 * p) + ")",
                textShadow: "2px 3px 0 #000, 0 0 18px rgba(0,0,0,0.85)",
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
      <div style={{ marginTop: 26, height: 10, width: bar, borderRadius: 5, background: hook ? YELLOW : RED }} />
    </div>
  );
};

// Har scene ke shuru me ek chamakti line baayein se daayein nikalti hai (scene change ka "whoosh").
const Sweep: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 14], [-W, W], { easing: Easing.out(Easing.quad), extrapolateRight: "clamp" });
  const o = interpolate(frame, [0, 4, 14], [0, 0.7, 0], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 735,
        width: W,
        height: 6,
        background: "linear-gradient(90deg, rgba(255,255,255,0), #ffffff, rgba(255,255,255,0))",
        opacity: o,
      }}
    />
  );
};

// Poori video ke saath smoothly bharta progress bar; scene ki seemayein chhote nishaan se dikhti hain.
const Progress: React.FC<{ marks: number[] }> = ({ marks }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const full = W - SIDE * 2;
  const fw = Math.max(14, full * Math.min(1, (frame + 1) / durationInFrames));
  return (
    <div style={{ position: "absolute", left: SIDE, top: 1293, width: full, height: 14, borderRadius: 7, background: "#3A4670" }}>
      <div style={{ width: fw, height: 14, borderRadius: 7, background: YELLOW, boxShadow: "0 0 18px rgba(255,230,0,0.7)" }} />
      {marks.map((m, i) => (
        <div
          key={i}
          style={{ position: "absolute", left: (full * m) / durationInFrames - 2, top: -3, width: 4, height: 20, borderRadius: 2, background: "rgba(7,21,47,0.9)" }}
        />
      ))}
    </div>
  );
};

const InfoBoxes: React.FC<{ info: ShortProps["info"] }> = ({ info }) => {
  const frame = useCurrentFrame();
  const lb = info.labels || {};
  // Khali ya "ऑफिशियल साइट देखें" wale box chhupa do: sirf asli, verified jaankari dikhao.
  const boxes = [
    { label: lb.totalPosts || "कुल पद", value: (info.totalPosts || "").trim(), red: false },
    { label: lb.startDate || "शुरू तारीख", value: (info.startDate || "").trim(), red: false },
    { label: lb.lastDate || "अंतिम तारीख", value: (info.lastDate || "").trim(), red: true },
  ].filter((b) => b.value && b.value !== NOT_FOUND);
  if (!boxes.length) return null;
  const bw = boxes.length === 1 ? 640 : boxes.length === 2 ? 480 : 310;
  const bh = 170;
  const gap = 25;
  return (
    <>
      {boxes.map((b, k) => {
        const p = pop(frame, 14 + k * 5, 11);
        const pulse = b.red ? 1 + Math.sin(frame / 6) * 0.02 : 1;
        const n = [...b.value].length;
        const vs = boxes.length < 3 ? (n <= 14 ? 44 : 36) : n <= 8 ? 40 : n <= 12 ? 34 : 28;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: W / 2 + (k - (boxes.length - 1) / 2) * (bw + gap) - bw / 2,
              top: 1450 - bh / 2,
              width: bw,
              height: bh,
              borderRadius: 28,
              boxSizing: "border-box",
              background: b.red ? RED : "#2A3558",
              border: "3px solid " + (b.red ? WHITE : "#4B587C"),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              transform: "translateY(" + (1 - p) * 80 + "px) scale(" + p * pulse + ")",
              opacity: Math.min(1, p * 1.5),
              fontFamily: FONT,
              fontWeight: 700,
              color: WHITE,
              textAlign: "center",
              boxShadow: b.red ? "0 0 " + (24 + Math.sin(frame / 6) * 12) + "px rgba(217,4,41,0.65)" : "none",
            }}
          >
            <div style={{ fontSize: 30, lineHeight: 1.3 }}>{b.label}</div>
            <div style={{ fontSize: vs, lineHeight: 1.3, padding: "0 10px" }}>{b.value}</div>
          </div>
        );
      })}
    </>
  );
};

const Footer: React.FC = () => {
  const frame = useCurrentFrame();
  const p = pop(frame, 24, 12);
  const bob = Math.sin(frame / 9) * 4;
  return (
    <div
      style={{
        position: "absolute",
        left: (W - 1000) / 2,
        top: 1729,
        width: 1000,
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 34,
        letterSpacing: 1,
        color: WHITE,
        opacity: Math.min(1, p * 1.5),
        transform: "translateY(" + ((1 - p) * 60 + bob) + "px)",
      }}
    >
      LINK DESCRIPTION MEIN • FOLLOW FOR UPDATES
    </div>
  );
};

export const Short: React.FC<ShortProps> = ({ scenes, info, voiceFiles, durations, hasMusic }) => {
  useHind();
  const { durationInFrames } = useVideoConfig();
  const lens = sceneFrames(durations);
  const starts = lens.map((_, i) => lens.slice(0, i).reduce((a, b) => a + b, 0));
  return (
    <AbsoluteFill style={{ backgroundColor: "#07152f", width: W, height: H }}>
      <Background />
      {hasMusic ? (
        <Audio
          src={staticFile("music.mp3")}
          loop
          volume={(f) => interpolate(f, [0, 20, durationInFrames - 45, durationInFrames], [0, 0.12, 0.12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      ) : null}
      <Header postName={info.postName || ""} />
      {scenes.map((s, i) => (
        <Sequence key={i} from={starts[i]} durationInFrames={lens[i]} name={"Scene " + (i + 1)}>
          <Audio src={staticFile(voiceFiles[i])} />
          <Badge index={i} frames={lens[i]} />
          <Caption text={s.caption} hook={i === 0} frames={lens[i]} />
          <Sweep />
        </Sequence>
      ))}
      <Progress marks={starts.slice(1)} />
      <InfoBoxes info={info} />
      <Footer />
    </AbsoluteFill>
  );
};
