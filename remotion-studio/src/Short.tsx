import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, FPS, H, INTRO_FRAMES, NOT_FOUND, W, sceneFrames, useHind, type ShortProps } from "./common";
import { Thumb } from "./Thumb";

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
      <div
        style={{
          position: "absolute",
          left: 900,
          top: 560,
          width: 130,
          height: 130,
          borderRadius: "50%",
          background: "#fff1b8",
          opacity: 0.45,
          boxShadow: "0 0 90px 30px rgba(255,241,184,0.25)",
        }}
      />
      {[75, 1005].map((lx, i) => {
        const sw = Math.sin(t * 1.3 + i * 2) * 5;
        return (
          <div
            key={"lan" + i}
            style={{ position: "absolute", left: lx - 2, top: 0, width: 4, height: 190, background: "#ffd60a", opacity: 0.7, transformOrigin: "50% 0", transform: "rotate(" + sw + "deg)" }}
          >
            <div
              style={{
                position: "absolute",
                left: -34,
                top: 170,
                width: 72,
                height: 92,
                borderRadius: "50%",
                background: i ? "#ff7a00" : "#e63946",
                boxShadow: "0 0 40px rgba(255,150,60,0.6)",
              }}
            />
          </div>
        );
      })}
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
const Progress: React.FC<{ marks: number[]; total: number }> = ({ marks, total }) => {
  const frame = useCurrentFrame();
  const durationInFrames = total;
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
        left: 50,
        top: 1690,
        width: 660,
        height: 150,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
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
      <div>LINK DESCRIPTION MEIN</div>
      <div>FOLLOW FOR UPDATES</div>
    </div>
  );
};

const HAIR = "#1e1038";
const SKIN = "#f9d3b4";
const TEAL = "#0e9e9a";

// Presenter: flat-vector ladki (ID card + tick liye). Neeche-right me slide-up hoti hai, sans leti hai, palak jhapakti hai, muh bolte hue khulta-band hota hai.
const Presenter: React.FC = () => {
  const frame = useCurrentFrame();
  const p = pop(frame, 14, 13);
  const bob = Math.sin(frame / 10) * 5;
  const sway = Math.sin(frame / 24) * 2;
  const mouth = 3 + Math.abs(Math.sin(frame / 3)) * 9;
  const blink = frame % 90 > 86 ? 0.15 : 1;
  const wave = Math.sin(frame / 9) * 5;
  return (
    <div
      style={{
        position: "absolute",
        left: 735,
        top: 1540,
        width: 325,
        height: 411,
        transformOrigin: "50% 100%",
        transform: "translateY(" + ((1 - p) * 430 + bob) + "px) rotate(" + sway + "deg)",
        opacity: Math.min(1, p * 1.4),
      }}
    >
      <svg width={325} height={411} viewBox="0 0 440 556">
        <defs>
          <radialGradient id="pg" cx="50%" cy="43%" r="52%">
            <stop offset="0" stopColor="rgba(170,110,255,0.35)" />
            <stop offset="1" stopColor="rgba(170,110,255,0)" />
          </radialGradient>
        </defs>
        <rect width="440" height="560" fill="url(#pg)" />
        <path d="M88 560 L88 210 C88 20 352 20 352 210 L352 560 Z" fill={HAIR} />
        <rect x="190" y="318" width="60" height="80" fill="#efbd95" />
        <path d="M36 560 L66 432 Q220 358 374 432 L404 560 Z" fill={TEAL} />
        <path d="M112 398 L160 378 L404 560 L316 560 Z" fill="#ee3f96" />
        <line x1="112" y1="398" x2="316" y2="560" stroke="#ffd60a" strokeWidth="6" strokeLinecap="round" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <circle key={"d" + i} cx={140 + i * 38} cy={392 + i * 28} r="5" fill="#fff" />
        ))}
        <path d="M270.4 384.9 A52 52 0 0 1 169.5 384.4" stroke="#ffd60a" strokeWidth="5" fill="none" />
        <path d="M104 230 L150 230 Q140 420 130 560 L92 560 Z" fill={HAIR} />
        <path d="M336 230 L290 230 Q300 420 310 560 L348 560 Z" fill={HAIR} />
        <polyline points="98,452 48,408 58,332" stroke={TEAL} strokeWidth="48" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <polyline points="342,452 396,410 374,334" stroke={TEAL} strokeWidth="48" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="58" cy="322" r="24" fill={SKIN} />
        <line x1="58" y1="322" x2="58" y2="276" stroke={SKIN} strokeWidth="17" strokeLinecap="round" />
        <ellipse cx="220" cy="232" rx="96" ry="106" fill={SKIN} />
        <path d="M112 236 C100 70 340 70 328 236 Q300 150 226 148 Q150 150 112 236 Z" fill={HAIR} />
        <line x1="108" y1="210" x2="116" y2="330" stroke="#7b4be8" strokeWidth="5" strokeLinecap="round" />
        <line x1="220" y1="70" x2="220" y2="150" stroke="#ffd60a" strokeWidth="3" />
        <circle cx="220" cy="158" r="8" fill="#ff3d57" />
        <circle cx="220" cy="158" r="3" fill="#ffd60a" />
        <circle cx="220" cy="190" r="6" fill="#d90429" />
        <polyline points="150,206 168,198 192,204" stroke={HAIR} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <polyline points="290,206 272,198 248,204" stroke={HAIR} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {[170, 270].map((cx) => (
          <g key={"e" + cx} transform={"translate(0 238) scale(1 " + blink + ") translate(0 -238)"}>
            <ellipse cx={cx} cy="238" rx="28" ry="32" fill="#fff" />
            <ellipse cx={cx + 2} cy="243" rx="20" ry="25" fill="#b5651d" />
            <ellipse cx={cx + 2} cy="245" rx="11" ry="14" fill="#2a1208" />
            <circle cx={cx + 9} cy="232" r="6" fill="#fff" />
            <circle cx={cx - 5} cy="251" r="3" fill="#fff" />
            <path d={"M" + (cx - 26.2) + " 226.8 A28 32 0 0 1 " + (cx + 26) + " 226"} stroke={HAIR} strokeWidth="7" strokeLinecap="round" fill="none" />
          </g>
        ))}
        <ellipse cx="140" cy="284" rx="18" ry="12" fill="rgba(255,105,150,0.45)" />
        <ellipse cx="300" cy="284" rx="18" ry="12" fill="rgba(255,105,150,0.45)" />
        <path d="M227.7 277.8 A6 6 0 0 1 216.9 279.1" stroke="#c98a62" strokeWidth="3" fill="none" />
        <ellipse cx="220" cy="314" rx="13" ry={mouth} fill="#c0304a" />
        <rect x="212" y={314 - mouth + 1} width="16" height={Math.min(5, mouth)} fill="#fff" />
        {[116, 324].map((cx) => (
          <g key={"er" + cx}>
            <circle cx={cx} cy="300" r="6" fill="#ffd60a" />
            <ellipse cx={cx} cy="318" rx="5" ry="9" fill="#ffd60a" />
          </g>
        ))}
        {[0, 1, 2, 3, 4].map((k) => (
          <circle key={"f" + k} cx={332 + Math.cos(k * 1.2566) * 16} cy={150 + Math.sin(k * 1.2566) * 16} r="12" fill="#ff9a3c" />
        ))}
        <circle cx="332" cy="150" r="9" fill="#ffd60a" />
        <g transform={"translate(372 265) rotate(" + (-3.4 + wave * 0.5) + ")"}>
          <rect x="-56" y="-60" width="112" height="112" rx="10" fill="#fff" />
          <rect x="-44" y="-48" width="36" height="32" rx="5" fill="#4aa3df" />
          <circle cx="-26" cy="-40" r="7" fill="#fff" />
          <ellipse cx="-26" cy="-22" rx="12" ry="7" fill="#fff" />
          <rect x="0" y="-44" width="44" height="6" fill="#c9d1e0" />
          <rect x="0" y="-30" width="32" height="6" fill="#c9d1e0" />
          <rect x="-44" y="-4" width="88" height="6" fill="#c9d1e0" />
          <circle cx="22" cy="28" r="15" fill="#1fb15a" />
          <polyline points="14,28 20,34 31,22" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
        <ellipse cx="374" cy="324" rx="26" ry="24" fill={SKIN} />
      </svg>
    </div>
  );
};

const Body: React.FC<ShortProps> = ({ scenes, info, voiceFiles, durations, hasMusic, voiceVolume = 1, musicVolume = 0.12, musicFile = "music.mp3" }) => {
  useHind();
  const lens = sceneFrames(durations);
  const total = lens.reduce((a, b) => a + b, 0);
  const starts = lens.map((_, i) => lens.slice(0, i).reduce((a, b) => a + b, 0));
  return (
    <AbsoluteFill style={{ backgroundColor: "#07152f", width: W, height: H }}>
      <Background />
      {hasMusic && musicVolume > 0 ? (
        <Audio
          src={staticFile(musicFile)}
          loop
          volume={(f) => interpolate(f, [0, 20, total - 45, total], [0, musicVolume, musicVolume, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      ) : null}
      <Header postName={info.postName || ""} />
      {scenes.map((s, i) => (
        <Sequence key={i} from={starts[i]} durationInFrames={lens[i]} name={"Scene " + (i + 1)}>
          <Audio src={staticFile(voiceFiles[i])} volume={voiceVolume} />
          <Badge index={i} frames={lens[i]} />
          <Caption text={s.caption} hook={i === 0} frames={lens[i]} />
          <Sweep />
        </Sequence>
      ))}
      <Progress marks={starts.slice(1)} total={total} />
      <InfoBoxes info={info} />
      <Footer />
      <Presenter />
    </AbsoluteFill>
  );
};

// Pehle INTRO_FRAMES (1 second) tak thumbnail, phir poori video (awaaz + scenes ab 1 second baad shuru).
export const Short: React.FC<ShortProps> = (props) => {
  const total = sceneFrames(props.durations).reduce((a, b) => a + b, 0);
  return (
    <AbsoluteFill style={{ backgroundColor: "#07152f", width: W, height: H }}>
      <Sequence from={0} durationInFrames={INTRO_FRAMES} name="Thumbnail">
        <Thumb {...props} />
      </Sequence>
      <Sequence from={INTRO_FRAMES} durationInFrames={total} name="Video">
        <Body {...props} />
      </Sequence>
    </AbsoluteFill>
  );
};
