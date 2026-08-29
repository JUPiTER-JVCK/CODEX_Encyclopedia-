/**
 * Progress storage for CORE.
 *
 * The app was originally written against `window.storage`, the async
 * key/value bridge that exists inside Claude artifacts. Outside that host the
 * bridge is absent, so this adapter falls back to `localStorage`, and to an
 * in-memory map when even that is unavailable — Safari private mode, a
 * sandboxed iframe, or a browser configured to block site data all make
 * `localStorage` throw on access rather than return null.
 *
 * The backend is detected once and cached. Every function is async so call
 * sites read identically whichever backend is in play.
 */

const FALLBACK = new Map();
const PROBE_KEY = "__core_storage_probe__";

let cached = null;

function detect() {
  if (typeof window === "undefined") return "memory";

  const bridge = window.storage;
  if (bridge && typeof bridge.get === "function" && typeof bridge.set === "function") {
    return "artifact";
  }

  try {
    window.localStorage.setItem(PROBE_KEY, "1");
    window.localStorage.removeItem(PROBE_KEY);
    return "local";
  } catch {
    return "memory";
  }
}

function backend() {
  if (cached === null) cached = detect();
  return cached;
}

/** Which backend is active: "artifact" | "local" | "memory". */
export function storageKind() {
  return backend();
}

/** Read a key. Resolves to the stored string, or null when absent. */
export async function getItem(key) {
  switch (backend()) {
    case "artifact": {
      const res = await window.storage.get(key);
      return res && typeof res.value === "string" ? res.value : null;
    }
    case "local":
      return window.localStorage.getItem(key);
    default:
      return FALLBACK.has(key) ? FALLBACK.get(key) : null;
  }
}

/**
 * Write a key. Rejects if the backend refuses the write — a full disk quota
 * on `localStorage`, for instance — so callers can decide whether to report it.
 */
export async function setItem(key, value) {
  switch (backend()) {
    case "artifact":
      await window.storage.set(key, value);
      return;
    case "local":
      window.localStorage.setItem(key, value);
      return;
    default:
      FALLBACK.set(key, value);
  }
}
