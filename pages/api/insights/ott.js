// /pages/api/insights/ott.js

// 🔁 Utility: small delay for retry backoff
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 🧠 Safe fetch with retry + timeout
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

            if (response.ok) {
                return await response.json();
            } else {
                console.warn(
                    `TMDB OTT fetch attempt ${attempt} failed: ${response.status}`
                );
            }
        } catch (err) {
            console.warn(`TMDB OTT retry ${attempt}/${retries} failed: ${err.message}`);
            if (attempt === retries) throw err;
            await delay(600 * attempt); // progressive backoff
        }
    }
}

export default async function handler(req, res) {
    const region = req.query.region || "IN"; // default India
    const providersUrl = `https://api.themoviedb.org/3/watch/providers/movie?watch_region=${region}&api_key=${process.env.TMDB_API_KEY}`;

    try {
        const data = await fetchWithRetry(providersUrl);

        if (!data || !data.results || data.results.length === 0) {
            console.warn("TMDB: No OTT provider data found.");
            return res.status(200).json([]);
        }

        // ✅ Sort and prepare top OTT platforms
        const platforms = (data.results || [])
            .sort((a, b) => a.display_priority - b.display_priority)
            .slice(0, 8)
            .map((p) => ({
                Platform: p.provider_name,
                Logo: p.logo_path
                    ? `https://image.tmdb.org/t/p/original${p.logo_path}`
                    : null,
                // 🔹 Placeholder metrics for now (to be replaced later with real data)
                Titles: Math.floor(Math.random() * 40) + 10, // number of titles released
                Popularity: Math.floor(Math.random() * 100), // engagement / buzz metric
            }));

        res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate"); // 24h cache
        res.status(200).json(platforms);
    } catch (error) {
        console.error("❌ TMDB OTT Fetch Failed:", error.message);
        res.status(500).json({
            error: "Failed to fetch OTT data",
            details: error.message,
        });
    }
}
