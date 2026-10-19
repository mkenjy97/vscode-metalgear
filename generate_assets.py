#!/usr/bin/env python3
"""
Genera placeholder PNG per backgrounds e icon.png.
Eseguire una volta sola: python3 generate_assets.py
"""
import os
import struct
import zlib


def make_png(width=128, height=128, r=30, g=60, b=30):
    def write_chunk(chunk_type, data):
        c = chunk_type + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)
    sig = b'\x89PNG\r\n\x1a\n'
    ihdr = write_chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0))
    raw = b''
    for _ in range(height):
        raw += b'\x00'
        for _ in range(width):
            raw += bytes([r, g, b])
    idat = write_chunk(b'IDAT', zlib.compress(raw))
    iend = write_chunk(b'IEND', b'')
    return sig + ihdr + idat + iend


# icon.png
with open('icon.png', 'wb') as f:
    f.write(make_png(128, 128, 30, 80, 30))
print('Created icon.png')

# Backgrounds
themes = {
    'shadow-moses': (30, 40, 50),
    'mother-base': (20, 40, 60),
    'big-shell': (30, 50, 60),
    'outer-heaven': (50, 40, 20),
}
sizes = ['nano', 'small', 'medium', 'large']
kinds = ['dark', 'light']
types_ = ['background', 'foreground']

count = 0
for theme, (r, g, b) in themes.items():
    dirpath = os.path.join('media', 'backgrounds', theme)
    os.makedirs(dirpath, exist_ok=True)
    for kind in kinds:
        for size in sizes:
            for t in types_:
                fr, fg, fb = (0, 0, 0) if t == 'foreground' else (r, g, b)
                filepath = os.path.join(dirpath, f'{t}-{kind}-{size}.png')
                with open(filepath, 'wb') as f:
                    f.write(make_png(200, 150, fr, fg, fb))
                count += 1

print(f'Created {count} background PNGs')
print('Done. Replace placeholder files with real assets.')
