import React, { useEffect, useState } from "react";

export default function PosterPathshalaDemo() {
    const [posters, setPosters] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        async function fetchPosters() {
            try {
                const res = await fetch("/api/fanposters");
                const data = await res.json();
                setPosters(data.posters || []);
                setLastUpdated(data.lastUpdated);
            } catch (err) {
                console.error("Failed to load fan posters:", err);
            }
        }
        fetchPosters();
    }, []);

    return (
        <section className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-2">🎨 Poster Pathshala (Fan Made)</h2>
            {lastUpdated && (
                <p className="text-xs text-gray-500 mb-4 text-center">
                    Last updated: {new Date(lastUpdated).toLocaleString()}
                </p>
            )}

            {!posters.length ? (
                <div className="text-gray-500">
                    No posters found. Drop some in <code>/public/fanposters/</code> 🎬
                </div>
            ) : (
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    <div className="flex gap-4 pr-4 snap-x snap-mandatory">
                        {posters.map((p, idx) => (
                            <article
                                key={idx}
                                className="min-w-[200px] sm:min-w-[220px] rounded-2xl overflow-hidden relative snap-start shadow-md hover:shadow-xl transition"
                            >
                                <div className="relative aspect-[2/3] bg-gray-100">
                                    <img
                                        src={p.file}
                                        alt={p.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    <span className="absolute bottom-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow">
                                        🎨 Fan Made
                                    </span>
                                </div>
                                <div className="p-3 text-center bg-white">
                                    <h3 className="font-semibold text-sm">{p.title}</h3>
                                    <p className="text-xs text-gray-500">{p.genre}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
