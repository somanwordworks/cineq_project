

// components/YoutubeTrending.jsx
import React, { useEffect, useState } from "react";

export default function YoutubeTrending({ initialData }) {
  const [data, setData] = useState(initialData || null);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (!initialData) {
      fetchData();
    }
    // optional: refresh every X ms
    const interval = setInterval(fetchData, 10 * 60 * 1000); // 10 min refresh
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const r = await fetch("/api/youtube-trending");
      const json = await r.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading trending trailers…</div>;
  if (!data || !data.results || data.results.length === 0)
    return <div>No trending trailers found right now.</div>;

  return (
    <div>
      <h3>🔥 Trending Movie Trailers (India)</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12 }}>
        {data.results.map((it, i) => (
          <a
            key={it.id}
            href={it.url}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none", color: "inherit", border: "1px solid #eee", padding: 8, borderRadius: 8 }}
          >
            <div style={{ position: "relative", paddingBottom: "56%", overflow: "hidden", borderRadius: 6 }}>
              <img src={it.thumbnail} alt={it.title} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ marginTop: 8 }}>
              <div style={{ fontWeight: 700 }}>{it.title}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{it.channelTitle} • {Math.round(it.viewCount).toLocaleString()} views</div>
              <div style={{ fontSize: 12, color: "#999", marginTop: 6 }}>
                {it.hoursSincePublished < 24
                  ? `${Math.round(it.hoursSincePublished * 60)} minutes ago` // rough
                  : `${Math.round(it.hoursSincePublished)} hours ago`} • {it.viewsPerHour.toLocaleString()} views/hr
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
