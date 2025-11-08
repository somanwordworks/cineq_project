import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    // Path to /public/fanposters
    const postersDir = path.join(process.cwd(), "public", "fanposters");

    // Check if folder exists
    if (!fs.existsSync(postersDir)) {
      return res.status(200).json({ posters: [] });
    }

    // Get all image files (jpg, jpeg, png, webp)
    const files = fs
      .readdirSync(postersDir)
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));

    // Build poster objects
    const posters = files.map((file) => ({
      title: path.basename(file, path.extname(file)), // filename only
      file: `/fanposters/${file}`, // accessible URL
      genre: "Fan Poster", // placeholder for now
    }));

    res.status(200).json({ posters });
  } catch (err) {
    console.error("API error /fanposters:", err);
    res.status(500).json({ posters: [], error: "Failed to load posters" });
  }
}
