import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

// SSR-safe localStorage-backed state. Starts from `initial` (so server and
// first client render match), then hydrates from storage on mount.
export function useLocalStorage<T>(
  key: string,
  initial: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore corrupt/unavailable storage */
    }
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore quota/unavailable storage */
    }
  }, [key, value, loaded]);

  return [value, setValue];
}
