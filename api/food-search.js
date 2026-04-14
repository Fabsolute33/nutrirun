// Edge Function Vercel → Open Food Facts proxy
// Runtime "edge" = Web Platform APIs (fetch natif garanti, pas de Node.js)
export const config = { runtime: "edge" };

export default async function handler(req) {
  // Preflight CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET" },
    });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (q.trim().length < 2) {
    return new Response(JSON.stringify({ products: [] }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  const offUrl =
    "https://world.openfoodfacts.org/api/v2/search" +
    `?search_terms=${encodeURIComponent(q.trim())}` +
    "&page_size=10" +
    "&fields=code,product_name,brands,nutriments";

  try {
    const res = await fetch(offUrl, {
      headers: {
        "User-Agent": "NutriRun/1.0 (contact@nutrirun.app)",
        "Accept": "application/json",
      },
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ products: [], error: "Recherche indisponible" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
}
