import { getMustWatchOTT } from '../../lib/airtable';

export default async function handler(req, res) {
    try {
        const records = await getMustWatchOTT();
        const results = records.map((r) => ({
            id: r.id,
            title: r.title,
            poster: r.poster || null,
        }));
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
        res.status(200).json({ results });
    } catch (err) {
        console.error('Posters API error:', err.message);
        res.status(200).json({ results: [] });
    }
}