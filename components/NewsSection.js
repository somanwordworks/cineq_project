// components/NewsSection.js
import { useEffect, useState } from 'react';

export default function NewsSection() {
  const [reelNews, setReelNews] = useState([]);
  const [realNews, setRealNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      const reelRes = await fetch('/api/reelNews');
      const realRes = await fetch('/api/realNews');
      setReelNews(await reelRes.json());
      setRealNews(await realRes.json());
    };
    fetchNews();
  }, []);

  const NewsCard = ({ item }) => (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white bg-opacity-10 rounded-xl p-4 hover:bg-opacity-20 transition"
    >
      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
      <p className="text-sm text-gray-300 mt-1">{item.source} • {item.pubDate}</p>
    </a>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-green-400 mb-6">🎬 Reel News</h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-12">
        {reelNews.slice(0, 6).map((item, idx) => (
          <NewsCard key={idx} item={item} />
        ))}
      </div>

      <h2 className="text-3xl font-bold text-blue-400 mb-6">🌍 Real News</h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {realNews.slice(0, 6).map((item, idx) => (
          <NewsCard key={idx} item={item} />
        ))}
      </div>
    </div>
  );
}
