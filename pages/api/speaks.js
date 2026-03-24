// pages/api/speaks.js
import { getCINEQSpeaks } from '../../lib/airtable';

export default async function handler(req, res) {
    try {
        const notes = await getCINEQSpeaks();
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
        res.status(200).json(notes);
    } catch (error) {
        console.error('Speaks error:', error);
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
        res.status(200).json([]);
    }
}
