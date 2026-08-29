import SwiftUI
import AppKit

// MARK: - Modern command palette (⌘P)

struct CommandPaletteView: View {
    @EnvironmentObject var state: AppState
    @State private var query: String = ""
    @State private var selectedIdx: Int = 0
    @FocusState private var focused: Bool

    private var results: [FuzzyMatch.Ranked] {
        FuzzyMatch.rank(query: query, files: state.allFiles, projectRoot: state.projectRoot)
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
        .onAppear { focused = true; selectedIdx = 0 }
        .background(KeyHandler(onUp:    { selectedIdx = max(0, selectedIdx - 1) },
                               onDown:  { selectedIdx = min(results.count - 1, selectedIdx + 1) },
                               onEnter: open,
                               onEsc:   { state.paletteVisible = false }))
    }

    private var searchField: some View {
        HStack(spacing: 10) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(Theme.overlay1)
            TextField("Search files, headings, or paths…", text: $query)
                .textFieldStyle(.plain)
                .font(.system(size: 15))
                .foregroundColor(Theme.text)
                .focused($focused)
                .onSubmit(open)
                .onChange(of: query) { _ in selectedIdx = 0 }
            HStack(spacing: 4) {
                Text("\(results.count)")
                    .font(.system(size: 10, weight: .semibold, design: .monospaced))
                    .foregroundColor(Theme.overlay1)
                Text(results.count == 1 ? "result" : "results")
                    .font(.system(size: 10)).foregroundColor(Theme.overlay1)
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
                    if results.isEmpty && !query.isEmpty {
                        VStack(spacing: 6) {
                            Image(systemName: "doc.text.magnifyingglass")
                                .font(.system(size: 28, weight: .light))
                                .foregroundColor(Theme.overlay0)
                            Text("No matches for \"\(query)\"")
                                .font(.system(size: 12))
                                .foregroundColor(Theme.subtext)
                        }
                        .padding(40)
                        .frame(maxWidth: .infinity)
                    } else {
                        ForEach(Array(results.enumerated()), id: \.element.id) { idx, r in
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
        guard !results.isEmpty, selectedIdx < results.count else { return }
        state.openFile(results[selectedIdx].url)
    }
}

private struct ResultRow: View {
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
                Text(CodexTree.prettyFilename(rank.display))
                    .font(.system(size: 13, weight: isSelected ? .semibold : .medium))
                    .foregroundColor(isSelected ? Theme.text : Theme.subtext)
                if !rank.parent.isEmpty {
                    Text(rank.parent)
                        .font(.system(size: 10, design: .monospaced))
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
    let key: String; let label: String
    init(_ k: String, _ l: String) { key = k; label = l }
    var body: some View {
        HStack(spacing: 4) {
            Text(key)
                .font(.system(size: 10, weight: .semibold, design: .monospaced))
                .foregroundColor(Theme.subtext)
                .padding(.horizontal, 5).padding(.vertical, 1)
                .background(RoundedRectangle(cornerRadius: 3).fill(Theme.surface0))
            Text(label).font(.system(size: 10)).foregroundColor(Theme.overlay1)
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
