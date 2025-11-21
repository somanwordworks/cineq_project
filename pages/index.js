import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer"; // ✅ Added universal footer
import ServiceUnavailable from "../components/ServiceUnavailable";
// import DisclaimerModal from "../components/DisclaimerModal";
import {
    getHeroBlocks,
    getReviews,
    getGossips,
    getTrailers,
    getMustWatchOTT,
    getRetrospect,
    getCINEQSpeaks,
    withTimeout,   // ⬅️ REQUIRED FIX
} from "../lib/airtable";
import PosterPathshala from "../components/PosterPathshala";
import BiggBossWinners from "../components/BiggBoss";
import BirthdayBanner from "../components/BirthdayBanner";

/* ------------------------- Utils ------------------------- */
const formatDate = (date) =>
    new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata",
    })
        .format(date)
        .replace(",", "");

const TELUGU = "te";
const toISO = (d) => d.toISOString().slice(0, 10);
function mapResults(list) {
    return (list || []).map((m) => ({
        id: m.id,
        title: m.title || m.original_title,
        releaseDate: m.release_date || "Coming Soon",
        poster: m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : null,
        overview: m.overview,
    }));
}

/* ------------------------- Server fetch (TMDB Radar) ------------------------- */
async function fetchUpcomingTeluguServer() {
    const v3 = process.env.TMDB_API_KEY;
    const v4 = process.env.TMDB_ACCESS_TOKEN;
    if (!v3 && !v4) return [];

    const today = new Date();
    const in180 = new Date();
    in180.setDate(today.getDate() + 180);

    const doFetch = async (url) => {
        const resp = await fetch(
            url,
            v4
                ? { headers: { Authorization: `Bearer ${v4}`, accept: "application/json" } }
                : undefined
        );
        if (!resp.ok) return [];
        const data = await resp.json();
        return mapResults(data.results || []);
    };

    const mkDiscover = (opts = {}) => {
        const url = new URL("https://api.themoviedb.org/3/discover/movie");
        url.searchParams.set("include_adult", "false");
        url.searchParams.set("include_video", "false");
        if (opts.withLang !== false) url.searchParams.set("with_original_language", TELUGU);
        url.searchParams.set("sort_by", opts.sortBy || "primary_release_date.asc");
        if (opts.withDates !== false) {
            url.searchParams.set("primary_release_date.gte", toISO(today));
            url.searchParams.set("primary_release_date.lte", toISO(in180));
        }
        if (opts.region) url.searchParams.set("region", "IN");
        if (opts.releaseType) url.searchParams.set("with_release_type", "2|3");
        if (!v4 && v3) url.searchParams.set("api_key", v3);
        return url.toString();
    };

    let res = await doFetch(mkDiscover({ region: true, releaseType: true, withDates: true }));
    if (!res.length) res = await doFetch(mkDiscover({ region: true, withDates: true }));
    if (!res.length) res = await doFetch(mkDiscover({ withDates: true }));
    if (!res.length) res = await doFetch(mkDiscover({ withDates: false, sortBy: "popularity.desc" }));
    return res;
}



/* ------------------------- Data Fetch ------------------------- */
export async function getServerSideProps() {
    const [
        heroBlocks,
        reviews,
        gossips,
        trailers,
        mustWatch,
        retrospect,
        CINEQspeaks,
    ] = await Promise.all([
        withTimeout(getHeroBlocks(), 2000).catch(() => ({ error: true })),
        withTimeout(getReviews(), 2000).catch(() => ({ error: true })),
        withTimeout(getGossips(), 2000).catch(() => ({ error: true })),
        withTimeout(getTrailers(), 2000).catch(() => ({ error: true })),
        withTimeout(getMustWatchOTT(), 2000).catch(() => ({ error: true })),
        withTimeout(getRetrospect(), 2000).catch(() => ({ error: true })),
        withTimeout(getCINEQSpeaks(), 2000).catch(() => ({ error: true })),
    ]);

    const hasError =
        heroBlocks?.error ||
        reviews?.error ||
        gossips?.error ||
        trailers?.error ||
        mustWatch?.error ||
        retrospect?.error ||
        CINEQspeaks?.error;

    // TMDB section
    let telugu = [];
    try {
        telugu = await fetchUpcomingTeluguServer();
    } catch {
        telugu = [];
    }

    return {
        props: {
            heroBlocks,
            reviews,
            gossips,
            trailers,
            mustWatch,
            retrospect,
            CINEQspeaks,
            telugu,
            hasError,
        },
    };
}


/* ------------------------- Hero Block ------------------------- */
const isVideoUrl = (u = "") => /\.(mp4|mov|webm|m4v)(\?|$)/i.test(u);

const HeroCarousel = ({ items }) => {
    const [index, setIndex] = useState(0);

    // Flatten all media from Airtable rows
    const slides = items.flatMap((item) =>
        (item.media || []).map((m, idx) => ({
            id: `${item.id}-${idx}`,
            url: m,
            side: item.side,
            duration: item.duration || 3,
        }))
    );

    useEffect(() => {
        if (!slides.length) return;
        const current = slides[index];
        let timer;

        if (isVideoUrl(current.url)) {
            timer = setTimeout(
                () => setIndex((p) => (p + 1) % slides.length),
                (current.duration || 10) * 1000
            );
        } else {
            timer = setTimeout(() => setIndex((p) => (p + 1) % slides.length), 3000);
        }

        return () => clearTimeout(timer);
    }, [index, slides]);

    if (!slides.length) {
        return <div className="w-full h-[500px] rounded-xl bg-black" />;
    }

    const current = slides[index];

    return (
        <div className="w-full h-[500px] bg-black flex items-center justify-center rounded-xl overflow-hidden">
            {isVideoUrl(current.url) ? (
                <video
                    key={current.id}
                    src={current.url}
                    className="w-full h-full object-contain bg-black"
                    autoPlay
                    muted
                    loop={false}
                    playsInline
                    preload="auto"
                    onCanPlay={() => {
                        // Start video as soon as it can play
                        const vid = document.querySelector(`video[key="${current.id}"]`);
                        if (vid) vid.play().catch(() => { });
                    }}
                    onEnded={() => setIndex((p) => (p + 1) % slides.length)}
                />

            ) : (
                <img
                    key={current.id}
                    src={current.url || "/placeholder.jpg"}
                    alt="Hero"
                    className="w-full h-full object-contain bg-black"
                />
            )}
        </div>
    );
};



/* ================== COMPACT VARIANTS (for left/right layout) ================== */

/* -------- CINEQ Radar · Telugu -------- */
function CineqTeluguRow({ items, compact = false }) {
    const [list, setList] = useState(items || [])
    const [votes, setVotes] = useState({})

    const toLocalMidnight = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x }
    const parseIST = (s) => new Date(`${s}T00:00:00+05:30`)
    const today = toLocalMidnight(new Date())

    useEffect(() => {
        if (!items || !items.length) {
            fetch('/api/tmdb/te-now-playing')
                .then(r => r.json())
                .then(d => setList(mapResults(d.results || [])))
        }
    }, [items])

    const badgeClass = (tone) => {
        const base = "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border"
        if (tone === 'soon') return base + " bg-yellow-100 text-yellow-800 border-yellow-200"
        if (tone === 'released') return base + " bg-green-100 text-green-800 border-green-200"
        if (tone === 'announcement') return base + " bg-blue-100 text-blue-800 border-blue-200"
        return base + " bg-gray-100 text-gray-700 border-gray-200"
    }

    const statusFor = (releaseDate) => {
        if (!releaseDate || releaseDate === 'Coming Soon') return { label: 'Coming Soon', tone: 'announcement' }
        const d = parseIST(releaseDate)
        if (isNaN(d.getTime())) return { label: 'TBA', tone: 'muted' }
        if (toLocalMidnight(d) > today) return { label: 'Releasing Soon', tone: 'soon', date: d }
        return { label: 'Released', tone: 'released', date: d }
    }

    const upcomingOnly = (list || []).filter(m => {
        if (!m.releaseDate || m.releaseDate === 'Coming Soon') return true
        const d = parseIST(m.releaseDate)
        if (isNaN(d.getTime())) return true
        return toLocalMidnight(d) > today
    })

    return (
        <section className={compact ? "" : "max-w-7xl mx-auto px-4 py-2 mb-12"}>
            <h2 className={`font-semibold mb-3 ${compact ? "text-xl" : "text-2xl"}`}>CINEQ Radar · Telugu</h2>
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <div className="flex gap-4 pr-4 snap-x snap-mandatory">
                    {upcomingOnly.map(m => {
                        const st = statusFor(m.releaseDate)
                        const v = votes[m.id] ?? 0
                        return (
                            <article key={m.id} className="min-w-[180px] sm:w-[200px] rounded-2xl border bg-white overflow-hidden hover:shadow-md transition snap-start">
                                <div className="relative">
                                    <div className="aspect-[2/3] bg-gray-100">
                                        <img src={m.poster || 'https://placehold.co/342x513?text=No+Poster'} alt={m.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute top-2 right-2">
                                        <span className={badgeClass(st.tone)}>{st.label}</span>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <h3 className="text-sm font-semibold leading-snug line-clamp-2">{m.title}</h3>
                                    <div className="mt-1 text-xs text-gray-600">
                                        {st.date ? `Release: ${formatDate(st.date)}` : 'Production Announced'}
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <button className={`flex-1 h-8 rounded-xl border text-xs ${v === 1 ? 'bg-green-600 text-white' : 'bg-white hover:bg-green-50'}`}>👍 Like</button>
                                        <button className={`flex-1 h-8 rounded-xl border text-xs ${v === -1 ? 'bg-red-600 text-white' : 'bg-white hover:bg-red-50'}`}>👎 Dislike</button>
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

/* -------- CINEQ Radar · OTT (Telugu) -------- */
function CineqOTTRow({ compact = false }) {
    const [list, setList] = useState([])

    useEffect(() => {
        fetch('/api/ott-releasing?ts=' + Date.now())
            .then(r => r.json())
            .then(d => setList(d.results || []))
    }, [])

    const badgeClass = (tone) => {
        const base = "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border"
        if (tone === 'released')
            return base + " bg-green-100 text-green-800 border-green-200"
        if (tone === 'announcement')
            return base + " bg-blue-100 text-blue-800 border-blue-200"
        return base + " bg-gray-100 text-gray-700 border-gray-200"
    }

    const statusForOTT = (platform) => {
        if (!platform || platform === "TBA")
            return { label: "Platform TBA", tone: "announcement" }
        return { label: platform, tone: "released" }
    }

    return (
        <section className={compact ? "" : "max-w-7xl mx-auto px-4 py-2 mb-12"}>
            <h2 className={`font-semibold mb-3 ${compact ? "text-xl" : "text-2xl"}`}>
                CINEQ Radar · OTT (Telugu)
            </h2>
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <div className="flex gap-4 pr-4 snap-x snap-mandatory">
                    {list.map(m => {
                        const st = statusForOTT(m.platform)
                        return (
                            <article key={m.id} className="min-w-[180px] sm:w-[200px] rounded-2xl border bg-white overflow-hidden hover:shadow-md transition snap-start">
                                <div className="relative">
                                    <div className="aspect-[2/3] bg-gray-100">
                                        <img
                                            src={m.poster || 'https://placehold.co/342x513?text=No+Poster'}
                                            alt={m.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute top-2 right-2">
                                        <span className={badgeClass(st.tone)}>{st.label}</span>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <h3 className="text-sm font-semibold leading-snug line-clamp-2">{m.title}</h3>
                                    <p className="text-xs font-medium text-blue-700">📺 {m.platform || "TBA"}</p>
                                </div>
                            </article>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

/* -------- CINEQ Speaks (fills right column; inner scroll) -------- */
function CINEQSpeaks({ compact = false, maxItems = 50, notes = [] }) {
    const ordered = [...notes]
        .filter(n => n?.content)
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        .slice(0, maxItems)

    return (
        <section className={compact ? "" : "max-w-7xl mx-auto px-4 py-2 mb-12"}>
            <h2 className={`font-semibold mb-3 flex items-center gap-2 ${compact ? "text-xl" : "text-2xl"}`}>
                <span role="img" aria-label="mic">🎙️</span> CINEQ Speaks
            </h2>

            <div className="rounded-2xl border bg-white shadow-sm h-full">
                <div className="h-full overflow-y-auto custom-thin-scroll">
                    {ordered.length === 0 ? (
                        <div className="p-4 text-gray-500 italic">
                            No editorial notes yet... CINEQ will speak soon!
                        </div>
                    ) : (
                        ordered.map((note, idx) => (
                            <div key={note.id} className={`p-5 ${idx !== ordered.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                <p className="text-gray-800 leading-relaxed">“{note.content}”</p>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-sm text-gray-500">— {note.author || 'CINEQ'}</span>
                                    {note.date ? (
                                        <span className="text-xs text-gray-400">
                                            {new Date(note.date).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}


/* -------- 🧨 Dynamic Bhavani Gossips (India-wide) -------- */
function BhavaniGossips() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch("/api/bhavani")
            .then(r => r.json())
            .then(d => setItems(d.items || []))
            .catch(() => { });
    }, []);

    if (!items.length) return (
        <p className="text-center text-gray-500">Loading gossips…</p>
    );

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-center">🧨 Is It True Bhavani !!</h2>

            <div className="h-[600px] overflow-y-auto pr-2 space-y-4">
                {items.map((text, idx) => (
                    <div
                        key={idx}
                        className="bg-yellow-50 border border-yellow-200 p-3 rounded shadow"
                    >
                        <p className="text-sm text-gray-800">{text}</p>

                        {idx !== items.length - 1 && (
                            <hr className="border-dotted border-gray-300 mt-3" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}


/* -------- 🔥 CINEQ Buzz (Full News Blocks - Clean, No Images) -------- */
function CINEQBuzz() {
    const [buzz, setBuzz] = useState([]);
    const [details, setDetails] = useState({}); // store summaries for each item

    useEffect(() => {
        fetch("/api/cineqbuzz")
            .then((r) => r.json())
            .then((d) => {
                setBuzz(d.items || []);

                // Fetch summary for each news link
                d.items.forEach((item) => {
                    fetch(`/api/cineqbuzz-detail?url=${encodeURIComponent(item.link)}`)
                        .then((r) => r.json())
                        .then((summaryData) =>
                            setDetails((prev) => ({
                                ...prev,
                                [item.link]: summaryData,
                            }))
                        );
                });
            })
            .catch(() => { });
    }, []);

    if (!buzz.length) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 py-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>🔥</span> CINEQ Buzz (Live News)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {buzz.map((item, idx) => {
                    const summaryData = details[item.link];

                    return (
                        <div
                            key={idx}
                            className="bg-white rounded-xl shadow-md p-4 border hover:shadow-lg transition"
                        >
                            {/* Title */}
                            <h3 className="font-bold text-lg mb-3 leading-snug">
                                {item.title}
                            </h3>

                            {/* Summary */}
                            <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                                {summaryData?.summary
                                    ?.replace(/<[^>]*>/g, "")
                                    ?.replace(/&nbsp;/g, " ")
                                    ?.trim() || "Loading news…"}
                            </p>

                            {/* Source */}
                            <p className="text-xs text-gray-500 mb-1">
                                Source: {item.source || "Google News"}
                            </p>

                            {/* Time */}
                            {item.published && (
                                <p className="text-xs text-gray-400">
                                    {new Date(item.published).toLocaleString("en-IN")}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

/* -------- 📢 Ad Scroller (Full-Width Continuous Scroll) -------- */
function AdScroller() {
    const ads = [
        "/ads/header-banner.jpg",
        "/ads/ad1.png",
        "/ads/ad2.png",
        "/ads/ad3.png",
        "/ads/ad4.png",
        "/ads/ad5.png"
    ];

    // Duplicate images for seamless scrolling
    const allAds = [...ads, ...ads];

    return (
        <div className="w-full bg-gray-100 border border-gray-300 py-3 overflow-hidden mb-10 rounded-lg">
            <div className="flex items-center animate-marquee-images">
                {allAds.map((src, idx) => (
                    <img
                        key={idx}
                        src={src}
                        alt={`ad-${idx}`}
                        className="mx-10 h-[70px] w-auto object-contain"
                    />
                ))}
            </div>

            <style jsx>{`
                @keyframes marquee-images {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }

                .animate-marquee-images {
                    display: flex;
                    width: max-content;
                    animation: marquee-images 25s linear infinite;
                    will-change: transform;
                }
            `}</style>
        </div>
    );
}


/* ------------------------- Page ------------------------- */
export default function Home({
    heroBlocks = [],
    reviews = [],
    gossips = [],
    trailers = [],
    mustWatch = [],
    retrospect = [],
    CINEQspeaks = [],   // ✅ add this
    telugu = [],
    hasError,
}) {

    if (hasError) {
        return <ServiceUnavailable />;
    }

    const leftBlocks = heroBlocks.filter((b) => (b.side || "").toLowerCase() === "left");
    const rightBlocks = heroBlocks.filter((b) => (b.side || "").toLowerCase() === "right");

    return (
        <>
            <Head>
                <title>CINEQ - Honest Movie Reviews</title>
                <meta
                    name="description"
                    content="CINEQ brings you sharp, clean, and honest movie reviews."
                />
            </Head>

            <Header />

            <main className="max-w-7xl mx-auto px-4 py-6 scroll-smooth">
                {/* 🔥 Hero */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <HeroCarousel items={leftBlocks} />
                    <HeroCarousel items={rightBlocks} />
                </div>

                {/* 🎉 Birthday Banner */}
                <div className="w-full overflow-hidden bg-yellow-100 border border-yellow-300 rounded-lg py-2 mb-8">
                    <div className="whitespace-nowrap text-center text-sm font-medium text-gray-800 animate-marquee">
                        <BirthdayBanner />
                    </div>
                </div>



                {/* 📢 Ad Banner Scroller */}
                <AdScroller />



                {/* 🧭 Radar + OTT (left) / Speaks (right) */}
                <div className="mb-12 lg:flex lg:gap-6">
                    <div className="w-full lg:w-2/3 space-y-8">
                        <CineqTeluguRow items={telugu} compact />
                        <CineqOTTRow compact />
                    </div>
                    <div
                        className="w-full lg:w-1/3 lg:sticky custom-thin-scroll"
                        style={{ top: 96, maxHeight: "calc(100vh - 96px)", overflowY: "auto" }}
                    >
                        <CINEQSpeaks compact notes={CINEQspeaks} />

                    </div>
                </div>

                {/* Reviews | Trailers | Gossips */}
                <section className="mb-16" id="reviews-trailers-gossips">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Reviews */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-center">🎬 Latest Movie Reviews</h2>
                            <div className="h-[600px] overflow-y-auto pr-2 space-y-4">
                                {reviews.map((review) => (
                                    <div key={review.slug} className="bg-white shadow-md rounded-lg overflow-hidden">
                                        <div className="relative w-full h-[250px] bg-gray-100 flex items-center justify-center">
                                            <img src={review.poster || '/placeholder.jpg'} alt={review.title} className="object-contain h-full" />
                                        </div>
                                        <div className="p-3 text-sm">
                                            <h3 className="font-bold mb-1">{review.title}</h3>
                                            {review.onelineReview && (
                                                <p className="text-gray-800 italic mb-2">“{review.onelineReview}”</p>
                                            )}
                                            <p className="text-gray-700 mb-1">🎭 Cast: {review.cast}</p>
                                            <p className="text-green-700 font-semibold mb-1">📝 {review.verdict}</p>
                                            <p className="text-gray-600 mb-1">🎬 Director: {review.director}</p>
                                            <p className="text-gray-600 mb-1">💼 Producer: {review.producer}</p>
                                            <p className="text-gray-600 mb-1">🏢 Production: {review.productionHouse}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Trailers */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-center">🎞️ Watch Latest Trailers</h2>
                            <div className="h-[600px] overflow-y-auto pr-2 space-y-4">
                                {trailers.map((trailer, idx) => (
                                    <div key={idx} className="bg-white shadow-md rounded-lg overflow-hidden">
                                        <div className="aspect-video">
                                            <iframe
                                                src={trailer.url.replace('watch?v=', 'embed/')}
                                                title={trailer.title}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="w-full h-full border-none"
                                            ></iframe>
                                        </div>
                                        <div className="p-3">
                                            <h3 className="font-bold text-gray-800 text-sm">{trailer.title}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                       
                        {/* Gossips (dynamic) */}
                        <BhavaniGossips />

                    </div>
                </section>


                {/* 🔥 CINEQ Buzz (Dynamic) */}
                <CINEQBuzz />



                {/* 📺 CINEQ · Must Watch OTT + 🎞️ Retrospect */}
                <section className="max-w-7xl mx-auto px-4 pt-4 pb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Must Watch OTT (2/3 width) */}
                        <div className="lg:col-span-2 flex flex-col">
                            <h2 className="font-semibold mb-3 text-xl">CINEQ · Must Watch OTT</h2>
                            <div className="flex-1 bg-white rounded-xl shadow-md p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                {!mustWatch.length ? (
                                    <p className="text-gray-500">No Must Watch titles available right now.</p>
                                ) : (
                                    <div className="flex gap-4 pr-4 snap-x snap-mandatory">
                                        {mustWatch.map((item) => (
                                            <article
                                                key={item.id}
                                                className="min-w-[180px] sm:w-[200px] rounded-2xl border bg-white overflow-hidden hover:shadow-md transition snap-start"
                                            >
                                                <div className="relative">
                                                    <div className="aspect-[2/3] bg-gray-100">
                                                        <img
                                                            src={item.poster}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="absolute top-2 right-2">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border bg-black bg-opacity-70 text-white">
                                                            {item.platform}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-3">
                                                    <h3 className="text-sm font-semibold leading-snug line-clamp-2">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">{item.language}</p>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 🎞️ Retrospect (1/3 width) */}
                        <div className="flex flex-col">
                            <h2 className="font-semibold mb-3 text-xl">CINEQ · Retrospect</h2>
                            <div className="flex-1 bg-white rounded-xl shadow-md p-4 h-[500px] overflow-y-auto custom-thin-scroll">
                                {!retrospect || !retrospect.length ? (
                                    <p className="text-gray-500 italic">
                                        No Retrospect analysis available yet...
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {retrospect.map((item) => (
                                            <div key={item.id} className="border-b border-gray-200 pb-3">
                                                <h3 className="font-semibold text-gray-800 text-sm">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-gray-700">{item.analysis}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>


                {/* 🔥 CINEQ Specials */}
                <section className="max-w-7xl mx-auto px-4 py-4">
                    <h2 className="text-2xl font-bold text-center mb-6">🔥 CINEQ Specials</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-md p-4">
                            <BiggBossWinners />
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-4">
                            <PosterPathshala />

                        </div>
                    </div>
                </section>


                <footer className="text-center text-gray-500 text-sm py-6 border-t border-gray-200">
                    © 2025 CINEQ. All rights reserved.
                </footer>
            </main>

            {/* ✅ Universal Footer Added */}
            <Footer />

            <style jsx>{`
        .animate-marquee { display: inline-block; padding-left: 100%; animation: marquee 15s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }
        .scrollbar-thin::-webkit-scrollbar { height: 8px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 9999px; }

        /* Thin vertical scrollbar for Speaks column and card */
        .custom-thin-scroll::-webkit-scrollbar { width: 8px; }
        .custom-thin-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 9999px; }
        .custom-thin-scroll::-webkit-scrollbar-track { background: transparent; }
      `}</style>
        </>
    )
}
