import { useEffect, useState } from "react";

export function useMockStore<T>(key: string, initialData: T[]) {
  const [data, setData] = useState<T[]>(() => {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T[]) : initialData;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data));
  }, [key, data]);

  return [data, setData] as const;
}
