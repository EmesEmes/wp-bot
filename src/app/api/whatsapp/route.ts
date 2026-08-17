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

    const change = body.entry?.[0]?.changes?.[0];

    if (change?.field !== "messages") {
      return Response.json({ status: "ignored" }, { status: 200 });
    }

    const value = change.value;
    const message = value?.messages?.[0];

    // Algunos webhooks de "messages" son estados de mensajes
    // y no contienen un mensaje entrante.
    if (!message) {
      return Response.json({ status: "ok" }, { status: 200 });
    }

    const from = message.from;
    const messageId = message.id;
    const messageType = message.type;
    const userName = value.contacts?.[0]?.profile?.name ?? "Usuario";

    if (messageType === "text") {
      const text = message.text?.body;

      console.log("Nuevo mensaje de WhatsApp:");
      console.log({
        from,
        userName,
        messageId,
        text,
      });
    } else {
      console.log(`Mensaje de tipo ${messageType} recibido de ${from}`);
    }

    return Response.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Error procesando webhook:", error);

    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
