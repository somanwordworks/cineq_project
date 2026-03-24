/// pages/api/insights/ott_top_watched.js ///

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
            clearTimeout(timeout);
            if (i === retries) throw e;
            await delay(500 * i);
        }
    }
    return null;
}

/**
 * TMDB OTT Provider IDs (India)
 */
const OTT_PROVIDER_MAP = {
    netflix: 8,
    prime: 119,
    hotstar: 122,
    jiocinema: 1968,
    zee5: 220,
    aha: 532,
};

export default async function handler(req, res) {
    const lang = req.query.lang || "en";
    const year = parseInt(req.query.year || new Date().getFullYear(), 10);
    const ott = req.query.ott || "all";
    const region = "IN";

    try {
        /**
         * 🎯 IMPORTANT FIX
         * OTT movies must be ALREADY RELEASED.
         * So we use a DATE RANGE, not primary_release_year.
         */
        const fromDate = `${year - 1}-01-01`;
        const toDate = `${year}-12-31`;

        const discoverUrl = `
      https://api.themoviedb.org/3/discover/movie
        ?with_original_language=${lang}
        &region=${region}
        &release_date.gte=${fromDate}
        &release_date.lte=${toDate}
        &sort_by=popularity.desc
        &api_key=${process.env.TMDB_API_KEY}
    `.replace(/\s+/g, "");

        const data = await fetchWithRetry(discoverUrl);

        if (!data?.results?.length) {
            return res.status(200).json({
                metrics: {},
                platforms: [],
                movies: [],
            });
        }

        const platformMap = {};
        const watchedMovies = [];

        const requiredProviderId =
            ott !== "all" ? OTT_PROVIDER_MAP[ott] : null;

        for (const movie of data.results.slice(0, 25)) {
            const provUrl = `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${process.env.TMDB_API_KEY}`;
            const prov = await fetchWithRetry(provUrl);

            const providers = prov?.results?.[region]?.flatrate || [];

            // ❌ Not on OTT
            if (!providers.length) continue;

            // ❌ OTT filter
            if (
                requiredProviderId &&
                !providers.some((p) => p.provider_id === requiredProviderId)
            ) {
                continue;
            }

            // ✅ Count platforms
            for (const p of providers) {
                platformMap[p.provider_name] =
                    (platformMap[p.provider_name] || 0) + 1;
            }

            watchedMovies.push({
                Title: movie.title,
                Popularity: Math.round(movie.popularity),
                Rating: movie.vote_average || "N/A",
                Providers: providers.map((p) => p.provider_name),
                Poster: movie.poster_path
                    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                    : null,
                ReleaseDate: movie.release_date || null,
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
            ott,
            period: `${fromDate} → ${toDate}`,
        };

        res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
        res.status(200).json({
            metrics,
            platforms,
            movies: sortedMovies,
        });
    } catch (err) {
        console.error("OTT Top Watched Error:", err.message);
        res.status(500).json({
            error: "Failed to fetch OTT top watched data",
        });
    }
}
