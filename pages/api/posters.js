// pages/api/posters.js
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  try {
    const records = await base("Posters").select({}).all();

    const results = records.map((rec) => ({
      id: rec.id,
      title: rec.get("Title") || "Untitled",
      poster: rec.get("Poster")?.[0]?.url || null,
    }));

    res.status(200).json({ results });
  } catch (err) {
    console.error("❌ Airtable fetch failed:", err.message);
    res.status(500).json({ error: "Failed to fetch posters" });
  }
}
