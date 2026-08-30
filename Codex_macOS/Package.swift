// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "Codex",
    platforms: [.macOS(.v13)],
    products: [
        .executable(name: "Codex", targets: ["Codex"]),
    ],
    targets: [
        .executableTarget(
            name: "Codex",
            path: "Sources/Codex",
            resources: [],
            swiftSettings: [
                .unsafeFlags(["-parse-as-library"]),
            ]
        ),
    ]
)
