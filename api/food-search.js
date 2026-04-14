// Edge Function Vercel → FatSecret API proxy
// OAuth2 Client Credentials + recherche aliments
export const config = { runtime: "edge" };

const TOKEN_URL = "https://oauth.fatsecret.com/connect/token";
const API_URL   = "https://platform.fatsecret.com/rest/server.api";

async function getAccessToken(clientId, clientSecret) {
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    scope: "basic",
  });

  const credentials = btoa(`${clientId}:${clientSecret}`);

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!res.ok) throw new Error(`Token error: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

function parseKcal(description) {
  if (!description) return null;
  // Exemples FatSecret :
  //  "Per 100g - Calories: 541kcal | Fat: 30.90g | ..."
  //  "Per 15g - Calories: 82kcal | Fat: 4.60g | ..."   ← portion, on ramène à 100g
  const servingMatch = description.match(/Per\s+([\d.]+)\s*g/i);
  const servingG = servingMatch ? parseFloat(servingMatch[1]) : 100;

  const calMatch = description.match(/Calories:\s*([\d.]+)\s*kcal/i);
  if (!calMatch) return null;

  const kcal = parseFloat(calMatch[1]);
  return Math.round((kcal / servingG) * 100);
}

export default async function handler(req) {
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

  const clientId     = process.env.FATSECRET_CLIENT_ID;
  const clientSecret = process.env.FATSECRET_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response(JSON.stringify({ products: [], error: "API non configurée" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  try {
    const token = await getAccessToken(clientId, clientSecret);

    const url = `${API_URL}?method=foods.search&search_expression=${encodeURIComponent(q.trim())}&format=json&max_results=10`;

    const res = await fetch(url, {
      headers: { "Authorization": `Bearer ${token}` },
    });

    if (!res.ok) throw new Error(`FatSecret ${res.status}`);

    const data = await res.json();

    const rawFoods = data?.foods?.food ?? [];
    const foods = Array.isArray(rawFoods) ? rawFoods : [rawFoods];

    const products = foods
      .map((f, i) => {
        const kcal = parseKcal(f.food_description);
        if (kcal === null) return null;
        return {
          id:          f.food_id || String(i),
          name:        f.food_name?.trim() || "",
          brand:       f.brand_name?.trim() || "",
          kcalPer100g: kcal,
        };
      })
      .filter(Boolean);

    return new Response(JSON.stringify({ products }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ products: [], error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
}
