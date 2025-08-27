export default async function handler(req, res) {
  const token = process.env.TMDB_ACCESS_TOKEN;

  try {
    // Discover Telugu movies only
    const response = await fetch(
      "https://api.themoviedb.org/3/discover/movie?with_original_language=te&sort_by=popularity.desc&page=1",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("TMDB fetch failed");

    const data = await response.json();

    const posters = (data.results || []).slice(0, 12).map((m) => ({
      id: m.id,
      title: m.title || m.original_title,
      releaseDate: m.release_date || "TBA",
      poster: m.poster_path
        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
        : "/placeholder.jpg",
      overview: m.overview || "",
    }));

    return res.status(200).json({ posters, source: "server" });
  } catch (error) {
    console.error("PosterPathshala error:", error);
    return res.status(200).json({ posters: [], source: "fallback" });
  }
}
