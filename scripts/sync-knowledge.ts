import OpenAI from "openai";
import fs from "node:fs";
import path from "node:path";
import { config } from "dotenv";

config({
  path: ".env.local",
});

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} no está configurada`);
  }

  return value;
}

const apiKey = getEnv("OPENAI_API_KEY");
const vectorStoreId = getEnv("OPENAI_VECTOR_STORE_ID");

const openai = new OpenAI({
  apiKey,
});

const knowledgeDir = path.resolve(process.cwd(), "knowledge");

async function clearVectorStore() {
  console.log("Buscando archivos actuales del Vector Store...");

  const existingFiles = [];

  for await (const file of openai.vectorStores.files.list(vectorStoreId, {
    limit: 100,
  })) {
    existingFiles.push(file);
  }

  if (existingFiles.length === 0) {
    console.log("El Vector Store está vacío.");
    return;
  }

  console.log(
    `Eliminando ${existingFiles.length} archivo(s) del Vector Store...`,
  );

  for (const file of existingFiles) {
    await openai.vectorStores.files.delete(file.id, {
      vector_store_id: vectorStoreId,
    });

    console.log(`- Eliminado: ${file.id}`);
  }
}

async function uploadKnowledge() {
  if (!fs.existsSync(knowledgeDir)) {
    throw new Error(`No existe la carpeta: ${knowledgeDir}`);
  }

  const files = fs
    .readdirSync(knowledgeDir)
    .filter(
      (file) => file.endsWith(".md") && file.toLowerCase() !== "readme.md",
    )
    .sort();

  if (files.length === 0) {
    throw new Error("No se encontraron archivos .md en la carpeta knowledge");
  }

  console.log(`Subiendo ${files.length} archivo(s)...`);

  for (const fileName of files) {
    const filePath = path.join(knowledgeDir, fileName);

    console.log(`- Subiendo: ${fileName}`);

    await openai.vectorStores.files.uploadAndPoll(
      vectorStoreId,
      fs.createReadStream(filePath),
    );

    console.log(`  ✓ Procesado correctamente`);
  }
}

async function main() {
  console.log("");
  console.log("=== Sincronización Notaría 22 ===");
  console.log(`Vector Store: ${vectorStoreId}`);
  console.log("");

  await clearVectorStore();

  console.log("");

  await uploadKnowledge();

  console.log("");
  console.log("✓ Base de conocimiento sincronizada correctamente.");
}

main().catch((error) => {
  console.error("");
  console.error("Error sincronizando la base de conocimiento:");
  console.error(error);

  process.exit(1);
});
