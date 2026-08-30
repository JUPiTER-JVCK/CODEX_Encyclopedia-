---
title: "User Applications — Interactive Labs"
layer: 08_User_Applications
section: lessons
tags: [lesson, cli, tui, shell, packaging, lab, quiz, hands-on]
updated: 2026-05-21
---

# User Applications — Interactive Labs

---

## Module 1: Build a CLI Tool (Python)

### Objective

Create a polished command-line tool with argument parsing, colored output,
and installable packaging.

### Prerequisites

- Python 3.10+, `pip`
- `click` or `argparse`, `rich` for formatting

### Lab Steps

1. Create project structure:
```
mytool/
├── pyproject.toml
├── src/
│   └── mytool/
│       ├── __init__.py
│       └── cli.py
└── README.md
```

2. Write the CLI (`src/mytool/cli.py`):
```python
import click
from rich.console import Console
from rich.table import Table

console = Console()

@click.group()
@click.version_option("1.0.0")
def cli():
    """My awesome CLI tool."""
    pass

@cli.command()
@click.argument("path", type=click.Path(exists=True))
@click.option("--sort", "-s", type=click.Choice(["name", "size", "date"]),
              default="name", help="Sort order")
def list(path, sort):
    """List files in PATH with details."""
    import os
    table = Table(title=f"Files in {path}")
    table.add_column("Name", style="cyan")
    table.add_column("Size", justify="right", style="green")
    table.add_column("Type", style="yellow")
    
    entries = os.scandir(path)
    for entry in sorted(entries, key=lambda e: e.name):
        size = entry.stat().st_size if entry.is_file() else "-"
        ftype = "DIR" if entry.is_dir() else "FILE"
        table.add_row(entry.name, str(size), ftype)
    
    console.print(table)

if __name__ == "__main__":
    cli()
```

3. Configure `pyproject.toml`:
```toml
[project]
name = "mytool"
version = "1.0.0"
dependencies = ["click>=8.0", "rich>=13.0"]

[project.scripts]
mytool = "mytool.cli:cli"

[build-system]
requires = ["setuptools>=68.0"]
build-backend = "setuptools.backends._legacy:_Backend"
```

4. Install and test:
```bash
pip install -e .
mytool --version
mytool list /tmp --sort size
```

### Knowledge Check

**Q1**: What does `pip install -e .` do?

> **A1**: Editable install — creates a link to your source directory so
> changes take effect immediately without reinstalling. The `-e` flag
> is for development; use `pip install .` for production.

**Q2**: What is `pyproject.toml` and why use it over `setup.py`?

> **A2**: `pyproject.toml` is the modern Python packaging standard (PEP 621).
> It declares metadata, dependencies, and build system in one file.
> `setup.py` is legacy and being phased out.

---

## Module 2: TUI File Picker (Textual)

### Objective

Build a terminal UI application with keyboard navigation, file browsing,
and live preview using the Textual framework.

### Prerequisites

- Python 3.10+, `textual` library

### Lab Steps

1. Create `file_picker.py`:
```python
from textual.app import App, ComposeResult
from textual.widgets import DirectoryTree, Footer, Header, Static
from textual.containers import Horizontal

class FilePicker(App):
    CSS = """
    DirectoryTree { width: 1fr; }
    #preview { width: 2fr; overflow-y: auto; }
    """
    BINDINGS = [("q", "quit", "Quit")]
    
    def compose(self) -> ComposeResult:
        yield Header()
        with Horizontal():
            yield DirectoryTree(".", id="tree")
            yield Static("Select a file to preview", id="preview")
        yield Footer()
    
    def on_directory_tree_file_selected(self, event):
        try:
            content = event.path.read_text(errors="replace")[:5000]
            self.query_one("#preview").update(content)
        except Exception as e:
            self.query_one("#preview").update(f"Error: {e}")

if __name__ == "__main__":
    FilePicker().run()
```

2. Run:
```bash
pip install textual
python file_picker.py
```

3. Enhance: add syntax highlighting with `rich.syntax`, search with
   `Input` widget, and file operations (copy path, open in editor)

### Knowledge Check

**Q1**: What is the difference between a CLI and a TUI?

> **A1**: A CLI processes commands and exits (one-shot). A TUI runs
> persistently with interactive widgets (trees, tables, inputs) — the
> user navigates and interacts without typing commands. Both run in
> a terminal.

---

## Module 3: Package & Distribute

### Objective

Package a Python tool as a wheel, publish to PyPI (or TestPyPI), and
install from the registry.

### Lab Steps

1. Build the package:
```bash
pip install build
python -m build
# Creates:
#   dist/mytool-1.0.0.tar.gz     (source distribution)
#   dist/mytool-1.0.0-py3-none-any.whl  (wheel)
```

2. Upload to TestPyPI:
```bash
pip install twine
twine upload --repository testpypi dist/*
```

3. Install from TestPyPI:
```bash
pip install --index-url https://test.pypi.org/simple/ mytool
mytool --version
```

### Distribution options

```
  Source distribution (.tar.gz)
  └── Contains source code, built on install
  
  Wheel (.whl)
  └── Pre-built, fast install, no compilation needed
  
  PyPI / TestPyPI
  └── Public package registry (pip install <name>)
  
  pipx
  └── Install CLI tools in isolated environments
  
  Docker image
  └── Ship with all dependencies included
  
  Homebrew formula
  └── macOS/Linux package manager distribution
```

### Review Flashcards

| Term | Definition |
|------|-----------|
| CLI | Command-Line Interface — one-shot command execution |
| TUI | Terminal User Interface — persistent interactive app |
| Click | Python library for building CLI tools |
| Rich | Python library for beautiful terminal formatting |
| Textual | Python TUI framework built on Rich |
| pyproject.toml | Modern Python project configuration file |
| Wheel (.whl) | Pre-built Python package format |
| Entry point | Script name → function mapping for installable CLIs |
| pipx | Install Python CLI tools in isolated environments |

### Challenge

> Create a CLI tool that queries a public API (e.g., weather, GitHub
> issues, or Hacker News). Add caching (with TTL), pretty-printed
> output (tables, colors), and a `--json` flag for machine-readable
> output. Package it and install with `pipx`.

---

## Cross-links

- Shell commands → [../man_pages/shell_commands.md](../man_pages/shell_commands.md)
- Text processing → [../man_pages/text_processing.md](../man_pages/text_processing.md)
- Package managers → [../man_pages/package_managers.md](../man_pages/package_managers.md)
