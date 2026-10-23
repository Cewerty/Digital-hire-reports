import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "mentor-theme";
const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

const listeners = new Set<() => void>();

let currentTheme: Theme | undefined;
let hasStoredChoice = false;

function readStoredTheme(): Theme | undefined {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value === "light" || value === "dark") {
      return value;
    }
  } catch {
    // localStorage может быть недоступен — работаем без сохранения.
  }
  return undefined;
}

function getSystemTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }
  return window.matchMedia(DARK_MEDIA_QUERY).matches ? "dark" : "light";
}

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}

/** Применяет тему к корневому элементу документа. */
export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

/** Текущая тема: сохранённый выбор пользователя или системная настройка. */
export function getTheme(): Theme {
  if (currentTheme === undefined) {
    const stored = readStoredTheme();
    hasStoredChoice = stored !== undefined;
    currentTheme = stored ?? getSystemTheme();
  }
  return currentTheme;
}

/** Переключает тему и сохраняет выбор между перезагрузками. */
export function setTheme(theme: Theme): void {
  currentTheme = theme;
  hasStoredChoice = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage может быть недоступен — работаем без сохранения.
  }
  applyTheme(theme);
  notify();
}

export function toggleTheme(): void {
  setTheme(getTheme() === "dark" ? "light" : "dark");
}

/** Подписка для `useSyncExternalStore`. */
export function subscribeTheme(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Инициализирует тему при старте приложения.
 * Пока пользователь не выбрал тему явно, приложение следует системной настройке.
 */
export function initTheme(): void {
  applyTheme(getTheme());

  if (hasStoredChoice || typeof window === "undefined") {
    return;
  }

  window.matchMedia(DARK_MEDIA_QUERY).addEventListener("change", (event) => {
    if (hasStoredChoice) {
      return;
    }
    currentTheme = event.matches ? "dark" : "light";
    applyTheme(currentTheme);
    notify();
  });
}

function getServerTheme(): Theme {
  return "light";
}

export interface ThemeController {
  theme: Theme;
  toggleTheme: () => void;
}

/** Хук доступа к теме для компонентов. */
export function useTheme(): ThemeController {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getTheme,
    getServerTheme,
  );
  return { theme, toggleTheme };
}
