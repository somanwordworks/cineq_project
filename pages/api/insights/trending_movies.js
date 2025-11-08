// /api/insights/trending_movies.js
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
  const currentYear = new Date().getFullYear();

  try {
    // 🎯 Filter for current year's releases only
    const year = req.query.year || new Date().getFullYear();
const discoverUrl = `https://api.themoviedb.org/3/discover/movie?with_original_language=${lang}&region=${region}&primary_release_year=${year}&sort_by=popularity.desc&api_key=${process.env.TMDB_API_KEY}`;

    const data = await fetchWithRetry(discoverUrl);

    if (!data?.results?.length)
      return res.status(200).json({ metrics: {}, movies: [] });

    const trendingMovies = data.results.slice(0, 10).map((movie) => ({
      Title: movie.title,
      Popularity: Math.round(movie.popularity),
      Rating: movie.vote_average || "N/A",
      ReleaseDate: movie.release_date || "N/A",
      Poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        : null,
    }));

    const metrics = {
      topMovie: trendingMovies[0]?.Title || "N/A",
      topPopularity: trendingMovies[0]?.Popularity || "N/A",
      totalMovies: trendingMovies.length,
      language: lang,
      year: currentYear,
    };

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.status(200).json({ metrics, movies: trendingMovies });
  } catch (err) {
    console.error("Trending fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch trending data" });
  }
}
