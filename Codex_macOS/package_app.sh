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
#
# Rendered with AppKit rather than Pillow. The old generator imported PIL and,
# when it was absent, fell back to writing a flat #1e1e2e square with nothing
# drawn on it — so every machine without Pillow (which is every stock macOS,
# since the system python3 does not ship it) got a blank tile in the Dock and
# no warning that anything had gone wrong.
#
# Swift is already a hard prerequisite of this script: it runs `swift build`
# twenty lines above. Drawing the icon with what we already require removes a
# dependency instead of documenting one, and lets the icon be the app's own
# mark — the same SF Symbol and gradient as the Welcome hero in Welcome.swift.
ICON="$APP/Contents/Resources/AppIcon.icns"
EXISTING_ICON="$ROOT/Codex.app.icon-backup/AppIcon.icns"
if [ -f "$EXISTING_ICON" ] && [ "$REBUILD_ICON" = false ]; then
    # Escape hatch for a hand-made icon. Announced rather than silent: a
    # backup left over from a build that produced the old blank square would
    # otherwise quietly reinstate it, and look like this script had failed.
    echo "→ Reusing $EXISTING_ICON (pass --icon to render a fresh one)"
    cp "$EXISTING_ICON" "$ICON"
elif [ ! -f "$ICON" ] || [ "$REBUILD_ICON" = true ]; then
    echo "→ Rendering AppIcon.icns"
    BUILD_DIR="$ROOT/.build_icon"
    rm -rf "$BUILD_DIR"
    ICONSET="$BUILD_DIR/AppIcon.iconset"
    mkdir -p "$ICONSET"
    BASE_PNG="$BUILD_DIR/icon_1024.png"
    RENDERER="$BUILD_DIR/render_icon.swift"

    cat > "$RENDERER" <<'SWIFTEOF'
import AppKit
import Foundation

func die(_ message: String) -> Never {
    FileHandle.standardError.write(Data("icon: \(message)\n".utf8))
    exit(1)
}

// Theme.swift: blue #89b4fa, lavender #b4befe, mauve #cba6f7, crust #11111b.
func c(_ r: Int, _ g: Int, _ b: Int) -> NSColor {
    NSColor(srgbRed: CGFloat(r)/255, green: CGFloat(g)/255,
            blue: CGFloat(b)/255, alpha: 1)
}
let size: CGFloat = 1024
let image = NSImage(size: NSSize(width: size, height: size))
image.lockFocus()
guard let ctx = NSGraphicsContext.current?.cgContext else { die("no graphics context") }

// macOS app icons sit inset inside their canvas rather than bleeding to the
// edge, so the rounded square is drawn at ~82% with a squircle-ish radius.
let inset  = size * 0.09
let rect   = CGRect(x: inset, y: inset, width: size - inset*2, height: size - inset*2)
let radius = rect.width * 0.235
let path   = NSBezierPath(roundedRect: rect, xRadius: radius, yRadius: radius)
ctx.saveGState()
path.addClip()
guard let gradient = NSGradient(colors: [c(0x89,0xb4,0xfa),
                                         c(0xb4,0xbe,0xfe),
                                         c(0xcb,0xa6,0xf7)]) else { die("gradient") }
gradient.draw(in: rect, angle: -45)
ctx.restoreGState()

// The same symbol the Welcome hero uses, so the Dock matches the app.
let cfg = NSImage.SymbolConfiguration(pointSize: size * 0.42, weight: .medium)
guard let symbol = NSImage(systemSymbolName: "books.vertical.fill",
                           accessibilityDescription: "Codex")?
        .withSymbolConfiguration(cfg) else { die("books.vertical.fill unavailable") }
let tinted = NSImage(size: symbol.size)
tinted.lockFocus()
c(0x11,0x11,0x1b).set()
NSRect(origin: .zero, size: symbol.size).fill()
symbol.draw(at: .zero, from: NSRect(origin: .zero, size: symbol.size),
            operation: .destinationIn, fraction: 1)
tinted.unlockFocus()
tinted.draw(in: CGRect(x: (size - symbol.size.width)/2,
                       y: (size - symbol.size.height)/2,
                       width: symbol.size.width, height: symbol.size.height))
image.unlockFocus()

guard let tiff = image.tiffRepresentation,
      let rep  = NSBitmapImageRep(data: tiff),
      let png  = rep.representation(using: .png, properties: [:]) else { die("PNG encode") }
guard CommandLine.arguments.count > 1 else { die("usage: render_icon.swift <out.png>") }
do {
    try png.write(to: URL(fileURLWithPath: CommandLine.arguments[1]))
} catch {
    die("write failed: \(error)")
}
SWIFTEOF

    # No silent fallback. A build that cannot draw its own icon is a build
    # worth stopping for, rather than one that ships a blank square.
    if ! swift "$RENDERER" "$BASE_PNG"; then
        echo "✘ Icon rendering failed — not shipping a blank icon." >&2
        exit 1
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
