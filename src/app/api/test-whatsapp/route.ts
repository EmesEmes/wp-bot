import { sendWhatsAppMessage } from "@/lib/whatsapp";

export async function GET() {
  try {
    const result = await sendWhatsAppMessage(
      "593987032774",
      "Hola 👋 Este mensaje fue enviado desde nuestro bot en Next.js.",
    );

    return Response.json(result);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "No se pudo enviar el mensaje" },
      { status: 500 },
    );
  }
}
