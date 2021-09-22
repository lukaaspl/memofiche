import { ACCESS_TOKEN } from "consts/storage-keys";

export function saveToLocalStorage(key: string, value: unknown): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getFromLocalStorage<T>(key: string): T | undefined {
  try {
    const item = window.localStorage.getItem(key);

    if (item) {
      return JSON.parse(item) as T;
    }
  } catch {
    return undefined;
  }
}

export function getAccessTokenFromLocalStorage(): string | undefined {
  return getFromLocalStorage<string>(ACCESS_TOKEN);
}
