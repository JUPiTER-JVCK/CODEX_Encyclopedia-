import SwiftUI

// MARK: - Welcome screen (shown when no tab is open)

struct WelcomeView: View {
    @EnvironmentObject var state: AppState

    private var stats: (layers: Int, files: Int, tools: Int) {
        let layers = state.root.children.flatMap { $0.children }.count
        let files = state.allFiles.count
        let tools = (try? FileManager.default.contentsOfDirectory(
            at: state.projectRoot.appendingPathComponent("Tools"),
            includingPropertiesForKeys: nil
        ).filter { $0.pathExtension == "html" }.count) ?? 0
        return (layers, files, tools)
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 32) {
                hero
                quickActions
                if !state.bookmarks.recents.isEmpty { recents }
                bands
                Spacer(minLength: 40)
            }
            .padding(.horizontal, 40).padding(.vertical, 32)
            .frame(maxWidth: 980)
            .frame(maxWidth: .infinity)
        }
        .background(Theme.base)
    }

    // MARK: Hero

    private var hero: some View {
        VStack(spacing: 14) {
            ZStack {
                RoundedRectangle(cornerRadius: 22, style: .continuous)
                    .fill(LinearGradient(colors: [Theme.blue, Theme.lavender, Theme.mauve],
                                         startPoint: .topLeading, endPoint: .bottomTrailing))
                    .frame(width: 90, height: 90)
                    .shadow(color: Theme.blue.opacity(0.5), radius: 20, y: 8)
                Image(systemName: "books.vertical.fill")
                    .font(.system(size: 42, weight: .medium))
                    .foregroundColor(Theme.crust)
            }
            VStack(spacing: 4) {
                Text("Codex").font(Theme.FontStyle.displayLarge).foregroundColor(Theme.text)
                Text("Computing Stack Knowledge Base · v3")
                    .font(Theme.FontStyle.title).foregroundColor(Theme.subtext)
            }
            HStack(spacing: 18) {
                StatBubble(value: "\(stats.layers)", label: "Layers", tint: Theme.blue)
                StatBubble(value: "\(stats.files)", label: "Docs", tint: Theme.teal)
                StatBubble(value: "\(stats.tools)", label: "Tools", tint: Theme.green)
            }
            .padding(.top, 8)
        }
        .padding(.vertical, 14)
    }

    // MARK: Quick actions

    private var quickActions: some View {
        let readme = state.projectRoot.appendingPathComponent("README.md")
        let layers = state.projectRoot.appendingPathComponent("LAYERS.md")
        let changelog = state.projectRoot.appendingPathComponent("CHANGELOG.md")
        let tools = state.projectRoot.appendingPathComponent("Tools/README.md")

        return VStack(alignment: .leading, spacing: 10) {
            SectionTitle("Quick Start")
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 220, maximum: 320), spacing: 12)], spacing: 12) {
                QuickCard(icon: "book.fill", tint: Theme.blue,
                          title: "Read the README",
                          subtitle: "Project overview & conventions") {
                    if FileManager.default.fileExists(atPath: readme.path) { state.openFile(readme) }
                }
                QuickCard(icon: "square.stack.3d.up.fill", tint: Theme.lavender,
                          title: "Explore Layers",
                          subtitle: "Foundations → Compute → Network → Cross-cutting") {
                    if FileManager.default.fileExists(atPath: layers.path) { state.openFile(layers) }
                }
                QuickCard(icon: "wrench.and.screwdriver.fill", tint: Theme.green,
                          title: "Open Tools",
                          subtitle: "14 standalone network & security utilities") {
                    if FileManager.default.fileExists(atPath: tools.path) { state.openFile(tools) }
                }
                QuickCard(icon: "magnifyingglass", tint: Theme.mauve,
                          title: "Command Palette",
                          subtitle: "Fuzzy-find any doc · ⌘P") {
                    state.paletteVisible = true
                }
                QuickCard(icon: "clock.arrow.circlepath", tint: Theme.peach,
                          title: "Changelog",
                          subtitle: "Version history & release notes") {
                    if FileManager.default.fileExists(atPath: changelog.path) { state.openFile(changelog) }
                }
                QuickCard(icon: "folder.fill", tint: Theme.teal,
                          title: "Reveal in Finder",
                          subtitle: "Open the Codex_v2 directory") {
                    LinkResolver.revealInFinder(state.projectRoot)
                }
            }
        }
    }

    // MARK: Recents

    private var recents: some View {
        VStack(alignment: .leading, spacing: 10) {
            SectionTitle("Recently Opened")
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 240, maximum: 360), spacing: 10)], spacing: 10) {
                ForEach(Array(state.bookmarks.recents.prefix(6)), id: \.self) { path in
                    let url = URL(fileURLWithPath: path)
                    RecentCard(url: url)
                }
            }
        }
    }

    // MARK: Bands

    private var bands: some View {
        VStack(alignment: .leading, spacing: 10) {
            SectionTitle("Browse by Band")
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 200, maximum: 280), spacing: 12)], spacing: 12) {
                ForEach(state.root.children) { band in
                    BandCard(band: band)
                }
            }
        }
    }
}

// MARK: - Components

private struct SectionTitle: View {
    let label: String
    init(_ label: String) { self.label = label }
    var body: some View {
        Text(label.uppercased())
            .font(.system(size: 11, weight: .semibold))
            .tracking(1.4)
            .foregroundColor(Theme.overlay1)
            .padding(.bottom, 4)
    }
}

private struct StatBubble: View {
    let value: String; let label: String; let tint: Color
    var body: some View {
        VStack(spacing: 2) {
            Text(value).font(.system(size: 22, weight: .bold, design: .rounded)).foregroundColor(tint)
            Text(label).font(.system(size: 11, weight: .medium)).foregroundColor(Theme.overlay1)
        }
        .frame(minWidth: 70)
    }
}

private struct QuickCard: View {
    let icon: String; let tint: Color; let title: String; let subtitle: String
    let action: () -> Void
    @State private var hovered = false

    var body: some View {
        Button(action: action) {
            HStack(alignment: .top, spacing: 12) {
                ZStack {
                    RoundedRectangle(cornerRadius: 9, style: .continuous)
                        .fill(tint.opacity(0.18))
                        .frame(width: 38, height: 38)
                    Image(systemName: icon)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(tint)
                }
                VStack(alignment: .leading, spacing: 3) {
                    Text(title).font(Theme.FontStyle.headline).foregroundColor(Theme.text)
                    Text(subtitle).font(Theme.FontStyle.footnote).foregroundColor(Theme.subtext)
                        .lineLimit(2).multilineTextAlignment(.leading)
                }
                Spacer(minLength: 0)
            }
            .padding(14)
            .background(
                RoundedRectangle(cornerRadius: Theme.Radius.large, style: .continuous)
                    .fill(hovered ? Theme.mantle : Theme.mantle.opacity(0.55))
            )
            .overlay(
                RoundedRectangle(cornerRadius: Theme.Radius.large)
                    .strokeBorder(hovered ? tint.opacity(0.55) : Theme.hairline,
                                  lineWidth: hovered ? 1 : 0.5)
            )
            .scaleEffect(hovered ? 1.012 : 1.0)
            .shadow(color: hovered ? .black.opacity(0.18) : .clear, radius: 8, y: 3)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .onHover { hovered = $0 }
        .animation(.easeInOut(duration: 0.16), value: hovered)
    }
}

private struct RecentCard: View {
    let url: URL
    @EnvironmentObject var state: AppState
    @State private var hovered = false

    var body: some View {
        Button(action: { state.openFile(url) }) {
            HStack(spacing: 10) {
                Image(systemName: "doc.text.fill")
                    .font(.system(size: 18))
                    .foregroundColor(Theme.blue)
                VStack(alignment: .leading, spacing: 2) {
                    Text(CodexTree.prettyFilename(url.lastPathComponent))
                        .font(Theme.FontStyle.headline)
                        .foregroundColor(Theme.text)
                        .lineLimit(1)
                    Text(url.deletingLastPathComponent().lastPathComponent
                        .replacingOccurrences(of: "_", with: " "))
                        .font(Theme.FontStyle.footnote)
                        .foregroundColor(Theme.subtext)
                        .lineLimit(1)
                }
                Spacer(minLength: 0)
            }
            .padding(12)
            .background(
                RoundedRectangle(cornerRadius: Theme.Radius.medium)
                    .fill(hovered ? Theme.mantle : Theme.mantle.opacity(0.55))
            )
            .overlay(
                RoundedRectangle(cornerRadius: Theme.Radius.medium)
                    .strokeBorder(hovered ? Theme.blue.opacity(0.4) : Theme.hairline, lineWidth: 0.5)
            )
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .onHover { hovered = $0 }
    }
}

private struct BandCard: View {
    let band: CodexNode
    @EnvironmentObject var state: AppState
    @State private var hovered = false

    var body: some View {
        let tint = Theme.bandTint(band.label)
        let count = band.children.count

        Button(action: openFirst) {
            VStack(alignment: .leading, spacing: 10) {
                HStack(spacing: 10) {
                    ZStack {
                        RoundedRectangle(cornerRadius: 9, style: .continuous)
                            .fill(tint.opacity(0.18))
                            .frame(width: 38, height: 38)
                        Image(systemName: band.iconName)
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(tint)
                    }
                    VStack(alignment: .leading, spacing: 1) {
                        Text(band.label).font(Theme.FontStyle.headline).foregroundColor(Theme.text)
                        Text("\(count) layer\(count == 1 ? "" : "s")")
                            .font(Theme.FontStyle.footnote).foregroundColor(Theme.overlay1)
                    }
                    Spacer()
                }
                VStack(alignment: .leading, spacing: 3) {
                    ForEach(band.children.prefix(4)) { layer in
                        Text("• " + layer.label)
                            .font(.system(size: 11)).foregroundColor(Theme.subtext)
                            .lineLimit(1)
                    }
                    if band.children.count > 4 {
                        Text("… and \(band.children.count - 4) more")
                            .font(.system(size: 10)).foregroundColor(Theme.overlay1)
                    }
                }
            }
            .padding(14)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(
                RoundedRectangle(cornerRadius: Theme.Radius.large, style: .continuous)
                    .fill(hovered ? Theme.mantle : Theme.mantle.opacity(0.55))
            )
            .overlay(
                RoundedRectangle(cornerRadius: Theme.Radius.large)
                    .strokeBorder(hovered ? tint.opacity(0.55) : Theme.hairline, lineWidth: 0.5)
            )
            .scaleEffect(hovered ? 1.01 : 1.0)
            .shadow(color: hovered ? .black.opacity(0.16) : .clear, radius: 8, y: 3)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .onHover { hovered = $0 }
        .animation(.easeInOut(duration: 0.16), value: hovered)
    }

    private func openFirst() {
        if let first = band.children.first {
            // open the README/Overview of the first layer
            if let overview = first.children.first(where: { $0.kind == .readme }), let u = overview.url {
                state.openFile(u)
            } else if let u = first.url {
                let readme = u.appendingPathComponent("README.md")
                if FileManager.default.fileExists(atPath: readme.path) { state.openFile(readme) }
            }
        }
    }
}
