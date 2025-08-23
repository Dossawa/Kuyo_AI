// server.js – Proxy/Scraper pour KUYO

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

// Exemple : Scraper des infos du site oneci.ci
app.get('/scrape/oneci', async (req, res) => {
  try {
    const { q } = req.query; // ?q=carte+identité
    const response = await axios.get('https://www.oneci.ci/');

    const $ = cheerio.load(response.data);
    let results = [];

    $('a').each((i, elem) => {
      const text = $(elem).text().toLowerCase();
      if (text.includes(q.toLowerCase())) {
        results.push({
          title: text.trim(),
          href: $(elem).attr('href')
        });
      }
    });

    if (results.length === 0) {
      return res.json({ message: "Aucune information trouvée sur le site public." });
    }

    res.json({ results });

  } catch (err) {
    console.error("Erreur scraping:", err);
    res.status(500).json({ error: "Erreur lors du scraping." });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy KUYO actif sur http://localhost:${PORT}`);
});
