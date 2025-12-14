// server.js – Proxy / Scraper / Gemini pour KUYO
// ==============================================

// 🔐 Charger les variables d’environnement AVANT TOUT
require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const { GoogleAuth } = require("google-auth-library");

const app = express();
const PORT = process.env.PORT || 5000;

// ================= MIDDLEWARES =================
app.use(cors());
app.use(express.json()); // requis pour Gemini

// ================= CONFIG GOOGLE CLOUD / GEMINI =================
const PROJECT_ID = process.env.GCP_PROJECT_ID;
const LOCATION = process.env.GCP_LOCATION || "global";
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

// 🔴 Sécurité : bloquer si PROJECT_ID manquant
if (!PROJECT_ID) {
  console.error("❌ ERREUR : GCP_PROJECT_ID manquant dans le fichier .env");
  process.exit(1);
}

const GEMINI_URL =
  `https://aiplatform.googleapis.com/v1/projects/${PROJECT_ID}` +
  `/locations/${LOCATION}/publishers/google/models/${MODEL}:generateContent`;

const auth = new GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
});

// Logs de vérification
console.log("✅ PROJECT_ID =", PROJECT_ID);
console.log("✅ GEMINI_MODEL =", MODEL);

// ================= ROUTE GEMINI (IA) =================
app.post("/api/gemini", async (req, res) => {
  try {
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    const response = await axios.post(
      GEMINI_URL,
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken.token}`,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(
      "❌ Erreur Gemini :",
      err?.response?.data || err.message
    );

    res.status(500).json({
      error: "Erreur lors de l'appel à Gemini",
      details: err?.response?.data || null,
    });
  }
});

// ================= ROUTE SCRAPING ONECI =================
app.get("/scrape/oneci", async (req, res) => {
  try {
    const { q } = req.query; // ?q=carte+identité
    const response = await axios.get("https://www.oneci.ci/");

    const $ = cheerio.load(response.data);
    let results = [];

    $("a").each((i, elem) => {
      const text = $(elem).text().toLowerCase();
      if (q && text.includes(q.toLowerCase())) {
        results.push({
          title: text.trim(),
          href: $(elem).attr("href"),
        });
      }
    });

    if (results.length === 0) {
      return res.json({
        message: "Aucune information trouvée sur le site public.",
      });
    }

    res.json({ results });
  } catch (err) {
    console.error("❌ Erreur scraping :", err);
    res.status(500).json({
      error: "Erreur lors du scraping.",
    });
  }
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`🚀 KUYO Backend actif sur http://localhost:${PORT}`);
});
