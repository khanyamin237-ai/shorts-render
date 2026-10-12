import { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const PAD_SECONDS = 0.25;
export const NOT_FOUND = "ऑफिशियल साइट देखें";
export const FONT = "Hind, 'Noto Sans Devanagari', sans-serif";

export type Scene = { voice: string; caption: string };
export type Info = {
  postName: string;
  totalPosts: string;
  startDate: string;
  lastDate: string;
  labels?: { totalPosts?: string; startDate?: string; lastDate?: string };
};
export type ShortProps = {
  scenes: Scene[];
  info: Info;
  voiceFiles: string[];
  durations: number[];
  hasMusic: boolean;
  thumbnailText: string;
  title: string;
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
