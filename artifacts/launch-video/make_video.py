#!/usr/bin/env python3
"""Render a short Recall launch video from the app's current UI and content."""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import subprocess
from pathlib import Path

OUT = Path(__file__).parent
W, H, FPS, DURATION = 1280, 720, 20, 30
BG = (9, 9, 11)
CARD = (24, 24, 27)
MUTED = (161, 161, 170)
DIM = (113, 113, 122)
WHITE = (244, 244, 245)
ACCENT = (99, 102, 241)
GREEN = (110, 231, 183)
FONT = "/System/Library/Fonts/SFNS.ttf"
BOLD = "/System/Library/Fonts/SFNS.ttf"

def f(size): return ImageFont.truetype(FONT, size)

def rr(d, box, radius, fill, outline=None, width=1):
    d.rounded_rectangle(box, radius, fill=fill, outline=outline, width=width)

def txt(d, xy, s, size, color=WHITE, anchor=None):
    d.text(xy, s, font=f(size), fill=color, anchor=anchor, stroke_width=0)

def wrap(d, s, size, max_width):
    words, rows, row = s.split(), [], ""
    for word in words:
        trial = (row + " " + word).strip()
        if d.textlength(trial, font=f(size)) <= max_width:
            row = trial
        else:
            if row: rows.append(row)
            row = word
    if row: rows.append(row)
    return rows

def paragraph(d, xy, s, size, color, width, leading=None):
    leading = leading or int(size * 1.34)
    for i, line in enumerate(wrap(d, s, size, width)):
        txt(d, (xy[0], xy[1] + i * leading), line, size, color)

def base():
    im = Image.new("RGB", (W, H), BG)
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    g = ImageDraw.Draw(glow)
    g.ellipse((610, -130, 1420, 690), fill=(70, 54, 190, 50))
    glow = glow.filter(ImageFilter.GaussianBlur(110))
    im = Image.alpha_composite(im.convert("RGBA"), glow)
    d = ImageDraw.Draw(im)
    txt(d, (76, 52), "RECALL", 18, (180, 180, 190))
    d.line((76, 91, 1204, 91), fill=(47, 47, 54), width=1)
    return im

def phone_canvas():
    im = Image.new("RGBA", (410, 668), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    rr(d, (7, 4, 403, 664), 43, (3, 3, 5), (71, 71, 79), 2)
    rr(d, (18, 15, 392, 653), 31, BG)
    rr(d, (161, 19, 249, 40), 11, (3, 3, 5))
    txt(d, (43, 29), "9:41", 14)
    txt(d, (332, 29), "●  ▰", 12)
    return im, d

def phone_home():
    im, d = phone_canvas()
    txt(d, (44, 80), "Recall", 28)
    txt(d, (346, 84), "⚙", 24, DIM)
    vals = [("DUE", "8", ACCENT), ("NEW TODAY", "10", WHITE), ("STREAK", "4d", WHITE), ("SEEN", "82/150", WHITE)]
    for i, (label, val, color) in enumerate(vals):
        x = 42 + (i % 2) * 169
        y = 147 + (i // 2) * 111
        rr(d, (x, y, x + 156, y + 94), 18, CARD)
        txt(d, (x + 15, y + 14), label, 11, DIM)
        txt(d, (x + 15, y + 36), val, 30, color)
    txt(d, (44, 384), "Activity", 18)
    for i, ht in enumerate([21, 32, 25, 44, 38, 50, 59, 40, 61, 70, 55, 77]):
        x = 44 + i * 25
        rr(d, (x, 483 - ht, x + 15, 483), 4, ACCENT if i > 6 else (67, 68, 119))
    txt(d, (43, 524), "Session size", 14, DIM)
    rr(d, (42, 548, 368, 589), 12, CARD)
    rr(d, (48, 553, 147, 584), 9, (63, 63, 70))
    for x, n in [(97, "10"), (205, "20"), (312, "30")]: txt(d, (x, 568), n, 15, WHITE if n == "10" else MUTED, "mm")
    rr(d, (42, 601, 368, 640), 12, ACCENT)
    txt(d, (205, 620), "Start · 10 cards", 18, WHITE, "mm")
    return im

def phone_question():
    im, d = phone_canvas()
    txt(d, (43, 88), "×", 28, DIM)
    rr(d, (92, 96, 315, 102), 3, (39, 39, 42))
    rr(d, (92, 96, 124, 102), 3, ACCENT)
    txt(d, (331, 90), "1/10", 14, DIM)
    rr(d, (43, 174, 92, 197), 6, (24, 72, 54))
    txt(d, (67, 185), "Easy", 12, GREEN, "mm")
    txt(d, (43, 210), "Two Sum", 30)
    paragraph(d, (43, 263), "Given an unsorted array and a target, return the indices of the two numbers that add up to the target.", 19, (212, 212, 216), 325, 27)
    txt(d, (43, 399), "Which pattern solves it?", 15, DIM)
    options = ["Two Pointers", "Hash Map", "Binary Search", "Sliding Window"]
    for i, option in enumerate(options):
        y = 439 + i * 52
        rr(d, (42, y, 368, y + 45), 13, CARD if i != 1 else (44, 45, 84))
        txt(d, (57, y + 12), option, 17)
    return im

def phone_feedback():
    im, d = phone_canvas()
    rr(d, (19, 57, 392, 178), 0, (23, 49, 43))
    txt(d, (43, 79), "CORRECT", 14, GREEN)
    txt(d, (43, 105), "Hash Map", 24)
    paragraph(d, (43, 141), "Find complements in one pass.", 14, (175, 208, 194), 330)
    txt(d, (43, 204), "Two Sum", 22)
    rr(d, (42, 253, 368, 390), 13, CARD)
    txt(d, (57, 270), "WHY", 12, DIM)
    paragraph(d, (57, 298), "For each number, check whether its complement has already appeared. A map gives the index in O(1).", 16, (212, 212, 216), 294, 22)
    rr(d, (42, 406, 368, 474), 13, CARD)
    txt(d, (57, 421), "COMPLEXITY", 12, DIM)
    txt(d, (57, 446), "O(n) time, O(n) space", 16, (212, 212, 216))
    txt(d, (43, 506), "Open on LeetCode ↗", 14, ACCENT)
    for x, label, sub, fill in [(42, "Hard", "1d", CARD), (152, "Good", "3d", ACCENT), (262, "Easy", "7d", CARD)]:
        rr(d, (x, 568, x + 106, 632), 13, fill)
        txt(d, (x + 53, 586), label, 17, WHITE, "mm")
        txt(d, (x + 53, 610), sub, 12, (222, 222, 230) if label == "Good" else DIM, "mm")
    return im

def phone_summary():
    im, d = phone_canvas()
    txt(d, (43, 83), "Session complete", 15, DIM)
    txt(d, (43, 112), "8/10", 34)
    txt(d, (143, 126), "first try · 80%", 15, DIM)
    txt(d, (43, 162), "Work on: Two Pointers", 15, (253, 164, 175))
    items = [("✓", "Two Sum", "Hash Map · due in 3d", GREEN), ("✓", "Daily Temperatures", "Monotonic Stack · due in 3d", GREEN), ("✗", "3Sum", "Two Pointers · due tomorrow", (253, 164, 175)), ("✓", "Number of Islands", "DFS · due in 7d", GREEN), ("✓", "Binary Search", "Binary Search · due in 3d", GREEN)]
    for i, (mark, title, sub, color) in enumerate(items):
        y = 214 + i * 69
        txt(d, (44, y), mark, 19, color)
        txt(d, (74, y), title, 17)
        txt(d, (74, y + 27), sub, 13, DIM)
        d.line((43, y + 58, 369, y + 58), fill=(35, 35, 39), width=1)
    rr(d, (42, 574, 198, 631), 14, CARD)
    rr(d, (209, 574, 368, 631), 14, ACCENT)
    txt(d, (120, 602), "Share", 17, WHITE, "mm")
    txt(d, (289, 602), "Done", 17, WHITE, "mm")
    return im

PHONES = [phone_home(), phone_home(), phone_question(), phone_feedback(), phone_feedback(), phone_summary(), phone_home()]
STARTS = [0, 3, 7, 12, 17, 22, 27]
END = [3, 7, 12, 17, 22, 27, 30]
HEADINGS = ["Practice the patterns.", "Start a quick session.", "Name the approach.", "Understand why.", "Choose when to review.", "See what stuck.", "Make it stick."]
DETAILS = ["Recall is a daily drill for coding interview patterns.", "Ten focused cards. A few minutes of practice.", "See a problem. Pick the pattern before you see the solution.", "Get the reasoning and complexity right after each answer.", "Rate each review so the next one comes at the right time.", "Finish with a clear view of your strengths and weak spots.", "Recall · coding patterns, remembered."]

def smooth(x):
    x = max(0, min(1, x))
    return x*x*(3-2*x)

def scene(idx, t):
    im = base()
    d = ImageDraw.Draw(im)
    local = t - STARTS[idx]
    alpha = smooth(local / 0.65) * smooth((END[idx] - t) / 0.55)
    text_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    td = ImageDraw.Draw(text_layer)
    txt(td, (78, 178), "INTRODUCING RECALL", 18, (147, 149, 255))
    paragraph(td, (75, 236), HEADINGS[idx], 49, WHITE, 530, 57)
    paragraph(td, (78, 374), DETAILS[idx], 21, MUTED, 480, 31)
    if idx == 2:
        rr(td, (78, 504, 275, 545), 20, (39, 39, 64))
        txt(td, (176, 524), "Two Sum  →  Hash Map", 15, (195, 197, 255), "mm")
    if idx == 6:
        rr(td, (78, 504, 315, 552), 15, ACCENT)
        txt(td, (196, 528), "Start practicing  →", 18, WHITE, "mm")
    text_layer.putalpha(text_layer.getchannel("A").point(lambda x: int(x * alpha)))
    im = Image.alpha_composite(im, text_layer)
    phone = PHONES[idx].copy()
    phone.putalpha(phone.getchannel("A").point(lambda x: int(x * alpha)))
    y = 28 + int((1 - smooth(local / 0.8)) * 18)
    im.alpha_composite(phone, (766, y))
    if idx in (1, 2, 4) and local > 1.15:
        p = smooth((local - 1.15) / 1.0)
        if idx == 1: sx, sy, ex, ey = 1135, 550, 969, 647
        elif idx == 2: sx, sy, ex, ey = 1135, 410, 945, 541
        else: sx, sy, ex, ey = 1135, 505, 979, 628
        cx, cy = int(sx + (ex-sx)*p), int(sy + (ey-sy)*p)
        cd = ImageDraw.Draw(im)
        cd.ellipse((cx-5, cy-5, cx+5, cy+5), fill=WHITE, outline=(50, 50, 60), width=1)
        if p > .93:
            rad = 10 + int(14 * smooth((local - 2.2)/.55))
            cd.ellipse((cx-rad, cy-rad, cx+rad, cy+rad), outline=(170, 171, 255, int(160*(1-smooth((local-2.2)/.55)))), width=2)
    return im.convert("RGB")

def frame(t):
    idx = next((i for i in range(len(END)) if t < END[i]), len(END)-1)
    if idx and t - STARTS[idx] < 0.45:
        a = scene(idx-1, t)
        b = scene(idx, t)
        return Image.blend(a, b, smooth((t-STARTS[idx])/.45))
    return scene(idx, t)

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    frame(9).save(OUT / "poster.png")
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-vcodec", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(OUT / "recall-launch-draft.mp4")]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    try:
        for n in range(FPS * DURATION):
            proc.stdin.write(frame(n/FPS).tobytes())
    finally:
        proc.stdin.close()
    if proc.wait(): raise RuntimeError("ffmpeg failed")

if __name__ == "__main__": main()
