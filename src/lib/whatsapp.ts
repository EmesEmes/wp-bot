const GRAPH_API_VERSION = "v26.0";

export async function sendWhatsAppMessage(to: string, text: string) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    throw new Error("Faltan variables de entorno de WhatsApp");
  }

  const response = await fetch(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: {
          body: text,
        },
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Error de WhatsApp:", data);
    throw new Error("No se pudo enviar el mensaje de WhatsApp");
  }

  return data;
}
