// Edge Function Vercel → FatSecret API v5
export const config = { runtime: "edge" };

const TOKEN_URL  = "https://oauth.fatsecret.com/connect/token";
const SEARCH_URL = "https://platform.fatsecret.com/rest/foods/search/v5";

const HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

async function getAccessToken(clientId, clientSecret) {
  const credentials = btoa(`${clientId}:${clientSecret}`);
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type":  "application/x-www-form-urlencoded",
      "Authorization": `Basic ${credentials}`,
    },
    body: "grant_type=client_credentials&scope=basic",
  });
  const raw = await res.text();
  if (!res.ok) throw new Error(`TOKEN_FAIL ${res.status}: ${raw}`);
  return JSON.parse(raw).access_token;
}

function getKcalPer100g(servings) {
  if (!servings) return null;
  const list = Array.isArray(servings) ? servings : [servings];
  for (const s of list) {
    const unit   = (s.metric_serving_unit || "").toLowerCase();
    const amount = parseFloat(s.metric_serving_amount);
    const kcal   = parseFloat(s.calories);
    if (unit === "g" && amount > 0 && !isNaN(kcal)) {
      return Math.round((kcal / amount) * 100);
    }
  }
  // fallback : première portion disponible
  const first = list[0];
  if (first && !isNaN(parseFloat(first.calories))) {
    return Math.round(parseFloat(first.calories));
  }
  return null;
}

export default async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: { "Access-Control-Allow-Origin": "*" } });
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  if (q.length < 2) {
    return new Response(JSON.stringify({ products: [] }), { status: 400, headers: HEADERS });
  }

  const clientId     = process.env.FATSECRET_CLIENT_ID;
  const clientSecret = process.env.FATSECRET_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response(
      JSON.stringify({ products: [], error: "ENV_MISSING: FATSECRET_CLIENT_ID or FATSECRET_CLIENT_SECRET not set" }),
      { status: 500, headers: HEADERS }
    );
  }

  try {
    const token = await getAccessToken(clientId, clientSecret);

    const url = `${SEARCH_URL}?search_expression=${encodeURIComponent(q)}&format=json&max_results=10&page_number=0`;
    const res  = await fetch(url, {
      headers: { "Authorization": `Bearer ${token}` },
    });

    const raw  = await res.text();
    if (!res.ok) throw new Error(`SEARCH_FAIL ${res.status}: ${raw}`);

    const data = JSON.parse(raw);
    const rawFoods = data?.foods?.food ?? [];
    const foods    = Array.isArray(rawFoods) ? rawFoods : [rawFoods];

    const products = foods
      .map((f, i) => {
        const kcalPer100g = getKcalPer100g(f.servings?.serving);
        if (!kcalPer100g) return null;
        return {
          id:    String(f.food_id || i),
          name:  f.food_name?.trim() || "",
          brand: f.brand_name?.trim() || "",
          kcalPer100g,
        };
      })
      .filter(Boolean);

    // DEBUG temporaire — à retirer après diagnostic
    const debug = {
      rawFoodsCount: foods.length,
      firstFood: foods[0] ?? null,
      dataKeys: Object.keys(data ?? {}),
    };

    return new Response(JSON.stringify({ products, debug }), { status: 200, headers: HEADERS });

  } catch (err) {
    return new Response(
      JSON.stringify({ products: [], error: err.message }),
      { status: 500, headers: HEADERS }
    );
  }
}
