import Airtable from "airtable";

const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID);

function isRecent(dateStr) {
    if (!dateStr) return false;
    const published = new Date(dateStr);
    const now = new Date();

    const diffInDays =
        (now.getTime() - published.getTime()) / (1000 * 60 * 60 * 24);

    return diffInDays <= 5; // allow last 10 days

}

export default async function handler(req, res) {
    try {
        const records = await base(process.env.AIRTABLE_REVIEWS_TABLE)
            .select({
                maxRecords: 5,
                sort: [{ field: "releasedate", direction: "desc" }],
            })
            .all();

        const items = records
            .map((record) => {
                const f = record.fields;
                return {
                    id: record.id,
                    type: "review",
                    title: f.Title || "",
                    slug: f.slug || "",
                    onelineReview: f.onelineReview || "",
                    verdict: f.ReviewVerdict || "",
                    watchable: f.Watchable || "",
                    releasedate: f.releasedate || "",
                    cast: f.starcast || "",
                    director: f.director || "",
                    producer: f.producedby || "",
                    productionHouse: f.productionhouse || "",
                    poster: f.poster?.[0]?.url || "/placeholder.jpg",
                    source: "cineq.in",
                };
            })
            .filter((r) => isRecent(r.releasedate));

        res.status(200).json({
            type: "reviews",
            generatedAt: new Date().toISOString(),
            count: items.length,
            items,
        });
    } catch (error) {
        console.error("Reviews API Error:", error);
        res.status(500).json({ error: "Failed to fetch review data" });
    }
}
