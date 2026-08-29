import SwiftUI

// MARK: - Top toolbar (sidebar toggle, history, breadcrumb, search, inspector)

struct CodexToolbar: View {
    @EnvironmentObject var state: AppState

    var body: some View {
        HStack(spacing: 14) {
            ToolbarIconButton(systemName: "sidebar.left", help: "Toggle sidebar (⌘1)") {
                withAnimation(.easeInOut(duration: 0.18)) { state.sidebarVisible.toggle() }
            }

            HStack(spacing: 2) {
                ToolbarIconButton(systemName: "chevron.backward",
                                  help: "Back (⌘[)",
                                  enabled: state.history.canGoBack) {
                    if let url = state.history.goBack() { state.openFile(url, pushHistory: false) }
                }
                ToolbarIconButton(systemName: "chevron.forward",
                                  help: "Forward (⌘])",
                                  enabled: state.history.canGoForward) {
                    if let url = state.history.goForward() { state.openFile(url, pushHistory: false) }
                }
            }

            BreadcrumbBar()

            Spacer(minLength: 16)

            ToolbarSearchField()

            HStack(spacing: 2) {
                ToolbarIconButton(systemName: state.selectedTabIsPinned ? "star.fill" : "star",
                                  tint: state.selectedTabIsPinned ? Theme.yellow : nil,
                                  help: "Pin current file") {
                    if let url = state.selectedTab {
                        state.bookmarks.togglePin(url.path)
                        state.objectWillChange.send()
                    }
                }
                .disabled(state.selectedTab == nil)

                ToolbarIconButton(systemName: "sidebar.right",
                                  help: "Toggle inspector (⌘0)") {
                    withAnimation(.easeInOut(duration: 0.18)) { state.inspectorVisible.toggle() }
                }
            }
        }
        .padding(.horizontal, 14).padding(.vertical, 9)
        .frame(height: 50)
        .background(VisualEffectBlur(material: .titlebar, blendingMode: .withinWindow).ignoresSafeArea())
        .overlay(Rectangle().fill(Theme.hairline).frame(height: 1), alignment: .bottom)
    }
}

// MARK: - Toolbar icon button

struct ToolbarIconButton: View {
    let systemName: String
    var tint: Color? = nil
    var help: String? = nil
    var enabled: Bool = true
    let action: () -> Void
    @State private var hovered = false

    var body: some View {
        Button(action: action) {
            Image(systemName: systemName)
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(enabled ? (tint ?? Theme.subtext) : Theme.overlay0.opacity(0.5))
                .frame(width: 26, height: 26)
                .background(hovered && enabled
                            ? RoundedRectangle(cornerRadius: 5).fill(Theme.surface1.opacity(0.5))
                            : nil)
                .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .disabled(!enabled)
        .onHover { hovered = $0 }
        .help(help ?? "")
    }
}

// MARK: - Breadcrumb (clickable path crumbs)

struct BreadcrumbBar: View {
    @EnvironmentObject var state: AppState

    var body: some View {
        HStack(spacing: 6) {
            if let url = state.selectedTab {
                let parts = relativeParts(url)
                Image(systemName: "books.vertical.fill")
                    .font(.system(size: 11))
                    .foregroundColor(Theme.lavender)
                Text("Codex")
                    .font(Theme.FontStyle.subhead)
                    .foregroundColor(Theme.subtext)
                ForEach(0..<parts.count, id: \.self) { i in
                    Image(systemName: "chevron.right")
                        .font(.system(size: 9, weight: .bold))
                        .foregroundColor(Theme.overlay0.opacity(0.7))
                    Text(parts[i])
                        .font(i == parts.count - 1 ? Theme.FontStyle.headline : Theme.FontStyle.subhead)
                        .foregroundColor(i == parts.count - 1 ? Theme.text : Theme.subtext)
                        .lineLimit(1)
                }
            } else {
                Image(systemName: "books.vertical.fill")
                    .font(.system(size: 11))
                    .foregroundColor(Theme.lavender)
                Text("Codex").font(Theme.FontStyle.subhead).foregroundColor(Theme.subtext)
                Text("·").font(Theme.FontStyle.subhead).foregroundColor(Theme.overlay0)
                Text("Welcome").font(Theme.FontStyle.headline).foregroundColor(Theme.text)
            }
        }
    }

    private func relativeParts(_ url: URL) -> [String] {
        let prefix = state.projectRoot.path + "/"
        let rel = url.path.replacingOccurrences(of: prefix, with: "")
        let raw = rel.split(separator: "/").map(String.init)
        return raw.enumerated().map { idx, part in
            if idx == raw.count - 1 {
                return CodexTree.prettyFilename(part)
            }
            return part.split(separator: "_", maxSplits: 1).last.map(String.init)?
                .replacingOccurrences(of: "_", with: " ").capitalized ?? part
        }
    }
}

// MARK: - Toolbar search field (mini, opens palette on click)

struct ToolbarSearchField: View {
    @EnvironmentObject var state: AppState
    @State private var hovered = false

    var body: some View {
        Button(action: { state.paletteVisible = true }) {
            HStack(spacing: 6) {
                Image(systemName: "magnifyingglass")
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(Theme.overlay1)
                Text("Search Codex")
                    .font(Theme.FontStyle.subhead)
                    .foregroundColor(Theme.overlay1)
                Spacer(minLength: 8)
                Text("⌘P")
                    .font(.system(size: 10, weight: .medium, design: .monospaced))
                    .foregroundColor(Theme.overlay0)
                    .padding(.horizontal, 5).padding(.vertical, 1)
                    .background(RoundedRectangle(cornerRadius: 3).fill(Theme.surface1.opacity(0.6)))
            }
            .padding(.horizontal, 10).padding(.vertical, 5)
            .frame(width: 220)
            .background(RoundedRectangle(cornerRadius: 7, style: .continuous)
                            .fill(hovered ? Theme.surface0.opacity(0.85) : Theme.surface0.opacity(0.55)))
            .overlay(RoundedRectangle(cornerRadius: 7).strokeBorder(Theme.hairline, lineWidth: 0.5))
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .onHover { hovered = $0 }
    }
}
