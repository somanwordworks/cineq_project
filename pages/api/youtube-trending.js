// pages/api/youtube-trending.js
import fetch from 'node-fetch';

const YT_BASE = 'https://www.googleapis.com/youtube/v3/videos';
const MAX_RESULTS = 50;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

let cache = { ts: 0, data: null };

const trailerKeywords = [
    'trailer', 'teaser', 'glimpse', 'first look', 'promo', 'official trailer', 'official teaser', 'jukebox'
];
const languageHints = [
    'telugu', 'tamil', 'hindi', 'kannada', 'malayalam', 'tollywood', 'kollywood', 'bollywood', 'sandalwood', 'mollywood'
];

// Identify if it's a movie trailer
function isTrailer(title, description, channel) {
    const text = `${title} ${description} ${channel}`.toLowerCase();
    const hasTr = trailerKeywords.some(k => text.includes(k));
    const hasLang = languageHints.some(k => text.includes(k));
    return hasTr && (hasLang || text.includes('official') || text.includes('movie') || text.includes('film'));
}

// Calculate hours since upload
function hoursSince(publishedAt) {
    const now = Date.now();
    const pub = new Date(publishedAt).getTime();
    const hrs = (now - pub) / (1000 * 60 * 60);
    return Math.max(hrs, 0.0001);
}

export default async function handler(req, res) {
    try {
        // Serve cached result if fresh
        if (Date.now() - cache.ts < CACHE_TTL && cache.data) {
            return res.status(200).json(cache.data);
        }

        const key = process.env.YOUTUBE_API_KEY;
        if (!key) return res.status(500).json({ error: 'YOUTUBE_API_KEY missing' });

        const params = new URLSearchParams({
            key,
            part: 'snippet,statistics,contentDetails',
            chart: 'mostPopular',
            regionCode: 'IN',
            maxResults: String(MAX_RESULTS),
        });

        const url = `${YT_BASE}?${params.toString()}`;
        const resp = await fetch(url);

        if (!resp.ok) {
            const txt = await resp.text();
            return res.status(resp.status).json({ error: 'YouTube API error', details: txt });
        }

        const json = await resp.json();

        /* --------------------------------- PARSE --------------------------------- */
        const items = (json.items || [])
            .map(it => {
                const snippet = it.snippet || {};
                const stats = it.statistics || {};

                const title = snippet.title || "";
                const desc = snippet.description || "";
                const channelTitle = snippet.channelTitle || "";
                const publishedAt = snippet.publishedAt || "";
                const viewCount = Number(stats.viewCount || 0);
                const likeCount = Number(stats.likeCount || 0);
                const commentCount = Number(stats.commentCount || 0);

                const thumbnails = snippet.thumbnails || {};
                const thumb =
                    (thumbnails.maxres && thumbnails.maxres.url) ||
                    (thumbnails.high && thumbnails.high.url) ||
                    (thumbnails.medium && thumbnails.medium.url) ||
                    (thumbnails.default && thumbnails.default.url) ||
                    null;

                return {
                    id: it.id,
                    title,
                    description: desc,
                    channelTitle,
                    publishedAt,
                    viewCount,
                    likeCount,
                    commentCount,
                    thumbnail: thumb,
                    url: `https://www.youtube.com/watch?v=${it.id}`
                };
            })
            .filter(it => isTrailer(it.title, it.description, it.channelTitle));

        /* ---------------------- ENRICH METRICS (VIEWS PER HOUR) ---------------------- */
        const enriched = items.map(it => {
            let hrs = hoursSince(it.publishedAt);

            // Cap hours to last 24h for trending accuracy
            if (hrs > 24) hrs = 24;

            const vph = it.viewCount / hrs;

            return {
                ...it,
                hoursSincePublished: hrs,
                viewsPerHour: Math.round(vph)
            };
        });


        /* ------------------------------ FIX: SORT BY MOMENTUM ------------------------------ */
        enriched.sort((a, b) => {
            const diff = b.viewsPerHour - a.viewsPerHour;
            if (diff !== 0) return diff;
            return b.viewCount - a.viewCount; // fallback
        });

        /* --------------------------- PREPARE RESULT --------------------------- */
        const result = {
            fetchedAt: new Date().toISOString(),
            total: enriched.length,
            results: enriched
        };

        cache = { ts: Date.now(), data: result };
        res.status(200).json(result);

    } catch (err) {
        console.error('YT trending API error', err);
        res.status(500).json({ error: 'internal_error', details: String(err) });
    }
}
