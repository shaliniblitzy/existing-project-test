"""Unit test package for the Python 3 / Flask Hello World backend parity suite.

This module is a bare package marker. Its sole purpose is to make
``src/backend/tests/unit`` an importable Python package so that pytest's default
"prepend" import mode resolves the absolute ``from app ...`` imports used by the
sibling ``test_*.py`` modules (for example ``from app import create_app``,
``from app.config import Config``, and ``from app.metrics import ...``).

With both ``tests/__init__.py`` and this ``tests/unit/__init__.py`` present,
pytest walks up from a collected test module to the first ancestor directory
that has no ``__init__.py`` -- ``src/backend`` -- and inserts it at the front of
``sys.path``. That is what allows the absolute ``app.*`` imports to resolve when
the suite is run from the ``src/backend`` working directory (matching the CI
configuration).

It mirrors the sibling package markers ``tests/__init__.py`` and
``tests/integration/__init__.py``. It intentionally declares no imports, no
fixtures, and no executable logic; the shared ``app`` and ``client`` fixtures
are provided by ``tests/conftest.py``.
"""
