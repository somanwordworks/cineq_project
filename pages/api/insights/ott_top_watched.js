

///pages/api/insights/ott_top_watched.js//


const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, retries = 3, timeoutMs = 8000) {
  for (let i = 1; i <= retries; i++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) return await res.json();
    } catch (e) {
      if (i === retries) throw e;
      await delay(500 * i);
    }
  }
  return null;
}

export default async function handler(req, res) {
  const lang = req.query.lang || "en"; // en | te | hi
  const region = "IN";

  try {
    // 🎯 Use discover endpoint instead of trending (true language filter)
      const year = req.query.year || new Date().getFullYear();
      const discoverUrl = `https://api.themoviedb.org/3/discover/movie?with_original_language=${lang}&region=${region}&primary_release_year=${year}&sort_by=popularity.desc&api_key=${process.env.TMDB_API_KEY}`;
    const data = await fetchWithRetry(discoverUrl);

    if (!data?.results?.length)
      return res.status(200).json({ metrics: {}, movies: [] });

    const platformMap = {};
    const watchedMovies = [];

    for (const movie of data.results.slice(0, 15)) {
      const provUrl = `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${process.env.TMDB_API_KEY}`;
      const prov = await fetchWithRetry(provUrl);
      const providers = prov?.results?.[region]?.flatrate || [];

      // Skip movies not streaming on any OTT platform
      if (!providers.length) continue;

      // Count platform frequency
      for (const p of providers) {
        platformMap[p.provider_name] = (platformMap[p.provider_name] || 0) + 1;
      }

      watchedMovies.push({
        Title: movie.title,
        Popularity: Math.round(movie.popularity),
        Rating: movie.vote_average || "N/A",
        Providers: providers.map((p) => p.provider_name),
        Poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
          : null,
      });
    }

    const sortedMovies = watchedMovies
      .sort((a, b) => b.Popularity - a.Popularity)
      .slice(0, 10);

    const platforms = Object.entries(platformMap)
      .map(([Platform, Titles]) => ({ Platform, Titles }))
      .sort((a, b) => b.Titles - a.Titles);

    const metrics = {
      totalMovies: sortedMovies.length,
      topMovie: sortedMovies[0]?.Title || "N/A",
      topScore: sortedMovies[0]?.Popularity || "N/A",
      topPlatform: platforms[0]?.Platform || "N/A",
      topPlatformCount: platforms[0]?.Titles || 0,
      language: lang,
    };

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.status(200).json({ metrics, platforms, movies: sortedMovies });
  } catch (err) {
    console.error("OTT Top Watched Error:", err.message);
    res.status(500).json({ error: "Failed to fetch OTT top watched data" });
  }
}
