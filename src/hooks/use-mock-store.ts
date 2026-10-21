import { useEffect, useState } from "react";

function parseStored<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function useMockStore<T>(key: string, initialData: T[]) {
  const [data, setData] = useState<T[]>(() => {
    const stored = localStorage.getItem(key);
    return parseStored<T[]>(stored, initialData);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data));
  }, [key, data]);

  return [data, setData] as const;
}
