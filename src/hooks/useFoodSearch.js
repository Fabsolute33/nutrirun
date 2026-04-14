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
        const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=10&fields=code,product_name,brands,nutriments&lc=fr&cc=fr`;
        const res  = await fetch(url, { signal: controller.signal });
        const data = await res.json();

        const parsed = (data.products || [])
          .filter(p => p.nutriments?.["energy-kcal_100g"] != null && p.product_name)
          .map((p, i) => ({
            id:          p.code || String(i),
            name:        p.product_name.trim(),
            brand:       p.brands?.split(",")[0]?.trim() || "",
            kcalPer100g: Math.round(p.nutriments["energy-kcal_100g"]),
          }));

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
