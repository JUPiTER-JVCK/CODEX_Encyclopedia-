import SwiftUI
import AppKit

/// SwiftUI wrapper around `NSVisualEffectView` so the sidebar and overlays can
/// participate in macOS vibrancy (the translucent + blur look Apple uses in
/// Mail, Notes, Music, Finder).
struct VisualEffectBlur: NSViewRepresentable {
    var material: NSVisualEffectView.Material = .sidebar
    var blendingMode: NSVisualEffectView.BlendingMode = .behindWindow
    var state: NSVisualEffectView.State = .followsWindowActiveState
    var emphasized: Bool = false

    func makeNSView(context: Context) -> NSVisualEffectView {
        let v = NSVisualEffectView()
        v.material = material
        v.blendingMode = blendingMode
        v.state = state
        v.isEmphasized = emphasized
        return v
    }

    func updateNSView(_ nsView: NSVisualEffectView, context: Context) {
        nsView.material = material
        nsView.blendingMode = blendingMode
        nsView.state = state
        nsView.isEmphasized = emphasized
    }
}

/// Convenience modifier — applies an NSVisualEffectView as background.
extension View {
    func vibrancy(_ material: NSVisualEffectView.Material = .sidebar,
                  blending: NSVisualEffectView.BlendingMode = .behindWindow) -> some View {
        background(VisualEffectBlur(material: material, blendingMode: blending).ignoresSafeArea())
    }
}
