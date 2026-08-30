import SwiftUI

/// Design tokens for Codex v3 — Apple HIG aligned, Catppuccin-tinted accent palette.
/// Uses semantic naming so the rest of the app reads intent, not raw hex.
enum Theme {

    // MARK: Surfaces (Catppuccin Mocha base + macOS materials)
    static let crust    = Color(red: 0x11/255.0, green: 0x11/255.0, blue: 0x1b/255.0)
    static let mantle   = Color(red: 0x18/255.0, green: 0x18/255.0, blue: 0x25/255.0)
    static let base     = Color(red: 0x1e/255.0, green: 0x1e/255.0, blue: 0x2e/255.0)
    static let surface0 = Color(red: 0x31/255.0, green: 0x32/255.0, blue: 0x44/255.0)
    static let surface1 = Color(red: 0x45/255.0, green: 0x47/255.0, blue: 0x5a/255.0)
    static let surface2 = Color(red: 0x58/255.0, green: 0x5b/255.0, blue: 0x70/255.0)
    static let overlay0 = Color(red: 0x6c/255.0, green: 0x70/255.0, blue: 0x86/255.0)
    static let overlay1 = Color(red: 0x7f/255.0, green: 0x84/255.0, blue: 0x9c/255.0)
    static let overlay2 = Color(red: 0x93/255.0, green: 0x99/255.0, blue: 0xb2/255.0)

    // MARK: Text
    static let text     = Color(red: 0xcd/255.0, green: 0xd6/255.0, blue: 0xf4/255.0)
    static let subtext  = Color(red: 0xa6/255.0, green: 0xad/255.0, blue: 0xc8/255.0)
    static let subtle   = Color(red: 0xba/255.0, green: 0xc2/255.0, blue: 0xde/255.0)

    // MARK: Accent palette
    static let blue     = Color(red: 0x89/255.0, green: 0xb4/255.0, blue: 0xfa/255.0)
    static let lavender = Color(red: 0xb4/255.0, green: 0xbe/255.0, blue: 0xfe/255.0)
    static let sapphire = Color(red: 0x74/255.0, green: 0xc7/255.0, blue: 0xec/255.0)
    static let sky      = Color(red: 0x89/255.0, green: 0xdc/255.0, blue: 0xeb/255.0)
    static let teal     = Color(red: 0x94/255.0, green: 0xe2/255.0, blue: 0xd5/255.0)
    static let green    = Color(red: 0xa6/255.0, green: 0xe3/255.0, blue: 0xa1/255.0)
    static let yellow   = Color(red: 0xf9/255.0, green: 0xe2/255.0, blue: 0xaf/255.0)
    static let peach    = Color(red: 0xfa/255.0, green: 0xb3/255.0, blue: 0x87/255.0)
    static let red      = Color(red: 0xf3/255.0, green: 0x8b/255.0, blue: 0xa8/255.0)
    static let maroon   = Color(red: 0xeb/255.0, green: 0xa0/255.0, blue: 0xac/255.0)
    static let mauve    = Color(red: 0xcb/255.0, green: 0xa6/255.0, blue: 0xf7/255.0)
    static let pink     = Color(red: 0xf5/255.0, green: 0xc2/255.0, blue: 0xe7/255.0)
    static let flamingo = Color(red: 0xf2/255.0, green: 0xcd/255.0, blue: 0xcd/255.0)
    static let rosewater = Color(red: 0xf5/255.0, green: 0xe0/255.0, blue: 0xdc/255.0)

    // MARK: Semantic
    static let accent       = blue
    static let accentSoft   = blue.opacity(0.18)
    static let accentSofter = blue.opacity(0.08)
    static let separator    = surface0.opacity(0.65)
    static let hairline     = surface1.opacity(0.45)

    // MARK: Band tints (sidebar section accents)
    static func bandTint(_ band: String) -> Color {
        switch band {
        case "Foundations":    return teal
        case "Compute":        return blue
        case "Network":        return mauve
        case "Cross-cutting":  return peach
        case "Tools":          return green
        case "Top-level":      return rosewater
        default:               return overlay1
        }
    }

    // MARK: Typography (SF Pro via .system, monospaced via .monospaced)
    enum FontStyle {
        static let appTitle     = Font.system(size: 28, weight: .bold,    design: .default)
        static let displayLarge = Font.system(size: 36, weight: .bold,    design: .default)
        static let display      = Font.system(size: 24, weight: .bold,    design: .default)
        static let title        = Font.system(size: 19, weight: .semibold, design: .default)
        static let headline     = Font.system(size: 15, weight: .semibold, design: .default)
        static let subhead      = Font.system(size: 13, weight: .medium,   design: .default)
        static let body         = Font.system(size: 14, weight: .regular,  design: .default)
        static let callout      = Font.system(size: 13, weight: .regular,  design: .default)
        static let footnote     = Font.system(size: 11, weight: .regular,  design: .default)
        static let caption      = Font.system(size: 10, weight: .medium,   design: .default)
        static let mono         = Font.system(size: 12.5, design: .monospaced)
        static let monoSmall    = Font.system(size: 11, design: .monospaced)

        // Heading scale for the markdown renderer
        static let h1 = Font.system(size: 28, weight: .bold,     design: .default)
        static let h2 = Font.system(size: 22, weight: .semibold, design: .default)
        static let h3 = Font.system(size: 18, weight: .semibold, design: .default)
        static let h4 = Font.system(size: 15, weight: .semibold, design: .default)
        static let h5 = Font.system(size: 13, weight: .semibold, design: .default)
        static let h6 = Font.system(size: 12, weight: .semibold, design: .default)
    }

    // MARK: Radii
    enum Radius {
        static let small:  CGFloat = 6
        static let medium: CGFloat = 10
        static let large:  CGFloat = 14
        static let xlarge: CGFloat = 20
    }
}
