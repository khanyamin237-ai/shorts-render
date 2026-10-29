import { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const PAD_SECONDS = 0.25;
export const INTRO_FRAMES = FPS; // video ke shuru me thumbnail 1 second (30 frames) dikhta hai
export const NOT_FOUND = "ऑफिशियल साइट देखें";
export const FONT = "Hind, 'Noto Sans Devanagari', sans-serif";

export type Scene = { voice: string; caption: string };
export type Info = {
  postName: string;
  totalPosts: string;
  startDate: string;
  lastDate: string;
  salary?: string;
  ageLimit?: string;
  labels?: { totalPosts?: string; startDate?: string; lastDate?: string };
};
export type ShortProps = {
  scenes: Scene[];
  info: Info;
  voiceFiles: string[];
  durations: number[];
  hasMusic: boolean;
  voiceVolume?: number; // narration volume (1 = normal)
  musicVolume?: number; // background music volume (0..1)
  musicFile?: string; // public/ me music file ka naam
  thumbnailText: string;
  title: string;
  kind?: string;
  bg?: string; // thumbnail ki background photo (public/ me file ka naam), na ho to purana gradient design
  layout?: string; // thumbnail layout id (bold-top, center-stamp, side-bar, diagonal-split, bottom-card, news-flash); na ho to bold-top
  palette?: { dark: string; mid: string; accent: string; accent2: string; headline: string; panel: string; ink: string }; // thumbnail ke colours
  speakers?: number[]; // cartoon dialogue: har scene ka speaker (0 = pehla character, 1 = doosra); na ho to baari-baari
  cta?: string; // aakhri scene par subscribe/comment banner
  subtitles?: boolean; // false = subtitles band
  moods?: string[]; // cartoon dialogue: har scene ke bolne wale ke chehre ka bhaav (happy / surprised / worried)
  chars?: Record<string, string>; // cartoon dialogue: character sheet ke 6 chehre (public/ me file ke naam); na ho to purane drawn cartoon
};

// Sirf Studio preview / test ke liye. Asli render me props.json aata hai (prepare.mjs banata hai).
export const defaultProps: ShortProps = {
  scenes: [
    { voice: "पहला सीन", caption: "बड़ी भर्ती आ गई" },
    { voice: "दूसरा सीन", caption: "कुल पद और तारीख देखें" },
    { voice: "तीसरा सीन", caption: "आज ही आवेदन करें" },
  ],
  info: { postName: "राजस्थान टेस्ट भर्ती 2026", totalPosts: "1000", startDate: "10 अक्टूबर 2026", lastDate: "30 अक्टूबर 2026" },
  voiceFiles: ["voice1.mp3", "voice2.mp3", "voice3.mp3"],
  durations: [3, 4, 3],
  hasMusic: false,
  thumbnailText: "बड़ी भर्ती",
  title: "राजस्थान टेस्ट भर्ती 2026",
};

// Har scene ki length = voiceover ki length + thoda pad (taaki awaaz beech me na kate).
export const sceneFrames = (durations: number[]) =>
  durations.map((d) => Math.max(15, Math.ceil((d + PAD_SECONDS) * FPS)));

// Hind Bold (Devanagari) — prepare.mjs ise public/hind.ttf me download karta hai.
export const useHind = () => {
  const [handle] = useState(() => delayRender("Hind font load"));
  useEffect(() => {
    const face = new FontFace("Hind", "url(" + staticFile("hind.ttf") + ")", { weight: "700" });
    face
      .load()
      .then(() => {
        (document.fonts as unknown as { add: (f: FontFace) => void }).add(face);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [handle]);
};
