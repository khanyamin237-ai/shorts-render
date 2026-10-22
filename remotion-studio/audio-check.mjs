// Audio check helpers. Remotion ke ffmpeg me volumedetect filter aur s16le muxer nahi hote,
// isliye audio ko temp WAV me decode karke peak khud naapte hain.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// File me audio stream hai ya nahi (true/false).
export function hasAudioStream(file) {
  const r = spawnSync("npx", ["remotion", "ffprobe", "-v", "error", "-select_streams", "a", "-show_entries", "stream=codec_name", "-of", "csv=p=0", file], { encoding: "utf8" });
  return r.status === 0 && String(r.stdout || "").trim().length > 0;
}

// Awaaz ki sabse tez peak (dBFS). -Infinity = poori silent, null = naap nahi paaye (decode fail).
export function peakDb(file) {
  const tmp = path.join(os.tmpdir(), "peak-" + process.pid + "-" + Date.now() + ".wav");
  try {
    const r = spawnSync("npx", ["remotion", "ffmpeg", "-v", "error", "-y", "-i", file, "-vn", "-ac", "1", "-ar", "8000", "-c:a", "pcm_s16le", tmp], { encoding: "utf8" });
    if (r.status !== 0 || !fs.existsSync(tmp)) return null;
    const buf = fs.readFileSync(tmp);
    let pos = 12;
    let start = -1;
    let end = buf.length;
    while (pos + 8 <= buf.length) {
      const id = buf.toString("latin1", pos, pos + 4);
      const size = buf.readUInt32LE(pos + 4);
      if (id === "data") {
        start = pos + 8;
        end = Math.min(buf.length, start + size);
        break;
      }
      pos += 8 + size + (size % 2);
    }
    if (start < 0 || end - start < 2) return null;
    let peak = 0;
    for (let i = start; i + 1 < end; i += 2) {
      const v = Math.abs(buf.readInt16LE(i));
      if (v > peak) peak = v;
    }
    if (peak === 0) return -Infinity;
    return 20 * Math.log10(peak / 32768);
  } finally {
    fs.rmSync(tmp, { force: true });
  }
}
