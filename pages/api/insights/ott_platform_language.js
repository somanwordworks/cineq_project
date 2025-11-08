


// /pages/api/insights/ott_platform_language.js




const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, retries = 3, timeoutMs = 8000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { "User-Agent": "CINEQ-Insights/1.0" },
      });
      clearTimeout(timeout);
      if (res.ok) return await res.json();
    } catch (e) {
      if (attempt === retries) throw e;
      await delay(500 * attempt);
    }
  }
  return null;
}

export default async function handler(req, res) {
  const lang = req.query.lang || "en"; // en | te | hi
  const region = "IN";
  const year = new Date().getFullYear();
  const start = `${year}-01-01`;
  const end = `${year}-12-31`;

  try {
    const discoverUrl = `https://api.themoviedb.org/3/discover/movie?with_original_language=${lang}&region=${region}&primary_release_date.gte=${start}&primary_release_date.lte=${end}&sort_by=popularity.desc&api_key=${process.env.TMDB_API_KEY}`;
    const moviesData = await fetchWithRetry(discoverUrl);
    const movies = moviesData?.results?.slice(0, 10) || [];

    const platformMap = {};
    const detailedMovies = [];

    for (const movie of movies) {
      const provUrl = `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${process.env.TMDB_API_KEY}`;
      const prov = await fetchWithRetry(provUrl);
      const providers = prov?.results?.[region]?.flatrate || [];

      for (const p of providers) {
        platformMap[p.provider_name] = (platformMap[p.provider_name] || 0) + 1;
      }

      detailedMovies.push({
        Title: movie.title,
        Popularity: Math.round(movie.popularity),
        Providers: providers.map((p) => p.provider_name),
        Poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
          : null,
      });
    }

    const platforms = Object.entries(platformMap)
      .map(([Platform, Titles]) => ({ Platform, Titles }))
      .sort((a, b) => b.Titles - a.Titles);

    const metrics = {
      language: lang,
      totalMovies: detailedMovies.length,
      totalPlatforms: platforms.length,
      topPlatform: platforms[0]?.Platform || "N/A",
      topPlatformCount: platforms[0]?.Titles || 0,
    };

    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
    res.status(200).json({ metrics, platforms, movies: detailedMovies });
  } catch (err) {
    console.error("OTT Platform Fetch failed:", err.message);
    res.status(500).json({ error: err.message });
  }
}
