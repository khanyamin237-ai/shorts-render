// GitHub Actions me render se pehle: font + voice files download, har voice ki length naapna, props.json banana.
import fs from "node:fs";
import { execFileSync } from "node:child_process";

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

fs.writeFileSync(
  "public/hind.ttf",
  await download("https://github.com/google/fonts/raw/main/ofl/hind/Hind-Bold.ttf", "Hind font")
);

const voiceFiles = [];
const durations = [];
for (let i = 0; i < scenes.length; i++) {
  const buf = await download(voiceUrls[i], "Voice " + (i + 1));
  const ext = buf.subarray(0, 4).toString("latin1") === "RIFF" ? "wav" : "mp3";
  const name = "voice" + (i + 1) + "." + ext;
  fs.writeFileSync("public/" + name, buf);
  voiceFiles.push(name);
  durations.push(duration("public/" + name));
}

let hasMusic = false;
if (payload.musicUrl) {
  try {
    fs.writeFileSync("public/music.mp3", await download(payload.musicUrl, "Music"));
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

const props = {
  scenes: scenes.map((s) => ({ voice: String(s.voice || ""), caption: String(s.caption || "") })),
  info: payload.info || { postName: "", totalPosts: "", startDate: "", lastDate: "" },
  voiceFiles,
  durations,
  hasMusic,
  thumbnailText: String(payload.thumbnailText || ""),
  title: String(payload.title || ""),
  kind: String(payload.kind || "recruitment"),
  ...(bg ? { bg } : {}),
};
fs.writeFileSync("props.json", JSON.stringify(props));
console.log("props ready:", scenes.length, "scenes, total", durations.reduce((a, b) => a + b, 0).toFixed(1), "sec");
