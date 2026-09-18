import SwiftUI
import AppKit

// MARK: - Modern command palette (⌘P)

struct CommandPaletteView: View {
    /// Redraw on a palette or text-scale change — see `Preferences.revision`.
    @ObservedObject private var appearance = Preferences.shared
    @EnvironmentObject var state: AppState
    @State private var selectedIdx: Int = 0
    @FocusState private var focused: Bool
    /// Cached ranking — recomputed exactly once per query change instead of
    /// once per `body` evaluation (which was 6× per keystroke via computed var).
    @State private var cachedResults: [FuzzyMatch.Ranked] = []

    /// Bound to AppState so the toolbar field and this field are one field.
    private var query: Binding<String> { $state.paletteQuery }

    private func rerank() {
        cachedResults = FuzzyMatch.rank(query: state.paletteQuery,
                                        files: state.allFiles,
                                        projectRoot: state.projectRoot)
    }

    var body: some View {
        VStack(spacing: 0) {
            searchField
            Divider().background(Theme.hairline)
            resultList
        }
        .frame(width: 680)
        .background(
            RoundedRectangle(cornerRadius: Theme.Radius.large, style: .continuous)
                .fill(Theme.mantle)
        )
        .overlay(
            RoundedRectangle(cornerRadius: Theme.Radius.large)
                .strokeBorder(Theme.hairline, lineWidth: 0.5)
        )
        .shadow(color: .black.opacity(0.5), radius: 28, y: 12)
        .onAppear { focused = true; selectedIdx = 0; rerank() }
        // ⌘R while the palette is open replaces the file index under it.
        .onChange(of: state.treeRevision) { _ in selectedIdx = 0; rerank() }
        // `min(cachedResults.count - 1, …)` yields -1 when nothing matches,
        // which no row can equal and which `scrollTo` cannot resolve. Clamp to
        // the last valid row, or stay at 0 when the list is empty.
        .background(KeyHandler(onUp:    { selectedIdx = max(0, selectedIdx - 1) },
                               onDown:  { selectedIdx = min(max(0, cachedResults.count - 1),
                                                            selectedIdx + 1) },
                               onEnter: open,
                               onEsc:   state.dismissPalette))
    }

    private var searchField: some View {
        HStack(spacing: 10) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(Theme.overlay1)
            // Was "Search files, headings, or paths…" — headings are not
            // indexed, and promising them made the palette look broken when a
            // heading search returned nothing. Heading search is worth adding;
            // until it is, the placeholder says what actually happens.
            TextField("Search files and paths…", text: query)
                .textFieldStyle(.plain)
                .font(.system(size: Theme.size(15)))
                .foregroundColor(Theme.text)
                .focused($focused)
                .onSubmit(open)
                .onChange(of: state.paletteQuery) { _ in selectedIdx = 0; rerank() }
            HStack(spacing: 4) {
                Text("\(cachedResults.count)")
                    .font(.system(size: Theme.size(10), weight: .semibold, design: .monospaced))
                    .foregroundColor(Theme.overlay1)
                Text(cachedResults.count == 1 ? "result" : "results")
                    .font(.system(size: Theme.size(10))).foregroundColor(Theme.overlay1)
            }
            .padding(.horizontal, 8).padding(.vertical, 3)
            .background(Capsule().fill(Theme.surface0))
        }
        .padding(.horizontal, 18).padding(.vertical, 14)
    }

    private var resultList: some View {
        ScrollViewReader { proxy in
            ScrollView {
                LazyVStack(spacing: 0) {
                    if cachedResults.isEmpty && !state.paletteQuery.isEmpty {
                        VStack(spacing: 6) {
                            Image(systemName: "doc.text.magnifyingglass")
                                .font(.system(size: 28, weight: .light))
                                .foregroundColor(Theme.overlay0)
                            Text("No matches for \"\(state.paletteQuery)\"")
                                .font(.system(size: Theme.size(12)))
                                .foregroundColor(Theme.subtext)
                        }
                        .padding(40)
                        .frame(maxWidth: .infinity)
                    } else {
                        ForEach(Array(cachedResults.enumerated()), id: \.element.id) { idx, r in
                            ResultRow(rank: r, isSelected: idx == selectedIdx)
                                .id(idx)
                                .onTapGesture { selectedIdx = idx; open() }
                        }
                    }
                }
                .padding(.vertical, 4)
            }
            .frame(maxHeight: 420)
            .onChange(of: selectedIdx) { v in
                withAnimation(.linear(duration: 0.05)) { proxy.scrollTo(v, anchor: .center) }
            }
        }
        .background(Theme.mantle)
        .overlay(footerHint, alignment: .bottom)
    }

    private var footerHint: some View {
        HStack(spacing: 18) {
            HintKey("↑↓", "Navigate")
            HintKey("⏎", "Open")
            HintKey("⎋", "Dismiss")
            Spacer()
        }
        .padding(.horizontal, 18).padding(.vertical, 8)
        .background(Theme.crust.opacity(0.65))
        .overlay(Rectangle().fill(Theme.hairline).frame(height: 1), alignment: .top)
    }

    private func open() {
        guard !cachedResults.isEmpty, selectedIdx < cachedResults.count else { return }
        state.openFile(cachedResults[selectedIdx].url)
    }
}

private struct ResultRow: View {
    /// Redraw on a palette or text-scale change — see `Preferences.revision`.
    @ObservedObject private var appearance = Preferences.shared
    let rank: FuzzyMatch.Ranked
    let isSelected: Bool

    var body: some View {
        HStack(spacing: 10) {
            ZStack {
                RoundedRectangle(cornerRadius: 6, style: .continuous)
                    .fill(isSelected ? Theme.accent.opacity(0.22) : Theme.surface0)
                    .frame(width: 30, height: 30)
                Image(systemName: rank.url.lastPathComponent == "INDEX.md" ? "list.bullet.rectangle" : "doc.text.fill")
                    .font(.system(size: 13, weight: .medium))
                    .foregroundColor(isSelected ? Theme.accent : Theme.overlay1)
            }
            VStack(alignment: .leading, spacing: 2) {
                Text(CodexTree.fullTitle(for: rank.url))
                    .font(.system(size: Theme.size(13), weight: isSelected ? .semibold : .medium))
                    .foregroundColor(isSelected ? Theme.text : Theme.subtext)
                if !rank.parent.isEmpty {
                    Text(rank.parent)
                        .font(.system(size: Theme.size(10), design: .monospaced))
                        .foregroundColor(Theme.overlay1)
                        .lineLimit(1).truncationMode(.middle)
                }
            }
            Spacer()
            if isSelected {
                Image(systemName: "return")
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(Theme.accent)
            }
        }
        .padding(.horizontal, 14).padding(.vertical, 8)
        .background(isSelected ? Theme.accent.opacity(0.10) : Color.clear)
        .contentShape(Rectangle())
    }
}

private struct HintKey: View {
    /// Redraw on a palette or text-scale change — see `Preferences.revision`.
    @ObservedObject private var appearance = Preferences.shared
    let key: String; let label: String
    init(_ k: String, _ l: String) { key = k; label = l }
    var body: some View {
        HStack(spacing: 4) {
            Text(key)
                .font(.system(size: Theme.size(10), weight: .semibold, design: .monospaced))
                .foregroundColor(Theme.subtext)
                .padding(.horizontal, 5).padding(.vertical, 1)
                .background(RoundedRectangle(cornerRadius: 3).fill(Theme.surface0))
            Text(label).font(.system(size: Theme.size(10))).foregroundColor(Theme.overlay1)
        }
    }
}

// MARK: - Arrow/Enter/Esc key handler

struct KeyHandler: NSViewRepresentable {
    let onUp: () -> Void
    let onDown: () -> Void
    let onEnter: () -> Void
    let onEsc: () -> Void

    func makeNSView(context: Context) -> NSView {
        let v = KeyHandlerView()
        v.onUp = onUp; v.onDown = onDown; v.onEnter = onEnter; v.onEsc = onEsc
        return v
    }
    func updateNSView(_ v: NSView, context: Context) {}

    final class KeyHandlerView: NSView {
        var onUp, onDown, onEnter, onEsc: (() -> Void)?
        override var acceptsFirstResponder: Bool { true }
        override func keyDown(with event: NSEvent) {
            switch event.keyCode {
            case 126: onUp?()
            case 125: onDown?()
            case 36, 76: onEnter?()
            case 53: onEsc?()
            default: super.keyDown(with: event)
            }
        }
        override func viewDidMoveToWindow() {
            super.viewDidMoveToWindow()
            DispatchQueue.main.async { [weak self] in self?.window?.makeFirstResponder(self) }
        }
    }
}
