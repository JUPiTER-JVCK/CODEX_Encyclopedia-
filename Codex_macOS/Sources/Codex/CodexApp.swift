import SwiftUI
import AppKit

// MARK: - Version

/// One place for the version the app shows itself as.
///
/// It was previously spelled "v3" in the window title and the Welcome
/// subtitle, "3.2" in Info.plist, and "Computing Stack v3" in the sidebar —
/// four literals, none agreeing, all stale against the released 3.6. Keep
/// this in step with CHANGELOG.md's top entry.
enum CodexInfo {
    static let version = "3.6"
}

// MARK: - App entry

@main
struct CodexApp: App {
    @StateObject private var state = AppState.shared

    var body: some Scene {
        WindowGroup("Codex v\(CodexInfo.version)") {
            RootView()
                .environmentObject(state)
                .frame(minWidth: 1180, minHeight: 740)
                .preferredColorScheme(.dark)
        }
        .windowStyle(.hiddenTitleBar)
        .windowToolbarStyle(.unified(showsTitle: false))
        .commands {
            CommandGroup(replacing: .newItem) {
                Button("Command Palette…") { state.paletteVisible = true }
                    .keyboardShortcut("p", modifiers: [.command])
                Divider()
                Button("Close Tab") { if let t = state.selectedTab { state.closeTab(t) } }
                    .keyboardShortcut("w", modifiers: [.command])
                Button("Close All Tabs") { state.closeAllTabs() }
                    .keyboardShortcut("w", modifiers: [.command, .shift])
            }
            CommandGroup(replacing: .sidebar) {
                Button("Toggle Sidebar") { withAnimation { state.sidebarVisible.toggle() } }
                    .keyboardShortcut("1", modifiers: [.command])
                Button("Toggle Inspector") { withAnimation { state.inspectorVisible.toggle() } }
                    .keyboardShortcut("0", modifiers: [.command])
            }
            CommandMenu("Navigation") {
                // ⌘H is Hide and ⌘⌥H is Hide Others, both reserved by macOS;
                // ⌘⇧H is free.
                Button("Welcome") { state.showWelcome() }
                    .keyboardShortcut("h", modifiers: [.command, .shift])
                Divider()
                Button("Back") { if let u = state.history.goBack() { state.openFile(u, pushHistory: false) } }
                    .keyboardShortcut("[", modifiers: [.command])
                    .disabled(!state.history.canGoBack)
                Button("Forward") { if let u = state.history.goForward() { state.openFile(u, pushHistory: false) } }
                    .keyboardShortcut("]", modifiers: [.command])
                    .disabled(!state.history.canGoForward)
                Divider()
                Button("Open README") {
                    let u = state.projectRoot.appendingPathComponent("README.md")
                    if FileManager.default.fileExists(atPath: u.path) { state.openFile(u) }
                }.keyboardShortcut("h", modifiers: [.command])
                Button("Reload Tree") { state.reloadTree() }
                    .keyboardShortcut("r", modifiers: [.command])
                Divider()
                Button("Pin / Unpin Current") {
                    if let u = state.selectedTab {
                        state.bookmarks.togglePin(u.path)
                        state.objectWillChange.send()
                    }
                }.keyboardShortcut("d", modifiers: [.command])
                Button("Reveal in Finder") {
                    if let u = state.selectedTab { LinkResolver.revealInFinder(u) }
                }.keyboardShortcut("r", modifiers: [.command, .shift])
            }
        }
    }
}

// MARK: - AppState

final class AppState: ObservableObject {
    static let shared = AppState()

    @Published var root: CodexNode
    @Published var openTabs: [URL] = []
    @Published var selectedTab: URL?
    @Published var paletteVisible: Bool = false
    @Published var sidebarVisible: Bool = true
    @Published var inspectorVisible: Bool = true
    @Published var bookmarks: Bookmarks

    let projectRoot: URL
    let history = NavigationHistory()
    private(set) lazy var allFiles: [URL] = CodexTree.allFiles(under: projectRoot)

    var selectedTabIsPinned: Bool {
        guard let u = selectedTab else { return false }
        return bookmarks.isPinned(u.path)
    }

    init() {
        let root = AppState.findProjectRoot()
        self.projectRoot = root
        self.root = CodexTree.build(root: root)
        self.bookmarks = Bookmarks.load()
        // Don't auto-open anything — show the Welcome screen first
    }

    static func findProjectRoot() -> URL {
        if let override = ProcessInfo.processInfo.environment["CODEX_ROOT"],
           !override.isEmpty {
            return URL(fileURLWithPath: override)
        }
        if let recorded = Bundle.main.url(forResource: "project_path", withExtension: nil),
           let s = try? String(contentsOf: recorded).trimmingCharacters(in: .whitespacesAndNewlines),
           FileManager.default.fileExists(atPath: s + "/README.md") {
            return URL(fileURLWithPath: s)
        }
        let exe = Bundle.main.bundleURL
        var candidate = exe.deletingLastPathComponent()
        for _ in 0..<6 {
            let r = candidate.appendingPathComponent("README.md")
            let s = candidate.appendingPathComponent("STRUCTURE.md")
            if FileManager.default.fileExists(atPath: r.path),
               FileManager.default.fileExists(atPath: s.path) { return candidate }
            candidate = candidate.deletingLastPathComponent()
        }
        return URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
    }

    func openFile(_ url: URL, forceNew: Bool = false, pushHistory: Bool = true) {
        // Guard: never add a directory URL as a tab
        var isDir: ObjCBool = false
        guard FileManager.default.fileExists(atPath: url.path, isDirectory: &isDir),
              !isDir.boolValue else {
            NSSound.beep()
            return
        }
        if forceNew || !openTabs.contains(url) { openTabs.append(url) }
        selectedTab = url
        if pushHistory { history.push(url) }
        paletteVisible = false
        bookmarks.touch(url.path)
        objectWillChange.send()
    }

    func closeTab(_ url: URL) {
        openTabs.removeAll { $0 == url }
        if selectedTab == url { selectedTab = openTabs.last }
    }

    func closeAllTabs() {
        openTabs.removeAll()
        selectedTab = nil
    }

    /// Return to the Welcome screen without losing the open tabs.
    ///
    /// `mainPane` shows WelcomeView whenever nothing is selected, so clearing
    /// the selection is all this needs. Until this existed the only route back
    /// was Close All Tabs, which reached Welcome by throwing away everything
    /// you had open — a destructive action standing in for a navigation one.
    /// TabStrip renders a nil selection correctly already: no pill is active.
    func showWelcome() {
        selectedTab = nil
    }

    func reloadTree() {
        DocumentStore.invalidateAll()
        root = CodexTree.build(root: projectRoot)
        allFiles = CodexTree.allFiles(under: projectRoot)
    }

    /// Route a markdown link click through the right behavior.
    func handleLink(_ target: LinkResolver.Target) {
        switch target {
        case .file(let url):
            openFile(url)
        case .external(let url):
            LinkResolver.openExternal(url)
        case .anchor:
            break // anchor scroll handled inside the renderer in a future pass
        case .unsupported:
            NSSound.beep()
        }
    }
}

// MARK: - Root layout

struct RootView: View {
    @EnvironmentObject var state: AppState

    var body: some View {
        VStack(spacing: 0) {
            CodexToolbar()
            HSplitView {
                if state.sidebarVisible {
                    SidebarView()
                        .frame(minWidth: 240, idealWidth: 280, maxWidth: 380)
                        .transition(.move(edge: .leading).combined(with: .opacity))
                }
                mainPane
                    .frame(minWidth: 560)
                if state.inspectorVisible {
                    InspectorView()
                        .frame(minWidth: 220, idealWidth: 260, maxWidth: 320)
                        .transition(.move(edge: .trailing).combined(with: .opacity))
                }
            }
        }
        .background(Theme.base)
        .overlay(paletteOverlay)
    }

    private var mainPane: some View {
        VStack(spacing: 0) {
            TabStrip()
            ZStack {
                if let url = state.selectedTab {
                    if let doc = DocumentStore.document(for: url, root: state.projectRoot) {
                        MarkdownView(document: doc,
                                     sourceFile: url,
                                     projectRoot: state.projectRoot,
                                     onLink: { state.handleLink($0) })
                    } else {
                        ErrorView(message: "Couldn't read \(url.lastPathComponent)")
                    }
                } else {
                    WelcomeView()
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
        .background(Theme.base)
    }

    @ViewBuilder
    private var paletteOverlay: some View {
        if state.paletteVisible {
            ZStack(alignment: .top) {
                Color.black.opacity(0.45)
                    .ignoresSafeArea()
                    .onTapGesture { state.paletteVisible = false }
                CommandPaletteView()
                    .padding(.top, 110)
                    .transition(.move(edge: .top).combined(with: .opacity))
            }
            .animation(.easeOut(duration: 0.18), value: state.paletteVisible)
        }
    }
}

private struct ErrorView: View {
    let message: String
    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: "exclamationmark.triangle")
                .font(.system(size: 32)).foregroundColor(Theme.red)
            Text(message).foregroundColor(Theme.subtext)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Theme.base)
    }
}
