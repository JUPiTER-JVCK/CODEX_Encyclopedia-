import Foundation
import SwiftUI

/// One node in the navigation tree.
final class CodexNode: Identifiable, Hashable {
    let id = UUID()
    let label: String
    let url: URL?
    let isFile: Bool
    let kind: NodeKind
    var children: [CodexNode]

    init(label: String, url: URL? = nil, isFile: Bool = false,
         kind: NodeKind = .group, children: [CodexNode] = []) {
        self.label = label
        self.url = url
        self.isFile = isFile
        self.kind = kind
        self.children = children
    }

    static func == (lhs: CodexNode, rhs: CodexNode) -> Bool { lhs.id == rhs.id }
    func hash(into hasher: inout Hasher) { hasher.combine(id) }

    /// Display title preferring the file's first H1 heading, falling back to filename.
    func displayTitle() -> String {
        guard let url = url, isFile,
              let src = try? String(contentsOf: url, encoding: .utf8) else {
            return label
        }
        // Skip YAML frontmatter and look for the first H1
        var lines = src.components(separatedBy: "\n")
        if lines.first == "---" {
            if let close = lines.dropFirst().firstIndex(of: "---") {
                lines = Array(lines.suffix(from: close + 1))
            }
        }
        for line in lines {
            let t = line.trimmingCharacters(in: .whitespaces)
            if t.hasPrefix("# ") { return String(t.dropFirst(2)).trimmingCharacters(in: .whitespaces) }
        }
        return label
    }
}

enum NodeKind {
    case root
    case band
    case layer
    case section          // references / lessons / topics / …
    case file
    case readme
    case group            // anything else (Top-level wrapper)
}

extension CodexNode {
    /// SF Symbol name for this node — used by the modern sidebar.
    var iconName: String {
        switch kind {
        case .root:    return "books.vertical.fill"
        case .band:    return "rectangle.3.group.fill"
        case .layer:   return "square.stack.3d.up.fill"
        case .section: return "folder.fill"
        case .readme:  return "book.fill"
        case .file:    return "doc.text"
        case .group:   return "folder"
        }
    }

    var iconTint: Color {
        switch kind {
        case .root:    return Theme.lavender
        case .band:    return Theme.overlay1
        case .layer:   return Theme.blue
        case .section: return Theme.peach
        case .readme:  return Theme.green
        case .file:    return Theme.subtle
        case .group:   return Theme.overlay1
        }
    }
}

enum CodexTree {

    static let bands: [(String, [String])] = [
        ("Foundations",    ["00_", "00b_", "00c_", "00d_"]),
        ("Compute",        ["01_", "02_", "03_", "04_", "05_", "06_", "07_", "08_"]),
        ("Network",        ["Network"]),
        ("Cross-cutting",  ["14_", "15_", "16_", "17_", "18_", "19_"]),
        ("Tools",          ["Tools"]),
    ]

    static let subsectionOrder = ["references", "lessons", "languages", "man_pages", "topics", "protocols"]
    static let pretty: [String: String] = [
        "references": "References",
        "lessons":    "Lessons",
        "languages":  "Languages",
        "man_pages":  "Man Pages",
        "topics":     "Topics",
        "protocols":  "Protocols",
    ]

    static func build(root: URL) -> CodexNode {
        let rootNode = CodexNode(label: "Codex v3", kind: .root)

        var topDocs: [CodexNode] = []
        for name in ["README.md", "LAYERS.md", "STRUCTURE.md", "CHANGELOG.md"] {
            let f = root.appendingPathComponent(name)
            if FileManager.default.fileExists(atPath: f.path) {
                topDocs.append(CodexNode(label: name, url: f, isFile: true, kind: .readme))
            }
        }
        if !topDocs.isEmpty {
            rootNode.children.append(CodexNode(label: "Top-level", url: root,
                                               kind: .band, children: topDocs))
        }

        var allLayers: [String: URL] = [:]
        for d in topLevelLayerDirs(root: root) { allLayers[d.lastPathComponent] = d }
        for d in networkLayerDirs(root: root)  { allLayers[d.lastPathComponent] = d }

        for (bandLabel, prefixes) in bands {
            let bandNode = CodexNode(label: bandLabel, kind: .band)
            if bandLabel == "Network" {
                for d in networkLayerDirs(root: root) {
                    bandNode.children.append(layerNode(d))
                }
            } else {
                for prefix in prefixes {
                    for name in allLayers.keys.sorted() where name.hasPrefix(prefix) {
                        bandNode.children.append(layerNode(allLayers[name]!))
                    }
                }
            }
            if !bandNode.children.isEmpty {
                rootNode.children.append(bandNode)
            }
        }
        return rootNode
    }

    private static func layerNode(_ dir: URL) -> CodexNode {
        CodexNode(label: prettifyLayer(dir.lastPathComponent),
                  url: dir, kind: .layer,
                  children: subsectionNodes(layerDir: dir))
    }

    private static func subsectionNodes(layerDir: URL) -> [CodexNode] {
        var out: [CodexNode] = []
        let readme = layerDir.appendingPathComponent("README.md")
        if FileManager.default.fileExists(atPath: readme.path) {
            out.append(CodexNode(label: "Overview", url: readme, isFile: true, kind: .readme))
        }
        for sub in subsectionOrder {
            let subDir = layerDir.appendingPathComponent(sub)
            guard FileManager.default.fileExists(atPath: subDir.path) else { continue }
            let files = listMd(in: subDir)
            guard !files.isEmpty else { continue }
            let children = files.map { f -> CodexNode in
                let isIndex = f.lastPathComponent == "INDEX.md"
                return CodexNode(label: prettyFilename(f.lastPathComponent),
                                 url: f, isFile: true,
                                 kind: isIndex ? .readme : .file)
            }
            out.append(CodexNode(label: pretty[sub] ?? sub,
                                 url: subDir, kind: .section, children: children))
        }
        for f in listMd(in: layerDir) where f.lastPathComponent != "README.md" {
            out.append(CodexNode(label: prettyFilename(f.lastPathComponent),
                                 url: f, isFile: true, kind: .file))
        }
        return out
    }

    /// Cleanup filename for display in the sidebar.
    static func prettyFilename(_ name: String) -> String {
        if name == "INDEX.md" { return "Index" }
        var s = name
        if s.hasSuffix(".md") { s.removeLast(3) }
        s = s.replacingOccurrences(of: "_", with: " ")
        return s.capitalized(with: nil)
            .replacingOccurrences(of: "Api", with: "API")
            .replacingOccurrences(of: "Cpu", with: "CPU")
            .replacingOccurrences(of: "Dns", with: "DNS")
            .replacingOccurrences(of: "Http", with: "HTTP")
            .replacingOccurrences(of: "Tcp", with: "TCP")
            .replacingOccurrences(of: "Udp", with: "UDP")
            .replacingOccurrences(of: "Ip", with: "IP")
            .replacingOccurrences(of: "Os ", with: "OS ")
            .replacingOccurrences(of: "Bios", with: "BIOS")
            .replacingOccurrences(of: "Uart", with: "UART")
            .replacingOccurrences(of: "Spi", with: "SPI")
            .replacingOccurrences(of: "I2c", with: "I²C")
    }

    private static func listMd(in dir: URL) -> [URL] {
        guard let items = try? FileManager.default.contentsOfDirectory(at: dir, includingPropertiesForKeys: nil) else { return [] }
        return items.filter { $0.pathExtension == "md" }
            .sorted { lhs, rhs in
                if lhs.lastPathComponent == "INDEX.md" { return true }
                if rhs.lastPathComponent == "INDEX.md" { return false }
                return lhs.lastPathComponent < rhs.lastPathComponent
            }
    }

    private static func topLevelLayerDirs(root: URL) -> [URL] {
        guard let items = try? FileManager.default.contentsOfDirectory(at: root, includingPropertiesForKeys: [.isDirectoryKey]) else { return [] }
        return items.filter {
            (try? $0.resourceValues(forKeys: [.isDirectoryKey]).isDirectory) == true
                && !$0.lastPathComponent.hasPrefix(".")
                && !$0.lastPathComponent.hasPrefix("_")
                && $0.lastPathComponent != "Network"
                && $0.lastPathComponent != "codex_tui"
                && $0.lastPathComponent != "Codex_macOS"
                && $0.lastPathComponent != "Codex.app"
        }.sorted { $0.lastPathComponent < $1.lastPathComponent }
    }

    private static func networkLayerDirs(root: URL) -> [URL] {
        let net = root.appendingPathComponent("Network")
        guard let items = try? FileManager.default.contentsOfDirectory(at: net, includingPropertiesForKeys: [.isDirectoryKey]) else { return [] }
        return items.filter {
            (try? $0.resourceValues(forKeys: [.isDirectoryKey]).isDirectory) == true
                && !$0.lastPathComponent.hasPrefix(".")
        }.sorted { $0.lastPathComponent < $1.lastPathComponent }
    }

    private static func prettifyLayer(_ name: String) -> String {
        let parts = name.split(separator: "_", maxSplits: 1, omittingEmptySubsequences: false)
        guard parts.count == 2 else { return name.replacingOccurrences(of: "_", with: " ") }
        let head = String(parts[0])
        let isNumericLike = head.allSatisfy { $0.isNumber } ||
            (head.first?.isNumber == true &&
             head.dropFirst().allSatisfy { "abcdef".contains($0) })
        if isNumericLike {
            return "\(head)  " + parts[1].replacingOccurrences(of: "_", with: " ")
        }
        return name.replacingOccurrences(of: "_", with: " ")
    }

    static func allFiles(under root: URL) -> [URL] {
        guard let enumerator = FileManager.default.enumerator(
            at: root,
            includingPropertiesForKeys: [.isRegularFileKey],
            options: [.skipsHiddenFiles]
        ) else { return [] }
        var files: [URL] = []
        for case let url as URL in enumerator {
            let parts = url.pathComponents
            if parts.contains("codex_tui") || parts.contains("_assets") ||
               parts.contains(".build") || parts.contains("Codex.app") ||
               parts.contains("Codex_macOS") { continue }
            if url.pathExtension == "md" { files.append(url) }
        }
        return files.sorted { $0.path < $1.path }
    }
}
