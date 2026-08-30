import SwiftUI

// MARK: - Safari-style tab strip

struct TabStrip: View {
    @EnvironmentObject var state: AppState

    var body: some View {
        if state.openTabs.isEmpty {
            EmptyView()
        } else {
            ScrollViewReader { proxy in
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 4) {
                        ForEach(state.openTabs, id: \.path) { url in
                            TabPill(url: url,
                                    isActive: state.selectedTab == url,
                                    onSelect: { state.openFile(url, pushHistory: false) },
                                    onClose:  { state.closeTab(url) })
                                .id(url)
                        }
                    }
                    .padding(.horizontal, 8).padding(.vertical, 6)
                }
                .frame(height: 38)
                .background(Theme.mantle.opacity(0.75))
                .overlay(Rectangle().fill(Theme.hairline).frame(height: 1), alignment: .bottom)
                .onChange(of: state.selectedTab) { new in
                    if let new = new { withAnimation { proxy.scrollTo(new, anchor: .center) } }
                }
            }
        }
    }
}

private struct TabPill: View {
    let url: URL; let isActive: Bool
    let onSelect: () -> Void
    let onClose:  () -> Void
    @State private var hovered = false

    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: "doc.text.fill")
                .font(.system(size: 10))
                .foregroundColor(isActive ? Theme.blue : Theme.overlay1)
            Text(displayName)
                .font(.system(size: 12, weight: isActive ? .semibold : .regular))
                .foregroundColor(isActive ? Theme.text : Theme.subtext)
                .lineLimit(1)

            Button(action: onClose) {
                Image(systemName: "xmark")
                    .font(.system(size: 8, weight: .bold))
                    .foregroundColor(Theme.overlay1)
                    .frame(width: 14, height: 14)
                    .background(hovered ? Circle().fill(Theme.surface1) : nil)
            }
            .buttonStyle(.plain)
            .opacity(hovered || isActive ? 1 : 0)
        }
        .padding(.horizontal, 12).padding(.vertical, 7)
        .background(
            RoundedRectangle(cornerRadius: 8, style: .continuous)
                .fill(isActive ? Theme.base : (hovered ? Theme.surface0.opacity(0.6) : Color.clear))
        )
        .overlay(
            RoundedRectangle(cornerRadius: 8, style: .continuous)
                .strokeBorder(isActive ? Theme.hairline : Color.clear, lineWidth: 0.5)
        )
        .contentShape(Rectangle())
        .onTapGesture(perform: onSelect)
        .onHover { hovered = $0 }
        .frame(maxWidth: 200)
    }

    private var displayName: String {
        let name = url.lastPathComponent
        if name == "INDEX.md" { return url.deletingLastPathComponent().lastPathComponent.capitalized + " · Index" }
        return CodexTree.prettyFilename(name)
    }
}
