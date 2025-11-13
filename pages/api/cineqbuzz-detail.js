
//pages/api/cineqbuzz-detail.js//

export default async function handler(req, res) {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ error: "Missing URL" });

        // Fetch the original news HTML
        const html = await fetch(url).then(r => r.text());

        // Extract meta description
        const metaDesc = html.match(/<meta name="description" content="([^"]+)"/i);
        const ogDesc = html.match(/<meta property="og:description" content="([^"]+)"/i);
        const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/i);

        const description =
            (metaDesc && metaDesc[1]) ||
            (ogDesc && ogDesc[1]) ||
            "No summary available.";

        // Extract first paragraph (optional)
        const firstPara = html.match(/<p>(.*?)<\/p>/i);
        const para = firstPara ? firstPara[1].replace(/<[^>]*>/g, "") : "";

        // Build clean readable summary
        const summary = `${description}\n\n${para}`.trim();

        return res.status(200).json({
            summary,
            image: ogImage ? ogImage[1] : null,
        });

    } catch (err) {
        console.error("DETAIL ERROR:", err);
        return res.status(200).json({ summary: "Could not load details." });
    }
}
