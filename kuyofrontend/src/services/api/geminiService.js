// api/geminiService.js
import { BaseService } from "./baseService";

/* =====================================================
   SYSTEM PROMPT KUYO
===================================================== */
const SYSTEM_PROMPT = `
Tu es KUYO, assistant spécialisé dans l’administration publique ivoirienne.

RÈGLES
1) Ne répondre que pour la Côte d’Ivoire et ses démarches/services publics.
2) Hors contexte (question non administrative ivoirienne) :
   répondre UNIQUEMENT par une phrase + 3–5 suggestions de sujets administratifs ivoiriens.
3) Utiliser STRICTEMENT les extraits fournis. 
   Si aucun extrait n’est fourni, donner une réponse générique basée sur les démarches usuelles en Côte d’Ivoire
   (et préciser que les procédures peuvent évoluer).
4) Toujours préciser que les procédures peuvent évoluer quand c’est pertinent.

STYLE & FORMAT
- Markdown clair.
- Titres avec stickers + gras :
  ## 📝 **Résumé**
  ## 📄 **Pièces à fournir**
  ## ⚖️ **Cas particuliers**
  ## ⏳ **Délais**
  ## 💰 **Frais**
  ## 🏛️ **Service compétent**
- Listes avec "- ".
- Pas d’URL ni de lien. Pas de section "Source".
`.trim();

/* =====================================================
   UTILITAIRES
===================================================== */
const clean = (x) => (x == null ? "" : String(x)).trim();

const bulletList = (arr) =>
  Array.isArray(arr) && arr.length
    ? `- ${arr.map((v) => clean(v)).filter(Boolean).join("\n- ")}`
    : "";

/* =====================================================
   FORMAT CONTEXTE (RAG)
===================================================== */
function stringifyChunk(c = {}) {
  const lines = [];
  if (c.title) lines.push(`# ${c.title}`);
  if (c.description) lines.push(clean(c.description));
  if (Array.isArray(c.documents) && c.documents.length)
    lines.push(`Documents:\n${bulletList(c.documents)}`);
  if (Array.isArray(c.etapes) && c.etapes.length)
    lines.push(`Étapes:\n${bulletList(c.etapes)}`);
  if (Array.isArray(c.casParticuliers) && c.casParticuliers.length)
    lines.push(`Cas particuliers:\n${bulletList(c.casParticuliers)}`);

  const meta = [
    c.frais ? `Frais: ${clean(c.frais)}` : "",
    c.delai ? `Délais: ${clean(c.delai)}` : "",
    c.direction ? `Direction: ${clean(c.direction)}` : "",
    c.cible ? `Cible: ${clean(c.cible)}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  if (meta) lines.push(meta);
  return lines.filter(Boolean).join("\n\n").trim();
}

/* =====================================================
   BUILD PROMPT
===================================================== */
function buildContents({ userText, contextChunks = [], mode = "normal" }) {
  const userTextFinal =
    mode === "outOfScope"
      ? `La question suivante est HORS CONTEXTE administratif ivoirien : "${userText}".
Réponds UNIQUEMENT par :
1) Une phrase indiquant que c'est hors contexte.
2) Une liste de 3 à 5 suggestions de sujets administratifs ivoiriens.`
      : `Mets en forme une réponse claire et structurée pour l’utilisateur, en suivant ce gabarit :

## 📝 **Résumé**
## 📄 **Pièces à fournir**
## ⚖️ **Cas particuliers**
## ⏳ **Délais**
## 💰 **Frais**
## 🏛️ **Service compétent**

Contraintes :
- Pas d’URL ni de section "Source".
- Si extraits fournis, les utiliser STRICTEMENT.
- Sinon, donner une réponse générique pour la Côte d’Ivoire.
Question : "${userText}"`;

  const parts = [{ text: userTextFinal }];

  if (contextChunks?.length) {
    const ctx = contextChunks
      .slice(0, 4)
      .map(stringifyChunk)
      .filter(Boolean)
      .join("\n\n---\n\n");

    if (ctx) {
      parts.unshift({
        text: "Contexte strict :\n\n" + ctx + "\n\n---\n\n",
      });
    }
  }

  return [{ role: "user", parts }];
}

/* =====================================================
   POST-FORMAT MARKDOWN
===================================================== */
function postFormatMarkdown(s) {
  if (!s) return s;

  let out = s
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[•·▪︎]/g, "-")
    .replace(/^\s*-\s*-\s*/gm, "- ")
    .trim();

  out = out
    .replace(/^résumé.*$/gim, "## 📝 **Résumé**")
    .replace(/^pi[eè]ces.*$/gim, "## 📄 **Pièces à fournir**")
    .replace(/^cas.*$/gim, "## ⚖️ **Cas particuliers**")
    .replace(/^d[ée]lais.*$/gim, "## ⏳ **Délais**")
    .replace(/^frais.*$/gim, "## 💰 **Frais**")
    .replace(/^service.*$/gim, "## 🏛️ **Service compétent**");

  out = out.replace(/^\s*Source\s*:.*$/gim, "");
  return out.trim();
}

/* =====================================================
   SERVICE GEMINI (APPEL BACKEND)
===================================================== */
export const GeminiService = {
  async generateContent({ userText, contextChunks = [], mode = "normal" }) {
    try {
      const body = {
        contents: buildContents({ userText, contextChunks, mode }),
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        generationConfig: {
          temperature: mode === "outOfScope" ? 0.1 : 0.4,
          maxOutputTokens: 2048,
        },
      };

      // 🔥 APPEL UNIQUEMENT AU BACKEND KUYO
      const data = await BaseService.request("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return raw ? postFormatMarkdown(raw) : "⚠️ Pas de réponse de KUYO.";
    } catch (error) {
      console.error("Erreur Gemini frontend:", error);
      return "⚠️ Erreur lors de l'appel à KUYO.";
    }
  },
};
