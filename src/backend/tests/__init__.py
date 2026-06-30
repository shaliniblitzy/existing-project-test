"""Pytest test suite for the Python/Flask Hello World server.

This package contains the automated tests that prove behavioral parity of the
Python 3 / Flask rewrite with the original Node.js HTTP server. It ports the
former Jest + SuperTest suite (previously under ``src/backend/__tests__/``) to
pytest, exercising the application through Flask's built-in ``test_client``.

Layout
------
- ``tests.integration`` -- end-to-end checks of the ``/hello`` and ``/health``
  endpoints, the 404/405/500 error responses, and the security headers emitted
  on every response (the seven-row parity contract).
- ``tests.unit`` -- focused checks of the application factory, configuration,
  response helpers, error handlers, and in-memory metrics.

Shared fixtures (``app`` and ``client``) are provided by the sibling
``conftest.py`` module, not by this package marker.

This module is intentionally a bare package marker: it exists only so that
``tests`` is importable as a proper Python package, allowing pytest's import
machinery and relative test discovery to work consistently when the suite is
invoked from the ``src/backend`` working directory (matching the CI
configuration). It declares no imports, no fixtures, and no executable logic.

Run the suite from ``src/backend`` with::

    pytest
"""
