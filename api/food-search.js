// Proxy serverless Vercel → Open Food Facts
// Évite les erreurs CORS (appel serveur→serveur, pas navigateur→serveur)
export default async function handler(req, res) {
  // Gestion preflight CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(400).json({ products: [] });
  }

  try {
    const url =
      `https://world.openfoodfacts.org/api/v2/search` +
      `?search_terms=${encodeURIComponent(q.trim())}` +
      `&page_size=10` +
      `&fields=code,product_name,brands,nutriments` +
      `&lc=fr&cc=fr`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "NutriRun/1.0 (contact@nutrirun.app)",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      return res.status(502).json({ products: [], error: `OFF ${response.status}` });
    }

    const data = await response.json();

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json(data);
  } catch (err) {
    console.error("food-search proxy error:", err);
    return res.status(500).json({ error: "Recherche indisponible", products: [] });
  }
}
