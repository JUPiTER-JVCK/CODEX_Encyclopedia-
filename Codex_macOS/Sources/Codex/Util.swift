import Foundation
import AppKit

// MARK: - Fuzzy matching

enum FuzzyMatch {
    static func score(query: String, candidate: String) -> Int? {
        if query.isEmpty { return 1 }
        let q = Array(query.lowercased())
        let c = Array(candidate.lowercased())
        var qi = 0, score = 0, consecutive = 0, lastIdx = -1
        for (ci, ch) in c.enumerated() {
            if qi < q.count, ch == q[qi] {
                score += 10
                if ci == lastIdx + 1 { consecutive += 1; score += consecutive * 5 } else { consecutive = 0 }
                if ci == 0 || "/_.-".contains(c[ci - 1]) { score += 8 }
                lastIdx = ci; qi += 1
            }
        }
        return qi == q.count ? score : nil
    }

    struct Ranked: Identifiable, Hashable {
        var id: String { url.path }
        let url: URL
        let display: String
        let parent: String
        let score: Int
    }

    static func rank(query: String, files: [URL], projectRoot: URL, limit: Int = 80) -> [Ranked] {
        let trimmed = query.trimmingCharacters(in: .whitespaces)
        var out: [Ranked] = []
        out.reserveCapacity(files.count)
        let prefix = projectRoot.path + "/"
        for url in files {
            let rel = url.path.replacingOccurrences(of: prefix, with: "")
            let target = trimmed.isEmpty ? rel : rel
            if let s = score(query: trimmed, candidate: target) {
                let parent = (rel as NSString).deletingLastPathComponent
                out.append(Ranked(url: url, display: url.lastPathComponent,
                                  parent: parent, score: s))
            }
        }
        return out.sorted { $0.score > $1.score }.prefix(limit).map { $0 }
    }
}

// MARK: - Bookmarks + recents (persisted to ~/Library/Application Support/Codex)

struct Bookmarks: Codable {
    var pinned: [String] = []
    var recents: [String] = []
    static let maxRecents = 30

    private static var storeURL: URL {
        let dir = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
            .appendingPathComponent("Codex", isDirectory: true)
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        return dir.appendingPathComponent("state.json")
    }

    static func load() -> Bookmarks {
        guard let data = try? Data(contentsOf: storeURL),
              let b = try? JSONDecoder().decode(Bookmarks.self, from: data) else {
            return Bookmarks()
        }
        return b
    }

    func save() {
        if let data = try? JSONEncoder().encode(self) {
            try? data.write(to: Bookmarks.storeURL)
        }
    }

    mutating func togglePin(_ path: String) {
        if let i = pinned.firstIndex(of: path) { pinned.remove(at: i) } else { pinned.append(path) }
        save()
    }

    mutating func touch(_ path: String) {
        recents.removeAll { $0 == path }
        recents.insert(path, at: 0)
        if recents.count > Bookmarks.maxRecents { recents = Array(recents.prefix(Bookmarks.maxRecents)) }
        save()
    }

    func isPinned(_ path: String) -> Bool { pinned.contains(path) }
}

// MARK: - Navigation history (back/forward like a browser)

final class NavigationHistory: ObservableObject {
    @Published private(set) var stack: [URL] = []
    @Published private(set) var index: Int = -1

    var canGoBack: Bool    { index > 0 }
    var canGoForward: Bool { index >= 0 && index < stack.count - 1 }
    var current: URL?      { (index >= 0 && index < stack.count) ? stack[index] : nil }

    func push(_ url: URL) {
        if let c = current, c == url { return }
        if index < stack.count - 1 { stack.removeLast(stack.count - 1 - index) }
        stack.append(url)
        index = stack.count - 1
    }

    func goBack() -> URL? {
        guard canGoBack else { return nil }
        index -= 1
        return stack[index]
    }

    func goForward() -> URL? {
        guard canGoForward else { return nil }
        index += 1
        return stack[index]
    }
}

// MARK: - Markdown link resolver

enum LinkResolver {
    /// Resolve a markdown link relative to a source file.
    /// Returns `.file` for in-codex .md/.html, `.external` for http(s)/mailto.
    enum Target {
        case file(URL)
        case anchor(String)
        case external(URL)
        case unsupported
    }

    static func resolve(_ href: String, sourceFile: URL, projectRoot: URL) -> Target {
        let trimmed = href.trimmingCharacters(in: .whitespaces)
        if trimmed.isEmpty { return .unsupported }
        // Anchor-only link
        if trimmed.hasPrefix("#") { return .anchor(String(trimmed.dropFirst())) }
        // External
        if let url = URL(string: trimmed),
           let scheme = url.scheme?.lowercased(),
           ["http", "https", "mailto", "ftp", "file"].contains(scheme) {
            return .external(url)
        }
        // Strip trailing anchor; resolve relative to sourceFile's directory
        var path = trimmed
        var anchor: String? = nil
        if let hashIdx = path.firstIndex(of: "#") {
            anchor = String(path[path.index(after: hashIdx)...])
            path = String(path[..<hashIdx])
        }
        if path.isEmpty, let a = anchor { return .anchor(a) }

        let baseDir = sourceFile.deletingLastPathComponent()
        var candidate = URL(fileURLWithPath: path, relativeTo: baseDir).standardizedFileURL

        // If path starts with /, anchor to project root
        if path.hasPrefix("/") {
            candidate = projectRoot.appendingPathComponent(String(path.dropFirst())).standardizedFileURL
        }
        if let resolved = resolveToFile(candidate) { return .file(resolved) }

        // Fallback: try as relative to project root
        let alt = projectRoot.appendingPathComponent(path).standardizedFileURL
        if let resolved = resolveToFile(alt) { return .file(resolved) }

        return .unsupported
    }

    /// Given a candidate URL that may be a file or a directory, return a real
    /// file URL. For directories, prefer README.md, then INDEX.md.
    private static func resolveToFile(_ url: URL) -> URL? {
        let fm = FileManager.default
        var isDir: ObjCBool = false
        guard fm.fileExists(atPath: url.path, isDirectory: &isDir) else { return nil }
        if !isDir.boolValue { return url }
        // Directory — look for an index file
        for child in ["README.md", "INDEX.md", "index.md", "readme.md"] {
            let c = url.appendingPathComponent(child)
            if fm.fileExists(atPath: c.path) { return c }
        }
        return nil
    }

    static func openExternal(_ url: URL) {
        NSWorkspace.shared.open(url)
    }

    static func revealInFinder(_ url: URL) {
        NSWorkspace.shared.activateFileViewerSelecting([url])
    }
}

// MARK: - Date formatting helper

enum HumanDate {
    static let relative: RelativeDateTimeFormatter = {
        let f = RelativeDateTimeFormatter()
        f.unitsStyle = .short
        return f
    }()

    static let abs: DateFormatter = {
        let f = DateFormatter()
        f.dateStyle = .medium
        f.timeStyle = .short
        return f
    }()

    static func describe(_ date: Date) -> String {
        let interval = -date.timeIntervalSinceNow
        if interval < 60 * 60 * 24 * 7 { return relative.localizedString(for: date, relativeTo: Date()) }
        return abs.string(from: date)
    }
}
