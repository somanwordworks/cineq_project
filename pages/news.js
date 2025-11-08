import { useEffect, useState } from 'react';

export default function News() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(json => setData(json.records || []));
  }, []);

  return (
    <div>
      <h1>Movie News</h1>
      {data.length === 0 ? (
        <p>No news available</p>
      ) : (
        <ul>
          {data.map((news, i) => (
            <li key={i}>
              <h3>{news.fields?.Title}</h3>
              <p><strong>Cast:</strong> {news.fields?.Cast}</p>
              <p><strong>Status:</strong> {news.fields?.Status}</p>
              {news.fields?.PosterImage && (
                <img src={news.fields.PosterImage[0].url} width="150" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
