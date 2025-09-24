import { useEffect, useState } from "react";

export default function PosterPathshala() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/posters?ts=" + Date.now())
            .then((r) => r.json())
            .then((d) => setList(d.results || []))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-2xl font-semibold mb-4">Poster Pathshala</h2>
                <p className="text-center text-gray-500 italic">Fetching posters…</p>
            </section>
        );
    }

    if (list.length === 0) {
        return null; // auto-hide if no posters
    }

    return (
        <section className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-semibold mb-4">Poster Pathshala</h2>
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <div className="flex gap-4 pr-4 snap-x snap-mandatory">
                    {list.map((p) => (
                        <article
                            key={p.id}
                            className="min-w-[220px] sm:w-[240px] rounded-2xl border bg-white overflow-hidden shadow-sm hover:shadow-lg transition snap-start flex flex-col items-center"
                        >
                            <div className="bg-gray-100 flex items-center justify-center overflow-hidden w-full h-[300px]">
                                <img
                                    src={p.poster || "https://placehold.co/400x600?text=No+Poster"}
                                    alt={p.title}
                                    className="max-h-[300px] w-auto object-contain transform transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                            <div className="p-2 text-center w-full">
                                <h3 className="text-sm font-semibold truncate">{p.title}</h3>
                                {p.poster && (
                                    <a
                                        href={p.poster}
                                        download={`${p.title.replace(/\s+/g, "_")}.jpg`}
                                        className="mt-2 inline-block text-xs px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                        ⬇ Download
                                    </a>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
