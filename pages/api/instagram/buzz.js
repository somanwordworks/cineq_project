export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/trending/movie/day",
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

    const items = data.results.slice(0, 3).map((movie) => ({
      id: movie.id,
      type: "buzz",
      title: movie.title,
      originalTitle: movie.original_title,
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
    }));

    res.status(200).json({
      type: "cineq_buzz",
      generatedAt: new Date().toISOString(),
      count: items.length,
      items,
    });
  } catch (error) {
    console.error("CINEQ Buzz API Error:", error);
    res.status(500).json({ error: "Failed to fetch TMDB buzz data" });
  }
}
