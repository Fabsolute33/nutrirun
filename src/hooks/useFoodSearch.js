import { useState, useEffect } from "react";

export function useFoodSearch() {
  const [query, setQuery]     = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `/api/food-search?q=${encodeURIComponent(query)}`;
        const res  = await fetch(url, { signal: controller.signal });
        const data = await res.json();

        if (data.error) setError(data.error);
        const parsed = (data.products || []).filter(p => p.kcalPer100g > 0 && p.name);
        setResults(parsed);
      } catch (e) {
        if (e.name !== "AbortError") setError("Recherche indisponible");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const reset = () => { setQuery(""); setResults([]); setError(null); };

  return { query, setQuery, results, loading, error, reset };
}
