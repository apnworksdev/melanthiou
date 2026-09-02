#!/usr/bin/env python3
"""Generate PNG/ICO brand assets for social previews and icons."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1] / "public" / "img"
INK = (26, 21, 16, 255)
PAPER = (243, 239, 230, 255)
BRONZE = (156, 124, 74, 255)
FONT = "/System/Library/Fonts/Supplemental/Didot.ttc"


def font(size: int) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype(FONT, size, index=0)
    except OSError:
        return ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia.ttf", size)


def draw_mark(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], stroke: int) -> None:
    x0, y0, x1, y1 = box
    mid = (x0 + x1) // 2
    draw.line([(x0, y1), (x0, y0), (mid, int(y0 + (y1 - y0) * 0.72)), (x1, y0), (x1, y1)], fill=PAPER, width=stroke)


def icon(size: int, path: Path) -> None:
    img = Image.new("RGBA", (size, size), INK)
    draw = ImageDraw.Draw(img)
    inset = max(3, size // 16)
    draw.rectangle([inset, inset, size - inset - 1, size - inset - 1], outline=BRONZE, width=max(1, size // 64))
    pad = int(size * 0.22)
    draw_mark(draw, (pad, pad, size - pad, size - pad), max(2, size // 18))
    img.save(path, "PNG")


def og_image(path: Path) -> None:
    w, h = 1200, 630
    img = Image.new("RGBA", (w, h), INK)
    draw = ImageDraw.Draw(img)
    draw.rectangle([36, 36, w - 37, h - 37], outline=BRONZE, width=1)
    draw.rectangle([42, 42, w - 43, h - 43], outline=(*BRONZE[:3], 90), width=1)
    mark_box = (88, 210, 188, 410)
    draw.rectangle([mark_box[0] - 18, mark_box[1] - 18, mark_box[2] + 18, mark_box[3] + 18], outline=BRONZE, width=1)
    draw_mark(draw, mark_box, 6)
    title = font(92)
    kicker = font(22)
    draw.text((250, 228), "MELANTHIOU", font=title, fill=PAPER)
    draw.line([(250, 350), (430, 350)], fill=BRONZE, width=1)
    draw.text((250, 372), "Official website", font=kicker, fill=BRONZE)
    img.convert("RGB").save(path, "PNG", optimize=True)


def main() -> None:
    ROOT.mkdir(parents=True, exist_ok=True)
    og_image(ROOT / "og-image.png")
    icon(180, ROOT / "apple-touch-icon.png")
    icon(32, ROOT / "favicon-32.png")
    icon(16, ROOT / "favicon-16.png")
    icon(192, ROOT / "icon-192.png")
    icon(512, ROOT / "icon-512.png")
    ico_src = Image.open(ROOT / "favicon-32.png")
    ico_src.save(
        ROOT.parent / "favicon.ico",
        sizes=[(16, 16), (32, 32)],
        format="ICO",
    )
    print(f"Wrote assets to {ROOT}")


if __name__ == "__main__":
    main()
