// Edge Function Vercel → FatSecret API v5
export const config = { runtime: "edge" };

const TOKEN_URL = "https://oauth.fatsecret.com/connect/token";
const SEARCH_URL = "https://platform.fatsecret.com/rest/foods/search/v5";

async function getAccessToken(clientId, clientSecret) {
  // Docs FatSecret : Basic auth header + grant_type/scope en body uniquement
  const credentials = btoa(`${clientId}:${clientSecret}`);
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    scope:      "basic",
  });

  const res = await fetch(TOKEN_URL, {
    method:  "POST",
    headers: {
      "Content-Type":  "application/x-www-form-urlencoded",
      "Authorization": `Basic ${credentials}`,
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Token error ${res.status}: ${txt}`);
  }
  const data = await res.json();
  return data.access_token;
}

// Trouve les kcal pour 100g à partir du tableau servings
function getKcalPer100g(servings) {
  if (!servings) return null;
  const list = Array.isArray(servings) ? servings : [servings];

  // 1. Cherche une portion en grammes et ramène à 100g
  for (const s of list) {
    const unit   = s.metric_serving_unit?.toLowerCase();
    const amount = parseFloat(s.metric_serving_amount);
    const kcal   = parseFloat(s.calories);
    if (unit === "g" && amount > 0 && !isNaN(kcal)) {
      return Math.round((kcal / amount) * 100);
    }
  }

  // 2. Fallback : portion par défaut
  const def = list.find(s => s.is_default === "1" || s.is_default === 1);
  if (def && !isNaN(parseFloat(def.calories))) {
    return Math.round(parseFloat(def.calories));
  }

  return null;
}

export default async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status:  200,
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET" },
    });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (q.trim().length < 2) {
    return new Response(JSON.stringify({ products: [] }), {
      status:  400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  const clientId     = process.env.FATSECRET_CLIENT_ID;
  const clientSecret = process.env.FATSECRET_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response(JSON.stringify({ products: [], error: "API non configurée" }), {
      status:  500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  try {
    const token = await getAccessToken(clientId, clientSecret);

    const url = `${SEARCH_URL}?search_expression=${encodeURIComponent(q.trim())}&format=json&max_results=10&page_number=0`;

    const res = await fetch(url, {
      headers: { "Authorization": `Bearer ${token}` },
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`FatSecret ${res.status}: ${txt}`);
    }

    const data = await res.json();

    const rawFoods = data?.foods?.food ?? [];
    const foods    = Array.isArray(rawFoods) ? rawFoods : [rawFoods];

    const products = foods
      .map((f, i) => {
        const servings     = f.servings?.serving;
        const kcalPer100g  = getKcalPer100g(servings);
        if (!kcalPer100g) return null;
        return {
          id:          String(f.food_id || i),
          name:        f.food_name?.trim() || "",
          brand:       f.brand_name?.trim() || "",
          kcalPer100g,
        };
      })
      .filter(Boolean);

    return new Response(JSON.stringify({ products }), {
      status:  200,
      headers: {
        "Content-Type":                "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control":               "no-store",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ products: [], error: err.message }), {
      status:  500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
}
