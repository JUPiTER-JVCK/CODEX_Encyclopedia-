import SwiftUI
import AppKit

// MARK: - Version

/// One place for the version the app shows itself as.
///
/// It was previously spelled "v3" in the window title and the Welcome
/// subtitle, "3.2" in Info.plist, and "Computing Stack v3" in the sidebar —
/// four literals, none agreeing, all stale against the released 3.6.
///
/// Collapsing those four to one constant left two, which is not one: this
/// enum and `CFBundleShortVersionString` still had to be edited together, and
/// by v3.6.25 both had been forgotten. So read the bundle, which `agvtool`
/// and every release script already know how to set, and let Info.plist be
/// the single source it was always closest to being.
///
/// The fallback is for unit tests and previews, where `Bundle.main` is the
/// test runner rather than the app.
enum CodexInfo {
    static let version: String =
        Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String
        ?? "0.0-dev"
}

// MARK: - App entry

@main
struct CodexApp: App {
    @StateObject private var state = AppState.shared
    @ObservedObject private var prefs = Preferences.shared

    var body: some Scene {
        WindowGroup("Codex v\(CodexInfo.version)") {
            RootView()
                .environmentObject(state)
                .frame(minWidth: 1180, minHeight: 740)
                // Was a hardcoded `.dark`. With Latte, Solarized Light,
                // Gruvbox Light and Rosé Pine Dawn in the picker, the window
                // has to follow the palette — otherwise macOS renders its own
                // controls and the vibrancy materials dark against a light
                // page.
                .preferredColorScheme(prefs.palette.isDark ? .dark : .light)
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
                Button("Unpin All Tabs") { state.unpinAllTabs() }
                    .keyboardShortcut("w", modifiers: [.command, .shift])
            }
            CommandGroup(replacing: .sidebar) {
                Button("Toggle Sidebar") { withAnimation { state.sidebarVisible.toggle() } }
                    .keyboardShortcut("1", modifiers: [.command])
                Button("Toggle Inspector") { withAnimation { state.inspectorVisible.toggle() } }
                    .keyboardShortcut("0", modifiers: [.command])
                Divider()
                // How much of a wide window the reading column should use.
                // "Utilize the unused space" cuts both ways — a centred 920pt
                // column on a 27" display leaves large calm sides, which is
                // either restful or wasteful depending on the reader. This
                // makes it their call rather than a number baked into the
                // renderer.
                Picker("Reading Width", selection: $prefs.columnWidth) {
                    ForEach(Preferences.ColumnWidth.allCases) { width in
                        Text(width.label).tag(width)
                    }
                }
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
                // ⌘⇧O, not ⌘H. macOS reserves ⌘H for Hide Application and wins
                // the binding, so this item never fired — a dead control of
                // exactly the kind Stage 1 existed to remove.
                Button("Open README") {
                    let u = state.projectRoot.appendingPathComponent("README.md")
                    if FileManager.default.fileExists(atPath: u.path) { state.openFile(u) }
                }.keyboardShortcut("o", modifiers: [.command, .shift])
                Button("Reload Tree") { state.reloadTree() }
                    .keyboardShortcut("r", modifiers: [.command])
                Divider()
                // Pinning is how a tab stops being the transient one, so this
                // is now the main way to keep a document in the strip.
                Button("Pin / Unpin Current") {
                    if let u = state.selectedTab {
                        state.togglePin(u)
                    }
                }.keyboardShortcut("d", modifiers: [.command])
                Button("Reveal in Finder") {
                    if let u = state.selectedTab { LinkResolver.revealInFinder(u) }
                }.keyboardShortcut("r", modifiers: [.command, .shift])
            }
        }

        // A sibling scene, not a modifier on the one above — `.commands` has
        // to stay attached to the WindowGroup or the menu items register
        // against the settings window instead of the app. `Settings` is what
        // wires ⌘, on macOS and places the item under the app menu.
        Settings { AppearanceSettings() }
    }
}

// MARK: - AppState

final class AppState: ObservableObject {
    static let shared = AppState()

    @Published var root: CodexNode
    /// The one tab that is *not* pinned — the document you are browsing.
    ///
    /// Replaced, not appended to. Everything else in the strip is a pin.
    @Published private(set) var transientTab: URL?

    /// The document on screen. `nil` shows Welcome.
    ///
    /// This kept its name because that is what almost every read site means by
    /// it — `Inspector`, `Toolbar`, `Sidebar` and `TabStrip` all ask "what am I
    /// looking at". The plan for this stage called for splitting it into
    /// "active tab" and "displayed document", on the theory that a transient
    /// document could be shown while no tab was active.
    ///
    /// It doesn't need two properties — a displayed file is either pinned or
    /// *is* the transient tab, so it is always in the strip. But that only
    /// holds because `togglePin` and `reconcileSelection` arrange it. The
    /// first version of this comment stated the invariant and left it to luck:
    /// unpinning the file you were reading, or reloading after renaming it,
    /// dropped it out of the strip with `selectedTab` still pointing at it.
    /// Both routes are closed now. Mutate pins through `togglePin`, not
    /// through `bookmarks` directly, or they open again.
    @Published var selectedTab: URL?

    /// The tab strip: pinned files in pin order, then the transient tab.
    ///
    /// Derived rather than stored, which is the whole change. `openTabs` used
    /// to be an array appended to on every single open and emptied only by an
    /// explicit close, so browsing twenty topics left twenty tabs. Pins and
    /// tabs were two independent lists that no code path connected. Now there
    /// is one source of truth — `Bookmarks.pinned` — plus a single slot for
    /// whatever you are reading right now.
    ///
    /// Pins whose file no longer exists are filtered out here: a renamed file
    /// should leave a stale *pin*, visible and clearable in the sidebar's
    /// pinned section, not a tab that beeps when clicked. (One `stat` per pin
    /// per render. Pins number in the tens; if that ever shows up in a profile,
    /// cache it against the tree reload.)
    var openTabs: [URL] {
        var tabs = bookmarks.pinned
            .map { URL(fileURLWithPath: $0) }
            .filter { FileManager.default.fileExists(atPath: $0.path) }
        if let t = transientTab, !bookmarks.isPinned(t.path) { tabs.append(t) }
        return tabs
    }
    @Published var paletteVisible: Bool = false
    /// Shared so the toolbar's field and the palette's field are one field.
    /// The toolbar control used to be a Button dressed as a search box: it
    /// looked typable, and typing went nowhere.
    @Published var paletteQuery: String = ""
    @Published var sidebarVisible: Bool = true
    @Published var inspectorVisible: Bool = true
    @Published var bookmarks: Bookmarks

    /// A heading anchor the renderer should scroll to, set by whoever asked.
    ///
    /// The outline rows in the inspector and `[text](#anchor)` links in a
    /// document both reach the same renderer, which is a sibling view rather
    /// than a child — so the request travels through shared state. The
    /// renderer clears it once consumed, making this a one-shot signal rather
    /// than a mode.
    @Published var pendingAnchor: String? = nil

    /// Bumped by `reloadTree()`. `allFiles` is a plain `lazy var` and `root`
    /// compares equal across a rebuild (`CodexNode ==` is by id, and the root's
    /// id is the constant "Codex v3"), so neither can be observed with
    /// `.onChange` — an open command palette kept ranking the pre-⌘R file list
    /// and could open a path that had since been deleted. This is the signal
    /// views watch to know the tree changed underneath them.
    @Published private(set) var treeRevision: Int = 0

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
        // A pinned file is already in the strip and stays where it is.
        // Anything else takes the single transient slot, replacing whatever
        // was there — which is the whole point: browsing no longer accumulates.
        //
        // `forceNew` is the sidebar's "Open in New Tab". In a preview-tab model
        // the way to make a tab stick is to pin it, so that is what it now
        // means.
        if forceNew {
            bookmarks.pin(url.path)
        } else if !bookmarks.isPinned(url.path) {
            transientTab = url
        }
        selectedTab = url
        if pushHistory { history.push(url) }
        dismissPalette()
        bookmarks.touch(url.path)
        objectWillChange.send()
    }

    /// Close the palette and forget what was typed.
    ///
    /// The query lives on AppState now (the toolbar field writes it), so it
    /// outlives the palette view and has to be cleared deliberately —
    /// otherwise the next ⌘P opens onto the last search.
    func dismissPalette() {
        paletteVisible = false
        paletteQuery = ""
    }

    /// Pin or unpin, keeping the strip and the selection consistent.
    ///
    /// **This exists because the invariant does not hold on its own.** Five
    /// call sites used to reach into `bookmarks.togglePin` directly, and
    /// unpinning the document you were reading dropped it out of the derived
    /// strip while `selectedTab` still pointed at it: a file on screen with no
    /// pill active. The comment on `selectedTab` asserted that could not
    /// happen. Asserting it is not the same as arranging it.
    ///
    /// Unpinning what you are reading hands it to the transient slot — you are
    /// still reading it, it is just no longer kept. Pinning what is transient
    /// frees that slot, since the file is in the strip as a pin now.
    func togglePin(_ url: URL) {
        let path = url.path
        if bookmarks.isPinned(path) {
            bookmarks.unpin(path)
            if selectedTab == url { transientTab = url }
        } else {
            bookmarks.pin(path)
            if transientTab == url { transientTab = nil }
        }
        objectWillChange.send()
    }

    /// Drop a selection whose file has gone, and land somewhere sensible.
    ///
    /// `openTabs` filters pins whose file no longer exists, so a rename plus
    /// ⌘R made the tab vanish while `selectedTab` kept pointing at it — the
    /// same broken invariant by a different route. Reload now reconciles.
    private func reconcileSelection() {
        let fm = FileManager.default
        if let t = transientTab, !fm.fileExists(atPath: t.path) { transientTab = nil }
        guard let sel = selectedTab, !fm.fileExists(atPath: sel.path) else { return }
        // A remaining pin beats bouncing to Welcome.
        selectedTab = openTabs.first
    }

    /// Remove a tab from the strip: unpin it, or clear the transient slot.
    func closeTab(_ url: URL) {
        let indexBefore = openTabs.firstIndex(of: url)

        if bookmarks.isPinned(url.path) { bookmarks.unpin(url.path) }
        if transientTab == url { transientTab = nil }

        if selectedTab == url {
            // Land on the adjacent tab, not the last one. Closing the third of
            // five tabs used to jump you to the fifth; every other tabbed app
            // moves you next to where you were.
            let remaining = openTabs
            if let i = indexBefore, !remaining.isEmpty {
                selectedTab = remaining[min(i, remaining.count - 1)]
            } else {
                selectedTab = nil
            }
        }
        objectWillChange.send()
    }

    /// Empty the strip, which now means unpinning everything.
    ///
    /// Named "Unpin All Tabs" in the menu rather than "Close All Tabs".
    /// Closing a tab used to be free — tabs were ephemeral — so ⇧⌘W cost
    /// nothing. Now the strip *is* your pins, and the same keystroke throws
    /// them away. The menu says so.
    func unpinAllTabs() {
        for path in bookmarks.pinned { bookmarks.unpin(path) }
        transientTab = nil
        selectedTab = nil
        objectWillChange.send()
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
        treeRevision &+= 1
        reconcileSelection()
    }

    /// Route a markdown link click through the right behavior.
    func handleLink(_ target: LinkResolver.Target) {
        switch target {
        case .file(let url, let anchor):
            openFile(url)
            // Set after the open, so it survives the dismissPalette/reset that
            // openFile performs and is waiting when the new document renders.
            if let anchor, !anchor.isEmpty { pendingAnchor = anchor }
        case .external(let url):
            LinkResolver.openExternal(url)
        case .anchor(let a):
            pendingAnchor = a
        case .unsupported:
            NSSound.beep()
        }
    }
}

// MARK: - Root layout

struct RootView: View {
    @EnvironmentObject var state: AppState
    @ObservedObject private var prefs = Preferences.shared

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
        // No blanket background here. `Theme.base` across the whole window is
        // what made the sidebar's and inspector's `.behindWindow` vibrancy
        // inert — they had an opaque layer painted over them. Each region now
        // paints itself: the toolbar its titlebar material, `mainPane` its
        // base, the two side panes their vibrancy.
        .background(WindowVibrancyConfigurator().frame(width: 0, height: 0))
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
                    .onTapGesture { state.dismissPalette() }
                CommandPaletteView()
                    .padding(.top, 110)
                    .transition(.move(edge: .top).combined(with: .opacity))
            }
            .animation(.easeOut(duration: 0.18), value: state.paletteVisible)
        }
    }
}

private struct ErrorView: View {
    /// Redraw on a palette or text-scale change — see `Preferences.revision`.
    @ObservedObject private var appearance = Preferences.shared
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
