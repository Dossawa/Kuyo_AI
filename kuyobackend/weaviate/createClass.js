// addProperties.js
import axios from "axios";

const WEAVIATE_URL = "http://localhost:8080";
const CLASS_NAME    = "Document";

const propsToAdd = [
  { name: "theme",       dataType: ["text"] },
  { name: "subtheme",    dataType: ["text"] },
  { name: "description", dataType: ["text"] },
  { name: "documents",   dataType: ["text[]"] },
  { name: "frais",       dataType: ["text"] },
  { name: "delai",       dataType: ["text"] },
  { name: "direction",   dataType: ["text"] },
  { name: "url",         dataType: ["text"] },
  { name: "imported_at", dataType: ["date"] }
];

async function addProperty(prop) {
  try {
    await axios.post(
      `${WEAVIATE_URL}/v1/schema/${CLASS_NAME}/properties`,
      prop,
      { headers: { "Content-Type": "application/json" } }
    );
    console.log(`✅ Propriété ajoutée : ${prop.name}`);
  } catch (err) {
    // ignore "already exists" errors
    const msg = err.response?.data?.error?.message || err.message;
    if (msg.match(/property.*already exists/i)) {
      console.log(`ℹ️  Propriété déjà présente : ${prop.name}`);
    } else {
      console.error(`❌ Erreur ajout ${prop.name}:`, msg);
    }
  }
}

async function run() {
  for (const prop of propsToAdd) {
    await addProperty(prop);
  }
}

run();
