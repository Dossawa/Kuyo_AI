const puppeteer = require("puppeteer");
const fs = require("fs/promises");

const BASE_URL = "https://servicepublic.gouv.ci";

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  console.log("📄 Chargement de la page d'accueil…");
  await page.goto(`${BASE_URL}/accueil/index/1`, { waitUntil: "networkidle2" });
  console.log("✅ Page d'accueil chargée");

  // 1️⃣ Récupérer thèmes + sous-thèmes
  const themeSections = await page.$$eval(
    "div.thematiques.mb40 div.theme",
    (themes) =>
      themes.map((th) => {
        const a = th.querySelector("h4.theme-title > a");
        return {
          themeName: a?.innerText.trim() || "",
          sousThemes: Array.from(
            th.querySelectorAll("ul.liste-sous-theme > li > a")
          ).map((st) => ({
            name: st.innerText.trim(),
            url:  st.href,
          })),
        };
      })
  );

  const results = [];
  const seen = new Set();

  for (const { themeName, sousThemes } of themeSections) {
    console.log(`\n🔖 Thème : ${themeName}`);
    for (const { name: subName, url: subUrl } of sousThemes) {
      console.log(`  📂 Sous-thème : ${subName}`);

      const subPage = await browser.newPage();
      await subPage.goto(subUrl, { waitUntil: "networkidle2" });

      // 2️⃣ récupérer liens + texte dans sub-theme
      const detailLinks = await subPage.$$eval(
        "div.contenu ul.list-sous-theme li a[href*='detaildemarcheparticulier']",
        (links) =>
          links.map((a) => ({
            url:   a.href.startsWith("http")
                     ? a.href
                     : `${window.location.origin}${a.getAttribute("href")}`,
            title: a.innerText.trim()
          }))
      );
      console.log(`    🔗 ${detailLinks.length} démarches trouvées`);
      await subPage.close();

      // 3️⃣ pour chaque démarche
      for (const { url, title } of detailLinks) {
        if (seen.has(url)) continue;
        seen.add(url);

        const d = await browser.newPage();
        try {
          await d.goto(url, { waitUntil: "networkidle2" });

          // 4️⃣ extraire le bloc principal
          const block = await d.$("div.col.m8.content");
          if (!block) throw new Error("Bloc contenu introuvable");

          const raw = await d.evaluate((el) => el.innerText, block);

          // 5️⃣ parser description, documents, frais, délai, direction
          const description = (raw.match(
            /Description\s*[:\-]?\s*([\s\S]*?)(?=\n\s*(?:\u2013|\-|•|Coût|Délai|Direction|$))/i
          ) || [])[1]?.trim() || "";

          const documents = Array.from(
            raw.matchAll(/(?:\u2013|\-|\•)\s*(.+)/g)
          ).map((m) => m[1].trim());

          const frais = (raw.match(/Coût\s*[:\-]?\s*(.+)/i) || [])[1]?.trim() || "";
          const delai = (raw.match(/Délai\s*[:\-]?\s*(.+)/i) || [])[1]?.trim() || "";
          const direction = (raw.match(/Direction\s*[:\-]?\s*(.+)/i) || [])[1]?.trim() || "";

          results.push({
            theme:     themeName,
            sousTheme: subName,
            title,      // ← on utilise le texte du lien
            url,
            description,
            documents,
            frais,
            delai,
            direction,
          });
          console.log(`      ✅ ${title}`);
        } catch (err) {
          console.warn(`      ❌ Erreur sur ${url} — ${err.message}`);
        } finally {
          await d.close();
        }
      }
    }
  }

  // 6️⃣ déduplication & enregistrement
  await fs.writeFile(
    "scrape-details.json",
    JSON.stringify(results, null, 2),
    "utf-8"
  );
  console.log(`\n✅ Scraping terminé : ${results.length} démarches enregistrées`);

  await browser.close();
})();
