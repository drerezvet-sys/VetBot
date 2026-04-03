const SHEETS_URL = "https://script.google.com/macros/s/AKfycbwMAxlusK4ru9Jd76xuiXunp4wfXkwEJ0hjZKIZ6iW3YDap3CiNFPmgu2WSB66XGpr1jQ/exec";

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
