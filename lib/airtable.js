import Airtable from 'airtable';

// Airtable Base setup using environment variables
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID
);

// ✅ Fetch Movie Reviews
export const getReviews = async () => {
    const records = await base(process.env.AIRTABLE_REVIEWS_TABLE)
        .select({ view: 'Grid view' })
        .firstPage();

    return records.map((record) => ({
        id: record.id,
        title: record.get('Title') || '',
        slug: record.get('slug') || '',
        summary: record.get('onlinereview') || '',
        verdict: record.get('ReviewVerdict') || '',
        watchable: record.get('Watchable') || '',
        releaseDate: record.get('releaseDate') || '',
        cast: record.get('starcast') || '',
        director: record.get('director') || '',
        producer: record.get('producedby') || '',
        productionHouse: record.get('productionhouse') || '',
        poster: record.get('poster')?.[0]?.url || '/placeholder.jpg',
    }));
};

// ✅ Fetch Trailers
export const getTrailers = async () => {
    const records = await base(process.env.AIRTABLE_TRAILERS_TABLE)
        .select({ view: 'Grid view' })
        .firstPage();

    return records.map((record) => ({
        id: record.id,
        title: record.get('Title') || '',
        url: record.get('URL') || '',
    }));
};

// ✅ Fetch Gossips for “Is It True Bhavani !!”
export const getGossips = async () => {
    const records = await base(process.env.AIRTABLE_GOSSIPS_TABLE)
        .select({ view: 'Grid view' })
        .firstPage();

    return records.map((record) => ({
        id: record.id,
        content: record.get('Content') || '',
    }));
};
