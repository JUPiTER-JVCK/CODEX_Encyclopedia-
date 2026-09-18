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
DO_UNIVERSAL=true   # build arm64 + x86_64 and lipo; pass --no-universal to skip
for arg in "$@"; do
    case "$arg" in
        --debug)        CONFIG="debug" ;;
        --install)      DO_INSTALL=true ;;
        --run)          DO_RUN=true ;;
        --icon)         REBUILD_ICON=true ;;
        --no-universal) DO_UNIVERSAL=false ;;
        -h|--help)
            grep -E '^# ' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    esac
done

# ── 1. Compile ─────────────────────────────────────────────────────────────
EXE="$PKG_DIR/.build/$CONFIG/Codex"
if [ "$DO_UNIVERSAL" = true ]; then
    echo "→ swift build -c $CONFIG --arch arm64"
    swift build -c "$CONFIG" --arch arm64
    echo "→ swift build -c $CONFIG --arch x86_64"
    swift build -c "$CONFIG" --arch x86_64
    echo "→ lipo: creating universal binary"
    # Not `.build/$CONFIG/Codex`. That path is a SwiftPM symlink pointing at
    # whichever triple built last — x86_64, here — so it names lipo's own
    # second input, and the command would write its output over a file it is
    # reading. Somewhere of its own, outside the symlinked tree.
    EXE="$PKG_DIR/.build/universal-$CONFIG/Codex"
    mkdir -p "$(dirname "$EXE")"
    lipo -create \
        "$PKG_DIR/.build/arm64-apple-macosx/$CONFIG/Codex" \
        "$PKG_DIR/.build/x86_64-apple-macosx/$CONFIG/Codex" \
        -output "$EXE"
    lipo -info "$EXE"
else
    echo "→ swift build -c $CONFIG"
    swift build -c "$CONFIG"
fi
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
#
# The drawing lives in Sources/RenderIcon/main.swift, a real SwiftPM target,
# so the compiler sees it on every pull request. As a shell heredoc it would
# be invisible to CI — which is how the generator it replaced managed to ship
# a blank icon undetected.
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

    # Same CONFIG as the app, so step 1 has already warmed the toolchain and
    # this is a cache hit; optimisation level is irrelevant to drawing one PNG.
    echo "→ swift build -c $CONFIG --product RenderIcon"
    swift build -c "$CONFIG" --product RenderIcon
    RENDERER="$PKG_DIR/.build/$CONFIG/RenderIcon"
    if [ ! -x "$RENDERER" ]; then
        echo "✘ RenderIcon did not build at $RENDERER" >&2
        exit 1
    fi

    # No silent fallback. A build that cannot draw its own icon is a build
    # worth stopping for, rather than one that ships a blank square.
    if ! "$RENDERER" "$BASE_PNG"; then
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
