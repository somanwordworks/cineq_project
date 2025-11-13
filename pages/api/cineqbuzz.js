
//pages/api/cineqbuzz.js//


import Parser from "rss-parser";
const parser = new Parser({
    customFields: {
        item: ['description', 'content:encoded']
    }
});

export default async function handler(req, res) {
    try {
        const feed = await parser.parseURL(
            "https://news.google.com/rss/search?q=tollywood+OR+telugu+movie+OR+south+cinema&hl=en-IN&gl=IN&ceid=IN:en"
        );

        const items = feed.items.slice(0, 10).map(i => ({
            title: i.title,
            desc: i.description || "",
            link: i.link,
            source: i.source || i.creator || "Google News",
            published: i.pubDate || ""
        }));

        return res.status(200).json({ items });
    } catch (err) {
        console.error("Buzz Error:", err);
        return res.status(200).json({ items: [] });
    }
}
