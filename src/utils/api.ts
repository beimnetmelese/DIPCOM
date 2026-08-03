const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined ?? "https://stockapi.dipcomtech.com/api").replace(/\/+$/, "");
export const AUTH_EXPIRED_EVENT = "dipcom:auth-expired";

export class ApiValidationError extends Error {
  constructor(message: string, public readonly fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = "ApiValidationError";
  }
}

const ACCESS_TOKEN_KEY = "dipcom_access_token";
const REFRESH_TOKEN_KEY = "dipcom_refresh_token";
let accessTokenCache: string | null = null;
let refreshTokenCache: string | null = null;

if (typeof window !== "undefined") {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getStoredAccessToken() {
  return accessTokenCache;
}

export function getStoredRefreshToken() {
  return refreshTokenCache;
}

export function storeTokens(accessToken: string, refreshToken: string) {
  accessTokenCache = accessToken;
  refreshTokenCache = refreshToken;
}

export function clearStoredTokens() {
  accessTokenCache = null;
  refreshTokenCache = null;
}

function resolveHeaders(headers?: HeadersInit) {
  const resolved = new Headers(headers ?? {});
  const accessToken = getStoredAccessToken();

  if (accessToken && !resolved.has("Authorization")) {
    resolved.set("Authorization", `Bearer ${accessToken}`);
  }

  return resolved;
}

async function refreshAccessToken() {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/accounts/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    clearStoredTokens();
    window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    return null;
  }

  const data = await response.json() as { access?: string };
  if (!data.access) {
    clearStoredTokens();
    window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    return null;
  }

  accessTokenCache = data.access;
  return data.access;
}

async function parseApiError(response: Response) {
  try {
    const data = await response.json() as Record<string, unknown>;
    const fieldErrors: Record<string, string> = {};
    for (const [field, value] of Object.entries(data)) {
      if (Array.isArray(value) && typeof value[0] === "string") fieldErrors[field] = value[0];
      else if (typeof value === "string" && field !== "detail") fieldErrors[field] = value;
    }
    const message = typeof data.detail === "string" ? data.detail : Object.values(fieldErrors)[0] ?? "Request could not be completed.";
    return new ApiValidationError(message, fieldErrors);
  } catch {
    return new ApiValidationError(`${response.status} ${response.statusText}`.trim());
  }
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  retryOnAuthFailure = true,
): Promise<T> {
  const hadAuthTokens = Boolean(getStoredAccessToken() || getStoredRefreshToken());
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: resolveHeaders(init.headers),
  });

  if (response.status === 401 && retryOnAuthFailure) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiRequest<T>(path, init, false);
    }

    if (hadAuthTokens) {
      clearStoredTokens();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
      }
    }
  }

  if (!response.ok) {
    throw await parseApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
