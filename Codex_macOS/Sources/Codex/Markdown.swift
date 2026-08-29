import SwiftUI
import AppKit

// MARK: - Block model

enum MDBlock {
    case heading(level: Int, text: String, anchor: String)
    case paragraph(String)
    case codeBlock(language: String?, code: String)
    case list(items: [String], ordered: Bool)
    case table(headers: [String], rows: [[String]])
    case blockquote(String)
    case rule
    case image(alt: String, href: String)
}

// MARK: - Parser

enum MarkdownParser {
    static func parse(_ raw: String) -> [MDBlock] {
        var blocks: [MDBlock] = []
        let lines = raw.components(separatedBy: "\n")
        var i = 0

        // Skip YAML frontmatter
        if lines.first == "---" {
            i = 1
            while i < lines.count, lines[i] != "---" { i += 1 }
            i = min(i + 1, lines.count)
        }

        while i < lines.count {
            let line = lines[i]

            // Fenced code
            if line.hasPrefix("```") {
                let lang = String(line.dropFirst(3)).trimmingCharacters(in: .whitespaces)
                i += 1
                var code: [String] = []
                while i < lines.count, !lines[i].hasPrefix("```") {
                    code.append(lines[i]); i += 1
                }
                if i < lines.count { i += 1 }
                blocks.append(.codeBlock(language: lang.isEmpty ? nil : lang, code: code.joined(separator: "\n")))
                continue
            }

            // Heading
            if line.hasPrefix("#") {
                var lvl = 0
                for ch in line { if ch == "#" { lvl += 1 } else { break } }
                if lvl > 6 { lvl = 6 }
                let txt = String(line.dropFirst(lvl)).trimmingCharacters(in: .whitespaces)
                let anchor = txt.lowercased()
                    .replacingOccurrences(of: " ", with: "-")
                    .filter { $0.isLetter || $0.isNumber || $0 == "-" }
                blocks.append(.heading(level: lvl, text: txt, anchor: anchor))
                i += 1
                continue
            }

            // Standalone image (lines like ![alt](url))
            if let img = matchImage(line) {
                blocks.append(.image(alt: img.alt, href: img.href))
                i += 1
                continue
            }

            // Pipe table
            if line.contains("|"), i + 1 < lines.count,
               lines[i+1].contains("|"), lines[i+1].contains("-") {
                let headers = parseRow(line)
                i += 2
                var rows: [[String]] = []
                while i < lines.count, lines[i].contains("|"),
                      !lines[i].trimmingCharacters(in: .whitespaces).isEmpty {
                    rows.append(parseRow(lines[i])); i += 1
                }
                blocks.append(.table(headers: headers, rows: rows))
                continue
            }

            // List (unordered / ordered)
            if line.hasPrefix("- ") || line.hasPrefix("* ") ||
               line.range(of: #"^\d+\.\s"#, options: .regularExpression) != nil {
                let ordered = line.range(of: #"^\d+\.\s"#, options: .regularExpression) != nil
                var items: [String] = []
                while i < lines.count {
                    let l = lines[i]
                    if l.hasPrefix("- ") || l.hasPrefix("* ") {
                        items.append(String(l.dropFirst(2))); i += 1
                    } else if let r = l.range(of: #"^\d+\.\s"#, options: .regularExpression) {
                        items.append(String(l[r.upperBound...])); i += 1
                    } else { break }
                }
                blocks.append(.list(items: items, ordered: ordered))
                continue
            }

            // Blockquote
            if line.hasPrefix(">") {
                var quoted: [String] = []
                while i < lines.count, lines[i].hasPrefix(">") {
                    let s = lines[i].hasPrefix("> ") ? String(lines[i].dropFirst(2)) : String(lines[i].dropFirst(1))
                    quoted.append(s); i += 1
                }
                blocks.append(.blockquote(quoted.joined(separator: " ")))
                continue
            }

            // Horizontal rule
            if line == "---" || line == "***" || line == "___" {
                blocks.append(.rule); i += 1; continue
            }

            // Blank
            if line.trimmingCharacters(in: .whitespaces).isEmpty { i += 1; continue }

            // Paragraph
            var para = line
            i += 1
            while i < lines.count {
                let l = lines[i]
                if l.trimmingCharacters(in: .whitespaces).isEmpty { break }
                if l.hasPrefix("#") || l.hasPrefix("```") || l.hasPrefix(">") ||
                   l.hasPrefix("- ") || l.hasPrefix("* ") ||
                   (l.contains("|") && i + 1 < lines.count && lines[i+1].contains("-")) {
                    break
                }
                para += " " + l.trimmingCharacters(in: .whitespaces)
                i += 1
            }
            blocks.append(.paragraph(para))
        }
        return blocks
    }

    private static func parseRow(_ line: String) -> [String] {
        var s = line.trimmingCharacters(in: .whitespaces)
        if s.hasPrefix("|") { s.removeFirst() }
        if s.hasSuffix("|") { s.removeLast() }
        return s.split(separator: "|", omittingEmptySubsequences: false)
            .map { $0.trimmingCharacters(in: .whitespaces) }
    }

    private static func matchImage(_ line: String) -> (alt: String, href: String)? {
        let trimmed = line.trimmingCharacters(in: .whitespaces)
        guard trimmed.hasPrefix("!["), trimmed.hasSuffix(")") else { return nil }
        let body = trimmed.dropFirst(2)
        guard let altEnd = body.firstIndex(of: "]"),
              body[body.index(after: altEnd)] == "(" else { return nil }
        let alt = String(body[..<altEnd])
        let href = String(body[body.index(altEnd, offsetBy: 2)..<body.index(before: body.endIndex)])
        return (alt, href)
    }
}

// MARK: - Inline → AttributedString (bold, italic, code, link)

enum InlineRenderer {
    /// Build an AttributedString with link attributes preserved so a click
    /// gesture on the rendered Text can route through `onLink`.
    static func attributedString(_ src: String,
                                 baseColor: Color = Theme.text,
                                 baseFont: Font = Theme.FontStyle.body) -> AttributedString {
        var options = AttributedString.MarkdownParsingOptions()
        options.interpretedSyntax = .inlineOnlyPreservingWhitespace
        options.failurePolicy = .returnPartiallyParsedIfPossible
        guard var attr = try? AttributedString(markdown: src, options: options) else {
            var fallback = AttributedString(src)
            fallback.foregroundColor = baseColor
            fallback.font = baseFont
            return fallback
        }
        attr.foregroundColor = baseColor
        attr.font = baseFont
        // Style links + inline code spans
        for run in attr.runs {
            if run.link != nil {
                attr[run.range].foregroundColor = Theme.sapphire
                attr[run.range].underlineStyle = .single
            }
            if run.inlinePresentationIntent?.contains(.code) == true {
                attr[run.range].foregroundColor = Theme.peach
                attr[run.range].font = Theme.FontStyle.monoSmall
                attr[run.range].backgroundColor = Theme.surface0.opacity(0.6)
            }
        }
        return attr
    }
}

// MARK: - The renderer

struct MarkdownView: View {
    let source: String
    let sourceFile: URL?
    let projectRoot: URL
    let onLink: (LinkResolver.Target) -> Void
    @State private var scrollAnchor: String? = nil

    private var frontmatter: PageFrontmatter? {
        guard let f = sourceFile else { return nil }
        return PageFrontmatter.parse(source: source, file: f, root: projectRoot)
    }

    private var blocks: [MDBlock] {
        // Skip first H1 if frontmatter card will show it
        var blocks = MarkdownParser.parse(source)
        if let fm = frontmatter, fm.h1Used {
            if let firstHeading = blocks.firstIndex(where: { if case .heading = $0 { return true } else { return false } }),
               case .heading(let lvl, _, _) = blocks[firstHeading], lvl == 1 {
                blocks.remove(at: firstHeading)
            }
        }
        return blocks
    }

    var body: some View {
        ScrollViewReader { proxy in
            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    if let fm = frontmatter {
                        PageHero(fm: fm)
                            .padding(.bottom, 28)
                    }
                    VStack(alignment: .leading, spacing: 16) {
                        ForEach(0..<blocks.count, id: \.self) { idx in
                            blockView(blocks[idx]).id(idx)
                        }
                    }
                    if let fm = frontmatter {
                        PageFooter(fm: fm, onLink: onLink, openExternal: LinkResolver.openExternal)
                            .padding(.top, 36)
                    }
                }
                .padding(.horizontal, 48)
                .padding(.vertical, 32)
                .frame(maxWidth: 920, alignment: .topLeading)
                .frame(maxWidth: .infinity, alignment: .topLeading)
            }
            .background(Theme.base)
        }
    }

    @ViewBuilder
    private func blockView(_ block: MDBlock) -> some View {
        switch block {
        case .heading(let lvl, let txt, let anchor):
            HeadingBlock(level: lvl, text: txt, anchor: anchor)
        case .paragraph(let txt):
            ParagraphBlock(text: txt, sourceFile: sourceFile, projectRoot: projectRoot, onLink: onLink)
        case .codeBlock(let lang, let code):
            CodeBlock(language: lang, code: code)
        case .list(let items, let ordered):
            ListBlock(items: items, ordered: ordered, sourceFile: sourceFile, projectRoot: projectRoot, onLink: onLink)
        case .table(let h, let rows):
            TableBlock(headers: h, rows: rows, sourceFile: sourceFile, projectRoot: projectRoot, onLink: onLink)
        case .blockquote(let txt):
            QuoteBlock(text: txt, sourceFile: sourceFile, projectRoot: projectRoot, onLink: onLink)
        case .rule:
            Rectangle().fill(Theme.hairline).frame(height: 1).padding(.vertical, 8)
        case .image(let alt, let href):
            ImageBlock(alt: alt, href: href, sourceFile: sourceFile, projectRoot: projectRoot)
        }
    }
}

// MARK: - Heading

private struct HeadingBlock: View {
    let level: Int; let text: String; let anchor: String

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(alignment: .firstTextBaseline, spacing: 8) {
                if level == 1 {
                    RoundedRectangle(cornerRadius: 3, style: .continuous)
                        .fill(Theme.accent)
                        .frame(width: 5, height: 28)
                }
                Text(text).font(font).foregroundColor(color)
            }
            if level <= 2 {
                Rectangle().fill(Theme.hairline).frame(height: 1)
            }
        }
        .padding(.top, level == 1 ? 6 : level == 2 ? 10 : 4)
        .padding(.bottom, 2)
    }

    private var font: Font {
        switch level {
        case 1: return Theme.FontStyle.h1
        case 2: return Theme.FontStyle.h2
        case 3: return Theme.FontStyle.h3
        case 4: return Theme.FontStyle.h4
        case 5: return Theme.FontStyle.h5
        default: return Theme.FontStyle.h6
        }
    }
    private var color: Color {
        switch level {
        case 1: return Theme.text
        case 2: return Theme.lavender
        case 3: return Theme.sapphire
        case 4: return Theme.teal
        default: return Theme.subtext
        }
    }
}

// MARK: - Paragraph (with link routing)

private struct ParagraphBlock: View {
    let text: String
    let sourceFile: URL?
    let projectRoot: URL
    let onLink: (LinkResolver.Target) -> Void

    var body: some View {
        Text(InlineRenderer.attributedString(text, baseFont: Theme.FontStyle.body))
            .lineSpacing(4)
            .textSelection(.enabled)
            .environment(\.openURL, OpenURLAction { url in
                handle(url)
                return .handled
            })
    }

    private func handle(_ url: URL) {
        let raw = url.absoluteString
        guard let src = sourceFile else {
            LinkResolver.openExternal(url); return
        }
        let target = LinkResolver.resolve(raw, sourceFile: src, projectRoot: projectRoot)
        onLink(target)
    }
}

// MARK: - List

private struct ListBlock: View {
    let items: [String]; let ordered: Bool
    let sourceFile: URL?; let projectRoot: URL
    let onLink: (LinkResolver.Target) -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            ForEach(0..<items.count, id: \.self) { idx in
                HStack(alignment: .top, spacing: 10) {
                    Group {
                        if ordered {
                            Text("\(idx + 1).")
                                .font(.system(size: 13, weight: .semibold, design: .rounded))
                                .foregroundColor(Theme.peach)
                                .frame(minWidth: 22, alignment: .trailing)
                        } else {
                            Circle().fill(Theme.accent.opacity(0.85))
                                .frame(width: 5, height: 5)
                                .padding(.top, 8)
                                .frame(width: 22)
                        }
                    }
                    ParagraphBlock(text: items[idx], sourceFile: sourceFile, projectRoot: projectRoot, onLink: onLink)
                }
            }
        }
        .padding(.leading, 4)
    }
}

// MARK: - Code block (with hover copy)

private struct CodeBlock: View {
    let language: String?; let code: String
    @State private var hovered = false
    @State private var copied = false

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(spacing: 8) {
                Circle().fill(Theme.red.opacity(0.85)).frame(width: 10, height: 10)
                Circle().fill(Theme.yellow.opacity(0.85)).frame(width: 10, height: 10)
                Circle().fill(Theme.green.opacity(0.85)).frame(width: 10, height: 10)
                if let lang = language, !lang.isEmpty {
                    Text(lang.lowercased())
                        .font(.system(size: 10, weight: .semibold, design: .monospaced))
                        .foregroundColor(Theme.subtext)
                        .padding(.horizontal, 8).padding(.vertical, 2)
                        .background(Theme.surface1.opacity(0.6))
                        .clipShape(Capsule())
                        .padding(.leading, 6)
                }
                Spacer()
                Button(action: copy) {
                    Label(copied ? "Copied" : "Copy",
                          systemImage: copied ? "checkmark" : "doc.on.doc")
                        .labelStyle(.titleAndIcon)
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(copied ? Theme.green : Theme.subtext)
                }
                .buttonStyle(.plain)
                .opacity(hovered ? 1 : 0)
            }
            .padding(.horizontal, 12).padding(.vertical, 8)
            .background(Theme.mantle)
            .overlay(Rectangle().fill(Theme.hairline).frame(height: 1), alignment: .bottom)

            ScrollView(.horizontal, showsIndicators: true) {
                Text(code)
                    .font(Theme.FontStyle.mono)
                    .foregroundColor(Theme.text)
                    .textSelection(.enabled)
                    .padding(14)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
            .background(Theme.crust)
        }
        .clipShape(RoundedRectangle(cornerRadius: Theme.Radius.medium, style: .continuous))
        .overlay(RoundedRectangle(cornerRadius: Theme.Radius.medium).strokeBorder(Theme.hairline, lineWidth: 1))
        .onHover { hovered = $0 }
        .shadow(color: .black.opacity(0.18), radius: 4, y: 2)
    }

    private func copy() {
        NSPasteboard.general.clearContents()
        NSPasteboard.general.setString(code, forType: .string)
        copied = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.4) { copied = false }
    }
}

// MARK: - Table

private struct TableBlock: View {
    let headers: [String]; let rows: [[String]]
    let sourceFile: URL?; let projectRoot: URL
    let onLink: (LinkResolver.Target) -> Void

    var body: some View {
        let cols = max(headers.count, rows.map(\.count).max() ?? 0)
        VStack(spacing: 0) {
            HStack(spacing: 0) {
                ForEach(0..<cols, id: \.self) { c in
                    Text(c < headers.count ? headers[c] : "")
                        .font(Theme.FontStyle.headline)
                        .foregroundColor(Theme.text)
                        .padding(10)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Theme.surface0)
                }
            }
            ForEach(0..<rows.count, id: \.self) { r in
                HStack(spacing: 0) {
                    ForEach(0..<cols, id: \.self) { c in
                        let cellText = c < rows[r].count ? rows[r][c] : ""
                        Text(InlineRenderer.attributedString(cellText, baseFont: Theme.FontStyle.callout))
                            .textSelection(.enabled)
                            .environment(\.openURL, OpenURLAction { url in
                                if let src = sourceFile {
                                    onLink(LinkResolver.resolve(url.absoluteString, sourceFile: src, projectRoot: projectRoot))
                                }
                                return .handled
                            })
                            .padding(10)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(r % 2 == 0 ? Theme.mantle : Theme.base.opacity(0.5))
                    }
                }
                .overlay(Rectangle().fill(Theme.hairline).frame(height: 1), alignment: .top)
            }
        }
        .clipShape(RoundedRectangle(cornerRadius: Theme.Radius.medium, style: .continuous))
        .overlay(RoundedRectangle(cornerRadius: Theme.Radius.medium).strokeBorder(Theme.hairline, lineWidth: 1))
    }
}

// MARK: - Blockquote

private struct QuoteBlock: View {
    let text: String
    let sourceFile: URL?; let projectRoot: URL
    let onLink: (LinkResolver.Target) -> Void

    private var callout: (kind: Callout, body: String) {
        // GitHub-style callouts: > [!NOTE] body  · > [!WARNING] · > [!TIP] · > [!IMPORTANT]
        let trimmed = text.trimmingCharacters(in: .whitespaces)
        for kind in Callout.allCases {
            let token = "[!\(kind.rawValue)]"
            if trimmed.uppercased().hasPrefix(token) {
                let after = String(trimmed.dropFirst(token.count)).trimmingCharacters(in: .whitespaces)
                return (kind, after)
            }
        }
        return (.note, trimmed)
    }

    private var hasMarker: Bool {
        let t = text.trimmingCharacters(in: .whitespaces).uppercased()
        return Callout.allCases.contains { t.hasPrefix("[!\($0.rawValue)]") }
    }

    var body: some View {
        if hasMarker {
            let (kind, body) = callout
            HStack(alignment: .top, spacing: 12) {
                Image(systemName: kind.symbol)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(kind.tint)
                    .frame(width: 18)
                    .padding(.top, 2)
                VStack(alignment: .leading, spacing: 4) {
                    Text(kind.label)
                        .font(.system(size: 11, weight: .semibold))
                        .tracking(0.5)
                        .foregroundColor(kind.tint)
                    ParagraphBlock(text: body, sourceFile: sourceFile, projectRoot: projectRoot, onLink: onLink)
                }
                Spacer(minLength: 0)
            }
            .padding(14)
            .background(kind.tint.opacity(0.10))
            .overlay(
                Rectangle().fill(kind.tint).frame(width: 3),
                alignment: .leading
            )
            .clipShape(RoundedRectangle(cornerRadius: Theme.Radius.small, style: .continuous))
        } else {
            HStack(alignment: .top, spacing: 12) {
                RoundedRectangle(cornerRadius: 2, style: .continuous)
                    .fill(Theme.mauve)
                    .frame(width: 3)
                ParagraphBlock(text: text, sourceFile: sourceFile, projectRoot: projectRoot, onLink: onLink)
                    .foregroundColor(Theme.subtle)
            }
            .padding(.vertical, 10).padding(.horizontal, 14)
            .background(Theme.mauve.opacity(0.06))
            .clipShape(RoundedRectangle(cornerRadius: Theme.Radius.small, style: .continuous))
        }
    }
}

enum Callout: String, CaseIterable {
    case note      = "NOTE"
    case tip       = "TIP"
    case important = "IMPORTANT"
    case warning   = "WARNING"
    case caution   = "CAUTION"

    var label: String {
        switch self {
        case .note:      return "NOTE"
        case .tip:       return "TIP"
        case .important: return "IMPORTANT"
        case .warning:   return "WARNING"
        case .caution:   return "CAUTION"
        }
    }
    var symbol: String {
        switch self {
        case .note:      return "info.circle.fill"
        case .tip:       return "lightbulb.fill"
        case .important: return "exclamationmark.circle.fill"
        case .warning:   return "exclamationmark.triangle.fill"
        case .caution:   return "xmark.octagon.fill"
        }
    }
    var tint: Color {
        switch self {
        case .note:      return Theme.blue
        case .tip:       return Theme.green
        case .important: return Theme.mauve
        case .warning:   return Theme.yellow
        case .caution:   return Theme.red
        }
    }
}

// MARK: - Frontmatter

struct PageFrontmatter {
    let title: String
    let h1Used: Bool          // true if title came from H1 (so we should hide it from body)
    let summary: String?
    let layer: String?
    let section: String?
    let tags: [String]
    let updated: String?
    let path: String          // relative to project root
    let modifiedDate: Date?
    let fileURL: URL
    let projectRoot: URL

    static func parse(source: String, file: URL, root: URL) -> PageFrontmatter {
        var title: String = file.deletingPathExtension().lastPathComponent
        var h1Used = false
        var summary: String? = nil
        var layer: String? = nil
        var section: String? = nil
        var tags: [String] = []
        var updated: String? = nil

        let lines = source.components(separatedBy: "\n")

        // YAML frontmatter
        var bodyStart = 0
        if lines.first == "---" {
            var i = 1
            while i < lines.count, lines[i] != "---" {
                let line = lines[i]
                if let colon = line.firstIndex(of: ":") {
                    let key = String(line[..<colon]).trimmingCharacters(in: .whitespaces)
                    var val = String(line[line.index(after: colon)...]).trimmingCharacters(in: .whitespaces)
                    val = val.trimmingCharacters(in: CharacterSet(charactersIn: "\""))
                    switch key {
                    case "title":   title = val
                    case "layer":   layer = val
                    case "section": section = val
                    case "updated": updated = val
                    case "tags":
                        let inner = val.trimmingCharacters(in: CharacterSet(charactersIn: "[]"))
                        tags = inner.split(separator: ",").map { $0.trimmingCharacters(in: .whitespaces) }
                            .filter { !$0.isEmpty }
                    default: break
                    }
                }
                i += 1
            }
            bodyStart = i + 1
        }

        // First H1 if no YAML title was found (or to confirm)
        for j in bodyStart..<lines.count {
            let t = lines[j].trimmingCharacters(in: .whitespaces)
            if t.hasPrefix("# ") {
                let h1 = String(t.dropFirst(2)).trimmingCharacters(in: .whitespaces)
                if title == file.deletingPathExtension().lastPathComponent {
                    title = h1
                }
                if h1 == title { h1Used = true }
                break
            }
            if !t.isEmpty { break }
        }

        // First blockquote after the H1 is treated as summary
        var foundH1 = false
        for j in bodyStart..<lines.count {
            let t = lines[j].trimmingCharacters(in: .whitespaces)
            if t.hasPrefix("# ") { foundH1 = true; continue }
            if foundH1, t.hasPrefix(">") {
                var s = String(t.dropFirst(1)).trimmingCharacters(in: .whitespaces)
                if s.uppercased().hasPrefix("[!") { break } // a callout, not a summary
                var k = j + 1
                while k < lines.count, lines[k].trimmingCharacters(in: .whitespaces).hasPrefix(">") {
                    let extra = lines[k].trimmingCharacters(in: .whitespaces)
                    s += " " + String(extra.dropFirst(1)).trimmingCharacters(in: .whitespaces)
                    k += 1
                }
                summary = s
                break
            }
            if foundH1, !t.isEmpty { break }
        }

        let path = file.path.replacingOccurrences(of: root.path + "/", with: "")
        let modified = (try? FileManager.default.attributesOfItem(atPath: file.path)[.modificationDate]) as? Date

        return PageFrontmatter(title: title, h1Used: h1Used, summary: summary,
                               layer: layer, section: section, tags: tags,
                               updated: updated, path: path, modifiedDate: modified,
                               fileURL: file, projectRoot: root)
    }
}

// MARK: - Page hero

struct PageHero: View {
    let fm: PageFrontmatter

    private var pathParts: [String] {
        fm.path.split(separator: "/").map(String.init)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            // Eyebrow path
            HStack(spacing: 6) {
                Image(systemName: "books.vertical.fill")
                    .font(.system(size: 10))
                    .foregroundColor(Theme.lavender)
                Text("Codex")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundColor(Theme.subtext)
                ForEach(Array(pathParts.dropLast().enumerated()), id: \.offset) { _, part in
                    Image(systemName: "chevron.right")
                        .font(.system(size: 8, weight: .bold))
                        .foregroundColor(Theme.overlay0)
                    Text(prettifyCrumb(part))
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(Theme.subtext)
                }
            }

            // Title
            Text(fm.title)
                .font(Theme.FontStyle.displayLarge)
                .foregroundColor(Theme.text)
                .lineLimit(3)
                .minimumScaleFactor(0.75)

            // Summary (frontmatter blockquote)
            if let summary = fm.summary, !summary.isEmpty {
                Text(InlineRenderer.attributedString(summary,
                                                     baseColor: Theme.subtext,
                                                     baseFont: .system(size: 16, weight: .regular)))
                    .lineSpacing(4)
                    .padding(.bottom, 2)
            }

            // Meta row (tags + updated)
            HStack(spacing: 14) {
                if let updated = fm.updated {
                    HStack(spacing: 4) {
                        Image(systemName: "clock").font(.system(size: 10))
                            .foregroundColor(Theme.overlay1)
                        Text("Updated \(updated)")
                            .font(.system(size: 11))
                            .foregroundColor(Theme.overlay1)
                    }
                }
                if let modified = fm.modifiedDate {
                    HStack(spacing: 4) {
                        Image(systemName: "doc.badge.clock").font(.system(size: 10))
                            .foregroundColor(Theme.overlay1)
                        Text(HumanDate.describe(modified))
                            .font(.system(size: 11))
                            .foregroundColor(Theme.overlay1)
                    }
                }
                if !fm.tags.isEmpty {
                    Rectangle().fill(Theme.hairline).frame(width: 1, height: 14)
                    FlowLayout(spacing: 5) {
                        ForEach(fm.tags.prefix(8), id: \.self) { tag in
                            Text(tag)
                                .font(.system(size: 10, weight: .medium))
                                .foregroundColor(Theme.accent)
                                .padding(.horizontal, 7).padding(.vertical, 2)
                                .background(Capsule().fill(Theme.accent.opacity(0.14)))
                        }
                    }
                }
                Spacer()
            }
            .padding(.top, 4)

            // Hairline divider
            Rectangle().fill(Theme.hairline).frame(height: 1).padding(.top, 8)
        }
    }

    private func prettifyCrumb(_ s: String) -> String {
        let mapped = CodexTree.pretty[s] ?? s
        return mapped.split(separator: "_").map { piece -> String in
            piece.first?.isNumber == true ? String(piece) : piece.capitalized
        }.joined(separator: " ")
    }
}

// MARK: - Page footer (adjacent docs, actions)

struct PageFooter: View {
    let fm: PageFrontmatter
    let onLink: (LinkResolver.Target) -> Void
    let openExternal: (URL) -> Void

    private var siblings: [URL] {
        let dir = fm.fileURL.deletingLastPathComponent()
        guard let items = try? FileManager.default.contentsOfDirectory(at: dir, includingPropertiesForKeys: nil) else {
            return []
        }
        return items.filter { $0.pathExtension == "md" && $0 != fm.fileURL }
            .sorted { $0.lastPathComponent < $1.lastPathComponent }
    }

    private var prevNext: (prev: URL?, next: URL?) {
        let s = siblings
        guard let idx = s.firstIndex(where: { $0 == fm.fileURL }) else {
            return (s.first { $0 != fm.fileURL }, nil)
        }
        return (idx > 0 ? s[idx - 1] : nil,
                idx < s.count - 1 ? s[idx + 1] : nil)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Rectangle().fill(Theme.hairline).frame(height: 1)

            // Adjacent docs
            HStack(spacing: 12) {
                AdjacentCard(direction: .prev, url: prevNext.prev, onLink: onLink)
                AdjacentCard(direction: .next, url: prevNext.next, onLink: onLink)
            }

            // Action row
            HStack(spacing: 8) {
                FooterChip(icon: "folder", label: "Reveal in Finder") {
                    LinkResolver.revealInFinder(fm.fileURL)
                }
                FooterChip(icon: "doc.on.doc", label: "Copy Path") {
                    NSPasteboard.general.clearContents()
                    NSPasteboard.general.setString(fm.fileURL.path, forType: .string)
                }
                FooterChip(icon: "arrow.up.right.square", label: "Open in Editor") {
                    NSWorkspace.shared.open(fm.fileURL)
                }
                Spacer()
                Text(fm.path)
                    .font(.system(size: 10, design: .monospaced))
                    .foregroundColor(Theme.overlay1)
            }
        }
    }
}

enum AdjacentDirection { case prev, next }

private struct AdjacentCard: View {
    let direction: AdjacentDirection
    let url: URL?
    let onLink: (LinkResolver.Target) -> Void
    @State private var hovered = false

    var body: some View {
        Group {
            if let url = url {
                Button(action: { onLink(.file(url)) }) {
                    HStack(spacing: 10) {
                        if direction == .prev {
                            Image(systemName: "arrow.left")
                                .font(.system(size: 12, weight: .semibold))
                                .foregroundColor(Theme.overlay1)
                        }
                        VStack(alignment: direction == .prev ? .leading : .trailing, spacing: 2) {
                            Text(direction == .prev ? "Previous" : "Next")
                                .font(.system(size: 10, weight: .semibold))
                                .tracking(0.6)
                                .foregroundColor(Theme.overlay1)
                            Text(CodexTree.prettyFilename(url.lastPathComponent))
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundColor(Theme.text)
                                .lineLimit(1)
                        }
                        if direction == .next {
                            Image(systemName: "arrow.right")
                                .font(.system(size: 12, weight: .semibold))
                                .foregroundColor(Theme.overlay1)
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: direction == .prev ? .leading : .trailing)
                    .padding(.horizontal, 14).padding(.vertical, 12)
                    .background(
                        RoundedRectangle(cornerRadius: Theme.Radius.medium, style: .continuous)
                            .fill(hovered ? Theme.mantle : Theme.mantle.opacity(0.55))
                    )
                    .overlay(
                        RoundedRectangle(cornerRadius: Theme.Radius.medium, style: .continuous)
                            .strokeBorder(hovered ? Theme.accent.opacity(0.5) : Theme.hairline, lineWidth: 0.5)
                    )
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                .onHover { hovered = $0 }
            } else {
                Color.clear
            }
        }
        .frame(maxWidth: .infinity, minHeight: 56)
    }
}

private struct FooterChip: View {
    let icon: String; let label: String; let action: () -> Void
    @State private var hovered = false
    var body: some View {
        Button(action: action) {
            HStack(spacing: 5) {
                Image(systemName: icon).font(.system(size: 11))
                Text(label).font(.system(size: 11, weight: .medium))
            }
            .foregroundColor(hovered ? Theme.text : Theme.subtext)
            .padding(.horizontal, 10).padding(.vertical, 5)
            .background(Capsule().fill(hovered ? Theme.surface0 : Theme.surface0.opacity(0.5)))
            .contentShape(Capsule())
        }
        .buttonStyle(.plain)
        .onHover { hovered = $0 }
    }
}

// MARK: - Image (file-relative or external)

private struct ImageBlock: View {
    let alt: String; let href: String
    let sourceFile: URL?; let projectRoot: URL

    private var resolvedURL: URL? {
        guard let src = sourceFile else { return URL(string: href) }
        let r = LinkResolver.resolve(href, sourceFile: src, projectRoot: projectRoot)
        if case .file(let u) = r { return u }
        if case .external(let u) = r { return u }
        return nil
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            if let url = resolvedURL, url.isFileURL, let image = NSImage(contentsOf: url) {
                Image(nsImage: image)
                    .resizable().scaledToFit()
                    .frame(maxHeight: 480)
                    .clipShape(RoundedRectangle(cornerRadius: Theme.Radius.medium, style: .continuous))
                    .overlay(RoundedRectangle(cornerRadius: Theme.Radius.medium).strokeBorder(Theme.hairline, lineWidth: 1))
            } else {
                HStack(spacing: 8) {
                    Image(systemName: "photo").foregroundColor(Theme.overlay1)
                    Text(alt.isEmpty ? href : alt).foregroundColor(Theme.subtext).font(Theme.FontStyle.callout)
                }
                .padding(14)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Theme.mantle)
                .clipShape(RoundedRectangle(cornerRadius: Theme.Radius.medium, style: .continuous))
                .overlay(RoundedRectangle(cornerRadius: Theme.Radius.medium).strokeBorder(Theme.hairline, lineWidth: 1))
            }
            if !alt.isEmpty {
                Text(alt).font(Theme.FontStyle.footnote).foregroundColor(Theme.overlay1)
            }
        }
    }
}
