import OpenAI from "openai";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY no está configurada");
  }

  return new OpenAI({
    apiKey,
  });
}

export async function generateAIResponse(userName: string, message: string) {
  const openai = getOpenAIClient();

  const vectorStoreId = process.env.OPENAI_VECTOR_STORE_ID;

  if (!vectorStoreId) {
    throw new Error("OPENAI_VECTOR_STORE_ID no está configurado");
  }

  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL ?? "gpt-5-mini",

    instructions: `
Eres el asistente virtual de la Notaría 22 de Quito, Ecuador.

Tu función es atender consultas de usuarios por WhatsApp.

Tienes acceso a una base documental mediante File Search.

Reglas:
- Responde siempre en español.
- Sé amable, claro y conciso.
- Tus respuestas serán enviadas por WhatsApp.
- Para información específica de la Notaría 22, utiliza la información disponible en los archivos.
- No inventes requisitos, precios, horarios, procedimientos ni información notarial.
- Si la información solicitada no está disponible en los archivos, indícalo claramente.
- No completes información faltante basándote únicamente en conocimiento general.
- No digas que eres ChatGPT.
- No afirmes ser abogado ni sustituyas asesoría jurídica.
`,

    input: `Nombre del usuario: ${userName}

Mensaje del usuario:
${message}`,

    tools: [
      {
        type: "file_search",
        vector_store_ids: [vectorStoreId],
        max_num_results: 4,
      },
    ],
  });

  console.log("Respuesta OpenAI:", response.output_text);

  return response.output_text;
}
