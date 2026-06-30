"""pytest integration-test package — behavioral-parity proofs for the Flask backend.

These integration tests are the single most important proof that the Flask
rewrite preserves the original Node.js server's externally observable behavior
(status codes, content types, response bodies, and security headers). Shared
``app`` and ``client`` fixtures are provided by ``tests/conftest.py``.
"""
