// pages/youtube-stats.js
import React, { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

/* -------------------------------- LANGS -------------------------------- */
const LANGS = ["All", "Telugu", "Tamil", "Hindi", "Kannada", "Malayalam"];

/* -------------------------------- HELPERS -------------------------------- */
function formatNumber(n) {
    if (typeof n !== "number") return String(n || "");
    if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
    return String(n);
}

function TimeAgoFromHours(h) {
    if (typeof h !== "number" || isNaN(h)) return "—";
    if (h < 1) return `${Math.round(h * 60)}m ago`;
    if (h < 24) return `${Math.round(h)}h ago`;
    return `${Math.round(h / 24)}d ago`;
}

/* ------------------------- SHIMMER COMPONENT ------------------------- */
function Shimmer({ className }) {
    return (
        <div
            className={
                "animate-pulse bg-[#f1f1f1] rounded-md " + (className || "")
            }
        ></div>
    );
}

/* -------------------------------- HERO -------------------------------- */
function Hero({ lastUpdated }) {
    return (
        <section className="w-full bg-gradient-to-b from-white to-[#F9FAFB] px-6 py-8 border-b border-[#E6E6E6]">
            <div className="max-w-[1400px] mx-auto">
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#C62828]">
                    🔥 YouTube Trending — Movie Trailers
                </h1>
                <p className="mt-2 text-gray-600 text-sm">
                    Real-time YouTube stats: views, growth rate & ranking • Updated every 10 minutes
                </p>
                <div className="mt-3 text-xs text-gray-500">
                    Last fetched: {lastUpdated ? new Date(lastUpdated).toLocaleString() : "—"}
                </div>
            </div>
        </section>
    );
}

/* -------------------------------- FILTER BAR -------------------------------- */
function FilterBar({ selected, setSelected }) {
    return (
        <div className="w-full py-4 bg-[#F9FAFB] border-b border-[#E6E6E6]">
            <div className="max-w-[1400px] mx-auto px-6 flex gap-3 overflow-x-auto">
                {LANGS.map((l) => (
                    <button
                        key={l}
                        onClick={() => setSelected(l)}
                        className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition ${selected === l
                                ? "bg-[#C62828] text-white shadow"
                                : "bg-white border border-[#E6B852] text-[#C62828] hover:bg-[#FFF4DB]"
                            }`}
                    >
                        {l}
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ---------------------------- SKELETON: TOP METRICS ---------------------------- */
function SkeletonTopMetrics() {
    return (
        <div className="max-w-[1400px] mx-auto px-6 mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-[#F4E4B8] p-5">
                    <div className="flex items-center gap-4">
                        <Shimmer className="w-24 h-16" />
                        <div className="flex-1 space-y-3">
                            <Shimmer className="h-4 w-3/4" />
                            <Shimmer className="h-4 w-1/2" />
                            <Shimmer className="h-4 w-1/3" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ---------------------------- TOP METRICS ---------------------------- */
function TopMetrics({ top3 }) {
    return (
        <div className="max-w-[1400px] mx-auto px-6 mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {top3.map((t, idx) => (
                <div
                    key={t.id || idx}
                    className="bg-white rounded-xl shadow-sm border-t-4 border-[#C62828] overflow-hidden"
                >
                    <div className="flex items-center gap-4 p-4 md:p-5">
                        <div className="w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            <img
                                src={t.thumbnail || "/placeholder.jpg"}
                                alt={t.title || "thumbnail"}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="text-xs text-gray-500 truncate">
                                #{idx + 1} • {t.channelTitle || "—"}
                            </div>

                            <div className="text-lg font-bold text-[#C62828] truncate">
                                {t.title || "Not Available"}
                            </div>

                            <div className="mt-2 flex items-center gap-3">
                                <div className="text-2xl font-extrabold text-[#C62828] truncate">
                                    {formatNumber(Number(t.viewCount) || 0)}
                                </div>

                                <div className="px-3 py-1 bg-[#FFF4DB] text-[#C62828] font-bold text-sm rounded">
                                    {formatNumber(Number(t.viewsPerHour) || 0)}/hr
                                </div>

                                <div className="text-xs text-gray-500">
                                    {TimeAgoFromHours(Number(t.hoursSincePublished) || 0)}
                                </div>
                            </div>
                        </div>

                        <a
                            href={t.url || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-3 inline-flex items-center px-3 py-2 bg-[#C62828] text-white rounded font-semibold text-sm hover:bg-[#8B1A1A]"
                        >
                            Watch
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ---------------------------- SKELETON: GROWTH CHART ---------------------------- */
function SkeletonGrowthChart() {
    return (
        <div className="max-w-[1400px] mx-auto px-6 mt-8">
            <div className="bg-white rounded-xl shadow-sm border border-[#F4E4B8] p-6">
                <Shimmer className="h-6 w-1/3 mb-4" />
                <div className="h-[260px] flex items-end gap-6">
                    {[1, 2, 3].map((i) => (
                        <Shimmer key={i} className="flex-1 h-full" />
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ---------------------------- FIXED GROWTH CHART ---------------------------- */
function GrowthChart({ top3 }) {

    const safe = [...top3];
    while (safe.length < 3) {
        safe.push({ id: `missing-${safe.length}`, title: "Not Available", viewsPerHour: 0 });
    }

    const cleaned = safe.map(x => ({
        ...x,
        viewsPerHour: Number(x.viewsPerHour) || 0
    }));

    const max = Math.max(...cleaned.map(c => c.viewsPerHour), 1);

    const colors = ["#C62828", "#E6B852", "#8B1A1A"];

    return (
        <div className="max-w-[1400px] mx-auto px-6 mt-8">
            <div className="bg-white rounded-xl shadow-sm border border-[#F4E4B8] p-6">

                <h2 className="text-lg font-bold text-[#C62828] mb-4">
                    Growth (views / hour) — Top 3
                </h2>

                {/* Three column layout */}
                <div
                    className="grid grid-cols-3 gap-6 relative"
                    style={{ height: "220px" }}
                >

                    {/* Grid lines */}
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute left-0 right-0 border-t border-gray-200"
                            style={{ top: `${(i / 4) * 100}%` }}
                        />
                    ))}

                    {/* Bars */}
                    {cleaned.map((item, i) => {
                        const pct = item.viewsPerHour > 0
                            ? Math.max(12, (item.viewsPerHour / max) * 100)
                            : 12;

                        return (
                            <div key={i} className="relative flex items-end justify-center">
                                <div
                                    className="w-[60%] rounded-t-lg shadow-md transition-all duration-700"
                                    style={{
                                        height: `${pct}%`,
                                        backgroundColor: colors[i]
                                    }}
                                ></div>
                            </div>
                        );
                    })}

                </div>

                {/* Titles */}
                <div className="grid grid-cols-3 mt-6 text-center gap-4">
                    {cleaned.map((t, i) => (
                        <div key={i}>
                            <div className="truncate text-sm text-gray-700">{t.title}</div>
                            <div className="text-xs text-gray-500">{formatNumber(t.viewsPerHour)}/hr</div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

/* ---------------------------- SKELETON: LEADERBOARD ---------------------------- */
function SkeletonLeaderboard() {
    return (
        <div className="max-w-[1400px] mx-auto px-6 mt-8">
            <div className="bg-white rounded-xl shadow-sm border border-[#F4E4B8]">
                <Shimmer className="h-10 w-full" />
                <div className="divide-y divide-gray-200">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4 px-4 py-3">
                            <Shimmer className="w-8 h-8 rounded-full" />
                            <Shimmer className="w-24 h-16" />
                            <div className="flex-1 space-y-2">
                                <Shimmer className="h-4 w-3/4" />
                                <Shimmer className="h-3 w-1/2" />
                            </div>
                            <Shimmer className="h-8 w-20" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ---------------------------- LEADERBOARD ---------------------------- */
function Leaderboard({ list }) {
    return (
        <div className="max-w-[1400px] mx-auto px-6 mt-8">
            <div className="bg-white rounded-xl shadow-sm border border-[#F4E4B8] overflow-hidden">
                <div className="bg-[#C62828] px-6 py-3 text-white font-bold flex justify-between items-center">
                    <span>Top 10 Trending Trailers</span>
                    <span className="text-sm">Updated Live</span>
                </div>

                <div className="divide-y divide-gray-100">
                    {list.slice(0, 10).map((it, idx) => (
                        <div
                            key={it.id || idx}
                            className="flex items-center gap-4 px-4 py-3 hover:bg-[#FFF4DB] transition-colors"
                        >
                            <div className="w-10 text-center">
                                <div className="w-8 h-8 rounded-full bg-[#E6B852] flex items-center justify-center font-bold text-sm text-[#8B1A1A]">
                                    {idx + 1}
                                </div>
                            </div>

                            <img
                                src={it.thumbnail || "/placeholder.jpg"}
                                alt={it.title || "thumb"}
                                className="w-24 h-16 rounded-lg object-cover flex-shrink-0"
                            />

                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-[#C62828] truncate">
                                    {it.title || "Not Available"}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                    {it.channelTitle || "—"}
                                </div>
                            </div>

                            <div className="w-40 text-right hidden sm:block">
                                <div className="font-bold text-[#C62828]">
                                    {formatNumber(Number(it.viewCount) || 0)}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {formatNumber(Number(it.viewsPerHour) || 0)}/hr
                                </div>
                            </div>

                            <a
                                href={it.url || "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="ml-auto inline-flex items-center px-3 py-2 bg-[#C62828] text-white rounded font-bold hover:bg-[#8B1A1A]"
                            >
                                Watch
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ---------------------------- SKELETON: TRENDING WALL ---------------------------- */
function SkeletonTrendingWall() {
    return (
        <div className="max-w-[1400px] mx-auto px-6 mt-10 pb-16">
            <Shimmer className="h-6 w-1/4 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-xl shadow-sm border border-[#F4E4B8] overflow-hidden p-3"
                    >
                        <Shimmer className="w-full h-32 mb-3" />
                        <Shimmer className="h-4 w-3/4 mb-2" />
                        <Shimmer className="h-3 w-1/2" />
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ---------------------------- TRENDING WALL ---------------------------- */
function TrendingWall({ list }) {
    return (
        <div className="max-w-[1400px] mx-auto px-6 mt-10 pb-16">
            <h2 className="text-xl font-bold text-[#C62828] mb-4">Trending Wall</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {list.map((it) => (
                    <a
                        key={it.id}
                        href={it.url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="block bg-white rounded-xl shadow-sm border border-[#F4E4B8] hover:border-[#C62828] transition overflow-hidden"
                    >
                        <div className="relative pb-[56%] overflow-hidden rounded-t-xl">
                            <img
                                src={it.thumbnail || "/placeholder.jpg"}
                                alt={it.title || "thumb"}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute left-3 top-3 px-2 py-1 bg-black/50 text-white text-xs rounded">
                                {formatNumber(Number(it.viewCount) || 0)} views
                            </div>
                        </div>

                        <div className="p-3">
                            <div className="font-semibold text-[#8B1A1A] truncate">
                                {it.title || "Not Available"}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 truncate">
                                {it.channelTitle || "—"}
                            </div>
                            <div className="text-xs font-bold text-[#C62828] mt-2">
                                {formatNumber(Number(it.viewsPerHour) || 0)}/hr
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

/* ---------------------------- MAIN PAGE ---------------------------- */
export default function YouTubeStats() {
    const [data, setData] = useState(null);
    const [lang, setLang] = useState("All");
    const [loading, setLoading] = useState(true);

    async function fetchData() {
        setLoading(true);
        try {
            const res = await fetch("/api/youtube-trending");
            const json = await res.json();
            setData(json);
        } catch (error) {
            console.error("API Error:", error);
            setData(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
        const id = setInterval(fetchData, 10 * 60 * 1000);
        return () => clearInterval(id);
    }, []);

    const filtered = useMemo(() => {
        if (!data?.results) return [];
        if (lang === "All") return data.results;

        return data.results.filter((item) => {
            const text = `${item.title || ""} ${item.description || ""} ${item.channelTitle || ""}`.toLowerCase();
            return text.includes(lang.toLowerCase());
        });
    }, [data, lang]);

    // FILTER + TOP 3 LOGIC (LANGUAGE AWARE with fallback)
    const baseList = filtered.length > 0 ? filtered : (data?.results || []);
    const top3 = baseList.slice(0, 3);



    return (
        <>
            <Head>
                <title>YouTube Stats — CINEQ</title>
            </Head>

            <Header />

            <div className="min-h-screen bg-[#F9FAFB]">
                <Hero lastUpdated={data?.fetchedAt} />
                <FilterBar selected={lang} setSelected={setLang} />

                {/* SKELETONS */}
                {loading && (
                    <>
                        <SkeletonTopMetrics />
                        <SkeletonGrowthChart />
                        <SkeletonLeaderboard />
                        <SkeletonTrendingWall />
                    </>
                )}

                {/* REAL CONTENT */}
                {!loading && data && (
                    <>
                        <TopMetrics top3={top3} />
                        <GrowthChart top3={top3} />
                        <Leaderboard list={filtered} />
                        <TrendingWall list={filtered.slice(0, 20)} />
                    </>
                )}

                {!loading && !data && (
                    <div className="max-w-[1400px] mx-auto px-6 py-12 text-center text-gray-600">
                        Could not fetch YouTube data. See console for details.
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
}
