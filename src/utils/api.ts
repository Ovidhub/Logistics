const API_URL = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'swiftrack_token';
const ROLE_KEY = 'swiftrack_role';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRole(): string | null {
  return localStorage.getItem(ROLE_KEY);
}

export function setAuth(token: string, role: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

interface ApiOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
}

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  // In dev, an unreachable API usually means the PHP server isn't running.
  const devHint = import.meta.env.DEV
    ? ' Make sure the PHP API server is running (npm run dev:all).'
    : '';

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: options.method || 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    // fetch rejects on a true network failure (server down, DNS, offline).
    throw new ApiError(0, `Cannot reach the server.${devHint}`);
  }

  if (res.status === 401 && options.auth) {
    clearAuth();
  }

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    let message: string;
    if (data && typeof data === 'object' && 'error' in data) {
      message = String((data as { error: unknown }).error);
    } else if (res.status >= 500) {
      // A bodyless 5xx (e.g. dev proxy can't reach the API) lands here.
      message = `Server error (${res.status}).${devHint}`;
    } else {
      message = `Request failed (${res.status})`;
    }
    throw new ApiError(res.status, message);
  }

  return data as T;
}
