export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/trending/movie/week",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!data.results || !data.results.length) {
      return res.status(200).json({ items: [] });
    }

    const now = new Date();

    const items = data.results
      .filter((movie) => {
        if (!movie.release_date) return false;
        const releaseDate = new Date(movie.release_date);
        const diffDays =
          (now.getTime() - releaseDate.getTime()) /
          (1000 * 60 * 60 * 24);

        return diffDays <= 90; // released in last 90 days
      })
      .slice(0, 3)
      .map((movie) => ({
        id: movie.id,
        type: "ott_insight",
        title: movie.title,
        overview: movie.overview,
        releaseDate: movie.release_date,
        popularity: movie.popularity,
        rating: movie.vote_average,
        votes: movie.vote_count,
        poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "/placeholder.jpg",
        backdrop: movie.backdrop_path
          ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
          : null,
        source: "TMDB",
      }));

    res.status(200).json({
      type: "ott_insights",
      generatedAt: new Date().toISOString(),
      count: items.length,
      items,
    });
  } catch (error) {
    console.error("OTT Insights API Error:", error);
    res.status(500).json({ error: "Failed to fetch OTT insights" });
  }
}
