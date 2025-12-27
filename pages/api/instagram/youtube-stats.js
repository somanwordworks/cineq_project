export default async function handler(req, res) {
  try {
    // Step 1: Search trending trailers in India
    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=trailer&regionCode=IN&type=video&order=viewCount&maxResults=3&key=${process.env.YOUTUBE_API_KEY}`
    );

    const searchData = await searchRes.json();

    if (!searchData.items || !searchData.items.length) {
      return res.status(200).json({ items: [] });
    }

    const videoIds = searchData.items
      .map((item) => item.id.videoId)
      .join(",");

    // Step 2: Fetch statistics for these videos
    const statsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${process.env.YOUTUBE_API_KEY}`
    );

    const statsData = await statsRes.json();

    const items = statsData.items.map((video) => ({
      id: video.id,
      type: "youtube_stats",
      title: video.snippet.title,
      channel: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt,
      views: Number(video.statistics.viewCount || 0),
      likes: Number(video.statistics.likeCount || 0),
      comments: Number(video.statistics.commentCount || 0),
      thumbnail:
        video.snippet.thumbnails?.high?.url ||
        video.snippet.thumbnails?.default?.url,
      source: "YouTube",
    }));

    res.status(200).json({
      type: "youtube_stats",
      generatedAt: new Date().toISOString(),
      count: items.length,
      items,
    });
  } catch (error) {
    console.error("YouTube Stats API Error:", error);
    res.status(500).json({ error: "Failed to fetch YouTube stats" });
  }
}
