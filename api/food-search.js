// Proxy serverless Vercel → Open Food Facts
// Évite les erreurs CORS (appel serveur→serveur, pas navigateur→serveur)
export default async function handler(req, res) {
  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(400).json({ products: [] });
  }

  try {
    const url = `https://world.openfoodfacts.org/api/v2/search?search_terms=${encodeURIComponent(q)}&page_size=10&fields=code,product_name,brands,nutriments&lc=fr&cc=fr`;
    const response = await fetch(url, {
      headers: { "User-Agent": "NutriRun/1.0 (contact@nutrirun.app)" },
    });
    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Recherche indisponible", products: [] });
  }
}
