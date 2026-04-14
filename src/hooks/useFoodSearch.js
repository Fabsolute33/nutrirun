import { useState, useEffect } from "react";

export function useFoodSearch() {
  const [query, setQuery]     = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    console.log("[FoodSearch] query changed:", query);

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
        console.log("[FoodSearch] fetching:", url);
        const res  = await fetch(url, { signal: controller.signal });
        const data = await res.json();
        console.log("[FoodSearch] response:", data);

        if (data.error) setError(data.error);
        const parsed = (data.products || []).filter(p => p.kcalPer100g > 0 && p.name);
        console.log("[FoodSearch] parsed results:", parsed.length);
        setResults(parsed);
      } catch (e) {
        console.error("[FoodSearch] error:", e);
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
