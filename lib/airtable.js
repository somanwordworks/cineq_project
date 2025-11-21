import Airtable from 'airtable';

// Airtable Base setup using environment variables
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID
);

// In-memory cache
const cache = {};

// ⛔ Added: Safe wrapper to prevent site crash when Airtable is down
async function safeFetchAirtable(table, options, cacheMinutes) {
    try {
        return await fetchWithCache(table, options, cacheMinutes);
    } catch (err) {
        console.error("Airtable Error:", err.message);
        return { error: true }; // ⛔ Minimal safe fallback
    }
}

// Generic fetcher with cache
async function fetchWithCache(table, options = {}, cacheMinutes = 5) {
    const cacheKey = `${table}-${JSON.stringify(options)}`;
    const now = Date.now();

    if (cache[cacheKey] && cache[cacheKey].expiry > now) {
        return cache[cacheKey].data;
    }

    const records = await base(table).select(options).all();
    const data = records.map((r) => ({ id: r.id, ...r.fields }));

    cache[cacheKey] = {
        data,
        expiry: now + cacheMinutes * 60 * 1000,
    };

    return data;
}

// ✅ Fetch Movie Reviews (refresh every 5 minutes)
export const getReviews = async () => {
    const records = await safeFetchAirtable(
        process.env.AIRTABLE_REVIEWS_TABLE,
        { view: 'Grid view' },
        5
    );

    if (records.error) return { error: true }; // ⛔ Added error bubble

    return records.map((record) => ({
        id: record.id,
        title: record.Title || '',
        slug: record.slug || '',
        onelineReview: record.onelineReview || '',
        verdict: record.ReviewVerdict || '',
        watchable: record.Watchable || '',
        releaseDate: record.releaseDate || '',
        cast: record.starcast || '',
        director: record.director || '',
        producer: record.producedby || '',
        productionHouse: record.productionhouse || '',
        poster: record.poster?.[0]?.url || '/placeholder.jpg',
    }));
};

// ✅ Fetch Trailers (refresh every 30 minutes)
export const getTrailers = async () => {
    const records = await safeFetchAirtable(
        process.env.AIRTABLE_TRAILERS_TABLE,
        { view: 'Grid view' },
        30
    );

    if (records.error) return { error: true }; // ⛔ Added

    return records.map((record) => ({
        id: record.id,
        title: record.Title || '',
        url: record.URL || '',
    }));
};

// ✅ Fetch Gossips (refresh every 30 minutes)
export const getGossips = async () => {
    const records = await safeFetchAirtable(
        process.env.AIRTABLE_GOSSIPS_TABLE,
        { view: 'Grid view' },
        30
    );

    if (records.error) return { error: true }; // ⛔ Added

    return records.map((record) => ({
        id: record.id,
        content: record.Content || '',
    }));
};

// ✅ Fetch CINEQ Speaks (refresh every 30 minutes)
export const getCINEQSpeaks = async () => {
    const records = await safeFetchAirtable(
        process.env.AIRTABLE_CINEQSPEAK_TABLE,
        {
            view: "Grid view",
            sort: [{ field: "Date", direction: "desc" }],
        },
        30
    );

    if (records.error) return { error: true }; // ⛔ Added

    return records.map((record) => ({
        id: record.id,
        content: record.Content || "",
        author: record.Author || "CINEQ",
        date: record.Date || null,
    }));
};

// ✅ Fetch Must Watch OTT (refresh every 30 minutes)
export const getMustWatchOTT = async () => {
    const records = await safeFetchAirtable(
        process.env.AIRTABLE_MUSTWATCHOTT_TABLE,
        { view: 'Grid view' },
        30
    );

    if (records.error) return { error: true }; // ⛔ Added

    return records.map((record) => ({
        id: record.id,
        title: record.Title || '',
        language: record.language || '',
        platform: record.platform || '',
        mustReason: record.mustReason || '',
        poster: record.Poster?.[0]?.url || '/placeholder.jpg',
    }));
};

// ✅ Fetch Retrospect (refresh every 30 minutes)
export const getRetrospect = async () => {
    const records = await safeFetchAirtable(
        process.env.AIRTABLE_RETROSPECT_TABLE,
        { view: 'Grid view' },
        30
    );

    if (records.error) return { error: true }; // ⛔ Added

    return records.map((record) => ({
        id: record.id,
        title: record.title || '',
        analysis: record.analysis || '',
    }));
};

// ✅ Fetch Poster Pathshala (refresh every 30 minutes)
export const getPosters = async () => {
    const records = await safeFetchAirtable(
        process.env.AIRTABLE_POSTERS_TABLE,
        { view: 'Grid view' },
        30
    );

    if (records.error) return { error: true }; // ⛔ Added

    return records.map((record) => ({
        id: record.id,
        title: record.Title || '',
        poster: record.Poster?.[0]?.url || '/placeholder.jpg',
    }));
};

// ✅ Fetch Hero Block (refresh every 30 minutes)
export const getHeroBlocks = async () => {
    const records = await safeFetchAirtable(
        process.env.AIRTABLE_HEROBLOCK_TABLE,
        {
            view: 'Grid view',
            sort: [{ field: 'order', direction: 'asc' }],
        },
        30
    );

    if (records.error) return { error: true }; // ⛔ Added

    return records.map((record) => ({
        id: record.id,
        order: record.order || 0,
        media: record.media?.map((m) => m.url) || [],
        side: record.side || 'left',
        duration: record.duration || null,
    }));
};


export function withTimeout(promise, ms = 2000) {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Airtable timeout")), ms)
        ),
    ]);
}
