const puppeteer = require("puppeteer");

async function scrapeTrendingLetterboxd() {
  const url = "https://letterboxd.com/films/popular/this/week/";

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Spoof real browser
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
  );

  await page.goto(url, { waitUntil: "domcontentloaded" });

  // Wait for poster list to be loaded
  await page.waitForSelector("ul.poster-list li");

  const movies = await page.evaluate(() => {
    const movieEls = document.querySelectorAll("ul.poster-list li");
    const results = [];

    for (let i = 0; i < Math.min(10, movieEls.length); i++) {
      const anchor = movieEls[i].querySelector("a");
      const img = movieEls[i].querySelector("img");

      const title = anchor?.getAttribute("title")?.trim();
      const link = anchor ? "https://letterboxd.com" + anchor.getAttribute("href") : null;
      const poster = img?.getAttribute("data-src") || img?.getAttribute("src");

      if (title && link && poster) {
        results.push({ title, link, poster });
      }
    }

    return results;
  });

  await browser.close();

  if (!movies || movies.length === 0) {
    console.log("❌ Still no movies found. Try inspecting the page structure again.");
  } else {
    console.log("🎬 Trending on Letterboxd:\n");
    movies.forEach((movie, i) => {
      console.log(`${i + 1}. ${movie.title}`);
      console.log("🔗", movie.link);
      console.log("🖼", movie.poster);
      console.log("—");
    });
  }

  return movies;
}

scrapeTrendingLetterboxd();
