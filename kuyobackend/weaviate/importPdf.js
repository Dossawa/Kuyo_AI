import weaviate from "weaviate-ts-client";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080",
});

const classObj = {
  class: "Document",
  vectorizer: "text2vec-transformers",
  moduleConfig: {
    "text2vec-transformers": { vectorizeClassName: true },
  },
  properties: [
    { name: "title", dataType: ["text"] },
    { name: "theme", dataType: ["text"] },
    { name: "sousTheme", dataType: ["text"] },
    { name: "description", dataType: ["text"] },
    { name: "documents", dataType: ["text[]"] },
    { name: "etapes", dataType: ["text[]"] },
    { name: "frais", dataType: ["text"] },
    { name: "delai", dataType: ["text"] },
    { name: "direction", dataType: ["text"] },
    { name: "contact", dataType: ["text"] },
    { name: "url", dataType: ["text"] },
    { name: "content", dataType: ["text"] },
    { name: "imported_at", dataType: ["text"] }
  ],
};

async function setupWeaviate() {
  try {
    await client.schema.classDeleter().withClassName("Document").do();
    console.log("🗑 Classe 'Document' supprimée.");
  } catch {}
  await client.schema.classCreator().withClass(classObj).do();
  console.log("✅ Classe 'Document' (re)créée.");
}

async function importScrapedData() {
  const SCRAPE_FILE = path.join(__dirname, "./../scrapers", "scrape-details.json");
  if (!fs.existsSync(SCRAPE_FILE)) {
    console.warn(`⚠️ Fichier JSON introuvable: ${SCRAPE_FILE}`);
    return;
  }
  try {
    const raw = await fsp.readFile(SCRAPE_FILE, "utf8");
    const data = JSON.parse(raw);
    let count = 0;

    if (Array.isArray(data) && data.length && data[0].details) {
      for (const themeObj of data) {
        const theme = themeObj.theme || "";
        const sousTheme = themeObj.sousTheme || themeObj.subtheme || "";
        const details = Array.isArray(themeObj.details) ? themeObj.details : [];
        for (const item of details) {
          await importDocument(item, theme, sousTheme);
          count++;
        }
      }
    } else {
      for (const item of data) {
        const theme = item.theme || "";
        const sousTheme = item.sousTheme || item.subtheme || "";
        await importDocument(item, theme, sousTheme);
        count++;
      }
    }

    console.log(`📥 Import de ${count} documents scrappés…`);
  } catch (err) {
    console.error("❌ Erreur lors de l'import JSON :", err);
  }
}

async function importDocument(item, theme, sousTheme) {
  const fullContent = [
    `Titre : ${item.title || ""}`,
    `Description : ${item.description || ""}`,
    `Documents à fournir : ${(item.documents || []).join(", ") || "Non précisé"}`,
    `Étapes : ${(item.etapes || []).join(", ") || "Non précisé"}`,
    `Frais : ${item.frais || "Non précisé"}`,
    `Délai : ${item.delai || "Non précisé"}`,
    `Direction : ${item.direction || "Non précisé"}`,
    `Contact : ${item.contact || "Non précisé"}`
  ].join("\n");

  await client.data
    .creator()
    .withClassName("Document")
    .withProperties({
      title: item.title || "",
      theme,
      sousTheme,
      description: item.description || "",
      documents: item.documents || [],
      etapes: item.etapes || [],
      frais: item.frais || "",
      delai: item.delai || "",
      direction: item.direction || "",
      contact: item.contact || "",
      url: item.url || "",
      content: fullContent,
      imported_at: new Date().toISOString(),
    })
    .do();

  console.log(`✅ Indexé : ${item.title}`);
}

(async () => {
  await setupWeaviate();
  await importScrapedData();
  console.log("🚀 Import terminé !");
})();
