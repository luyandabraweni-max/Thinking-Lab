import { useEffect, useState } from "react";

/** Loads data for a screen and reloads it after a change. `deps` are the values the loader depends on. */
export function useLoad<T>(load: () => Promise<T>, deps: unknown[]): [T | undefined, () => void, string] {
  const [data, setData] = useState<T>(), [error, setError] = useState(""), [n, setN] = useState(0);
  useEffect(() => {
    let live = true;
    load().then(d => { if (live) { setData(d); setError(""); } }, (e: Error) => { if (live) setError(e.message); });
    return () => { live = false; };
  }, [...deps, n]); // eslint-disable-line react-hooks/exhaustive-deps
  return [data, () => setN(x => x + 1), error];
}
