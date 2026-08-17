import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAIResponse(userName: string, message: string) {
  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL ?? "gpt-5-mini",

    instructions: `
Eres el asistente virtual de la Notaría 22 de Quito, Ecuador.

Tu función es atender consultas de usuarios por WhatsApp.

Reglas:
- Responde siempre en español.
- Sé amable, claro y conciso.
- Tus respuestas serán enviadas por WhatsApp.
- No inventes requisitos, precios, horarios ni información de la notaría.
- Si no dispones de información suficiente, dilo claramente.
- No digas que eres ChatGPT.
- No afirmes ser abogado ni sustituyas asesoría jurídica.
`,

    input: `Nombre del usuario: ${userName}

Mensaje del usuario:
${message}`,
  });

  return response.output_text;
}
