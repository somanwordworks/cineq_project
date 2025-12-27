
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

  return diffInDays <= 2; // last 48 hours
}

export default async function handler(req, res) {
  try {
    const records = await base(process.env.AIRTABLE_CINEQSPEAK_TABLE)
      .select({
        maxRecords: 5,
        sort: [{ field: "publishDate", direction: "desc" }],
      })
      .all();

    const items = records
      .map((record) => {
        const f = record.fields;

        return {
          id: record.id,
          type: "cineq_speaks",
          title: f.Title || "",
          slug: f.slug || "",
          oneline: f.oneline || "",
          content: f.Content || "",
          author: f.author || "CINEQ Editorial",
          publishDate: f.publishDate || "",
          coverImage: f.coverImage?.[0]?.url || "/placeholder.jpg",
          source: "cineq.in",
        };
      })
      .filter((item) => isRecent(item.publishDate));

    res.status(200).json({
      type: "cineq_speaks",
      generatedAt: new Date().toISOString(),
      count: items.length,
      items,
    });
  } catch (error) {
    console.error("CINEQ Speaks API Error:", error);
    res.status(500).json({ error: "Failed to fetch CINEQ Speaks data" });
  }
}
