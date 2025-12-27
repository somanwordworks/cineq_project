import Airtable from "airtable";

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  try {
    const records = await base(process.env.AIRTABLE_GOSSIPS_TABLE)
      .select({
        maxRecords: 5,
        sort: [{ field: "createdTime", direction: "desc" }],
      })
      .all();

    const items = records.map((record) => {
      const f = record.fields;

      return {
        id: record.id,
        type: "bhavani",
        content: f.Content || "",
        source: "Is It True Bhavani!!",
        createdAt: record._rawJson.createdTime,
      };
    });

    res.status(200).json({
      type: "bhavani_gossip",
      generatedAt: new Date().toISOString(),
      count: items.length,
      items,
    });
  } catch (error) {
    console.error("Bhavani Gossip API Error:", error);
    res.status(500).json({ error: "Failed to fetch Bhavani gossip data" });
  }
}
