// /pages/api/insights/boxoffice.js
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, retries = 3, timeoutMs = 8000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetch(url, {
                signal: controller.signal,
                headers: { "User-Agent": "CINEQ-Insights/1.0" },
            });
            clearTimeout(timeout);
            if (response.ok) return await response.json();
            console.warn(`TMDB fetch attempt ${attempt} failed: ${response.status}`);
        } catch (err) {
            console.warn(`TMDB retry ${attempt}/${retries} failed: ${err.message}`);
            if (attempt === retries) throw err;
            await delay(600 * attempt);
        }
    }
    return null;
}

export default async function handler(req, res) {
    const year = req.query.year || new Date().getFullYear();
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    if (!process.env.TMDB_API_KEY) {
        return res.status(500).json({ error: "TMDB_API_KEY not configured" });
    }

    const discoverUrl = `https://api.themoviedb.org/3/discover/movie?with_original_language=te&primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}&sort_by=revenue.desc&region=IN&api_key=${process.env.TMDB_API_KEY}`;

    try {
        const data = await fetchWithRetry(discoverUrl);
        if (!data?.results?.length) {
            return res.status(200).json({ movies: [], metrics: { note: "no-results" } });
        }

        const moviesRaw = await Promise.all(
            data.results.slice(0, 10).map(async (movie) => {
                const detailsUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.TMDB_API_KEY}`;
                try {
                    const details = await fetchWithRetry(detailsUrl, 3, 8000);
                    const revenueUSD = details?.revenue ? Math.round(details.revenue / 1_000_000) : 0;
                    const budgetUSD = details?.budget ? Math.round(details.budget / 1_000_000) : 0;
                    return {
                        Movie: movie.title,
                        "Release Date": movie.release_date,
                        "Revenue (Million USD)": revenueUSD,
                        "Budget (Million USD)": budgetUSD,
                        Poster: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : null,
                        _rawDetailsPresent: !!details,
                    };
                } catch (err) {
                    console.error(`Error fetching details for ${movie.title}: ${err.message}`);
                    return {
                        Movie: movie.title,
                        "Release Date": movie.release_date,
                        "Revenue (Million USD)": 0,
                        "Budget (Million USD)": 0,
                        Poster: null,
                        _rawDetailsPresent: false,
                    };
                }
            })
        );

        // Keep raw list (for charts) but compute metrics only on valid entries
        const movies = moviesRaw.slice(); // raw list for frontend charts

        // Define valid records as both revenue and budget > 0
        const validMovies = moviesRaw.filter(
            (m) =>
                m &&
                Number.isFinite(m["Revenue (Million USD)"]) &&
                Number.isFinite(m["Budget (Million USD)"]) &&
                m["Revenue (Million USD)"] > 0 &&
                m["Budget (Million USD)"] > 0
        );

        const totalConsidered = validMovies.length;
        let metrics;
        if (totalConsidered === 0) {
            // Not enough valid data to compute meaningful percentages
            metrics = {
                totalMoviesReturned: movies.length,
                validMoviesCount: 0,
                successRate: null,
                breakEvenRate: null,
                underperformRate: null,
                note: "insufficient-data",
            };
        } else {
            const success = validMovies.filter((m) => m["Revenue (Million USD)"] > m["Budget (Million USD)"]).length;
            const breakEven = validMovies.filter((m) => {
                const rev = m["Revenue (Million USD)"];
                const bud = m["Budget (Million USD)"];
                return bud > 0 && Math.abs(rev - bud) / bud <= 0.1; // within 10%
            }).length;
            const underperform = totalConsidered - success - breakEven;

            metrics = {
                totalMoviesReturned: movies.length,
                validMoviesCount: totalConsidered,
                successRate: Number(((success / totalConsidered) * 100).toFixed(1)),
                breakEvenRate: Number(((breakEven / totalConsidered) * 100).toFixed(1)),
                underperformRate: Number(((underperform / totalConsidered) * 100).toFixed(1)),
                note: "ok",
            };
        }

        // Sort movies for chart display (still include movies with zero values)
        const sortedMovies = movies.sort(
            (a, b) => (b["Revenue (Million USD)"] || 0) - (a["Revenue (Million USD)"] || 0)
        );

        res.setHeader("Cache-Control", "no-store");
        return res.status(200).json({ metrics, movies: sortedMovies });
    } catch (error) {
        console.error("TMDB BoxOffice Fetch Failed:", error.message);
        return res.status(500).json({ error: "fetch_failed", details: error.message });
    }
}
