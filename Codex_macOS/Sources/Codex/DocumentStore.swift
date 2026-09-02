import Foundation

/// A markdown file after reading and parsing: the source text, the block
/// tree, and the frontmatter card that heads the page.
struct CodexDocument {
    let source: String
    let blocks: [MDBlock]
    let frontmatter: PageFrontmatter?
}

/// Reads and parses each markdown file once per revision.
///
/// Both the read and the parse used to happen inside `View.body`. `blocks`
/// was a computed property, and the render loop touched it once for `count`
/// and again for every index, so a document parsed roughly as many times as
/// it had blocks — on every hover, tab switch, or panel toggle, with a
/// synchronous disk read in front of it.
///
/// Entries are keyed on path plus modification date and size, so editing a
/// file outside the app invalidates its entry without an explicit reload.
enum DocumentStore {

    private struct Key: Hashable {
        let path: String
        let modified: Date
        let size: Int
    }

    /// Documents are the expensive item; titles are cached separately because
    /// the sidebar and tab strip want a title for files nobody has opened.
    private static var documents: [Key: CodexDocument] = [:]
    private static var titles: [Key: String] = [:]
    private static var documentOrder: [Key] = []
    private static var titleOrder: [Key] = []

    private static let lock = NSLock()
    private static let documentLimit = 48
    private static let titleLimit = 512

    // MARK: - Public API

    /// The parsed document for `url`, or nil if it can't be read as UTF-8.
    static func document(for url: URL, root: URL) -> CodexDocument? {
        guard let key = key(for: url) else { return nil }

        lock.lock()
        if let hit = documents[key] {
            lock.unlock()
            return hit
        }
        lock.unlock()

        guard let source = try? String(contentsOf: url, encoding: .utf8) else { return nil }

        let frontmatter = PageFrontmatter.parse(source: source, file: url, root: root)
        var blocks = MarkdownParser.parse(source)

        // The hero card already shows the H1, so drop it from the body.
        if frontmatter.h1Used,
           let first = blocks.firstIndex(where: { if case .heading = $0 { return true } else { return false } }),
           case .heading(let level, _, _) = blocks[first], level == 1 {
            blocks.remove(at: first)
        }

        let document = CodexDocument(source: source, blocks: blocks, frontmatter: frontmatter)

        lock.lock()
        documents[key] = document
        documentOrder.append(key)
        evict(&documents, &documentOrder, limit: documentLimit)
        lock.unlock()

        return document
    }

    /// The file's first H1, skipping YAML frontmatter. Nil when it has none.
    ///
    /// Used for tab and sidebar titles, which are asked for far more often
    /// than documents are opened, so this scans for the heading and stops
    /// rather than parsing the whole file.
    static func title(for url: URL) -> String? {
        guard let key = key(for: url) else { return nil }

        lock.lock()
        if let hit = titles[key] {
            lock.unlock()
            return hit.isEmpty ? nil : hit
        }
        lock.unlock()

        let found = scanTitle(url) ?? ""

        lock.lock()
        titles[key] = found
        titleOrder.append(key)
        evict(&titles, &titleOrder, limit: titleLimit)
        lock.unlock()

        return found.isEmpty ? nil : found
    }

    /// Drop everything. Called by Reload Tree (⌘R).
    static func invalidateAll() {
        lock.lock()
        documents.removeAll()
        titles.removeAll()
        documentOrder.removeAll()
        titleOrder.removeAll()
        lock.unlock()
    }

    // MARK: - Internals

    private static func key(for url: URL) -> Key? {
        guard let values = try? url.resourceValues(forKeys: [.contentModificationDateKey, .fileSizeKey]),
              let modified = values.contentModificationDate,
              let size = values.fileSize else { return nil }
        return Key(path: url.path, modified: modified, size: size)
    }

    private static func scanTitle(_ url: URL) -> String? {
        guard let source = try? String(contentsOf: url, encoding: .utf8) else { return nil }
        var lines = source.components(separatedBy: "\n")

        if lines.first == "---",
           let close = lines.dropFirst().firstIndex(of: "---") {
            lines = Array(lines.suffix(from: close + 1))
        }

        for line in lines {
            let trimmed = line.trimmingCharacters(in: .whitespaces)
            if trimmed.hasPrefix("# ") {
                return String(trimmed.dropFirst(2)).trimmingCharacters(in: .whitespaces)
            }
        }
        return nil
    }

    /// Oldest-first eviction. Caller holds the lock.
    private static func evict<V>(_ store: inout [Key: V], _ order: inout [Key], limit: Int) {
        guard order.count > limit else { return }
        let excess = order.count - limit
        for key in order.prefix(excess) where !order.dropFirst(excess).contains(key) {
            store.removeValue(forKey: key)
        }
        order.removeFirst(excess)
    }
}
