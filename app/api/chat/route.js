// Server-enforced model: the client-supplied model is ignored so the API key
// can't be used as an open proxy for arbitrary (or retired) models.
const MODEL = process.env.NEXT_PUBLIC_MODEL || "claude-sonnet-4-6";
const MAX_TOKENS_CAP = 1000;

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid JSON body" }, { status: 400 });
  }

  if (!Array.isArray(body?.messages) || body.messages.length === 0) {
    return Response.json({ error: "messages required" }, { status: 400 });
  }

  const payload = {
    model: MODEL,
    max_tokens: Math.min(Number(body.max_tokens) || MAX_TOKENS_CAP, MAX_TOKENS_CAP),
    system: body.system,
    messages: body.messages,
  };

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("anthropic error", res.status, JSON.stringify(data?.error || data).slice(0, 500));
  }
  return Response.json(data, { status: res.status });
}
