
///pages/api/bhavani.js//

import Parser from "rss-parser";
const parser = new Parser();

export default async function handler(req, res) {
    try {
        const sources = [
            // Pinkvilla (celebrity + gossip)
            "https://www.pinkvilla.com/feed",

            // Filmibeat Gossip
            "https://www.filmibeat.com/rss/filmy-gossip-fb.xml",

            // Google News - India-wide gossip detection
            "https://news.google.com/rss/search?q=celebrity+gossip+OR+bollywood+gossip+OR+tollywood+gossip+OR+rumour&hl=en-IN&gl=IN&ceid=IN:en"
        ];

        let items = [];

        for (let url of sources) {
            try {
                const feed = await parser.parseURL(url);
                items.push(...feed.items.slice(0, 10).map(i => i.title));
            } catch (e) {
                console.log("Failed source:", url);
            }
        }

        // Clean, unique, limit
        const final = [...new Set(items)]
            .map(t => t.replace(/<[^>]*>|&nbsp;/g, "").trim())
            .filter(Boolean)
            .slice(0, 30);

        res.status(200).json({ items: final });
    } catch (err) {
        console.error("Bhavani Gossip Error:", err);
        res.status(200).json({ items: [] });
    }
}
