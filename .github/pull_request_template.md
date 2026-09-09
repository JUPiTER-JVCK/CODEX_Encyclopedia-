## What this changes

<!-- What is different afterwards, and why. Link an issue if there is one. -->

## Checks

Run what your change touches. All of these also run in CI — ticking a box you
did not run is worse than leaving it blank.

**Markdown / the codex**

- [ ] `python3 tools/link_audit.py`
- [ ] `python3 tools/table_audit.py`
- [ ] `python3 tools/title_audit.py`
- [ ] `python3 tools/diagram_audit.py --self-test && python3 tools/diagram_audit.py`
- [ ] `python3 tools/stats_audit.py`

**The LMS** (`Codex_LMS/`)

- [ ] `npm ci && npm run build`
- [ ] `npm run smoke:local`

**The macOS app** (`Codex_macOS/`) — needs a Mac; CI covers it otherwise

- [ ] `swift build && swift build -c release`

## Not verified

<!-- What you did NOT check, and would not claim. A change that renders
     correctly is not a change that reads well; a control that is focusable
     is not a control a screen reader announces sensibly. Say which is
     which — an honest gap here is worth more than a full set of ticks. -->

## Notes for review

<!-- Anything you are unsure about, or would like a second opinion on.
     If an audit disagreed with you and you think it is wrong, say so here
     rather than working around it. -->
