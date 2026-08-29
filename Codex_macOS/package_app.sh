#!/bin/bash
# package_app.sh — Compile the SwiftUI Codex app and bundle it into Codex.app.
#
# Prereqs (one-time):
#   sudo xcodebuild -license accept
#
# Usage:
#   ./package_app.sh                # build release, replace ../Codex.app
#   ./package_app.sh --install      # also copy to /Applications
#   ./package_app.sh --debug        # debug build (faster, no optimisation)
#   ./package_app.sh --icon         # regenerate the AppIcon.icns
#   ./package_app.sh --run          # build then `open` the resulting .app
#
# Builds with SwiftPM, copies the executable into Contents/MacOS/, copies
# Info.plist + AppIcon into Resources, ad-hoc codesigns, and refreshes
# Launch Services so Spotlight & Launchpad find it immediately.

set -e
cd "$(dirname "$0")"
PKG_DIR="$(pwd)"
ROOT="$(cd .. && pwd)"
APP="$ROOT/Codex.app"

CONFIG="release"
DO_INSTALL=false
DO_RUN=false
REBUILD_ICON=false
for arg in "$@"; do
    case "$arg" in
        --debug)   CONFIG="debug" ;;
        --install) DO_INSTALL=true ;;
        --run)     DO_RUN=true ;;
        --icon)    REBUILD_ICON=true ;;
        -h|--help)
            grep -E '^# ' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    esac
done

# ── 1. Compile ─────────────────────────────────────────────────────────────
echo "→ swift build -c $CONFIG"
swift build -c "$CONFIG"
EXE="$PKG_DIR/.build/$CONFIG/Codex"
if [ ! -x "$EXE" ]; then
    echo "✘ Build did not produce executable at $EXE" >&2
    exit 1
fi

# ── 2. Layout bundle ───────────────────────────────────────────────────────
echo "→ Assembling $APP"
rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"
cp "$EXE" "$APP/Contents/MacOS/Codex"
chmod +x "$APP/Contents/MacOS/Codex"
cp "$PKG_DIR/Info.plist" "$APP/Contents/Info.plist"

# Record absolute project path so the bundle stays portable
echo "$ROOT" > "$APP/Contents/Resources/project_path"

# ── 3. Icon ────────────────────────────────────────────────────────────────
ICON="$APP/Contents/Resources/AppIcon.icns"
EXISTING_ICON="$ROOT/Codex.app.icon-backup/AppIcon.icns"
if [ -f "$EXISTING_ICON" ] && [ "$REBUILD_ICON" = false ]; then
    cp "$EXISTING_ICON" "$ICON"
elif [ ! -f "$ICON" ] || [ "$REBUILD_ICON" = true ]; then
    echo "→ Generating AppIcon.icns"
    BUILD_DIR="$ROOT/.build_icon"
    rm -rf "$BUILD_DIR"
    ICONSET="$BUILD_DIR/AppIcon.iconset"
    mkdir -p "$ICONSET"
    BASE_PNG="$BUILD_DIR/icon_1024.png"

    if python3 -c "import PIL" 2>/dev/null; then
        python3 - <<PYEOF
from PIL import Image, ImageDraw, ImageFont
import os
size = 1024
img = Image.new("RGBA", (size, size), (0,0,0,0))
d = ImageDraw.Draw(img)
for y in range(size):
    t = y / size
    r = int(17  + (49  - 17)  * t)
    g = int(17  + (50  - 17)  * t)
    b = int(27  + (68  - 27)  * t)
    d.line([(0,y),(size,y)], fill=(r,g,b,255))
mask = Image.new("L", (size, size), 0)
ImageDraw.Draw(mask).rounded_rectangle((40,40,size-40,size-40), radius=180, fill=255)
out = Image.new("RGBA", (size, size), (0,0,0,0))
out.paste(img, mask=mask)
draw = ImageDraw.Draw(out)
fonts = ["/System/Library/Fonts/SFNS.ttf","/System/Library/Fonts/SFNSDisplay.ttf",
         "/System/Library/Fonts/Helvetica.ttc","/Library/Fonts/Arial.ttf"]
font = None
for f in fonts:
    if os.path.exists(f):
        try: font = ImageFont.truetype(f, 620); break
        except Exception: pass
if font is None: font = ImageFont.load_default()
bbox = draw.textbbox((0,0), "C", font=font)
w = bbox[2]-bbox[0]; h = bbox[3]-bbox[1]
draw.text(((size-w)//2-bbox[0], (size-h)//2-bbox[1]-30), "C", fill=(137,180,250,255), font=font)
try: tfont = ImageFont.truetype(fonts[0] if os.path.exists(fonts[0]) else fonts[2], 110)
except Exception: tfont = font
draw.text((size-300, size-200), ">_", fill=(166,227,161,255), font=tfont)
out.save("$BASE_PNG")
PYEOF
    else
        echo "  (Pillow not installed — using flat-color icon)"
        python3 - <<PYEOF
import struct, zlib
W=H=1024
raw=b''
for _ in range(H):
    raw+=b'\x00'+b'\x1e\x1e\x2e\xff'*W
def chunk(t,d):
    return struct.pack('>I',len(d))+t+d+struct.pack('>I',zlib.crc32(t+d))
png=b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',W,H,8,6,0,0,0))+chunk(b'IDAT',zlib.compress(raw))+chunk(b'IEND',b'')
open("$BASE_PNG","wb").write(png)
PYEOF
    fi

    for sz in 16 32 64 128 256 512 1024; do
        sips -z "$sz" "$sz" "$BASE_PNG" --out "$ICONSET/icon_${sz}x${sz}.png" >/dev/null
    done
    for sz in 16 32 128 256 512; do
        x2=$((sz * 2))
        sips -z "$x2" "$x2" "$BASE_PNG" --out "$ICONSET/icon_${sz}x${sz}@2x.png" >/dev/null
    done
    iconutil -c icns "$ICONSET" -o "$ICON"
    rm -rf "$BUILD_DIR"
fi

# ── 4. Ad-hoc code-sign (lets Gatekeeper run it locally) ───────────────────
echo "→ codesign --force --deep -s -"
codesign --force --deep --sign - "$APP" 2>/dev/null || \
    echo "  (codesign failed — app may still run, but Gatekeeper may complain)"

touch "$APP"

# ── 5. Install (optional) ──────────────────────────────────────────────────
if [ "$DO_INSTALL" = true ]; then
    DEST="/Applications/Codex.app"
    echo "→ Installing to $DEST (sudo)"
    if [ -d "$DEST" ]; then sudo rm -rf "$DEST"; fi
    sudo cp -R "$APP" "$DEST"
    echo "$ROOT" | sudo tee "$DEST/Contents/Resources/project_path" >/dev/null
    /System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -f "$DEST" || true
    sudo touch "$DEST"
fi

echo
echo "✓ Native SwiftUI Codex.app built:"
echo "    $APP"
[ "$DO_INSTALL" = true ] && echo "    /Applications/Codex.app (installed)"

if [ "$DO_RUN" = true ]; then
    echo "→ open $APP"
    open "$APP"
fi
