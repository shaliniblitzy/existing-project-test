"""Environment-driven configuration for the Python 3 / Flask Hello World service.

This module is the Python replacement for the two deleted Node.js configuration
files in the original project:

* ``src/backend/config/environment.js`` — parsed and validated the runtime
  environment variables (``PORT``, the environment-mode variable, and
  ``LOG_LEVEL``), applied sensible defaults, and exposed derived ``IS_*``
  environment-state flags.
* ``src/backend/config/index.js`` — merged the environment values with the
  static application metadata (``APP_NAME``, ``APP_VERSION``).

The migration preserves the original configuration *semantics* exactly while
adopting Flask conventions:

* The legacy Node environment-mode variable is retired (the Node toolchain is
  being removed). The runtime environment mode is now read from ``APP_ENV``
  (primary) with ``FLASK_ENV`` accepted as a backwards-compatible alias.
* Configuration is surfaced through a :class:`Config` class so the Flask
  application factory can consume it via ``app.config.from_object(Config)``
  (Flask copies only *UPPERCASE* attributes into ``app.config``).

Validation rules reproduced from the Node implementation:

* ``PORT`` must be an integer in the inclusive range ``1..65535``; any
  missing, non-numeric, or out-of-range value falls back to ``3000`` and emits
  a warning.
* The environment mode must be one of ``development``, ``production``, or
  ``test``; any other value falls back to ``development`` and emits a warning.
* ``LOG_LEVEL`` defaults to ``info`` when unset.

Only the Python standard library and ``python-dotenv`` are used here. Flask is
intentionally **not** imported to avoid an import cycle: the application factory
imports this module, never the reverse.
"""

import logging
import os

from dotenv import load_dotenv

# Load variables from a local ``.env`` file (if present) into ``os.environ``
# before any configuration values are read. This mirrors the Node ``dotenv``
# usage pattern and is a safe no-op when no ``.env`` file exists (typical in
# production/container deployments where variables are injected directly).
load_dotenv()

# Module-level logger. Using the standard library ``logging`` module reproduces
# the Node ``console.warn`` calls used by the original validation routines while
# integrating cleanly with the application's structured logging configuration.
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Defaults and valid value sets (ported verbatim from config/environment.js).
# ---------------------------------------------------------------------------

#: Default HTTP listening port. Must remain ``3000`` to agree with the
#: Dockerfile ``EXPOSE 3000``, the docker-compose ``curl /hello`` health check,
#: and the Terraform port variable.
_DEFAULT_PORT = 3000

#: Default runtime environment mode when none is supplied.
_DEFAULT_ENV = "development"

#: Default logging verbosity when ``LOG_LEVEL`` is unset.
_DEFAULT_LOG_LEVEL = "info"

#: The set of accepted runtime environment modes (formerly the Node
#: ``VALID_*_ENVS`` allow-list).
_VALID_ENVS = ("development", "production", "test")

#: Inclusive lower/upper bounds for a valid TCP port.
_MIN_PORT = 1
_MAX_PORT = 65535


def _validate_port(raw: "str | None") -> int:
    """Validate and normalize an HTTP port value.

    Reproduces the Node ``validatePort`` helper: the raw value is parsed as an
    integer and accepted only when it falls within the inclusive ``1..65535``
    range. Any value that is missing, non-numeric, or out of range results in a
    warning and a fall back to the default port (``3000``).

    Args:
        raw: The raw port value, typically ``os.environ.get("PORT")`` which is
            either a string or ``None``.

    Returns:
        A valid port number in ``[1, 65535]``, or ``3000`` when ``raw`` is
        invalid.
    """
    # ``int(None)`` raises TypeError and ``int("abc")``/``int("")`` raise
    # ValueError; both are caught here and fall back to the default port.
    try:
        port = int(raw)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        port = None

    if port is not None and _MIN_PORT <= port <= _MAX_PORT:
        return port

    # Invalid, missing, or out-of-range value: warn and use the default port.
    logger.warning(
        'Invalid PORT value: "%s". Using default port %d.', raw, _DEFAULT_PORT
    )
    return _DEFAULT_PORT


def _resolve_env(raw: "str | None") -> str:
    """Validate and normalize the runtime environment mode.

    Reproduces the Node environment-mode validation: the value is lower-cased
    (defaulting to ``development`` when unset/empty) and validated against the
    allowed set (``development``/``production``/``test``). Any other value emits
    a warning and falls back to ``development``.

    Args:
        raw: The raw environment value, typically
            ``os.environ.get("APP_ENV") or os.environ.get("FLASK_ENV")`` which
            is either a string or ``None``.

    Returns:
        One of ``"development"``, ``"production"``, or ``"test"``.
    """
    # ``(raw or _DEFAULT_ENV)`` treats both ``None`` and an empty string as
    # "unset", matching the Node ``process.env.<mode> || 'development'`` idiom.
    value = (raw or _DEFAULT_ENV).lower()

    if value not in _VALID_ENVS:
        logger.warning(
            'Invalid APP_ENV value: "%s". Using default environment "%s".',
            value,
            _DEFAULT_ENV,
        )
        return _DEFAULT_ENV

    return value


class Config:
    """Application configuration object consumed by the Flask factory.

    Exposes UPPERCASE attributes so that ``app.config.from_object(Config)``
    copies them into the Flask application config (Flask ignores non-uppercase
    names). Values are resolved once, at import time, from the process
    environment — mirroring the eager, frozen configuration object the Node
    application built at startup.
    """

    #: Validated HTTP listening port (default ``3000``).
    PORT = _validate_port(os.environ.get("PORT"))

    #: Resolved runtime environment mode. ``APP_ENV`` is primary; ``FLASK_ENV``
    #: is accepted as an alias. Both supersede the retired Node environment-mode
    #: variable.
    APP_ENV = _resolve_env(os.environ.get("APP_ENV") or os.environ.get("FLASK_ENV"))

    #: Logging verbosity level (raw string; mapped to a Python level by
    #: ``logging_config.py``). Defaults to ``info``.
    LOG_LEVEL = os.environ.get("LOG_LEVEL", _DEFAULT_LOG_LEVEL)

    #: Static application metadata (formerly in config/index.js). Renamed from
    #: the Node ``node-hello-world`` to a Python-appropriate name aligned with
    #: ``pyproject.toml``.
    APP_NAME = "hello-world-flask"

    #: Application version. Bumped from the Node ``1.0.0`` to ``2.0.0`` for the
    #: Node->Python/Flask migration (aligned with ``pyproject.toml``).
    APP_VERSION = "2.0.0"

    #: Derived environment-state flags (ported from the Node ``IS_*`` flags).
    IS_PRODUCTION = APP_ENV == "production"
    IS_DEVELOPMENT = APP_ENV == "development"
    IS_TEST = APP_ENV == "test"


# ---------------------------------------------------------------------------
# Module-level convenience constants.
#
# These mirror the :class:`Config` attributes so callers that prefer plain
# imports (``from app.config import PORT``) get the same resolved values. The
# authoritative interface remains the :class:`Config` class consumed by the
# Flask factory via ``from_object``.
# ---------------------------------------------------------------------------

PORT = Config.PORT
APP_ENV = Config.APP_ENV
LOG_LEVEL = Config.LOG_LEVEL
APP_NAME = Config.APP_NAME
APP_VERSION = Config.APP_VERSION
IS_PRODUCTION = Config.IS_PRODUCTION
IS_DEVELOPMENT = Config.IS_DEVELOPMENT
IS_TEST = Config.IS_TEST

#: Public API of this module.
__all__ = [
    "Config",
    "PORT",
    "APP_ENV",
    "LOG_LEVEL",
    "APP_NAME",
    "APP_VERSION",
    "IS_PRODUCTION",
    "IS_DEVELOPMENT",
    "IS_TEST",
]
