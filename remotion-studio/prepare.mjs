// GitHub Actions me render se pehle: font + voice files download, har voice ki length naapna, props.json banana.
import fs from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { peakDb } from "./audio-check.mjs";

const payload = JSON.parse(process.env.PAYLOAD || "{}");
const scenes = Array.isArray(payload.scenes) ? payload.scenes : [];
const voiceUrls = Array.isArray(payload.voiceUrls) ? payload.voiceUrls : [];
if (!scenes.length || voiceUrls.length < scenes.length) {
  throw new Error("Payload adhura hai: scenes ya voiceUrls nahi mile.");
}

fs.mkdirSync("public", { recursive: true });
fs.mkdirSync("out", { recursive: true });

async function download(url, label, tries = 3) {
  let last;
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) throw new Error("HTTP " + res.status);
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      last = err;
      await new Promise((r) => setTimeout(r, 1500 * i));
    }
  }
  throw new Error(label + " download fail hui: " + last);
}

function duration(file) {
  const out = execFileSync(
    "npx",
    ["remotion", "ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
  );
  const seconds = parseFloat(out.trim().split(/\s+/).pop());
  if (!Number.isFinite(seconds) || seconds <= 0) throw new Error("Awaaz ki length nahi mili: " + file);
  return seconds;
}

function ff(args) {
  return spawnSync("npx", ["remotion", "ffmpeg", ...args], { encoding: "utf8" });
}

fs.writeFileSync(
  "public/hind.ttf",
  await download("https://github.com/google/fonts/raw/main/ofl/hind/Hind-Bold.ttf", "Hind font")
);

const voiceFiles = [];
const durations = [];
for (let i = 0; i < scenes.length; i++) {
  const buf = await download(voiceUrls[i], "Voice " + (i + 1));
  const ext = buf.subarray(0, 4).toString("latin1") === "RIFF" ? "wav" : "mp3";
  const raw = "public/raw" + (i + 1) + "." + ext;
  fs.writeFileSync(raw, buf);
  // Har scene ki loudness ek jaisi (-16 LUFS, Shorts ke liye theek) taaki awaaz dheemi/tez na ho. Fail ho to original rakho.
  let name = "voice" + (i + 1) + ".wav";
  const norm = ff(["-y", "-i", raw, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "44100", "-ac", "1", "-c:a", "pcm_s16le", "public/" + name]);
  if (norm.status !== 0 || !fs.existsSync("public/" + name) || fs.statSync("public/" + name).size < 2000) {
    console.log("Loudness normalize skip (scene " + (i + 1) + "):", String(norm.stderr || "").slice(-200));
    name = "voice" + (i + 1) + "." + ext;
    fs.copyFileSync(raw, "public/" + name);
  }
  fs.rmSync(raw, { force: true });
  const peak = peakDb("public/" + name);
  if (peak === -Infinity || (peak !== null && peak < -50)) {
    throw new Error("Scene " + (i + 1) + " ki awaaz silent hai (peak " + peak + " dB) — video nahi banega.");
  }
  voiceFiles.push(name);
  durations.push(duration("public/" + name));
}

let hasMusic = false;
let musicFile = "music.mp3";
if (payload.musicUrl) {
  try {
    const mbuf = await download(payload.musicUrl, "Music");
    musicFile = mbuf.subarray(0, 4).toString("latin1") === "RIFF" ? "music.wav" : "music.mp3";
    fs.writeFileSync("public/" + musicFile, mbuf);
    hasMusic = true;
  } catch (err) {
    console.log("Music skip hua:", String(err));
  }
}

// Thumbnail ki background photo (AI se bani, vibhag ke hisab se). Na mile to chupchap purana design use hota hai.
let bg = "";
if (payload.bgUrl) {
  try {
    const buf = await download(payload.bgUrl, "Background");
    const isPng = buf.subarray(1, 4).toString("latin1") === "PNG";
    const isJpg = buf[0] === 0xff && buf[1] === 0xd8;
    if (isPng || isJpg) {
      bg = isPng ? "bg.png" : "bg.jpg";
      fs.writeFileSync("public/" + bg, buf);
    } else {
      console.log("Background image jaisi nahi lagi, skip hua");
    }
  } catch (err) {
    console.log("Background skip hua:", String(err));
  }
}

// Cartoon chehre (character sheet se bane 6 JPEG). Sab 6 na mile to chupchap purane drawn cartoon use hote hain.
const chars = {};
if (payload.charUrls && typeof payload.charUrls === "object") {
  for (const key of ["munna", "chintu"].flatMap((w) => ["happy", "surprised", "worried"].map((m) => w + "-" + m))) {
    try {
      const url = payload.charUrls[key];
      if (!url) continue;
      const buf = await download(String(url), "Character " + key);
      const isPng = buf.subarray(1, 4).toString("latin1") === "PNG";
      const isJpg = buf[0] === 0xff && buf[1] === 0xd8;
      if (!isPng && !isJpg) continue;
      const name = "char-" + key + (isPng ? ".png" : ".jpg");
      fs.writeFileSync("public/" + name, buf);
      chars[key] = name;
    } catch (err) {
      console.log("Character skip:", key, String(err));
    }
  }
}
const charsReady = Object.keys(chars).length === 6;

const props = {
  scenes: scenes.map((s) => ({ voice: String(s.voice || ""), caption: String(s.caption || "") })),
  info: payload.info || { postName: "", totalPosts: "", startDate: "", lastDate: "" },
  voiceFiles,
  durations,
  hasMusic,
  musicFile,
  voiceVolume: Math.min(1.5, Math.max(0.3, Number(payload.voiceVolumePct || 100) / 100)),
  musicVolume: Math.min(0.4, Math.max(0, Number(payload.musicVolumePct === undefined ? 12 : payload.musicVolumePct) / 100)),
  thumbnailText: String(payload.thumbnailText || ""),
  title: String(payload.title || ""),
  kind: String(payload.kind || "recruitment"),
  ...(Array.isArray(payload.speakers) ? { speakers: payload.speakers.map((n) => (Number(n) === 1 ? 1 : 0)) } : {}),
  ...(payload.cta ? { cta: String(payload.cta).slice(0, 60) } : {}),
  ...(payload.subtitles === false ? { subtitles: false } : {}),
  ...(Array.isArray(payload.moods) ? { moods: payload.moods.map((m) => (m === "surprised" || m === "worried" ? m : "happy")) } : {}),
  ...(charsReady ? { chars } : {}),
  ...(bg ? { bg } : {}),
  ...(typeof payload.layout === "string" ? { layout: payload.layout } : {}),
  ...(payload.palette && typeof payload.palette === "object" ? { palette: payload.palette } : {}),
};
fs.writeFileSync("props.json", JSON.stringify(props));
console.log("props ready:", scenes.length, "scenes, total", durations.reduce((a, b) => a + b, 0).toFixed(1), "sec");
