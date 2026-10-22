// Workflow me final MP4 check: audio stream hona chahiye aur awaaz silent nahi honi chahiye.
import { hasAudioStream, peakDb } from "./audio-check.mjs";

const file = process.argv[2] || "out/video.mp4";
if (!hasAudioStream(file)) {
  console.log("FINAL MP4 me audio stream nahi hai");
  process.exit(1);
}
const peak = peakDb(file);
console.log("audio peak:", peak === null ? "naap nahi paaye (skip)" : peak === -Infinity ? "-inf" : peak.toFixed(1) + " dB");
if (peak === -Infinity || (peak !== null && peak < -50)) {
  console.log("FINAL MP4 ki awaaz silent hai");
  process.exit(1);
}
