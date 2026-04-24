// ── ORACLE PROXY — Cloudflare Worker ──────────────────────────
// Deploy at: https://dash.cloudflare.com -> Workers & Pages -> Create Worker
// Add secret: Settings -> Variables -> Add variable -> GROQ_API_KEY (secret)
// Set ALLOWED_ORIGIN to your Github Pages URL e.g. https://yourname.github.io

const ALLOWED_ORIGIN = "https://YOUR_GITHUB_USERNAME.github.io"; // ← change this
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

export default {
  async fetch(request, env) {

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // Only accept POST
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    // Only accept requests from your Pages domain
    const origin = request.headers.get("Origin") || "";
    if (origin !== ALLOWED_ORIGIN) {
      return new Response("Forbidden", { status: 403 });
    }

    // Parse incoming body
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    // Forward to Groq
    const groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: body.messages,
        max_tokens: 1200,
      }),
    });

    const groqData = await groqRes.json();

    // Return Groq response with CORS headers
    return new Response(JSON.stringify(groqData), {
      status: groqRes.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      },
    });
  },
};
