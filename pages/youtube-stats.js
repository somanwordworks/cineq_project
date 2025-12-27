// pages/youtube-stats.js
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

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

/* ---------------------------- CONTENT TYPE ---------------------------- */
function getContentType(title = "") {
    const t = title.toLowerCase();

    if (t.includes("song") || t.includes("lyrical") || t.includes("single") || t.includes("theme"))
        return { label: "SONG", color: "#16A34A" };

    if (t.includes("trailer"))
        return { label: "TRAILER", color: "#2563EB" };

    if (t.includes("teaser") || t.includes("glimpse") || t.includes("first look"))
        return { label: "TEASER", color: "#9333EA" };

    return null;
}

/* -------------------------------- HERO -------------------------------- */
function Hero({ lastUpdated, activeTab, setActiveTab }) {
    return (
        <section className="w-full bg-gradient-to-b from-white to-[#F9FAFB] px-6 py-8 border-b">
            <div className="max-w-[1400px] mx-auto">
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#C62828]">
                    🔥 YouTube Trending — {activeTab === "telugu" ? "Telugu Cinema" : "India"}
                </h1>

                <p className="mt-2 text-gray-600 text-sm">
                    Songs • Teasers • Trailers • Updated every 10 minutes
                </p>

                <div className="mt-4 flex gap-3">
                    {["all", "telugu"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition ${activeTab === tab
                                    ? "bg-[#C62828] text-white"
                                    : "bg-white border border-[#E6B852] text-[#C62828]"
                                }`}
                        >
                            {tab === "all" ? "All (India)" : "Telugu"}
                        </button>
                    ))}
                </div>

                <div className="mt-3 text-xs text-gray-500">
                    Last fetched: {lastUpdated ? new Date(lastUpdated).toLocaleString() : "—"}
                </div>
            </div>
        </section>
    );
}

/* ---------------------------- BADGES ---------------------------- */
function ContentBadge({ title }) {
    const type = getContentType(title);
    if (!type) return null;

    return (
        <span
            style={{ backgroundColor: type.color }}
            className="px-2 py-0.5 text-white text-xs font-bold rounded"
        >
            {type.label}
        </span>
    );
}

function NewBadge({ hours }) {
    if (hours > 6) return null;
    return (
        <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded">
            NEW
        </span>
    );
}

/* ---------------------------- TOP METRICS ---------------------------- */
function TopMetrics({ top3 }) {
    return (
        <div className="max-w-[1400px] mx-auto px-6 mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {top3.map((t, idx) => (
                <div key={t.id} className="bg-white rounded-xl shadow-sm border-t-4 border-[#C62828]">
                    <div className="flex gap-4 p-4">
                        <img src={t.thumbnail} className="w-24 h-16 rounded object-cover" />
                        <div className="flex-1">
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                                #{idx + 1} • {t.channelTitle}
                                <ContentBadge title={t.title} />
                                <NewBadge hours={t.hoursSincePublished} />
                            </div>

                            <div className="font-bold text-[#C62828] leading-snug line-clamp-2">
                                {t.title}
                            </div>

                            <div className="mt-2 flex gap-3 items-center">
                                <div className="text-xl font-extrabold text-[#C62828]">
                                    {formatNumber(t.viewCount)}
                                </div>
                                <div className="px-2 py-1 bg-[#FFF4DB] text-sm font-bold rounded">
                                    {formatNumber(t.viewsPerHour)}/hr
                                </div>
                                <div className="text-xs text-gray-500">
                                    {TimeAgoFromHours(t.hoursSincePublished)}
                                </div>
                            </div>
                        </div>

                        <a
                            href={t.url}
                            target="_blank"
                            rel="noreferrer"
                            className="self-center px-3 py-2 bg-[#C62828] text-white rounded font-bold"
                        >
                            Watch
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ---------------------------- FASTEST GROWING ---------------------------- */
function FastestGrowing({ list }) {
    const fastest = list
        .filter(v => v.hoursSincePublished <= 24)
        .sort((a, b) => b.viewsPerHour - a.viewsPerHour)
        .slice(0, 5);

    if (!fastest.length) return null;

    return (
        <div className="max-w-[1400px] mx-auto px-6 mt-10">
            <h2 className="text-xl font-bold text-[#C62828] mb-4">
                ⚡ Fastest Growing Today
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {fastest.map(v => (
                    <a key={v.id} href={v.url} target="_blank" rel="noreferrer"
                        className="bg-white rounded-xl shadow-sm border hover:border-[#C62828] overflow-hidden">
                        <img src={v.thumbnail} className="w-full h-28 object-cover" />
                        <div className="p-3">
                            <div className="text-xs flex items-center gap-2">
                                <ContentBadge title={v.title} />
                                <NewBadge hours={v.hoursSincePublished} />
                            </div>
                            <div className="font-semibold text-sm text-[#8B1A1A] line-clamp-2 mt-1">
                                {v.title}
                            </div>
                            <div className="text-xs font-bold text-[#C62828] mt-2">
                                {formatNumber(v.viewsPerHour)}/hr
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

/* ---------------------------- TRENDING WALL ---------------------------- */
function TrendingWall({ list }) {
    return (
        <div className="max-w-[1400px] mx-auto px-6 mt-10 pb-16">
            <h2 className="text-xl font-bold text-[#C62828] mb-4">
                Trending Wall
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {list.map(it => (
                    <a key={it.id} href={it.url} target="_blank" rel="noreferrer"
                        className="bg-white rounded-xl shadow-sm border hover:border-[#C62828] overflow-hidden">
                        <img src={it.thumbnail} className="w-full h-32 object-cover" />
                        <div className="p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <ContentBadge title={it.title} />
                                <NewBadge hours={it.hoursSincePublished} />
                            </div>
                            <div className="font-semibold text-[#8B1A1A] line-clamp-2">
                                {it.title}
                            </div>
                            <div className="text-xs font-bold text-[#C62828] mt-2">
                                {formatNumber(it.viewsPerHour)}/hr
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
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");

    async function fetchData(tab) {
        setLoading(true);
        try {
            const url =
                tab === "telugu"
                    ? "/api/youtube-trending?lang=telugu"
                    : "/api/youtube-trending";

            const res = await fetch(url);
            const json = await res.json();
            setData(json);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData(activeTab);
        const id = setInterval(() => fetchData(activeTab), 10 * 60 * 1000);
        return () => clearInterval(id);
    }, [activeTab]);

    const list = data?.results || [];
    const top3 = list.slice(0, 3);

    return (
        <>
            <Head>
                <title>YouTube Stats — CINEQ</title>
            </Head>

            <Header />

            <div className="min-h-screen bg-[#F9FAFB]">
                <Hero
                    lastUpdated={data?.fetchedAt}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                {!loading && data && (
                    <>
                        <TopMetrics top3={top3} />
                        <FastestGrowing list={list} />
                        <TrendingWall list={list.slice(0, 20)} />
                    </>
                )}
            </div>

            <Footer />
        </>
    );
}
