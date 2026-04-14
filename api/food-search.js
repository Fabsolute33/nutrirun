// Edge Function Vercel → Open Food Facts proxy (pas de restriction IP, pas d'auth)
export const config = { runtime: "edge" };

const HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

export default async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: { "Access-Control-Allow-Origin": "*" } });
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  if (q.length < 2) {
    return new Response(JSON.stringify({ products: [] }), { status: 400, headers: HEADERS });
  }

  try {
    const url =
      "https://world.openfoodfacts.org/api/v2/search" +
      `?search_terms=${encodeURIComponent(q)}` +
      "&page_size=15" +
      "&fields=code,product_name,brands,nutriments" +
      "&sort_by=unique_scans_n";

    const res = await fetch(url, {
      headers: {
        "User-Agent": "NutriRun/1.0 (contact@nutrirun.app)",
        "Accept": "application/json",
      },
    });

    if (!res.ok) throw new Error(`OFF ${res.status}`);

    const data = await res.json();

    const products = (data.products || [])
      .map((p, i) => {
        const kcal = p.nutriments?.["energy-kcal_100g"];
        if (kcal == null || !p.product_name) return null;
        return {
          id:          p.code || String(i),
          name:        p.product_name.trim(),
          brand:       p.brands?.split(",")[0]?.trim() || "",
          kcalPer100g: Math.round(kcal),
        };
      })
      .filter(Boolean);

    return new Response(JSON.stringify({ products }), {
      status: 200,
      headers: { ...HEADERS, "Cache-Control": "no-store" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ products: [], error: err.message }),
      { status: 500, headers: HEADERS }
    );
  }
}
