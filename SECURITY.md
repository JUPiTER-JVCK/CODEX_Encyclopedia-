# Security

## Reporting a vulnerability

Report privately through GitHub's
[security advisory form](https://github.com/JUPiTER-JVCK/CODEX_Encyclopedia-/security/advisories/new)
rather than opening a public issue.

Please include what you did, what happened, and what you expected. A proof of
concept helps but is not required.

## Scope — what could actually go wrong here

This is a documentation repository with two local reader applications. It has
no server, no accounts, no network service, and stores nothing about anyone.
That rules out most of what a security policy usually covers, so it is worth
being specific about what is left:

- **`Codex_LMS/`** is a static single-page React app. It stores learning
  progress in `localStorage` under one key and sends nothing anywhere. Its
  only network request is a Google Fonts stylesheet, which it works without.
  A finding here would most likely be a dependency advisory — `npm audit`
  runs in CI on every pull request.
- **`Codex_macOS/`** reads markdown from disk and renders it. It parses
  untrusted input in the sense that it will open any file you point it at, so
  a malformed document causing a crash or worse is in scope.
- **`tools/`** are audit scripts run by maintainers and CI over repository
  content. They read files and print; they do not execute what they read.

Out of scope: the accuracy of the codex's technical content. Errors there are
ordinary bugs — open an issue.

## Supported versions

The most recent release. This is a single-branch project with no backports.
