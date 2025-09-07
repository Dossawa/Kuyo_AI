// api/weaviateService.js
const WEAVIATE_GRAPHQL = import.meta?.env?.VITE_WEAVIATE_GRAPHQL_URL || "http://localhost:8080/v1/graphql";
const DEFAULT_LIMIT = 12;
const DEFAULT_ALPHA = 0.35;
const SEARCH_PROPS = ["title","aliases","search_text","description","documents","etapes","frais","cible","delai","direction"];

function clientScore(doc, query) {
  const q = (query || "").toLowerCase();
  const tokens = q.split(/\W+/).filter(Boolean);
  const hay = [doc.title, doc.description, Array.isArray(doc.documents) ? doc.documents.join(" ") : "", doc.frais, doc.delai, doc.direction]
    .filter(Boolean).join(" ").toLowerCase();
  let hits = 0; tokens.forEach(t => { if (t.length >= 3 && hay.includes(t)) hits++; });
  return (Number(doc._additional?.score || 0) * 0.8) + Math.min(hits, 5) * 0.2;
}

async function doGraphQL(query) {
  const res = await fetch(WEAVIATE_GRAPHQL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query }) });
  const text = await res.text(); let data; try { data = JSON.parse(text); } catch { data = { raw: text }; }
  return res.ok ? { ok: true, data } : { ok: false, data };
}

function buildHybridQuery(msg, limit, alpha = DEFAULT_ALPHA) {
  const propsArr = SEARCH_PROPS.map((p) => `"${p}"`).join(", ");
  return `{ Get { Document(hybrid:{query:${JSON.stringify(msg)},alpha:${alpha},properties:[${propsArr}]},limit:${limit}){title description documents frais cible delai direction url _additional{score}} } }`;
}
function buildBm25Query(msg, limit) {
  const propsArr = SEARCH_PROPS.map((p) => `"${p}"`).join(", ");
  return `{ Get { Document(bm25:{query:${JSON.stringify(msg)},properties:[${propsArr}]},limit:${limit}){title description documents frais cible delai direction url _additional{score}} } }`;
}

export const WeaviateService = {
  async query(message, limit = DEFAULT_LIMIT) {
    try {
      const h = await doGraphQL(buildHybridQuery(message, limit));
      let results = h.ok ? h.data?.data?.Get?.Document : [];
      if (!results?.length) {
        const b = await doGraphQL(buildBm25Query(message, limit));
        results = b.ok ? b.data?.data?.Get?.Document : [];
      }
      if (results?.length > 1) {
        results = results.map(d => ({ ...d, __clientScore: clientScore(d, message) }))
          .sort((a, b) => b.__clientScore - a.__clientScore)
          .map(({ __clientScore, ...rest }) => rest);
      }
      return results || [];
    } catch (err) {
      console.error("❌ WeaviateService.query error:", err);
      return [];
    }
  }
};
