#!/usr/bin/env python3
"""
slice_spritesheet.py
Taglia lo spritesheet norex (16 righe × 6 colonne) e produce:
  - GIF animati in media/{operative-type}/   (usati dall'engine)
  - PNG singoli in media/sprites/{operative-type}/  (per editing manuale)

Uso:
    python3 vscode-metalgear/slice_spritesheet.py
"""

import os
import sys
from PIL import Image

# ─── Config ───────────────────────────────────────────────────────────────────

SPRITESHEET = "vscode-metalgear/media/vscode_metalgear_justsprites_norex.png"
OUTPUT_ROOT = "vscode-metalgear/media"       # GIF engine
SPRITES_ROOT = "vscode-metalgear/media/sprites"  # PNG di riferimento

ROWS = 16
COLS = 6

# Mappatura (row_index 0-based) → (cartella operativo, prefisso colore)
ROW_MAP = [
    ("genome-soldier", "normal"),       # ROW 1
    ("genome-soldier", "foxhound"),     # ROW 2
    ("genome-soldier", "snow"),         # ROW 3
    ("solid-snake",    "foxhound"),     # ROW 4
    ("solid-snake",    "vr-mission"),   # ROW 5
    ("cardboard-box",  "normal"),       # ROW 6
    ("cardboard-box",  "snow"),         # ROW 7
    ("cardboard-box",  "desert"),       # ROW 8
    ("solid-snake",    "sneaking-suit"),# ROW 9
    ("solid-snake",    "bandana"),      # ROW 10
    ("solid-snake",    "tuxedo"),       # ROW 11
    ("gray-fox",       "cyborg"),       # ROW 12
    ("gray-fox",       "ninja"),        # ROW 13
    ("raiden",         "normal"),       # ROW 14
    ("raiden",         "white-suit"),   # ROW 15
    ("raiden",         "cyborg"),       # ROW 16  ← nuovo colore, richiede modifica codice
]

# Mappatura (col_index 0-based) → suffisso animazione engine
COL_MAP = [
    "idle",
    "walk",
    "walk_fast",
    "run",
    "swipe",
    "with_ball",
]

# GIF a 8 fps = 1 frame ogni 125ms = delay Pillow in ms
GIF_DURATION_MS = 125

# ─── Main ─────────────────────────────────────────────────────────────────────

README_TEMPLATE = """# {operative_type} — sprite frames

Ogni PNG corrisponde a un frame singolo ritagliato dallo spritesheet.
Per l'engine serve una GIF animata; se il personaggio ha un solo frame
per animazione basta convertire 1:1.

## Naming convention GIF (engine)

    {color}_{{animation}}_8fps.gif

Dove {{animation}} è uno di: idle, walk, walk_fast, run, swipe, with_ball

## Come convertire con ImageMagick

    convert -delay 12 -loop 0 {color}__idle.png {color}_idle_8fps.gif

## Come convertire con ffmpeg

    ffmpeg -framerate 8 -i {color}__idle.png {color}_idle_8fps.gif
"""


def main():
    if not os.path.exists(SPRITESHEET):
        print(f"ERRORE: spritesheet non trovato: {SPRITESHEET}")
        sys.exit(1)

    img = Image.open(SPRITESHEET).convert("RGBA")
    w, h = img.size
    print(f"Spritesheet: {w}×{h} px")

    # Divisione uniforme — più affidabile su spritesheet con sfondo solido
    row_lines = [round(i * h / ROWS) for i in range(ROWS + 1)]
    col_lines = [round(i * w / COLS) for i in range(COLS + 1)]

    print(f"Bordi righe:    {row_lines}")
    print(f"Bordi colonne:  {col_lines}")
    print()

    gif_count = 0
    png_count = 0

    for row_idx in range(ROWS):
        operative_type, color = ROW_MAP[row_idx]
        y0 = row_lines[row_idx]
        y1 = row_lines[row_idx + 1]

        # ── GIF per l'engine ──────────────────────────────────────────────────
        out_dir = os.path.join(OUTPUT_ROOT, operative_type)
        os.makedirs(out_dir, exist_ok=True)

        # ── PNG di riferimento ────────────────────────────────────────────────
        sprite_dir = os.path.join(SPRITES_ROOT, operative_type)
        os.makedirs(sprite_dir, exist_ok=True)

        # Scrivi README nella cartella sprite la prima volta
        readme_path = os.path.join(sprite_dir, "README.md")
        if not os.path.exists(readme_path):
            with open(readme_path, "w") as f:
                f.write(README_TEMPLATE.format(operative_type=operative_type, color=color))

        for col_idx in range(COLS):
            animation = COL_MAP[col_idx]
            x0 = col_lines[col_idx]
            x1 = col_lines[col_idx + 1]

            cell = img.crop((x0, y0, x1, y1))

            # ── GIF engine ────────────────────────────────────────────────────
            gif_name = f"{color}_{animation}_8fps.gif"
            gif_path = os.path.join(out_dir, gif_name)
            cell.save(
                gif_path,
                format="GIF",
                save_all=True,
                append_images=[],
                duration=GIF_DURATION_MS,
                loop=0,
                disposal=2,
            )
            gif_count += 1

            # ── PNG parlante ──────────────────────────────────────────────────
            # Nome: {color}__{animation}.png
            # es.  sneaking-suit__idle.png  → diventerà sneaking-suit_idle_8fps.gif
            png_name = f"{color}__{animation}.png"
            png_path = os.path.join(sprite_dir, png_name)
            cell.save(png_path, format="PNG")
            print(f"  ✓  {png_path}")
            png_count += 1

    print()
    print(f"GIF engine:   {gif_count}  →  {OUTPUT_ROOT}/")
    print(f"PNG sprites:  {png_count}  →  {SPRITES_ROOT}/")
    print()
    print("Converti PNG → GIF (esempio con ImageMagick):")
    print("  convert -delay 12 -loop 0 sneaking-suit__idle.png sneaking-suit_idle_8fps.gif")


if __name__ == "__main__":
    main()
