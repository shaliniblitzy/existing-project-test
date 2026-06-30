"""In-memory health metrics for the Flask application (uptime, memory, counters).

This module is the Python port of the metrics portion of the original Node.js
``handlers/health-handler.js`` (lines 19-22 for state initialisation and lines
86-107 for the uptime / memory computation). It is intentionally a
**dependency-free** module that uses only the Python standard library, so it can
be imported safely from the ``/health`` blueprint (``app/blueprints/health.py``)
and from the application-factory hooks without pulling in Flask or any
third-party package.

Behavioural parity
------------------
The ``/health`` JSON payload must preserve the *exact* shape and string format of
the original Node implementation (Technical Specification / AAP, parity row 3)::

    {
        "status": "ok",
        "uptime": <int seconds>,
        "memory": {
            "rss":       "<n.nn> MB",
            "heapTotal": "<n.nn> MB",
            "heapUsed":  "<n.nn> MB",
            "external":  "<n.nn> MB"
        },
        "metrics": {
            "requestCount": <int>,
            "errorCount":   <int>
        }
    }

The four ``memory`` values mirror Node's ``(bytes / 1024 / 1024).toFixed(2) + ' MB'``
formatting exactly (two decimals, a space, then ``MB``). Because the original
keys are V8-specific, each is mapped to the nearest Python standard-library
metric:

* ``rss``       -> process resident set size (current RSS via ``/proc/self/statm``,
  falling back to ``resource.getrusage`` peak RSS, then ``0.0``).
* ``heapUsed``  -> ``tracemalloc.get_traced_memory()[0]`` (current traced bytes).
* ``heapTotal`` -> ``tracemalloc.get_traced_memory()[1]`` (peak traced bytes; this
  guarantees ``heapTotal >= heapUsed`` exactly like Node's relationship).
* ``external``  -> ``0.0`` bytes (no Python equivalent) -> ``"0.00 MB"``.

Counters
--------
``request_count`` and ``error_count`` are process-global, module-scope singletons
exactly like the original Node module-scope ``let`` variables — they are the
single source of truth and are deliberately **not** stored on Flask's ``g`` or in
any request-scoped state. In the committed Node source the increment functions
existed but were never wired into the active runtime, so the counters stayed at
``0``. The Flask migration wires them up: the application factory's
``before_request`` hook calls :func:`increment_request_count` and the error
handlers call :func:`increment_error_count`. The ``/health`` integration test
asserts *types and structure* (integers / shape), not fixed values, so wiring the
counters is parity-safe.

Public API
----------
The following names are stable and are relied upon by the blueprint and factory
modules:

* :func:`increment_request_count` -> ``int``
* :func:`increment_error_count`   -> ``int``
* :func:`get_request_count`       -> ``int``
* :func:`get_error_count`         -> ``int``
* :func:`reset_counts`            -> ``None``  (test helper)
* :func:`get_uptime_seconds`      -> ``int``
* :func:`get_memory_usage`        -> ``dict`` of ``str`` -> ``str``
* :func:`get_metrics`             -> ``dict`` of ``str`` -> ``int``
* :func:`build_health_payload`    -> ``dict``

The module performs no I/O at import time other than (idempotently) starting
``tracemalloc`` so the heap figures are populated for the lifetime of the
process.
"""

from __future__ import annotations

import math
import os
import time
import tracemalloc

try:  # ``resource`` is POSIX-only; it is absent on some platforms (e.g. Windows).
    import resource as _resource
except ImportError:  # pragma: no cover - exercised only on non-POSIX platforms.
    _resource = None  # type: ignore[assignment]


__all__ = [
    "increment_request_count",
    "increment_error_count",
    "get_request_count",
    "get_error_count",
    "reset_counts",
    "get_uptime_seconds",
    "get_memory_usage",
    "get_metrics",
    "build_health_payload",
]


# ---------------------------------------------------------------------------
# Module-level state (process-global singletons; initialised once at import).
#
# Mirrors the original Node module scope:
#     const startTime = new Date();
#     let requestCount = 0;
#     let errorCount = 0;
# ---------------------------------------------------------------------------

# A monotonic clock is used for uptime so the value never goes backwards if the
# system wall-clock is adjusted. The contract is the whole-second floor of the
# elapsed time since the process started.
_START_TIME: float = time.monotonic()

_request_count: int = 0
_error_count: int = 0

# Conversion divisor: bytes per mebibyte (1024 * 1024), matching Node's
# ``/ 1024 / 1024`` byte-to-MB conversion.
_BYTES_PER_MB: int = 1024 * 1024


def _ensure_tracemalloc_started() -> None:
    """Start ``tracemalloc`` once, idempotently, and without ever raising.

    Starting the tracer at import time means :func:`get_memory_usage` can report
    meaningful ``heapUsed`` / ``heapTotal`` figures. If the tracer cannot be
    started for any reason the failure is swallowed: the heap figures simply
    report ``"0.00 MB"`` and the ``/health`` endpoint continues to function.
    """
    try:
        if not tracemalloc.is_tracing():
            tracemalloc.start()
    except Exception:  # pragma: no cover - defensive; tracemalloc.start rarely fails.
        pass


# Begin tracing as early as possible so heap statistics are available for the
# entire process lifetime. Guarded so a failure here can never break import.
_ensure_tracemalloc_started()


# ---------------------------------------------------------------------------
# Counters
# ---------------------------------------------------------------------------


def increment_request_count() -> int:
    """Increment the global request counter and return the new value.

    Port of Node ``incrementRequestCount()`` (``return ++requestCount;``). Wired
    into the Flask application factory's ``before_request`` hook so every handled
    request advances the counter.
    """
    global _request_count
    _request_count += 1
    return _request_count


def increment_error_count() -> int:
    """Increment the global error counter and return the new value.

    Port of Node ``incrementErrorCount()`` (``return ++errorCount;``). Wired into
    the Flask error handlers (404 / 405 / 500) so every error response advances
    the counter.
    """
    global _error_count
    _error_count += 1
    return _error_count


def get_request_count() -> int:
    """Return the current request count."""
    return _request_count


def get_error_count() -> int:
    """Return the current error count."""
    return _error_count


def reset_counts() -> None:
    """Reset both counters to zero.

    Provided so unit tests can establish a deterministic starting state between
    cases. It is not used by the running application.
    """
    global _request_count, _error_count
    _request_count = 0
    _error_count = 0


# ---------------------------------------------------------------------------
# Uptime
# ---------------------------------------------------------------------------


def get_uptime_seconds() -> int:
    """Return whole seconds elapsed since process start.

    Port of Node ``getUptimeInSeconds()`` which computes
    ``Math.floor((now - startTime) / 1000)``. The result is clamped to be
    non-negative: the monotonic clock is non-decreasing, but the clamp makes the
    contract — a non-negative integer second count — explicit and defensive.
    """
    elapsed = time.monotonic() - _START_TIME
    return max(0, math.floor(elapsed))


# ---------------------------------------------------------------------------
# Memory
# ---------------------------------------------------------------------------


def _fmt_mb(num_bytes: float) -> str:
    """Format a byte count as a ``"<n.nn> MB"`` string.

    Mirrors Node's ``(bytes / 1024 / 1024).toFixed(2) + ' MB'`` exactly: two
    decimal places, a single space, then the literal ``MB``. The result always
    matches the regular expression ``^\\d+\\.\\d{2} MB$``.
    """
    return f"{num_bytes / _BYTES_PER_MB:.2f} MB"


def _get_rss_bytes() -> float:
    """Return the process resident set size (RSS) in bytes.

    Strategy (Linux-first, with graceful fallbacks):

    1. Read the *current* RSS from ``/proc/self/statm`` — field index 1
       (resident pages) multiplied by the system page size. This is the closest
       analogue to Node's ``process.memoryUsage().rss`` (which reports current
       RSS) and is the primary source on the Linux deployment target.
    2. Fall back to ``resource.getrusage(RUSAGE_SELF).ru_maxrss`` (peak RSS). On
       Linux this is reported in kibibytes, so it is multiplied by 1024.
    3. Fall back to ``0.0`` if neither source is available.

    Never raises: every branch is guarded so the caller always receives a float.
    """
    # Preferred: current RSS from /proc (Linux).
    try:
        page_size = os.sysconf("SC_PAGE_SIZE")
        with open("/proc/self/statm", "r", encoding="ascii") as statm:
            resident_pages = int(statm.read().split()[1])
        return float(resident_pages * page_size)
    except Exception:
        pass

    # Fallback: peak RSS via the POSIX ``resource`` module.
    try:
        if _resource is not None:
            ru_maxrss = _resource.getrusage(_resource.RUSAGE_SELF).ru_maxrss
            # Linux reports kibibytes; convert to bytes. (On macOS ``ru_maxrss``
            # is already bytes, but the primary /proc path is used on the Linux
            # deployment target, and the contract only requires a valid
            # RSS-shaped figure rather than identical byte values across OSes.)
            return float(ru_maxrss * 1024)
    except Exception:
        pass

    return 0.0


def _get_heap_bytes() -> tuple[float, float]:
    """Return ``(current, peak)`` traced heap bytes via ``tracemalloc``.

    Returns ``(0.0, 0.0)`` if tracing is not active or measurement fails, which
    formats as ``"0.00 MB"`` and preserves structural parity. Never raises.
    """
    try:
        current, peak = tracemalloc.get_traced_memory()
        return float(current), float(peak)
    except Exception:
        return 0.0, 0.0


def get_memory_usage() -> dict:
    """Return formatted memory statistics matching the Node ``/health`` shape.

    Port of Node ``getMemoryUsage()``. Returns a dict with exactly the four keys
    ``rss``, ``heapTotal``, ``heapUsed`` and ``external`` (in that order), each a
    ``"<n.nn> MB"`` string.

    Key mapping (V8 -> Python):

    * ``rss``       -> process resident set size (see :func:`_get_rss_bytes`).
    * ``heapUsed``  -> current ``tracemalloc`` traced bytes.
    * ``heapTotal`` -> peak ``tracemalloc`` traced bytes (always ``>= heapUsed``).
    * ``external``  -> ``0.0`` (no direct Python equivalent).

    The whole computation is defensive: any measurement failure degrades to
    ``"0.00 MB"`` rather than raising, so the ``/health`` endpoint can never
    return ``500`` because of metric collection.
    """
    try:
        rss_bytes = _get_rss_bytes()
        heap_used_bytes, heap_total_bytes = _get_heap_bytes()
        # ``external`` has no Python equivalent; report 0.0 bytes for structural
        # parity (mirrors a process with no tracked off-heap allocations).
        external_bytes = 0.0
        return {
            "rss": _fmt_mb(rss_bytes),
            "heapTotal": _fmt_mb(heap_total_bytes),
            "heapUsed": _fmt_mb(heap_used_bytes),
            "external": _fmt_mb(external_bytes),
        }
    except Exception:
        # Absolute last-resort fallback: never raise from the metrics path. The
        # four keys are always present so the /health payload shape is stable.
        zero = _fmt_mb(0.0)
        return {
            "rss": zero,
            "heapTotal": zero,
            "heapUsed": zero,
            "external": zero,
        }


# ---------------------------------------------------------------------------
# Aggregate builders consumed by the /health blueprint
# ---------------------------------------------------------------------------


def get_metrics() -> dict:
    """Return the request/error counter sub-object for the health payload.

    Shape: ``{"requestCount": <int>, "errorCount": <int>}`` — matching the Node
    ``metrics`` object (``{ requestCount, errorCount }``).
    """
    return {
        "requestCount": get_request_count(),
        "errorCount": get_error_count(),
    }


def build_health_payload() -> dict:
    """Build the complete ``/health`` JSON payload.

    Returns the exact parity shape (Technical Specification / AAP parity row 3)::

        {
            "status": "ok",
            "uptime": <int seconds>,
            "memory": {"rss", "heapTotal", "heapUsed", "external"},
            "metrics": {"requestCount", "errorCount"}
        }

    The ``/health`` blueprint may call this helper directly or assemble the
    payload from the individual getters; both styles are supported by the public
    API so the blueprint agent can choose whichever reads best.
    """
    return {
        "status": "ok",
        "uptime": get_uptime_seconds(),
        "memory": get_memory_usage(),
        "metrics": get_metrics(),
    }
