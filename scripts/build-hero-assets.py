#!/usr/bin/env python3
"""Turn the intro video into a seamless looping hero clip.

Usage:
  python3 scripts/build-hero-assets.py INTRO.mp4 [--crop W:H:X:Y] [--loop-seconds 10] [--still-at 2.0]

Needs: ffmpeg (on PATH, or `pip install imageio-ffmpeg`), numpy, pillow.
Outputs: public/hero/hero.mp4, public/hero/hero.webm, public/hero/poster.webp, public/portrait-bust.webp, public/og.jpg
"""
import argparse, os, shutil, subprocess, sys, tempfile, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XFADE = 0.5          # seconds of cross-fade
SR = 48000           # audio sample rate used for the loop
OUT_W = 768          # hero width (height follows 768:960 = 4:5)
PAPER = (244, 242, 238)


def ffmpeg_exe():
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        sys.exit("ffmpeg not found. Install it or `pip install imageio-ffmpeg`.")


FF = ffmpeg_exe()


def run(args):
    subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-y", *args], check=True)


def grab_frame(src, t, path):
    run(["-ss", str(t), "-i", src, "-frames:v", "1", path])
    return Image.open(path).convert("RGB")


def person_bbox(img):
    """Bounding box of everything that is not near-white background."""
    a = np.asarray(img).astype(np.int16)
    bg = np.median(a[:8, :, :].reshape(-1, 3), axis=0)           # top strip = backdrop
    mask = np.abs(a - bg).sum(axis=2) > 60
    cols, rows = np.where(mask.sum(axis=0) > 3)[0], np.where(mask.sum(axis=1) > 3)[0]
    return cols.min(), rows.min(), cols.max(), rows.max()


def centre_x(img, y0, y1):
    """Median horizontal centre of the figure between rows y0..y1 (ignores arms/shadows)."""
    a = np.asarray(img).astype(np.int16)
    bg = np.median(a[:8, :, :].reshape(-1, 3), axis=0)
    mask = np.abs(a - bg).sum(axis=2) > 60
    cs = [(np.where(mask[r])[0].min() + np.where(mask[r])[0].max()) / 2 for r in range(y0, y1) if mask[r].sum() > 3]
    return int(np.median(cs))


def auto_crop(img):
    x0, y0, x1, y1 = person_bbox(img)
    H = img.height
    h = min(H, int((y1 - y0) * 1.06))
    w = int(h * 0.8)                                              # 4:5 like the hero box
    cx = centre_x(img, y0, y0 + int((y1 - y0) * 0.55))            # centre the torso
    x = max(0, min(img.width - w, cx - w // 2))
    y = max(0, min(H - h, y0 - int((h - (y1 - y0)) / 2)))
    w = w // 4 * 4
    h = w * 5 // 4
    return w, h, x, y, (x0, y0, x1, y1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("--crop", help="W:H:X:Y crop box in source pixels (default: auto-detect)")
    ap.add_argument("--loop-seconds", type=float, default=10.0)
    ap.add_argument("--still-at", type=float, default=2.0)
    o = ap.parse_args()

    tmp = tempfile.mkdtemp()
    first = grab_frame(o.src, o.still_at, os.path.join(tmp, "still.png"))
    if o.crop:
        cw, ch, cx, cy = [int(v) for v in o.crop.split(":")]
        bbox = person_bbox(first)
    else:
        cw, ch, cx, cy, bbox = auto_crop(first)
    print(f"crop={cw}:{ch}:{cx}:{cy}  person bbox={bbox}")

    T = o.loop_seconds
    out_h = int(round(OUT_W * ch / cw / 2)) * 2
    whiten = "colorlevels=rimax=0.98:gimax=0.98:bimax=0.98"
    vf = (
        f"[0:v]trim=0:{T},setpts=PTS-STARTPTS,crop={cw}:{ch}:{cx}:{cy},scale={OUT_W}:{out_h}:flags=lanczos,{whiten},fps=24,split[a][b];"
        f"[a]trim=start={XFADE},setpts=PTS-STARTPTS,fps=24[main];"
        f"[b]trim=0:{XFADE},setpts=PTS-STARTPTS,fps=24[head];"
        f"[main][head]xfade=transition=fade:duration={XFADE}:offset={T - XFADE - XFADE},format=yuv420p[v]"
    )
    vid = os.path.join(tmp, "loop_video.mkv")
    run(["-i", o.src, "-filter_complex", vf, "-map", "[v]", "-an", "-c:v", "libx264", "-crf", "12", "-preset", "fast", vid])

    # ---- audio: sample-accurate equal-power cross-fade in numpy
    raw = os.path.join(tmp, "a.raw")
    run(["-i", o.src, "-t", str(T), "-vn", "-ac", "2", "-ar", str(SR), "-f", "f32le", raw])
    a = np.fromfile(raw, dtype="<f4").reshape(-1, 2)
    n = int(XFADE * SR)
    t = np.linspace(0, np.pi / 2, n, endpoint=False)[:, None]
    body = a[n:].copy()                                           # from 0.5 s to the end
    body[-n:] = a[-n:] * np.cos(t) + a[:n] * np.sin(t)            # tail fades into head
    wav = os.path.join(tmp, "loop.wav")
    with wave.open(wav, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(body, -1, 1) * 32767).astype("<i2").tobytes())

    pub = os.path.join(ROOT, "public")
    os.makedirs(os.path.join(pub, "hero"), exist_ok=True)
    run(["-i", vid, "-i", wav, "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-pix_fmt", "yuv420p",
         "-crf", "24", "-preset", "slow", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", "-shortest",
         os.path.join(pub, "hero", "hero.mp4")])
    run(["-i", vid, "-i", wav, "-map", "0:v", "-map", "1:a", "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0",
         "-row-mt", "1", "-pix_fmt", "yuv420p", "-c:a", "libopus", "-b:a", "80k", "-shortest",
         os.path.join(pub, "hero", "hero.webm")])

    # ---- poster frame shown before the video starts
    run(["-ss", "0.5", "-i", os.path.join(pub, "hero", "hero.mp4"), "-frames:v", "1", "-c:v", "libwebp", "-quality", "82", os.path.join(pub, "hero", "poster.webp")])

    # ---- portrait still (head to shirt) from the clearest frame
    x0, y0, x1, y1 = bbox
    bh = y1 - y0
    ph = int(bh * 0.30)                                           # head + collar/shoulders
    pw = int(ph * 0.8)
    pcx = centre_x(first, y0, y0 + int(bh * 0.12))                # head centre
    px = max(0, min(first.width - pw, pcx - pw // 2))
    py = max(0, y0 - int(bh * 0.03))
    still = first.crop((px, py, px + pw, py + ph)).resize((480, 600), Image.LANCZOS)
    arr = np.asarray(still).astype(np.float32)
    k = 255.0 / (0.98 * 255.0)
    still = Image.fromarray(np.clip(arr * k, 0, 255).astype(np.uint8))
    still.save(os.path.join(pub, "portrait-bust.webp"), quality=90)

    # ---- og.jpg 1200x630 on the paper colour
    og = Image.new("RGB", (1200, 630), PAPER)
    port = still.resize((420, 525), Image.LANCZOS)
    og.paste(port, (700, 52))
    d = ImageDraw.Draw(og)
    fnt = os.path.join(ROOT, "src", "fonts", "InterTight-Variable.woff2")
    try:
        big = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 84, index=1)
        small = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 34)
    except Exception:
        big = small = ImageFont.load_default()
    d.text((72, 200), "Muhammad\nAnas Khan", fill=(13, 13, 13), font=big, spacing=6)
    d.text((72, 420), "Backend Developer (Node.js)", fill=(119, 117, 111), font=small)
    og.save(os.path.join(pub, "og.jpg"), quality=88)
    print("done ->", os.path.join(pub, "hero"))


if __name__ == "__main__":
    main()
