const SHEETS_URL = "https://script.google.com/macros/s/AKfycbwzeoyPn720HgkWMxZWn1jEgsA4ZZiUbUVUkeAGudwBokG9e6vXzs0-BzytH0e2PqJJUw/exec";

export async function POST(req) {
  const body = await req.json();

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  // שמור לוג בגוגל שיטס
  try {
    const answer = data.content?.[0]?.text || "";
    const metaMatch = answer.match(/<!--VETBOT_META:(.*?)-->/);
    let urgency = "none";
    if (metaMatch) {
      try { urgency = JSON.parse(metaMatch[1]).urgency || "none"; } catch {}
    }

    const lastUserMsg = body.messages?.[body.messages.length - 1]?.content || "";
    const now = new Date();

    await fetch(SHEETS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: now.toLocaleDateString("he-IL"),
        time: now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }),
        pet: body.messages?.[0]?.content?.match(/יש (\S+)/)?.[1] || "לא ידוע",
        petName: body.messages?.[0]?.content?.match(/בשם (\S+)/)?.[1] || "",
        question: lastUserMsg.substring(0, 500),
        answer: answer.replace(/<!--VETBOT_META:.*?-->/g, "").trim().substring(0, 1000),
        urgency,
      }),
    });
  } catch (e) {
    // לוג נכשל — לא עוצר את האפליקציה
    console.error("Sheets log error:", e);
  }

  return Response.json(data, { status: res.status });
}
