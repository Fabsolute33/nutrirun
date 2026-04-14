// Proxy serverless Vercel → Open Food Facts
// Utilise le module https natif (pas de dépendance fetch)
import https from "node:https";

function httpsGetJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { headers: { "User-Agent": "NutriRun/1.0 (contact@nutrirun.app)", "Accept": "application/json" } },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          if (res.statusCode >= 400) {
            return reject(new Error(`HTTP ${res.statusCode}`));
          }
          try { resolve(JSON.parse(raw)); }
          catch (e) { reject(e); }
        });
      }
    );
    req.on("error", reject);
    req.setTimeout(8000, () => { req.destroy(new Error("timeout")); });
  });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return res.status(400).json({ products: [] });
  }

  try {
    const url =
      "https://world.openfoodfacts.org/api/v2/search" +
      `?search_terms=${encodeURIComponent(q.trim())}` +
      "&page_size=10" +
      "&fields=code,product_name,brands,nutriments";

    const data = await httpsGetJson(url);

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(data);
  } catch (err) {
    console.error("food-search error:", err.message);
    return res.status(500).json({ error: "Recherche indisponible", products: [] });
  }
}
