// kuyoService.js
import { WeaviateService } from "./api/weaviateService";
import { GeminiService } from "./api/geminiService";

function normalizeSourceInContent(markdown) {
  if (!markdown) return "";
  return String(markdown)
    .replace(/^\s*Source\s*:.*$/gim, "")
    .replace(/^\s*https?:\/\/\S+\s*$/gim, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const formatDoc = (d = {}) => {
  const clean = (x) => (x == null ? "" : String(x)).trim();
  const bullet = (arr) =>
    Array.isArray(arr) && arr.length ? `- ${arr.map((v) => clean(v)).join("\n- ")}` : "- Non précisé";

  const parts = [];
  parts.push(`## 📝 **Résumé**\n${clean(d.title) || clean(d.description) || "Non précisé"}`);
  parts.push(`## 📄 **Pièces à fournir**\n${bullet(d.documents)}`);
  parts.push(`## ⚖️ **Cas particuliers**\n${bullet(d.casParticuliers)}`);
  parts.push(`## ⏳ **Délais**\n${clean(d.delai) || "Non précisé"}`);
  parts.push(`## 💰 **Frais**\n${clean(d.frais) || "Non précisé"}`);
  parts.push(`## 🏛️ **Service compétent**\n${clean(d.direction) || "Non précisé"}`);
  return parts.join("\n\n");
};

const IVORY_ADMIN_HINTS = [
  "cni","cnps","passeport","acte de naissance","extrait","casier judiciaire",
  "dgi","impôt","impots","servicepublic.gouv.ci","sante.gouv.ci","santé.gouv.ci",
  "demarche","démarche","permis","etat civil","mairie","préfecture",
  "sous-préfecture","tribunal","duplicata","naturalisation","fonction publique","mariage"
];
const looksIvorianAdministrative = (q) => IVORY_ADMIN_HINTS.some((k) => (q || "").toLowerCase().includes(k));

export const kuyoService = {
  async askQuestion(message) {
    const docs = await WeaviateService.query(message);

    if (docs && docs.length) {
      const topDocs = docs.slice(0, 3);
      try {
        const pretty = await GeminiService.generateContent({ userText: message, contextChunks: topDocs });
        return { content: normalizeSourceInContent(pretty || formatDoc(topDocs[0])), source: "Kuyo_AI" };
      } catch {
        return { content: normalizeSourceInContent(formatDoc(topDocs[0])), source: "Kuyo_AI" };
      }
    }

    const outOfScope = !looksIvorianAdministrative(message);
    try {
      const geminiAnswer = await GeminiService.generateContent({
        userText: message, mode: outOfScope ? "outOfScope" : "normal",
      });
      return { content: normalizeSourceInContent(geminiAnswer), source: "Gemini" };
    } catch {
      return { content: "Désolé, je n’ai pas trouvé d’informations.", source: "Kuyo_AI" };
    }
  },
};
