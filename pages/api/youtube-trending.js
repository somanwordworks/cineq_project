import fetch from "node-fetch";

const YT_BASE = "https://www.googleapis.com/youtube/v3/videos";
const MAX_RESULTS = 50;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

let cache = { ts: 0, data: null };

/* -------------------------------- CONTENT KEYWORDS (ALL TAB) -------------------------------- */
const movieContentKeywords = [
    "trailer",
    "teaser",
    "glimpse",
    "first look",
    "promo",
    "official trailer",
    "official teaser",
    "song",
    "lyrical",
    "first single",
    "title song",
    "theme song",
];

/* -------------------------------- TELUGU INTELLIGENCE -------------------------------- */
const TELUGU_HEROES = [
    "prabhas",
    "mahesh babu",
    "jr ntr",
    "ntr",
    "ram charan",
    "allu arjun",
    "pawan kalyan",
    "vijay deverakonda",
    "nani",
    "chiranjeevi",
    "balakrishna",
    "nagarjuna",
    "ram pothineni",
    "akhil",
    "varun tej",
    "sai dharam tej",
];

const TELUGU_PRODUCTIONS = [
    "mythri movie makers",
    "geetha arts",
    "haarika hassine",
    "vyjayanthi movies",
    "sithara entertainments",
    "dvvc",
    "people media factory",
    "14 reels",
    "suresh productions",
    "annapurna studios",
];

const TELUGU_INTENT = [
    "trailer",
    "teaser",
    "glimpse",
    "first look",
    "official trailer",
    "official teaser",
    "ట్రైలర్",
    "టీజర్",
    "గ్లింప్స్",
];

/* ---------------------------- ALL CONTENT DETECTION ---------------------------- */
function isMovieContent(title = "", description = "", channel = "") {
    const text = `${title} ${description} ${channel}`.toLowerCase();

    const hasMovieKeyword = movieContentKeywords.some((k) =>
        text.includes(k)
    );
    if (!hasMovieKeyword) return false;

    const rejectKeywords = ["reaction", "review"];
    if (rejectKeywords.some((k) => text.includes(k))) return false;

    return true;
}

/* ---------------------------- TELUGU CONTENT DETECTION ---------------------------- */
function isTeluguCinema(item) {
    const text = `${item.title} ${item.description}`.toLowerCase();
    const channel = item.channelTitle.toLowerCase();

    const heroMatch = TELUGU_HEROES.some((h) => text.includes(h));
    const prodMatch = TELUGU_PRODUCTIONS.some((p) =>
        channel.includes(p)
    );
    const intentMatch = TELUGU_INTENT.some((i) =>
        text.includes(i)
    );

    return intentMatch && (heroMatch || prodMatch);
}

/* ---------------------------- TIME CALC ---------------------------- */
function hoursSince(publishedAt) {
    const now = Date.now();
    const pub = new Date(publishedAt).getTime();
    const hrs = (now - pub) / (1000 * 60 * 60);

    // minimum 15 minutes
    return Math.max(hrs, 0.25);
}

/* -------------------------------- HANDLER -------------------------------- */
export default async function handler(req, res) {
    try {
        const lang = req.query.lang || "all";

        // cache only for ALL tab
        if (
            lang === "all" &&
            Date.now() - cache.ts < CACHE_TTL &&
            cache.data
        ) {
            return res.status(200).json(cache.data);
        }

        const key = process.env.YOUTUBE_API_KEY;
        if (!key) {
            return res.status(500).json({ error: "YOUTUBE_API_KEY missing" });
        }

        const params = new URLSearchParams({
            key,
            part: "snippet,statistics,contentDetails",
            chart: "mostPopular",
            regionCode: "IN",
            maxResults: String(MAX_RESULTS),
        });

        const url = `${YT_BASE}?${params.toString()}`;
        const resp = await fetch(url);

        if (!resp.ok) {
            const txt = await resp.text();
            return res.status(resp.status).json({
                error: "YouTube API error",
                details: txt,
            });
        }

        const json = await resp.json();

        /* -------------------------------- PARSE -------------------------------- */
        let items = (json.items || [])
            .map((it) => {
                const s = it.snippet || {};
                const st = it.statistics || {};

                return {
                    id: it.id,
                    title: s.title || "",
                    description: s.description || "",
                    channelTitle: s.channelTitle || "",
                    publishedAt: s.publishedAt || "",
                    viewCount: Number(st.viewCount || 0),
                    likeCount: Number(st.likeCount || 0),
                    commentCount: Number(st.commentCount || 0),
                    thumbnail:
                        s.thumbnails?.maxres?.url ||
                        s.thumbnails?.high?.url ||
                        s.thumbnails?.medium?.url ||
                        s.thumbnails?.default?.url ||
                        null,
                    url: `https://www.youtube.com/watch?v=${it.id}`,
                };
            })
            .filter((it) =>
                isMovieContent(it.title, it.description, it.channelTitle)
            );

        /* ---------------- TELUGU MODE FILTER ---------------- */
        if (lang === "telugu") {
            items = items.filter(isTeluguCinema);
        }

        /* ---------------- ENRICH METRICS ---------------- */
        const enriched = items.map((it) => {
            let hrs = hoursSince(it.publishedAt);
            if (hrs > 24) hrs = 24;

            const vph =
                it.viewCount > 0
                    ? Math.max(1, Math.round(it.viewCount / hrs))
                    : 0;

            return {
                ...it,
                hoursSincePublished: hrs,
                viewsPerHour: vph,
            };
        });

        /* ---------------- SORT ---------------- */
        enriched.sort((a, b) => {
            const diff = b.viewsPerHour - a.viewsPerHour;
            if (diff !== 0) return diff;
            return b.viewCount - a.viewCount;
        });

        const result = {
            fetchedAt: new Date().toISOString(),
            total: enriched.length,
            mode: lang,
            results: enriched,
        };

        if (lang === "all") {
            cache = { ts: Date.now(), data: result };
        }

        res.status(200).json(result);
    } catch (err) {
        console.error("YT trending API error", err);
        res.status(500).json({
            error: "internal_error",
            details: String(err),
        });
    }
}
