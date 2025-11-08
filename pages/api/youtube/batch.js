// pages/api/youtube/batch.js
export default async function handler(req, res) {
  const { ids } = req.query;

  if (!ids) {
    return res.status(400).json({ error: "No video IDs provided" });
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids}&key=${process.env.YOUTUBE_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text(); // capture HTML error
      return res.status(500).json({ error: `YouTube API error: ${errorText}` });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
