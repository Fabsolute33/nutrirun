// Edge Function : lookup produit par code-barres via Open Food Facts
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
  const code = (searchParams.get("code") || "").trim();

  if (!code) {
    return new Response(JSON.stringify({ product: null }), { status: 400, headers: HEADERS });
  }

  try {
    const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}?fields=code,product_name,brands,nutriments`;
    const res  = await fetch(url, {
      headers: {
        "User-Agent": "NutriRun/1.0 (contact@nutrirun.app)",
        "Accept": "application/json",
      },
    });

    if (!res.ok) throw new Error(`OFF ${res.status}`);

    const data = await res.json();

    if (data.status !== 1 || !data.product) {
      return new Response(JSON.stringify({ product: null }), { status: 200, headers: HEADERS });
    }

    const p    = data.product;
    const kcal = p.nutriments?.["energy-kcal_100g"];

    if (kcal == null || !p.product_name) {
      return new Response(JSON.stringify({ product: null }), { status: 200, headers: HEADERS });
    }

    const product = {
      id:          p.code || code,
      name:        p.product_name.trim(),
      brand:       (Array.isArray(p.brands) ? p.brands[0] : p.brands?.split(",")[0])?.trim() || "",
      kcalPer100g: Math.round(kcal),
    };

    return new Response(JSON.stringify({ product }), {
      status: 200,
      headers: { ...HEADERS, "Cache-Control": "no-store" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ product: null, error: err.message }),
      { status: 500, headers: HEADERS }
    );
  }
}
