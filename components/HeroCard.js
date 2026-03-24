// components/HeroCard.jsx
import Image from "next/image";

function formatViews(n) {
  if (!n) return "—";
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

export default function HeroCard({ poster, hero, movie, type, views, fastest }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      {poster && (
        <div className="relative w-full h-48 mb-3">
          <Image src={poster} alt={`${movie} poster`} fill className="object-cover rounded-lg" />
        </div>
      )}
      <h2 className="text-lg font-bold">{hero} – {movie}</h2>
      <p className="text-sm text-gray-500">{type}</p>
      <p className="mt-2 font-semibold">Views: {formatViews(views)}</p>
      <p className="text-sm text-gray-600">Fastest Record: {fastest || "—"}</p>
    </div>
  );
}
