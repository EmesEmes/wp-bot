export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === "subscribe" && token === verifyToken) {
    console.log("Webhook verificado correctamente");

    return new Response(challenge, {
      status: 200,
    });
  }

  return new Response("Forbidden", {
    status: 403,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("Webhook recibido:");
    console.log(JSON.stringify(body, null, 2));

    return Response.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Error procesando webhook:", error);

    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
