// pages/api/ott-releasing.js
export const config = { api: { bodyParser: false } };
export const dynamic = "force-dynamic";
export const revalidate = 0;

const V3 = process.env.TMDB_API_KEY;
const V4 = process.env.TMDB_ACCESS_TOKEN;

// 🟢 In-memory cache (resets if server restarts)
let cache = { data: null, expiry: 0 };

function authOpts() {
    return V4
        ? { headers: { Authorization: `Bearer ${V4}`, accept: "application/json" }, cache: "no-store" }
        : { cache: "no-store" };
}
function addKey(url) {
    if (!V4 && V3) url.searchParams.set("api_key", V3);
    return url;
}
function toISO(d) {
    return d.toISOString().slice(0, 10);
}
async function safeFetch(url) {
    try {
        const r = await fetch(url, authOpts());
        if (!r.ok) {
            console.error("❌ Fetch failed:", url.toString(), r.status);
            return null;
        }
        return await r.json();
    } catch (err) {
        console.error("❌ Fetch exception:", url.toString(), err.message);
        return null;
    }
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export default async function handler(req, res) {
    if (!V3 && !V4) return res.status(500).json({ error: "TMDB key missing" });

    const now = Date.now();
    const forceRefresh = req.query.force === "true";

    if (!forceRefresh && cache.data && cache.expiry > now) {
        console.log("⚡ Serving OTT results from cache");
        res.setHeader("Cache-Control", "no-store, max-age=0");
        return res.status(200).json({ results: cache.data });
    }

    const today = new Date();

    // Past 60 days
    const past60 = new Date(today);
    past60.setDate(today.getDate() - 60);

    // Future 45 days
    const plus45 = new Date(today);
    plus45.setDate(today.getDate() + 45);

    let finalList = [];

    try {
        const discover = new URL("https://api.themoviedb.org/3/discover/movie");
        discover.searchParams.set("region", "IN");
        discover.searchParams.set("primary_release_date.gte", toISO(past60));
        discover.searchParams.set("primary_release_date.lte", toISO(plus45));
        discover.searchParams.set("sort_by", "primary_release_date.asc");
        discover.searchParams.set("with_original_language", "te"); // Telugu only
        addKey(discover);

        const moviesResp = await safeFetch(discover);
        if (moviesResp) {
            const movies = (moviesResp?.results || []).slice(0, 40);
            console.log("🎬 Found", movies.length, "Telugu movies (-60 to +45 days)");

            for (const m of movies) {
                await delay(300); // 🟢 throttle

                let platform = "TBA";
                try {
                    const provUrl = new URL(`https://api.themoviedb.org/3/movie/${m.id}/watch/providers`);
                    addKey(provUrl);
                    const provResp = await safeFetch(provUrl);
                    const provIN = provResp?.results?.IN || {};
                    const ott = provIN.flatrate || provIN.buy || provIN.rent || [];
                    if (ott.length) {
                        platform = ott.map((p) => p.provider_name).join(", ");
                    }
                } catch (err) {
                    console.error("❌ Provider fetch failed for movie:", m.id, err.message);
                }

                finalList.push({
                    id: m.id,
                    title: m.title || m.original_title,
                    releaseDate: m.release_date || "TBA",
                    poster: m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : null,
                    platform,
                });
            }
        }
    } catch (e) {
        console.error("❌ OTT discover error:", e.message);
    }

    // Fallback if no results
    if (!finalList.length) {
        console.warn("⚠️ No OTT data from TMDB, returning fallback placeholders");
        finalList = [
            { id: "f1", title: "OTT Release Coming Soon", releaseDate: "TBA", poster: null, platform: "TBA" },
            { id: "f2", title: "Awaiting Provider Data", releaseDate: "TBA", poster: null, platform: "TBA" },
            { id: "f3", title: "OTT Title Placeholder", releaseDate: "TBA", poster: null, platform: "TBA" },
        ];
    }

    console.log("✅ Returning", finalList.length, "OTT results");

    // Cache for 1 hour
    cache = { data: finalList, expiry: now + 3600000 };

    res.setHeader("Cache-Control", "no-store, max-age=0");
    return res.status(200).json({ results: finalList });
}
