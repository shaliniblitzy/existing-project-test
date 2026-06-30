"""HTTP status codes and error message strings for the Flask backend.

This module is the Python 3 / Flask replacement for the two Node.js (CommonJS)
constant modules that previously lived under ``src/backend/constants/``:

* ``constants/http-status.js`` -> the ``HTTP_*`` integer status codes below.
* ``constants/error-messages.js`` -> the ``MSG_*`` error message strings below.

They are consolidated into this single module as part of the Node.js -> Python 3
/ Flask migration (see the Technical Specification / Agent Action Plan,
Section 0.6.1).

Behavioral parity is the governing constraint of the migration: the error
message strings defined here are emitted verbatim in HTTP response bodies, so
their exact, byte-for-byte values (capitalization, spacing, and punctuation) are
part of the externally observable HTTP contract and MUST NOT change. They are
asserted -- directly and indirectly through endpoint behavior -- by the parity
test suite (``tests/unit/test_responses.py``, ``tests/unit/test_errors.py``, and
the integration tests covering the 404/405/500 responses).

The module is intentionally dependency-free: it imports nothing -- no standard
library modules and, critically, no third-party packages such as Flask. Keeping
it free of imports makes it safe for every other ``app`` module
(``app.responses``, ``app.errors``, ``app.blueprints.*``) to import these
constants without any risk of circular imports.

Typical usage by downstream modules (absolute imports)::

    from app.constants import HTTP_OK, MSG_NOT_FOUND

The :data:`HTTP_STATUS` and :data:`ERROR_MESSAGES` grouping dictionaries mirror
the shape of the original Node export objects and are provided for ergonomic,
namespaced access. They are derived from the individual module-level constants
so the two representations can never drift apart.
"""

# ---------------------------------------------------------------------------
# HTTP status codes
# ---------------------------------------------------------------------------
# Mirror of the Node ``constants/http-status.js`` ``HTTP_STATUS`` object. Using
# named constants instead of magic numbers keeps routing, response helpers, and
# error handlers readable and consistent across the application.

#: 200 OK -- the request has succeeded. Used for the ``GET /hello`` and
#: ``GET /health`` success responses.
HTTP_OK = 200

#: 404 Not Found -- the server cannot find the requested resource. Used when a
#: client requests an undefined/unmatched route.
HTTP_NOT_FOUND = 404

#: 405 Method Not Allowed -- the request method is not supported by the target
#: resource. Used when a client uses a non-GET method on ``/hello`` or
#: ``/health``.
HTTP_METHOD_NOT_ALLOWED = 405

#: 500 Internal Server Error -- the server encountered an unexpected condition.
#: Used for unhandled errors and other server-side failures.
HTTP_INTERNAL_SERVER_ERROR = 500


# ---------------------------------------------------------------------------
# Error message strings
# ---------------------------------------------------------------------------
# Mirror of the Node ``constants/error-messages.js`` ``ERROR_MESSAGES`` object.
# These strings are written directly into ``text/plain`` HTTP response bodies,
# so the exact values are part of the externally observable contract. Do not
# alter their capitalization, spacing, or punctuation.

#: Body returned for 404 (Not Found) responses.
MSG_NOT_FOUND = "Not Found"

#: Body returned for 405 (Method Not Allowed) responses.
MSG_METHOD_NOT_ALLOWED = "Method Not Allowed"

#: Body returned for 500 (Internal Server Error) responses.
MSG_INTERNAL_SERVER_ERROR = "Internal Server Error"

#: Generic fallback message used when no more specific error message applies.
MSG_DEFAULT_ERROR = "Something went wrong"


# ---------------------------------------------------------------------------
# Grouping dictionaries (ergonomic, namespaced access)
# ---------------------------------------------------------------------------
# These mirror the original Node export objects one-to-one. Each value is
# referenced from the individual constants defined above so that the two
# representations are guaranteed to stay in sync.

#: Mapping of symbolic names to HTTP status codes (mirror of the Node
#: ``HTTP_STATUS`` object).
HTTP_STATUS = {
    "OK": HTTP_OK,
    "NOT_FOUND": HTTP_NOT_FOUND,
    "METHOD_NOT_ALLOWED": HTTP_METHOD_NOT_ALLOWED,
    "INTERNAL_SERVER_ERROR": HTTP_INTERNAL_SERVER_ERROR,
}

#: Mapping of symbolic names to error message strings (mirror of the Node
#: ``ERROR_MESSAGES`` object).
ERROR_MESSAGES = {
    "NOT_FOUND": MSG_NOT_FOUND,
    "METHOD_NOT_ALLOWED": MSG_METHOD_NOT_ALLOWED,
    "INTERNAL_SERVER_ERROR": MSG_INTERNAL_SERVER_ERROR,
    "DEFAULT_ERROR": MSG_DEFAULT_ERROR,
}


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------
#: Explicit public surface of this module. Documents exactly what downstream
#: modules may rely on and keeps ``from app.constants import *`` predictable.
__all__ = [
    # HTTP status codes
    "HTTP_OK",
    "HTTP_NOT_FOUND",
    "HTTP_METHOD_NOT_ALLOWED",
    "HTTP_INTERNAL_SERVER_ERROR",
    # Error message strings
    "MSG_NOT_FOUND",
    "MSG_METHOD_NOT_ALLOWED",
    "MSG_INTERNAL_SERVER_ERROR",
    "MSG_DEFAULT_ERROR",
    # Grouping dictionaries
    "HTTP_STATUS",
    "ERROR_MESSAGES",
]
