import OpenAI from "openai";
import fs from "node:fs";
import { config } from "dotenv";

config({
  path: ".env.local",
});

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY no está configurada");
}

const openai = new OpenAI({
  apiKey,
});

async function main() {
  console.log("Creando Vector Store...");

  const vectorStore = await openai.vectorStores.create({
    name: "Notaria22 Knowledge Dev",
  });

  console.log("Vector Store creado:");
  console.log(vectorStore.id);

  console.log("Subiendo archivo...");

  await openai.vectorStores.files.uploadAndPoll(
    vectorStore.id,
    fs.createReadStream("knowledge/notaria22-test.md"),
  );

  console.log("Archivo procesado correctamente.");
  console.log("");
  console.log("Guarda esta variable:");
  console.log(`OPENAI_VECTOR_STORE_ID=${vectorStore.id}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
