const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined ?? "http://127.0.0.1:8000/api").replace(/\/+$/, "");
export const AUTH_EXPIRED_EVENT = "dipcom:auth-expired";

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

async function parseErrorMessage(response: Response) {
  try {
    const data = await response.json() as Record<string, unknown>;
    if (typeof data.detail === "string") {
      return data.detail;
    }

    const firstKey = Object.keys(data)[0];
    if (firstKey) {
      const firstValue = data[firstKey];
      if (Array.isArray(firstValue) && typeof firstValue[0] === "string") {
        return firstValue[0];
      }

      if (typeof firstValue === "string") {
        return firstValue;
      }
    }
  } catch {
    // Fall through to a generic message.
  }

  return `${response.status} ${response.statusText}`.trim();
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
    throw new Error(await parseErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}