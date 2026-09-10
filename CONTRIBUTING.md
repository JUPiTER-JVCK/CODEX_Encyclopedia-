# Contributing

[STRUCTURE.md](STRUCTURE.md) says what the conventions are. This says how to
check you have followed them before opening a pull request.

Five scripts and one browser test cover most of the conventions here. All six
run in CI on every pull request, so anything they catch, they catch whether or
not you ran them — running them first just makes the round trip shorter.

**A green run is not a conformance proof.** Some conventions in
[STRUCTURE.md](STRUCTURE.md) have no audit behind them, and the two worth
knowing are the frontmatter block on content notes (`title`, `layer`,
`section`, `tags`, `updated`) and registering any new root directory in
`CodexTree.nonContentDirs`. Both are checked by a reader or not at all.

## Before opening a pull request

### If you touched markdown

```sh
python3 tools/link_audit.py --self-test   # H1 exemption covers templates only
python3 tools/link_audit.py      # relative links resolve; every file has an H1
python3 tools/table_audit.py     # pipe tables well-formed
python3 tools/title_audit.py     # section indexes titled "<Layer> — <Section>"
python3 tools/diagram_audit.py --self-test && python3 tools/diagram_audit.py
python3 tools/stats_audit.py     # README's own numbers still true
```

Each exits non-zero and names the file at fault. Where the fault has a line —
a malformed table row, an over-wide diagram — you get the line too; where it
does not, you get what identifies it instead: a broken link and its target, a
section index and the section it should name, a README claim and the number
the tree actually holds. No arguments needed — they find the repository root
themselves.

Three need a word of explanation:

- **`link_audit.py --self-test`** asserts that the H1 exemption covers the
  `.github/` templates and nothing adjacent to them. It exists because the
  first version of that rule was a prefix test that also exempted
  `pull_request_template.md.backup.md`.
- **`diagram_audit.py --self-test`** runs before the audit itself because the
  audit's fence parsing has been wrong twice. The self-test asserts the
  CommonMark fence rules directly, so a regression there fails loudly instead
  of quietly mis-reporting every diagram in the repo.
- **`stats_audit.py`** checks the counts README quotes about itself. If you
  add a file, a link, or a diagram, this will tell you which number to
  update. It also fails if you *reword* a claim past its pattern — that is
  deliberate, not a bug. A checker that silently stops checking is worse than
  no checker.

### If you touched the LMS

```sh
cd Codex_LMS
npm ci
npm run build
npm run smoke:local
```

`smoke:local` starts the preview server, waits for it to listen, runs the
Playwright test, and cleans up the whole process group. Beyond the reload
test it runs four guards: `simulator: true` must agree with whether a topic
renders a component that holds state; `onClick` may only sit on a `<button>`,
a component, or an element with `role="button"` plus `tabIndex` and a key
handler; all 43 topics must mount a widget without a page error; and Tab must
reach a real control that Enter then operates.

### If you touched the macOS app

```sh
cd Codex_macOS
swift build && swift build -c release
```

Needs a Mac with the Xcode command-line tools. CI builds both configurations
on `macos-14`, so a Linux contributor can let CI answer this one.

## Adding to the codex

- One note per concept, in the layer that owns the thing on the wire. Link
  rather than duplicate.
- Content notes open with YAML frontmatter (`title`, `layer`, `section`,
  `tags`, `updated`). Entry points — `INDEX.md`, `README.md` — carry none.
- Diagrams are fenced ASCII, at most 90 columns. Not images: fenced text
  diffs, renders identically on GitHub and in the macOS reader, and survives
  a terminal. Every layer README needs one showing where its layer sits.
- Anything added at the repository root that is not a layer must also be
  registered in `CodexTree.nonContentDirs`, or the macOS app treats it as one.

## What gets pushed back

Conventions here are enforced by scripts rather than by review comments,
which means a pull request that fails an audit fails visibly and specifically
rather than through someone noticing. If you think an audit is wrong, say so
in the pull request — three of them have been wrong before, twice in the same
function, and both times review caught what running the code did not.

Please do not disable, skip, or narrow a check to get a build green.

## Licensing

Contributions are accepted under the licenses the repository already uses:
MIT for `Codex_macOS/`, `Codex_LMS/` and `tools/`; CC BY-SA 4.0 for the
markdown codex. See [LICENSE](LICENSE) and [LICENSE-docs](LICENSE-docs).

Do not add third-party material to a `references/` folder unless you can say
where it came from and under what terms.
