---
title: Python — language profile
layer: 08_User_Applications
section: languages
tags: [python, cpython, pip, venv, pytest, mypy, ruff]
updated: 2026-05-20
---

# Python — language profile

> CPython 3.x is on every Mac and most Linux distros by default. The ecosystem
> spans web apps, ML, automation, DevOps, scientific compute. **The 80/20 of
> day-to-day Python is `python3`, `pip`, `venv`, a linter, a formatter, and a
> test runner** — the table below is your man-page-style reference.

## Interpreter & launchers

| Command | Purpose | Notable flags |
|---------|---------|---------------|
| `python3` | The interpreter | `-c "<expr>"` run inline · `-m mod` run module · `-i script.py` enter REPL after · `-O` strip asserts |
| `python3 -m venv .venv` | Create virtual env | `--upgrade-deps` bootstrap pip |
| `python3 -m pip` | Pip without launcher | (preferred over bare `pip`) |
| `python3 -m site` | Show site-packages paths | `--user-base` user prefix |
| `pyenv` | Multi-version manager | `install 3.13.0` · `global 3.13.0` |
| `uv` | Astral's fast replacement for pip+venv | `uv venv` · `uv pip install` · `uv run` · `uv sync` |
| `pipx` | Install CLI tools in isolated envs | `pipx install black` |
| `ipython` | Enhanced REPL | tab complete, magics (`%timeit`, `%paste`) |
| `bpython` / `ptpython` | Alt REPLs | |
| `pythonw` | macOS GUI variant (no console window) | |

## Package management

| Command | Purpose |
|---------|---------|
| `pip install pkg` | Install (use `--user` outside venv) |
| `pip install -e .` | Editable / dev install of current package |
| `pip install -r requirements.txt` | From a file |
| `pip install --upgrade pkg` | Upgrade |
| `pip freeze > requirements.txt` | Lock current env |
| `pip list --outdated` | Show upgradable packages |
| `pip show pkg` | Show metadata + install location |
| `pip uninstall pkg` | Remove |
| `pip cache purge` | Clear download cache |
| `poetry`, `pdm`, `hatch`, `uv` | Modern project managers (lockfiles + builds) |

## Linting / formatting / type-checking

| Tool | Use | Config |
|------|-----|--------|
| `ruff check .` | Linter (very fast, replaces flake8 / isort / many) | `pyproject.toml [tool.ruff]` |
| `ruff format .` | Formatter (PEP 8 + Black-compatible) | same |
| `black .` | Opinionated formatter | `pyproject.toml [tool.black]` |
| `isort .` | Import sorter (use `ruff` instead) | |
| `mypy .` | Static type checker | `mypy.ini` or `pyproject.toml` |
| `pyright` | Microsoft's type checker (used by Pylance) | `pyrightconfig.json` |
| `pylint` | Comprehensive linter (slower) | `.pylintrc` |
| `bandit -r .` | Security linter | |

## Testing

| Tool | Use |
|------|-----|
| `pytest` | De-facto test runner. `-v` verbose, `-x` stop on first fail, `-k pattern`, `-s` show prints |
| `pytest --cov` | Coverage via `pytest-cov` |
| `python -m unittest` | Stdlib test runner |
| `hypothesis` | Property-based testing |
| `nox`, `tox` | Multi-env test orchestration |
| `coverage run` / `coverage report` | Standalone coverage |

## Debugging / profiling

| Tool | Use |
|------|-----|
| `python -m pdb script.py` | Stdlib debugger |
| `breakpoint()` in code | Drop into pdb at runtime (3.7+) |
| `python -X dev script.py` | Dev mode — extra warnings |
| `python -X tracemalloc=10 script.py` | Memory tracker |
| `python -m cProfile -s cumulative script.py` | Stdlib profiler |
| `py-spy top --pid <pid>` | Sampling profiler (no instrumentation) |
| `austin` | Frame profiler |
| `scalene` | CPU + memory + GPU profiler |
| `memory_profiler` | Line-by-line memory |
| `objgraph` | Memory-leak hunting |

## Build / distribution

| Tool | Use |
|------|-----|
| `python -m build` | Build sdist + wheel (uses `pyproject.toml`) |
| `twine upload dist/*` | Upload to PyPI |
| `pyinstaller`, `nuitka`, `pyoxidizer` | Bundle to a binary |
| `setuptools`, `flit`, `hatchling`, `poetry-core` | Build backends |
| `cibuildwheel` | Multi-platform wheels in CI |

## Stdlib map (the 80/20)

| Module | When you reach for it |
|--------|----------------------|
| `argparse` / `click` / `typer` | CLI argument parsing |
| `pathlib` | Modern path handling (use over `os.path`) |
| `subprocess` | Shell out (use `subprocess.run` with `check=True`) |
| `json` | JSON I/O |
| `csv` | Simple CSV (use `pandas` for analysis) |
| `re` | Regex |
| `collections` | `Counter`, `defaultdict`, `deque`, `namedtuple`, `OrderedDict` |
| `dataclasses` | Boilerplate-free record classes (3.7+) |
| `typing` | `Optional`, `Union`, `List`, `Dict`, `Callable`, `Protocol`, `TYPE_CHECKING` |
| `functools` | `lru_cache`/`cache`, `partial`, `reduce`, `cmp_to_key`, `singledispatch` |
| `itertools` | `chain`, `combinations`, `permutations`, `product`, `groupby`, `accumulate` |
| `concurrent.futures` | Thread/process pools (high-level) |
| `asyncio` | `async`/`await` event loop |
| `multiprocessing` | True parallel via processes (sidesteps GIL) |
| `threading` | Threads (still GIL-bound for CPU work) |
| `logging` | Production logging (configure once at root) |
| `enum` | Type-safe enums |
| `contextlib` | `contextmanager`, `suppress`, `ExitStack` |
| `unittest.mock` | Mocking in tests |
| `tempfile`, `shutil`, `glob`, `os`, `sys` | Filesystem + process |
| `datetime`, `zoneinfo` | Dates & times (use `zoneinfo` over `pytz`) |
| `urllib.request` / `urllib.parse` | Basic HTTP / URL utils |
| `socket`, `ssl`, `http.client`, `http.server` | Low-level networking |
| `sqlite3` | Embedded DB |

## Async / web / data essentials (3rd party)

| Library | Use |
|---------|-----|
| `requests` / `httpx` | HTTP clients (`httpx` adds async) |
| `aiohttp` | Async HTTP + server |
| `fastapi`, `flask`, `django`, `starlette` | Web frameworks |
| `pydantic` | Data validation + settings |
| `pandas`, `polars`, `pyarrow`, `duckdb` | Tabular data |
| `numpy`, `scipy` | Numerical |
| `matplotlib`, `seaborn`, `plotly` | Plotting |
| `sqlalchemy` | ORM / SQL toolkit |
| `pytest`, `hypothesis`, `freezegun` | Testing |
| `loguru` | Drop-in replacement for `logging` (simpler) |
| `rich` | Pretty terminal output |
| `tqdm` | Progress bars |
| `paramiko`, `fabric` | SSH |
| `boto3` | AWS SDK |

## Pythonic patterns / idioms

- **EAFP over LBYL** — try/except over "look before you leap"
- **Truthiness over equality** — `if not x:` over `if x == 0` for collections
- **Context managers** for resources (`with open(...) as f`)
- **Generators** for streaming — `yield`, `(x for x in ...)`
- **List/dict/set comprehensions** when they fit on one line
- **`enumerate()`** over `range(len(...))`
- **`zip()`** for parallel iteration
- **f-strings** over `.format()` or `%`
- **`__main__` guard** — `if __name__ == "__main__":`
- **Type hints** even in scripts — IDE + future maintainability

## Common gotchas

- **Mutable default args** — `def f(x=[]): x.append(1); return x` accumulates across calls. Use `None` + assign inside.
- **Late binding in closures** — `[lambda: i for i in range(3)]` all return 2. Use `lambda i=i: i`.
- **`is` vs `==`** — `is` checks identity, not equality. Use `==` for value comparison (except `is None`).
- **GIL** — threads don't run Python bytecode in parallel; use `multiprocessing` or async for CPU-bound parallelism.
- **`from x import *`** — pollutes namespace; only `__all__`-listed names exported.
- **Circular imports** — refactor to a `_common` module or use `TYPE_CHECKING` for type-only imports.
- **`__init__.py` and packages** — modern Python (3.3+) supports implicit namespace packages, but explicit `__init__.py` is still clearest.
- **Encoding** — always pass `encoding="utf-8"` to `open()` for cross-platform portability.

## Performance escape hatches

1. **NumPy / Pandas vectorization** — order of magnitude over pure Python loops
2. **Cython / mypyc** — compile to C
3. **Numba `@jit`** — JIT-compile numeric functions
4. **C extension via `ctypes` / `cffi`** — call native code
5. **PyPy** — JIT'd Python (drop-in for many programs, no C extensions issues mostly)
6. **`multiprocessing.Pool.map`** for embarrassingly parallel work
7. **`asyncio` + `httpx`** for I/O-bound concurrency

## Versions

| Version | Notable additions |
|---------|-------------------|
| 3.8 | Walrus `:=`, positional-only `/`, `Literal`, `Final`, `TypedDict` |
| 3.9 | `dict | dict` merge, `list[int]` generic builtins, `zoneinfo` |
| 3.10 | `match` statement, `X | Y` type union, parenthesized context managers |
| 3.11 | ~10-60% faster, exception groups + `except*`, `tomllib` |
| 3.12 | f-string grammar overhaul, type-param syntax, `@override` |
| 3.13 | Free-threaded build (no-GIL preview), JIT (experimental), iOS/Android tier-3 |

## Cross-references
- Runtime internals → [07_Runtime_Environment/topics](../../07_Runtime_Environment/topics/INDEX.md) (CPython, PyPy)
- Embedded Python (MicroPython / CircuitPython) → [18_Embedded_Systems/languages/embedded_python.md](../../18_Embedded_Systems/languages/embedded_python.md)
- Python for ML → [15_AI_ML/languages](../../15_AI_ML/languages/INDEX.md)
- Python for algorithms / interviews → [17_Algorithms_DSA/languages](../../17_Algorithms_DSA/languages/INDEX.md)
