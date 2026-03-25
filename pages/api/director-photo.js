// pages/api/director-photo.js
// Searches TMDB by director name, returns best match profile photo
// Usage: GET /api/director-photo?name=Ram+Gopal+Varma

export default async function handler(req, res) {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: "name param required" });
  }

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "TMDB_API_KEY not set" });
  }

  try {
    const searchRes = await fetch(
      `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(name)}&include_adult=false`,
      { headers: { Accept: "application/json" } }
    );

    if (!searchRes.ok) {
      return res.status(502).json({ error: "TMDB search failed" });
    }

    const data = await searchRes.json();
    const results = data.results || [];

    // Pick best match: prefer known_for_department = Directing, highest popularity
    const directors = results.filter(
      (p) => p.known_for_department === "Directing"
    );
    const best = directors.length > 0 ? directors[0] : results[0];

    if (!best || !best.profile_path) {
      return res.status(200).json({ photo: null });
    }

    const photo = `https://image.tmdb.org/t/p/w300${best.profile_path}`;
    const tmdbId = best.id;
    const knownFor = (best.known_for || [])
      .filter((m) => m.media_type === "movie")
      .slice(0, 3)
      .map((m) => m.title || m.original_title);

    // Cache for 7 days — director photos don't change often
    res.setHeader("Cache-Control", "public, max-age=604800, stale-while-revalidate=86400");
    return res.status(200).json({ photo, tmdbId, knownFor });

  } catch (err) {
    console.error("director-photo error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
