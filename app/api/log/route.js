const SHEETS_URL = "https://script.google.com/macros/s/AKfycbwzeoyPn720HgkWMxZWn1jEgsA4ZZiUbUVUkeAGudwBokG9e6vXzs0-BzytH0e2PqJJUw/exec";

export async function POST(req) {
  try {
    const body = await req.json();
    await fetch(SHEETS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return Response.json({ status: "ok" });
  } catch (e) {
    return Response.json({ status: "error", message: e.toString() }, { status: 500 });
  }
}
