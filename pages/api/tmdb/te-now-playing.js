// pages/api/te-now-playing.js
export const config = { api: { bodyParser: false } };
export const dynamic = "force-dynamic";

const V3 = process.env.TMDB_API_KEY;
const V4 = process.env.TMDB_ACCESS_TOKEN;

function authOpts() {
    return V4
        ? { headers: { Authorization: `Bearer ${V4}`, accept: "application/json" }, cache: "no-store" }
        : { cache: "no-store" };
}
function addKey(url) { if (!V4 && V3) url.searchParams.set("api_key", V3); return url; }
function uniqBy(arr, key = "id") { const seen = new Set(); return arr.filter(x => (seen.has(x[key]) ? false : (seen.add(x[key]), true))); }
function toISO(d) { return d.toISOString().slice(0, 10); }

async function safeFetch(url) {
    try {
        const r = await fetch(url, authOpts());
        if (!r.ok) return [];
        const j = await r.json();
        return Array.isArray(j.results) ? j.results : [];
    } catch { return []; }
}

export default async function handler(req, res) {
    if (!V3 && !V4) return res.status(500).json({ error: "TMDB key missing" });

    const today = new Date();
    const plus90 = new Date(today); plus90.setDate(today.getDate() + 90);

    try {
        // Now Playing Telugu (India)
        const np = new URL("https://api.themoviedb.org/3/movie/now_playing");
        np.searchParams.set("region", "IN"); np.searchParams.set("page", "1"); addKey(np);
        const nowPlayingTe = (await safeFetch(np)).filter(m => m.original_language === "te");

        // Upcoming Telugu (next 90 days, India)
        const up = new URL("https://api.themoviedb.org/3/discover/movie");
        up.searchParams.set("with_original_language", "te");
        up.searchParams.set("primary_release_date.gte", toISO(today));
        up.searchParams.set("primary_release_date.lte", toISO(plus90));
        up.searchParams.set("with_release_type", "2|3");
        up.searchParams.set("region", "IN");
        up.searchParams.set("sort_by", "primary_release_date.asc");
        addKey(up);
        const upcomingTe = await safeFetch(up);

        // ✅ Only Now Playing + Upcoming (no past movies)
        const merged = uniqBy([...nowPlayingTe, ...upcomingTe], "id").slice(0, 30);

        return res.status(200).json({ results: merged });
    } catch (e) {
        return res.status(500).json({ error: e?.message || "Unknown error" });
    }
}
