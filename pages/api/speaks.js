import { getSpeaks } from "../../lib/airtable";

export default async function handler(req, res) {
  try {
    const notes = await getSpeaks();
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch CINEQ Speaks" });
  }
}
