const TOKEN_KEY = "access_token";
const USER_KEY = "auth_user";

export function setAuth(token: string, user: unknown) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser<T = unknown>(): T | null {
  const value = localStorage.getItem(USER_KEY);
  if (!value) return null;
  try { return JSON.parse(value) as T; } catch { return null; }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
