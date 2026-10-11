import json, os, subprocess, sys, urllib.request
from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1920
SIDE = 50
WHITE, YELLOW, RED = (255, 255, 255), (255, 255, 0), (217, 4, 41)
FONT_PATH = os.environ.get("FONT", "hind.ttf")
FALLBACK = "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf"
if not os.path.exists(FONT_PATH):
    FONT_PATH = FALLBACK
FPS = 25
OUT = "out"
os.makedirs(OUT, exist_ok=True)
os.makedirs("work", exist_ok=True)


def font(size):
    return ImageFont.truetype(FONT_PATH, size, layout_engine=ImageFont.Layout.RAQM)


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-3000:], file=sys.stderr)
        raise SystemExit("command failed: " + " ".join(cmd[:3]))
    return r.stdout


def download(url, path):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=120) as r, open(path, "wb") as f:
        f.write(r.read())


def text_w(draw, s, f):
    return draw.textlength(s, font=f)


def center_text(draw, s, f, cx, cy, fill, shadow=False):
    w = text_w(draw, s, f)
    x, y = cx - w / 2, cy
    if shadow:
        draw.text((x + 3, y + 4), s, font=f, fill=(0, 0, 0))
    draw.text((x, y), s, font=f, fill=fill, anchor="la")


def fit_size(draw, s, start, minimum, max_w):
    size = start
    while size > minimum and text_w(draw, s, font(size)) > max_w:
        size -= 2
    return size


def wrap(draw, s, f, max_w):
    lines, line = [], ""
    for word in s.split():
        nxt = (line + " " + word) if line else word
        if text_w(draw, nxt, f) > max_w and line:
            lines.append(line)
            line = word
        else:
            line = nxt
    if line:
        lines.append(line)
    return lines


def rrect(draw, box, r, fill, outline=None, width=0):
    draw.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)


def background():
    img = Image.new("RGB", (W, H))
    px = img.load()
    c1, c2 = (7, 21, 47), (20, 43, 85)
    for y in range(H):
        for x in range(0, W):
            t = (x / W * 0.45 + y / H * 0.55)
            k = 1 - abs(t - 0.52) / 0.52
            k = max(0.0, min(1.0, k))
            px[x, y] = tuple(int(c1[i] + (c2[i] - c1[i]) * k) for i in range(3))
    return img


BG = background()


def scene_frame(i, total, scene, info):
    img = BG.copy().convert("RGBA")
    d = ImageDraw.Draw(img, "RGBA")
    cx = W // 2

    rrect(d, (cx - 320, 170 - 42, cx + 320, 170 + 42), 42, RED)
    center_text(d, "SARKARI ALERT", font(44), cx, 170 - 30, WHITE)
    f = font(fit_size(d, "RAJASTHAN SARKARI HELP CENTER", 34, 22, 960))
    center_text(d, "RAJASTHAN SARKARI HELP CENTER", f, cx, 275 - 24, WHITE)
    post = " ".join((info.get("postName") or "").split()[:6])
    if post:
        pf = font(44)
        lines = wrap(d, post, pf, 940)[:2]
        y0 = 385 - len(lines) * 28
        for k, ln in enumerate(lines):
            center_text(d, ln, pf, cx, y0 + k * 56 - 6, WHITE)
    d.ellipse((cx - 55, 640 - 55, cx + 55, 640 + 55), fill=(11, 19, 43), outline=WHITE, width=6)
    center_text(d, str(i + 1), font(60), cx, 640 - 40, WHITE)

    cap_box = (SIDE + 10, 750, W - SIDE - 10, 1250)
    d.rectangle(cap_box, fill=(8, 18, 43, 64))
    text = scene["caption"]
    n = len(text)
    base = 66 if n > 44 else 76 if n > 30 else 88 if n > 18 else 96
    size = base + 6 if i == 0 else base
    color = YELLOW if i == 0 else WHITE
    while True:
        cf = font(size)
        lines = wrap(d, text, cf, 940)
        lh = int(size * 1.3)
        if len(lines) * lh <= 480 or size <= 40:
            break
        size -= 4
    y0 = 1000 - len(lines) * lh / 2
    for k, ln in enumerate(lines):
        center_text(d, ln, cf, cx, y0 + k * lh, color, shadow=True)

    pw = W - SIDE * 2
    rrect(d, (SIDE, 1300 - 7, SIDE + pw, 1300 + 7), 7, (58, 70, 112))
    fw = max(14, round(pw * (i + 1) / total))
    rrect(d, (SIDE, 1300 - 7, SIDE + fw, 1300 + 7), 7, YELLOW)

    na = "ऑफिशियल साइट देखें"
    boxes = [
        ("कुल पद", info.get("totalPosts") or na, False),
        ("शुरू तारीख", info.get("startDate") or na, False),
        ("अंतिम तारीख", info.get("lastDate") or na, True),
    ]
    bw, bh, gap, bcy = 310, 170, 25, 1450
    for k, (label, value, red) in enumerate(boxes):
        bcx = cx + (k - 1) * (bw + gap)
        rrect(d, (bcx - bw / 2, bcy - bh / 2, bcx + bw / 2, bcy + bh / 2), 28,
              RED if red else (42, 53, 88), outline=WHITE if red else (75, 88, 124), width=3)
        center_text(d, label, font(30), bcx, bcy - 38 - 22, WHITE)
        vf = font(fit_size(d, value, 40, 20, bw - 30))
        center_text(d, value, vf, bcx, bcy + 28 - 28, WHITE)

    ff = font(fit_size(d, "LINK DESCRIPTION MEIN • FOLLOW FOR UPDATES", 34, 20, 1000))
    center_text(d, "LINK DESCRIPTION MEIN • FOLLOW FOR UPDATES", ff, cx, 1765 - 26, WHITE)
    return img.convert("RGB")


def thumbnail(text, info, path):
    img = Image.new("RGB", (1280, 720))
    px = img.load()
    c1, c2 = (29, 78, 216), (15, 23, 42)
    for y in range(720):
        for x in range(1280):
            t = (x / 1280 + y / 720) / 2
            px[x, y] = tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))
    d = ImageDraw.Draw(img)
    d.text((70, 70), "RAJASTHAN SARKARI HELP CENTER", font=font(34), fill=(147, 197, 253))
    hf = font(128)
    lines = wrap(d, text, hf, 1140)[:3]
    size = 128
    while len(lines) > 2 and size > 70:
        size -= 8
        hf = font(size)
        lines = wrap(d, text, hf, 1140)[:3]
    y = 150
    for ln in lines:
        d.text((70 + 4, y + 5), ln, font=hf, fill=(0, 0, 0))
        d.text((70, y), ln, font=hf, fill=(253, 224, 71))
        y += int(size * 1.25)
    na = "ऑफिशियल साइट देखें"
    parts = []
    if info.get("totalPosts") and info["totalPosts"] != na:
        parts.append("कुल पद: " + info["totalPosts"])
    if info.get("lastDate") and info["lastDate"] != na:
        parts.append("अंतिम तारीख: " + info["lastDate"])
    chip = " • ".join(parts)
    if chip and len(chip) > 38:
        chip = parts[0]
    if chip:
        cf = font(46)
        w = d.textlength(chip, font=cf)
        top = min(y + 20, 620)
        d.rounded_rectangle((70, top, 70 + w + 60, top + 76), radius=38, fill=(220, 38, 38))
        d.text((100, top + 8), chip, font=cf, fill=WHITE)
    img.save(path, "JPEG", quality=92)


def main():
    p = json.loads(os.environ.get("PAYLOAD") or open(sys.argv[1]).read())
    scenes, info, urls = p["scenes"], p.get("info") or {}, p["voiceUrls"]
    total = len(scenes)
    segs = []
    for i, scene in enumerate(scenes):
        audio = "work/voice%d.audio" % (i + 1)
        download(urls[i], audio)
        dur = float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", audio]).strip())
        frame = "work/frame%d.png" % (i + 1)
        scene_frame(i, total, scene, info).save(frame)
        seg = "work/seg%d.mp4" % (i + 1)
        run(["ffmpeg", "-y", "-loop", "1", "-framerate", str(FPS), "-i", frame, "-i", audio,
             "-t", "%.2f" % (dur + 0.25), "-af", "apad=pad_dur=0.25,aresample=44100",
             "-c:v", "libx264", "-preset", "veryfast", "-crf", "22", "-pix_fmt", "yuv420p", "-r", str(FPS),
             "-c:a", "aac", "-b:a", "128k", "-ac", "2", "-shortest", "-movflags", "+faststart", seg])
        segs.append(seg)
    with open("work/list.txt", "w") as f:
        for s in segs:
            f.write("file '%s'\n" % os.path.basename(s))
    joined = "work/joined.mp4"
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", "work/list.txt", "-c", "copy", joined])
    final = OUT + "/video.mp4"
    music = p.get("musicUrl")
    if music:
        try:
            download(music, "work/music.audio")
            run(["ffmpeg", "-y", "-i", joined, "-stream_loop", "-1", "-i", "work/music.audio",
                 "-filter_complex", "[1:a]volume=0.12[m];[0:a][m]amix=inputs=2:duration=first:dropout_transition=0[a]",
                 "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "128k",
                 "-movflags", "+faststart", final])
        except BaseException as e:
            print("music skipped:", e)
            run(["ffmpeg", "-y", "-i", joined, "-c", "copy", "-movflags", "+faststart", final])
    else:
        run(["ffmpeg", "-y", "-i", joined, "-c", "copy", "-movflags", "+faststart", final])
    thumbnail(p.get("thumbnailText") or p.get("title") or "", info, OUT + "/thumb.jpg")
    print("done", os.path.getsize(final))


if __name__ == "__main__":
    main()
