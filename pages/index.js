import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
    getHeroBlocks,
    getGossips,
    getTrailers,
    getMustWatchOTT,
    getRetrospect,
    getCINEQSpeaks,
} from "../lib/airtable";
import PosterPathshala from "../components/PosterPathshala";
import BiggBossWinners from "../components/BiggBoss";
import BirthdayBanner from "../components/BirthdayBanner";
import YoutubeFlash from "../components/YoutubeFlash";

/* ─── Utils ─── */
const formatDate = (date) =>
    new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" })
        .format(date).replace(",", "");
const TELUGU = "te";
const toISO = (d) => d.toISOString().slice(0, 10);
function mapResults(list) {
    return (list || []).map((m) => ({
        id: m.id, title: m.title || m.original_title,
        releaseDate: m.release_date || "Coming Soon",
        poster: m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : null,
        overview: m.overview, rating: m.vote_average ? Number(m.vote_average).toFixed(1) : null,
        votes: m.vote_count || 0, popularity: m.popularity || 0,
    }));
}
function fmtViews(n) {
    if (!n) return "0";
    if (n >= 1e7) return (n / 1e7).toFixed(1) + "Cr";
    if (n >= 1e5) return (n / 1e5).toFixed(1) + "L";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return String(n);
}

/* ─── TMDB Server Fetch ─── */
async function fetchUpcomingTeluguServer() {
    const v3 = process.env.TMDB_API_KEY;
    const v4 = process.env.TMDB_ACCESS_TOKEN;
    if (!v3 && !v4) return [];
    const today = new Date();
    const in180 = new Date(); in180.setDate(today.getDate() + 180);
    const doFetch = async (url) => {
        const resp = await fetch(url, v4 ? { headers: { Authorization: `Bearer ${v4}`, accept: "application/json" } } : undefined);
        if (!resp.ok) return [];
        return mapResults((await resp.json()).results || []);
    };
    const mk = (opts = {}) => {
        const url = new URL("https://api.themoviedb.org/3/discover/movie");
        url.searchParams.set("include_adult", "false"); url.searchParams.set("include_video", "false");
        if (opts.withLang !== false) url.searchParams.set("with_original_language", TELUGU);
        url.searchParams.set("sort_by", opts.sortBy || "primary_release_date.asc");
        if (opts.withDates !== false) { url.searchParams.set("primary_release_date.gte", toISO(today)); url.searchParams.set("primary_release_date.lte", toISO(in180)); }
        if (opts.region) url.searchParams.set("region", "IN");
        if (opts.releaseType) url.searchParams.set("with_release_type", "2|3");
        if (!v4 && v3) url.searchParams.set("api_key", v3);
        return url.toString();
    };
    let res = await doFetch(mk({ region: true, releaseType: true, withDates: true }));
    if (!res.length) res = await doFetch(mk({ region: true, withDates: true }));
    if (!res.length) res = await doFetch(mk({ withDates: true }));
    if (!res.length) res = await doFetch(mk({ withDates: false, sortBy: "popularity.desc" }));
    return res;
}

/* ─── Server fetch: Hero movies (TMDB trending Telugu) ─── */
async function fetchHeroMoviesServer() {
    const v3 = process.env.TMDB_API_KEY;
    const v4 = process.env.TMDB_ACCESS_TOKEN;
    if (!v3 && !v4) return [];
    const headers = v4 ? { Authorization: `Bearer ${v4}`, accept: "application/json" } : {};
    const addKey = (url) => { if (!v4 && v3) url.searchParams.set("api_key", v3); return url; };
    const safe = async (url) => {
        try {
            const r = await fetch(url, { headers });
            if (!r.ok) return [];
            const d = await r.json();
            return d.results || [];
        } catch { return []; }
    };
    const trendUrl = addKey(new URL("https://api.themoviedb.org/3/trending/movie/week"));
    const nowUrl = addKey(new URL("https://api.themoviedb.org/3/movie/now_playing"));
    nowUrl.searchParams.set("region", "IN");
    const [trending, nowPlaying] = await Promise.all([safe(trendUrl.toString()), safe(nowUrl.toString())]);
    const seen = new Set();
    return [...trending, ...nowPlaying]
        .filter(m => m.original_language === "te" && (m.backdrop_path || m.poster_path))
        .filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; })
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 12)
        .map(m => ({
            id: m.id,
            title: m.title || m.original_title,
            backdrop: m.backdrop_path ? `https://image.tmdb.org/t/p/w1280${m.backdrop_path}` : null,
            poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
            year: m.release_date ? m.release_date.slice(0, 4) : "",
            rating: m.vote_average ? Number(m.vote_average).toFixed(1) : null,
            overview: (m.overview || "").slice(0, 120),
        }));
}

/* ─── ISR ─── */
export async function getStaticProps() {
    const [heroBlocks, gossips, trailers, mustWatch, retrospect, CINEQspeaks] = await Promise.all([
        getHeroBlocks().catch(() => []), getGossips().catch(() => []), getTrailers().catch(() => []),
        getMustWatchOTT().catch(() => []), getRetrospect().catch(() => []), getCINEQSpeaks().catch(() => []),
    ]);
    let telugu = [];
    let heroMovies = [];
    try { telugu = await fetchUpcomingTeluguServer(); } catch { telugu = []; }
    try { heroMovies = await fetchHeroMoviesServer(); } catch { heroMovies = []; }
    return {
        props: {
            heroBlocks: Array.isArray(heroBlocks) ? heroBlocks : [],
            telugu: Array.isArray(telugu) ? telugu : [],
            heroMovies: Array.isArray(heroMovies) ? heroMovies : [],
        },
        revalidate: 7200,
    };
}

/* ─── Design tokens ─── */
const T = { ink: "#0F0F0F", paper: "#FAF8F4", paper2: "#F2EFE8", border: "#E2DDD5", muted: "#8A8680", red: "#C62828", gold: "#E6B852", white: "#FFFFFF" };

function SectionHead({ title, sub, pill }) {
    return (
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 20, letterSpacing: "0.12em", color: T.ink }}>{title}</span>
            {sub && <span style={{ fontSize: 11, color: T.muted }}>{sub}</span>}
            {pill && <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: T.red, cursor: "pointer", textTransform: "uppercase" }}>{pill}</span>}
        </div>
    );
}

function Card({ children, style = {} }) {
    return <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", ...style }}>{children}</div>;
}

function CardHead({ title, right }) {
    return (
        <div style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 15, letterSpacing: "0.12em", color: T.ink }}>{title}</span>
            {right && <span style={{ fontSize: 10, color: T.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{right}</span>}
        </div>
    );
}

/* ─── Hero ─── */
const isVideoUrl = (u = "") => /\.(mp4|mov|webm|m4v)(\?|$)/i.test(u);

/* ─── Dynamic Hero ─── */
// Uses heroMovies from getStaticProps (server-fetched TMDB trending Telugu).
// Falls back to /api/tmdb/te-now-playing on client if props are empty.
// Large card = left half of movies, small card = right half.

function DynamicHeroCard({ movies, size = "large" }) {
    const [index, setIndex] = useState(0);
    const [fading, setFading] = useState(false);

    useEffect(() => {
        if (!movies.length) return;
        const t = setInterval(() => {
            setFading(true);
            setTimeout(() => {
                setIndex(p => (p + 1) % movies.length);
                setFading(false);
            }, 400);
        }, size === "large" ? 5000 : 4000);
        return () => clearInterval(t);
    }, [movies, size]);

    if (!movies.length) {
        return <div style={{ width: "100%", height: "100%", background: "#111", borderRadius: size === "large" ? 14 : 10 }} />;
    }

    const m = movies[index];
    const img = m.backdrop || m.poster || "https://placehold.co/1280x720?text=CINEQ";

    if (size === "large") {
        return (
            <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: 14, overflow: "hidden", background: T.ink, cursor: "pointer" }}>
                <img src={img} alt={m.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", opacity: fading ? 0 : 0.82, transition: "opacity 0.4s ease" }} />
                {/* Dark gradient */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.05) 100%)" }} />
                {/* Content */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 24px" }}>
                    {/* LIVE badge */}
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: T.red, color: "white", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 4, marginBottom: 10 }}>
                        <span style={{ width: 5, height: 5, background: "white", borderRadius: "50%", animation: "cineqPulse 1.5s infinite" }} />
                        Trending Now
                    </div>
                    {/* Title */}
                    <div style={{ fontSize: 22, fontWeight: 700, color: "white", lineHeight: 1.2, marginBottom: 6, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                        {m.title}
                    </div>
                    {/* Meta */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
                        {m.year && <span>{m.year}</span>}
                        {m.rating && (
                            <span style={{ display: "flex", alignItems: "center", gap: 3, color: T.gold, fontWeight: 700 }}>
                                ★ {m.rating}
                            </span>
                        )}
                        {m.overview && <span style={{ color: "rgba(255,255,255,0.45)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 300 }}>{m.overview}</span>}
                    </div>
                </div>
                {/* Slide dots */}
                {movies.length > 1 && (
                    <div style={{ position: "absolute", bottom: 20, right: 20, display: "flex", gap: 5 }}>
                        {movies.slice(0, 6).map((_, i) => (
                            <div key={i} onClick={() => setIndex(i)}
                                style={{ width: i === index % 6 ? 20 : 6, height: 6, borderRadius: 3, background: i === index % 6 ? T.gold : "rgba(255,255,255,0.35)", cursor: "pointer", transition: "all 0.3s ease" }} />
                        ))}
                    </div>
                )}
                {/* Poster thumbnail strip */}
                <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 6 }}>
                    {movies.slice(0, 4).map((mv, i) => (
                        <img key={mv.id} src={mv.poster || mv.backdrop} alt={mv.title} onClick={() => setIndex(i)}
                            style={{ width: 32, height: 44, borderRadius: 5, objectFit: "cover", cursor: "pointer", opacity: i === index % 4 ? 1 : 0.45, border: i === index % 4 ? `2px solid ${T.gold}` : "2px solid transparent", transition: "all 0.2s" }} />
                    ))}
                </div>
            </div>
        );
    }

    // Small card (right side)
    return (
        <div style={{ position: "relative", width: "100%", height: 263, borderRadius: 11, overflow: "hidden", background: T.ink, cursor: "pointer" }}>
            <img src={m.poster || m.backdrop || "https://placehold.co/400x600?text=?"}
                alt={m.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: fading ? 0 : 0.78, transition: "opacity 0.4s ease" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 16px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "white", lineHeight: 1.25, marginBottom: 4 }}>{m.title}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 11 }}>
                    {m.year && <span style={{ color: "rgba(255,255,255,0.5)" }}>{m.year}</span>}
                    {m.rating && <span style={{ color: T.gold, fontWeight: 700 }}>★ {m.rating}</span>}
                </div>
            </div>
        </div>
    );
}

function HeroSection({ heroMovies }) {
    const [movies, setMovies] = useState(Array.isArray(heroMovies) ? heroMovies : []);

    // If server sent no movies (e.g. TMDB key missing), fetch client-side
    useEffect(() => {
        if (movies.length > 0) return;
        fetch("/api/tmdb/te-now-playing")
            .then(r => r.json())
            .then(d => {
                const seen = new Set();
                const results = (d.results || [])
                    .filter(m => (m.backdrop_path || m.poster_path) && !seen.has(m.id) && seen.add(m.id))
                    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
                    .slice(0, 12)
                    .map(m => ({
                        id: m.id,
                        title: m.title || m.original_title,
                        backdrop: m.backdrop_path ? `https://image.tmdb.org/t/p/w1280${m.backdrop_path}` : null,
                        poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
                        year: m.release_date ? m.release_date.slice(0, 4) : "",
                        rating: m.vote_average ? Number(m.vote_average).toFixed(1) : null,
                        overview: (m.overview || "").slice(0, 120),
                    }));
                setMovies(results);
            })
            .catch(() => { });
    }, []);

    const half = Math.ceil(movies.length / 2);
    const leftMovies = movies.slice(0, half);
    const rightMovies = movies.slice(half);

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 14, marginTop: 24, marginBottom: 24, alignItems: "start" }}>
            {/* Large hero */}
            <DynamicHeroCard movies={leftMovies} size="large" />
            {/* Small stacked right */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <DynamicHeroCard movies={rightMovies.slice(0, Math.ceil(rightMovies.length / 2))} size="small" />
                <DynamicHeroCard movies={rightMovies.slice(Math.ceil(rightMovies.length / 2))} size="small" />
            </div>
        </div>
    );
}


/* ─── Ticker ─── */
function LiveTicker() {
    const [items, setItems] = useState(["CINEQ — Telugu Cinema Intelligence", "Trending films, trailers, OTT releases updated daily", "Telugu · Tamil · Hindi · Malayalam · Kannada"]);
    useEffect(() => {
        fetch("/api/cineqbuzz").then(r => r.json()).then(d => { if (d.items?.length) setItems(d.items.map(i => i.title)); }).catch(() => { });
    }, []);
    const doubled = [...items, ...items];
    return (
        <div style={{ background: T.red, height: 36, display: "flex", alignItems: "center", overflow: "hidden" }}>
            <div style={{ background: T.gold, color: T.ink, fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 13, letterSpacing: "0.15em", padding: "0 16px", height: "100%", display: "flex", alignItems: "center", flexShrink: 0 }}>LIVE</div>
            <div style={{ overflow: "hidden", flex: 1, display: "flex" }}>
                <div style={{ display: "flex", animation: "cineqTicker 40s linear infinite", whiteSpace: "nowrap" }}>
                    {doubled.map((text, i) => (
                        <span key={i} style={{ color: "white", fontSize: 12, fontWeight: 500, padding: "0 28px", borderRight: "1px solid rgba(255,255,255,0.2)", flexShrink: 0 }}>{text}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─── Birthday Bar ─── */
function BirthdayBar() {
    return (
        <div style={{ background: T.gold, borderRadius: 8, padding: "9px 16px", display: "flex", alignItems: "center", gap: 14, overflow: "hidden", marginBottom: 24 }}>
            <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 12, letterSpacing: "0.15em", color: T.ink, flexShrink: 0 }}>BIRTHDAYS</span>
            <div style={{ overflow: "hidden", flex: 1 }}>
                <div style={{ display: "inline-block", animation: "cineqTicker 20s linear infinite", whiteSpace: "nowrap", fontSize: 12, fontWeight: 500, color: T.ink }}>
                    <BirthdayBanner />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<BirthdayBanner />
                </div>
            </div>
        </div>
    );
}

/* ─── Ad Scroller ─── */
function AdScroller() {
    const ads = ["/ads/header-banner.jpg", "/ads/ad1.png", "/ads/ad2.png", "/ads/ad3.png", "/ads/ad4.png", "/ads/ad5.png"];
    const all = [...ads, ...ads];
    return (
        <div style={{ background: T.paper2, border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 24, padding: "10px 0" }}>
            <div style={{ display: "flex", animation: "cineqMarquee 25s linear infinite", width: "max-content", willChange: "transform" }}>
                {all.map((src, i) => <img key={i} src={src} alt="" style={{ height: 56, width: "auto", objectFit: "contain", margin: "0 28px", flexShrink: 0 }} />)}
            </div>
        </div>
    );
}


/* ─── OTT Radar Row (Telugu streaming now) ─── */
function OTTRadarRow() {
    const [list, setList] = useState([]);
    const scrollRef = React.useRef(null);
    const scroll = (dir) => { if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 320, behavior: "smooth" }); };

    useEffect(() => {
        fetch("/api/ott-releasing?ts=" + Date.now())
            .then(r => r.json())
            .then(d => {
                const real = (d.results || []).filter(m =>
                    m.poster &&
                    !m.title?.toLowerCase().includes("placeholder") &&
                    !m.title?.toLowerCase().includes("coming soon") &&
                    !m.title?.toLowerCase().includes("awaiting") &&
                    m.id && !String(m.id).startsWith("f")
                );
                setList(real);
            })
            .catch(() => setList([]));
    }, []);

    if (!list.length) return null;

    return (
        <section style={{ margin: "16px 0 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${T.border}` }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 20, letterSpacing: "0.12em", color: T.ink }}>CINEQ Radar · OTT</span>
                    <span style={{ fontSize: 11, color: T.muted }}>Telugu streaming now</span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                    <CarouselArrowBtn dir="left" onClick={() => scroll(-1)} />
                    <CarouselArrowBtn dir="right" onClick={() => scroll(1)} />
                </div>
            </div>
            <div ref={scrollRef} style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8, scrollBehavior: "smooth" }} className="cineq-hide-scroll">
                {list.map(m => (
                    <div key={m.id} style={{ flexShrink: 0, width: 144 }}>
                        <div style={{ position: "relative", marginBottom: 7 }}>
                            <img src={m.poster} alt={m.title}
                                style={{ width: 144, height: 216, borderRadius: 11, objectFit: "cover", display: "block", transition: "transform 0.2s" }}
                                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
                                onMouseLeave={e => e.currentTarget.style.transform = "none"} />
                            {m.platform && m.platform !== "TBA" && (
                                <span style={{ position: "absolute", top: 7, right: 7, fontSize: 9, fontWeight: 800, padding: "3px 7px", borderRadius: 4, color: "white", textTransform: "uppercase", ...platformBadgeStyle(m.platform) }}>
                                    {m.platform.split(",")[0].trim()}
                                </span>
                            )}
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: T.ink, lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{m.title}</div>
                        <div style={{ fontSize: 10, color: "#3B82F6", fontWeight: 600, marginTop: 2 }}>
                            {m.platform && m.platform !== "TBA" ? `📺 ${m.platform.split(",")[0].trim()}` : `📅 ${m.releaseDate || "TBA"}`}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ─── Radar Row ─── */
function platformBadgeStyle(p = "") {
    const pl = p.toLowerCase();
    if (pl.includes("netflix")) return { background: "#E50914" };
    if (pl.includes("prime")) return { background: "#00A8E0" };
    if (pl.includes("hotstar")) return { background: "#1F3C88" };
    if (pl.includes("aha")) return { background: "#F5830A" };
    if (pl.includes("zee")) return { background: "#6B21A8" };
    if (pl.includes("jio")) return { background: "#7C3AED" };
    return { background: "#374151" };
}

function CarouselArrowBtn({ dir, onClick }) {
    return (
        <button onClick={onClick} style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", border: `1px solid ${T.border}`, background: T.white, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: T.ink, transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = T.ink; e.currentTarget.style.color = T.white; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.white; e.currentTarget.style.color = T.ink; }}>
            {dir === "left" ? "‹" : "›"}
        </button>
    );
}

function RadarRow({ items }) {
    const [list, setList] = useState(items || []);
    const scrollRef = React.useRef(null);
    const toMid = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
    const parseIST = (s) => new Date(`${s}T00:00:00+05:30`);
    const today = toMid(new Date());
    useEffect(() => {
        if (!items?.length) fetch("/api/tmdb/te-now-playing").then(r => r.json()).then(d => setList(mapResults(d.results || [])));
    }, [items]);
    const scroll = (dir) => { if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 320, behavior: "smooth" }); };
    const statusFor = (rd) => {
        if (!rd || rd === "Coming Soon") return { label: "Announced", tone: "announced" };
        const d = parseIST(rd); if (isNaN(d.getTime())) return { label: "TBA", tone: "announced" };
        if (toMid(d) > today) return { label: "Releasing Soon", tone: "soon", date: d };
        return { label: "Released", tone: "released", date: d };
    };
    const stStyle = (tone) => {
        if (tone === "soon") return { background: "#FEF9C3", color: "#854D0E" };
        if (tone === "released") return { background: "#DCFCE7", color: "#166534" };
        return { background: "#DBEAFE", color: "#1E40AF" };
    };
    const upcoming = (list || []).filter(m => {
        if (!m.releaseDate || m.releaseDate === "Coming Soon") return true;
        const d = parseIST(m.releaseDate); return isNaN(d.getTime()) || toMid(d) > today;
    });
    return (
        <section style={{ margin: "24px 0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${T.border}` }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 20, letterSpacing: "0.12em", color: T.ink }}>CINEQ Radar · Telugu</span>
                    <span style={{ fontSize: 11, color: T.muted }}>Upcoming releases</span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                    <CarouselArrowBtn dir="left" onClick={() => scroll(-1)} />
                    <CarouselArrowBtn dir="right" onClick={() => scroll(1)} />
                </div>
            </div>
            <div ref={scrollRef} style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8, scrollBehavior: "smooth" }} className="cineq-hide-scroll">
                {upcoming.map(m => {
                    const st = statusFor(m.releaseDate);
                    return (
                        <div key={m.id} style={{ flexShrink: 0, width: 144 }}>
                            <div style={{ position: "relative", marginBottom: 7 }}>
                                <img src={m.poster || "https://placehold.co/144x216?text=?"} alt={m.title}
                                    style={{ width: 144, height: 216, borderRadius: 11, objectFit: "cover", display: "block", transition: "transform 0.2s" }}
                                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
                                    onMouseLeave={e => e.currentTarget.style.transform = "none"} />
                                <span style={{ position: "absolute", top: 7, left: 7, fontSize: 9, fontWeight: 700, padding: "3px 7px", borderRadius: 4, letterSpacing: "0.05em", textTransform: "uppercase", ...stStyle(st.tone) }}>{st.label}</span>
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: T.ink, lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{m.title}</div>
                            <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{st.date ? formatDate(st.date) : "TBA"}</div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}



/* ═══ BLOCK 1: TRENDING TELUGU THIS WEEK ═══ */
function TrendingTeluguBlock() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/tmdb/te-now-playing")
            .then(r => r.json())
            .then(d => {
                const results = (d.results || [])
                    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
                    .slice(0, 10)
                    .map(m => ({
                        id: m.id,
                        title: m.title || m.original_title,
                        poster: m.poster_path ? `https://image.tmdb.org/t/p/w92${m.poster_path}` : null,
                        rating: m.vote_average ? Number(m.vote_average).toFixed(1) : "N/A",
                        votes: m.vote_count || 0,
                        releaseDate: m.release_date || "",
                    }));
                setMovies(results);
            })
            .catch(() => setMovies([]))
            .finally(() => setLoading(false));
    }, []);

    const rankStyle = (i) => { if (i === 0) return { color: "#E6B852" }; if (i === 1) return { color: "#C0C0C0" }; if (i === 2) return { color: "#CD7F32" }; return { color: "#E2DDD5" }; };
    const rStyle = (r) => { const n = parseFloat(r); if (n >= 7) return { color: "#16A34A" }; if (n >= 5) return { color: "#CA8A04" }; return { color: "#C62828" }; };

    return (
        <Card>
            <CardHead title="TRENDING THIS WEEK" right="Via TMDB" />
            <div style={{ maxHeight: 560, overflowY: "auto" }} className="cineq-custom-scroll">
                {loading ? Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} style={{ height: 60, margin: "4px 12px", borderRadius: 8, animation: "cineqShimmer 1.5s infinite", background: `linear-gradient(90deg, #F2EFE8 25%, #E2DDD5 50%, #F2EFE8 75%)`, backgroundSize: "200% 100%" }} />
                )) : movies.length === 0 ? (
                    <div style={{ padding: 32, textAlign: "center", color: "#8A8680", fontSize: 13, fontStyle: "italic" }}>No data right now.</div>
                ) : movies.map((m, idx) => (
                    <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", borderBottom: "1px solid #E2DDD5", transition: "background 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#F2EFE8"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 22, width: 26, flexShrink: 0, lineHeight: 1, ...rankStyle(idx) }}>{idx + 1}</span>
                        <img src={m.poster || "https://placehold.co/40x58?text=?"} alt={m.title} style={{ width: 40, height: 56, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#0F0F0F", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</div>
                            {m.releaseDate && <div style={{ fontSize: 10, color: "#8A8680", marginTop: 2 }}>{m.releaseDate}</div>}
                        </div>
                        <div style={{ flexShrink: 0, fontSize: 12, fontWeight: 700, ...rStyle(m.rating) }}>★ {m.rating}</div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

/* ═══ BLOCK 2: TRAILER DROP ═══ */
function TrailerDropBlock() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/youtube-trending?lang=telugu")
            .then(r => r.json())
            .then(d => {
                const filtered = (d.results || [])
                    .filter(v => {
                        const t = v.title.toLowerCase();
                        return t.includes("trailer") || t.includes("teaser") || t.includes("glimpse") || t.includes("first look") || t.includes("promo");
                    })
                    .slice(0, 8);
                setItems(filtered);
            })
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <Card>
            <CardHead title="TRAILER DROP" right="Via YouTube" />
            <div style={{ maxHeight: 560, overflowY: "auto" }} className="cineq-custom-scroll">
                {loading ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} style={{ height: 68, margin: "4px 12px", borderRadius: 8, animation: "cineqShimmer 1.5s infinite", background: `linear-gradient(90deg, #F2EFE8 25%, #E2DDD5 50%, #F2EFE8 75%)`, backgroundSize: "200% 100%" }} />
                )) : items.length === 0 ? (
                    <div style={{ padding: 32, textAlign: "center", color: "#8A8680", fontSize: 13, fontStyle: "italic" }}>No new trailers right now.</div>
                ) : items.map((v, idx) => (
                    <a key={v.id} href={v.url} target="_blank" rel="noopener noreferrer"
                        style={{ display: "flex", gap: 12, padding: "11px 14px", borderBottom: idx < items.length - 1 ? "1px solid #E2DDD5" : "none", textDecoration: "none", transition: "background 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#F2EFE8"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <div style={{ flexShrink: 0, width: 104, height: 60, borderRadius: 8, overflow: "hidden", background: "#0F0F0F" }}>
                            <img src={v.thumbnail || "https://placehold.co/104x60?text=YT"} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#0F0F0F", lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{v.title}</div>
                            <div style={{ fontSize: 11, color: "#8A8680", marginTop: 3 }}>{v.channelTitle}</div>
                            <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, background: "#FEE2E2", color: "#991B1B", padding: "2px 7px", borderRadius: 20 }}>▶ YouTube</span>
                                <span style={{ fontSize: 10, color: "#8A8680", background: "#F2EFE8", padding: "2px 7px", borderRadius: 20 }}>👁 {fmtViews(v.viewCount)}</span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </Card>
    );
}

/* ═══ CINEQ BUZZ CARD ═══ */
function CINEQBuzzCard() {
    const [buzz, setBuzz] = useState([]);

    useEffect(() => {
        fetch("/api/cineqbuzz")
            .then(r => r.json())
            .then(d => setBuzz(d.items || []))
            .catch(() => { });
    }, []);

    return (
        <div style={{ background: "#FFFFFF", border: "1px solid #E2DDD5", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ background: "#0F0F0F", padding: "13px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 15, letterSpacing: "0.15em", color: "#E6B852" }}>CINEQ BUZZ</span>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
                    <span style={{ width: 6, height: 6, background: "#4ADE80", borderRadius: "50%", animation: "cineqPulse 1.5s infinite" }} />LIVE
                </span>
            </div>
            <div style={{ maxHeight: 560, overflowY: "auto" }} className="cineq-custom-scroll">
                {buzz.length === 0 ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} style={{ height: 60, margin: "4px 12px", borderRadius: 6, animation: "cineqShimmer 1.5s infinite", background: `linear-gradient(90deg, #F2EFE8 25%, #E2DDD5 50%, #F2EFE8 75%)`, backgroundSize: "200% 100%" }} />
                )) : buzz.slice(0, 8).map((item, idx) => (
                    <div key={idx} style={{ padding: "11px 16px", borderBottom: idx < buzz.length - 1 ? "1px solid #E2DDD5" : "none", transition: "background 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#F2EFE8"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#0F0F0F", lineHeight: 1.4, marginBottom: 5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.title}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#8A8680" }}>
                            <span style={{ fontWeight: 700, color: "#C62828" }}>{item.source || "Google News"}</span>
                            {item.published && <span>{new Date(item.published).toLocaleString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ═══ BOX OFFICE PULSE ═══ */
function BoxOfficePulse() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/tmdb/te-now-playing")
            .then(r => r.json())
            .then(d => {
                const raw = d.results || [];
                // No vote_count filter — upcoming movies have 0 votes but are still valid
                const sorted = raw
                    .filter(m => m.id && (m.title || m.original_title))
                    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
                    .slice(0, 10)
                    .map((m, i) => ({
                        id: m.id,
                        rank: i + 1,
                        title: m.title || m.original_title || "Unknown",
                        poster: m.poster_path ? `https://image.tmdb.org/t/p/w185${m.poster_path}` : null,
                        rating: m.vote_average && m.vote_average > 0
                            ? Number(m.vote_average).toFixed(1)
                            : null,
                        votes: m.vote_count || 0,
                        releaseDate: m.release_date || "",
                        popularity: Math.round(m.popularity || 0),
                        maxPop: 0,
                    }));
                const maxPop = Math.max(...sorted.map(m => m.popularity), 1);
                setMovies(sorted.map(m => ({ ...m, maxPop })));
            })
            .catch(() => setMovies([]))
            .finally(() => setLoading(false));
    }, []);

    const rankColor = (i) => { if (i === 0) return T.gold; if (i === 1) return "#C0C0C0"; if (i === 2) return "#CD7F32"; return T.border; };
    const ratingColor = (r) => { const n = parseFloat(r); if (n >= 7) return "#16A34A"; if (n >= 5) return "#CA8A04"; return T.red; };

    return (
        <Card>
            <CardHead title="BOX OFFICE PULSE" right="Popularity · TMDB" />
            <div style={{ maxHeight: 520, overflowY: "auto" }} className="cineq-custom-scroll">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} style={{ height: 64, margin: "4px 12px", borderRadius: 8, animation: "cineqShimmer 1.5s infinite", background: `linear-gradient(90deg, ${T.paper2} 25%, ${T.border} 50%, ${T.paper2} 75%)`, backgroundSize: "200% 100%" }} />
                    ))
                ) : movies.length === 0 ? (
                    <div style={{ padding: 32, textAlign: "center", color: T.muted, fontSize: 13, fontStyle: "italic" }}>No trending data available</div>
                ) : (
                    movies.map((m, idx) => (
                        <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderBottom: `1px solid ${T.border}`, transition: "background 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.background = T.paper2}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 24, width: 28, flexShrink: 0, lineHeight: 1, color: rankColor(idx) }}>{m.rank}</span>
                            <img src={m.poster || "https://placehold.co/40x58?text=?"} alt={m.title} style={{ width: 38, height: 54, borderRadius: 5, objectFit: "cover", flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: T.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</div>
                                <div style={{ marginTop: 5, height: 4, background: T.paper2, borderRadius: 2, overflow: "hidden" }}>
                                    <div style={{ height: "100%", width: `${Math.round((m.popularity / m.maxPop) * 100)}%`, background: idx === 0 ? T.gold : T.red, borderRadius: 2, transition: "width 0.6s ease" }} />
                                </div>
                                <div style={{ fontSize: 10, color: T.muted, marginTop: 3 }}>{m.releaseDate} · {m.votes.toLocaleString()} votes</div>
                            </div>
                            <div style={{ flexShrink: 0, fontSize: 13, fontWeight: 700, color: m.rating ? ratingColor(m.rating) : T.muted }}>{m.rating ? `★ ${m.rating}` : "TBA"}</div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}

/* ═══ SOUTH BLOCKBUSTERS ═══ */
function SouthBlockbusters() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lang, setLang] = useState("te");
    const LANGS = [{ key: "te", label: "Telugu" }, { key: "ta", label: "Tamil" }, { key: "ml", label: "Malayalam" }, { key: "kn", label: "Kannada" }];

    useEffect(() => {
        setLoading(true);
        setMovies([]);
        const url = lang === "te"
            ? "/api/tmdb/te-now-playing"
            : `/api/insights/trending_movies?lang=${lang}&year=${new Date().getFullYear()}`;

        fetch(url)
            .then(r => r.json())
            .then(d => {
                const raw = d.results || d.movies || [];
                const results = raw
                    .filter(m => m.title || m.original_title || m.Title)
                    .sort((a, b) => (b.vote_average || b.rating || 0) - (a.vote_average || a.rating || 0))
                    .slice(0, 6)
                    .map(m => ({
                        id: m.id || m.Title,
                        title: m.title || m.original_title || m.Title || "Unknown",
                        poster: m.poster_path
                            ? `https://image.tmdb.org/t/p/w342${m.poster_path}`
                            : (m.Poster || m.poster || null),
                        rating: m.vote_average
                            ? Number(m.vote_average).toFixed(1)
                            : (m.Rating ? String(m.Rating) : (m.rating ? String(m.rating) : "N/A")),
                        votes: m.vote_count || m.votes || 0,
                        year: m.release_date
                            ? m.release_date.slice(0, 4)
                            : (m.ReleaseDate ? m.ReleaseDate.slice(0, 4) : (m.year || "")),
                    }));
                setMovies(results);
            })
            .catch(() => setMovies([]))
            .finally(() => setLoading(false));
    }, [lang]);

    const ratingColor = (r) => { const n = parseFloat(r); if (n >= 7) return "#16A34A"; if (n >= 5) return "#CA8A04"; return T.red; };

    return (
        <Card>
            <CardHead title="SOUTH BLOCKBUSTERS" right="Top rated" />
            <div style={{ display: "flex", borderBottom: `1px solid ${T.border}` }}>
                {LANGS.map(l => (
                    <button key={l.key} onClick={() => setLang(l.key)}
                        style={{ flex: 1, padding: "9px 0", fontSize: 11, fontWeight: 600, border: "none", borderBottom: lang === l.key ? `2px solid ${T.red}` : "2px solid transparent", background: "transparent", color: lang === l.key ? T.red : T.muted, cursor: "pointer", transition: "all 0.15s" }}>
                        {l.label}
                    </button>
                ))}
            </div>
            <div style={{ padding: 14 }}>
                {loading ? (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i}>
                                <div style={{ height: 140, borderRadius: 8, animation: "cineqShimmer 1.5s infinite", background: `linear-gradient(90deg, ${T.paper2} 25%, ${T.border} 50%, ${T.paper2} 75%)`, backgroundSize: "200% 100%", marginBottom: 6 }} />
                                <div style={{ height: 10, borderRadius: 4, background: T.border, width: "80%" }} />
                            </div>
                        ))}
                    </div>
                ) : movies.length === 0 ? (
                    <div style={{ padding: 32, textAlign: "center", color: T.muted, fontSize: 13, fontStyle: "italic" }}>No trending data available</div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                        {movies.map(m => (
                            <div key={m.id} style={{ cursor: "pointer" }}>
                                <div style={{ position: "relative", marginBottom: 6 }}>
                                    <img src={m.poster || "https://placehold.co/120x180?text=?"} alt={m.title}
                                        style={{ width: "100%", aspectRatio: "2/3", borderRadius: 8, objectFit: "cover", display: "block", transition: "transform 0.2s" }}
                                        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                                        onMouseLeave={e => e.currentTarget.style.transform = "none"} />
                                    <span style={{ position: "absolute", top: 5, right: 5, fontSize: 10, fontWeight: 700, background: "rgba(0,0,0,0.75)", color: ratingColor(m.rating), padding: "2px 6px", borderRadius: 4 }}>★ {m.rating}</span>
                                </div>
                                <div style={{ fontSize: 11, fontWeight: 600, color: T.ink, lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{m.title}</div>
                                <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{m.year} · {m.votes.toLocaleString()} votes</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
}


/* ═══ SOUTH LATEST POSTERS (replaces PosterPathshala) ═══ */
function SouthLatestPosters() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lang, setLang] = useState("te");
    const scrollRef = React.useRef(null);
    const scroll = (dir) => { if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 320, behavior: "smooth" }); };

    const LANGS = [
        { key: "te", label: "Telugu" },
        { key: "ta", label: "Tamil" },
        { key: "ml", label: "Malayalam" },
        { key: "kn", label: "Kannada" },
        { key: "hi", label: "Hindi" },
    ];

    useEffect(() => {
        setLoading(true);
        setMovies([]);
        // For Telugu use our existing route; for others use trending_movies API
        const url = lang === "te"
            ? "/api/tmdb/te-now-playing"
            : `/api/insights/trending_movies?lang=${lang}&year=${new Date().getFullYear()}`;

        fetch(url)
            .then(r => r.json())
            .then(d => {
                const raw = d.results || d.movies || [];
                const results = raw
                    .sort((a, b) => (b.popularity || b.Popularity || 0) - (a.popularity || a.Popularity || 0))
                    .slice(0, 20)
                    .map(m => ({
                        id: m.id || m.Title,
                        title: m.title || m.original_title || m.Title || "Unknown",
                        poster: m.poster_path
                            ? `https://image.tmdb.org/t/p/w342${m.poster_path}`
                            : (m.Poster || m.poster || null),
                        year: m.release_date
                            ? m.release_date.slice(0, 4)
                            : (m.ReleaseDate ? m.ReleaseDate.slice(0, 4) : ""),
                        rating: m.vote_average
                            ? Number(m.vote_average).toFixed(1)
                            : (m.Rating ? String(m.Rating) : null),
                    }))
                    .filter(m => m.poster);
                setMovies(results);
            })
            .catch(() => setMovies([]))
            .finally(() => setLoading(false));
    }, [lang]);

    return (
        <Card>
            {/* Header with lang tabs */}
            <div style={{ padding: "13px 16px 0", borderBottom: `1px solid ${T.border}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 15, letterSpacing: "0.12em", color: T.ink }}>LATEST SOUTH RELEASES</span>
                    <div style={{ display: "flex", gap: 6 }}>
                        <CarouselArrowBtn dir="left" onClick={() => scroll(-1)} />
                        <CarouselArrowBtn dir="right" onClick={() => scroll(1)} />
                    </div>
                </div>
                <div style={{ display: "flex", gap: 0 }}>
                    {LANGS.map(l => (
                        <button key={l.key} onClick={() => setLang(l.key)}
                            style={{ flex: 1, padding: "8px 0", fontSize: 11, fontWeight: 600, border: "none", borderBottom: lang === l.key ? `2px solid ${T.red}` : "2px solid transparent", background: "transparent", color: lang === l.key ? T.red : T.muted, cursor: "pointer", transition: "all 0.15s" }}>
                            {l.label}
                        </button>
                    ))}
                </div>
            </div>
            {/* Poster scroll */}
            <div style={{ padding: "14px 16px" }}>
                {loading ? (
                    <div style={{ display: "flex", gap: 10 }}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} style={{ flexShrink: 0, width: 90, height: 135, borderRadius: 8, animation: "cineqShimmer 1.5s infinite", background: `linear-gradient(90deg, ${T.paper2} 25%, ${T.border} 50%, ${T.paper2} 75%)`, backgroundSize: "200% 100%" }} />
                        ))}
                    </div>
                ) : movies.length === 0 ? (
                    <div style={{ padding: 24, textAlign: "center", color: T.muted, fontSize: 13, fontStyle: "italic" }}>No posters available.</div>
                ) : (
                    <div ref={scrollRef} style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6, scrollBehavior: "smooth" }} className="cineq-hide-scroll">
                        {movies.map(m => (
                            <div key={m.id} style={{ flexShrink: 0, width: 100, cursor: "pointer" }}>
                                <div style={{ position: "relative", marginBottom: 6 }}>
                                    <img src={m.poster} alt={m.title}
                                        style={{ width: 100, height: 150, borderRadius: 8, objectFit: "cover", display: "block", transition: "transform 0.2s" }}
                                        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
                                        onMouseLeave={e => e.currentTarget.style.transform = "none"} />
                                    {m.rating && (
                                        <span style={{ position: "absolute", bottom: 5, right: 5, fontSize: 10, fontWeight: 700, background: "rgba(0,0,0,0.75)", color: parseFloat(m.rating) >= 7 ? "#4ADE80" : parseFloat(m.rating) >= 5 ? "#FCD34D" : "#F87171", padding: "2px 5px", borderRadius: 4 }}>
                                            ★ {m.rating}
                                        </span>
                                    )}
                                </div>
                                <div style={{ fontSize: 11, fontWeight: 600, color: T.ink, lineHeight: 1.25, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{m.title}</div>
                                {m.year && <div style={{ fontSize: 10, color: T.muted, marginTop: 1 }}>{m.year}</div>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
}

function BhavaniGossips() {
    const [items, setItems] = useState([]);
    useEffect(() => { fetch("/api/bhavani").then(r => r.json()).then(d => setItems(d.items || [])).catch(() => { }); }, []);
    return (
        <Card>
            <CardHead title="IS IT TRUE BHAVANI??" right="Gossip Feed" />
            <div style={{ maxHeight: 480, overflowY: "auto" }} className="cineq-custom-scroll">
                {items.length === 0 ? <div style={{ padding: 24, textAlign: "center", color: T.muted, fontSize: 13, fontStyle: "italic" }}>Loading…</div> :
                    items.map((text, idx) => (
                        <div key={idx} style={{ padding: "10px 16px", borderBottom: idx < items.length - 1 ? `1px solid ${T.border}` : "none", display: "flex", gap: 8, alignItems: "flex-start", transition: "background 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.background = "#FFFBEB"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            <span style={{ color: T.gold, fontSize: 13, flexShrink: 0 }}>🧨</span>
                            <p style={{ fontSize: 12, color: T.ink, lineHeight: 1.5, margin: 0 }}>{text}</p>
                        </div>
                    ))
                }
            </div>
        </Card>
    );
}

/* ─── Re-Releases ─── */
function ReReleasesBlock() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lang, setLang] = useState("all");
    useEffect(() => { fetch("/api/rereleases").then(r => r.json()).then(d => { setItems(d.data || []); setLoading(false); }).catch(() => setLoading(false)); }, []);
    const LANGS = [{ key: "all", label: "All" }, { key: "telugu", label: "Telugu" }, { key: "tamil", label: "Tamil" }, { key: "hindi", label: "Hindi" }, { key: "malayalam", label: "Mal." }, { key: "kannada", label: "Kan." }];
    const filtered = lang === "all" ? items : items.filter(m => m.language?.toLowerCase().split("|").map(l => l.trim()).includes(lang));
    return (
        <div>
            <SectionHead title="RE-RELEASED" sub="Back in cinemas" />
            <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto" }} className="cineq-hide-scroll">
                {LANGS.map(l => (
                    <button key={l.key} onClick={() => setLang(l.key)}
                        style={{ padding: "4px 11px", borderRadius: 100, fontSize: 11, fontWeight: 600, border: `1.5px solid ${lang === l.key ? T.ink : T.border}`, background: lang === l.key ? T.ink : T.white, color: lang === l.key ? T.white : T.muted, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" }}>
                        {l.label}
                    </button>
                ))}
            </div>
            <div style={{ background: T.white, borderRadius: 12, border: `1px solid ${T.border}`, padding: 14 }}>
                {loading ? <p style={{ color: T.muted, fontSize: 13, fontStyle: "italic" }}>Loading…</p> :
                    !filtered.length ? <p style={{ color: T.muted, fontSize: 13, fontStyle: "italic" }}>None found.</p> :
                        <div style={{ display: "flex", gap: 12, overflowX: "auto" }} className="cineq-hide-scroll">
                            {filtered.map(m => (
                                <div key={m.id} style={{ flexShrink: 0, width: 110 }}>
                                    <img src={m.poster || "https://placehold.co/110x165?text=?"} alt={m.title}
                                        style={{ width: 110, height: 165, borderRadius: 9, objectFit: "cover", display: "block", marginBottom: 6, transition: "transform 0.2s" }}
                                        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={e => e.currentTarget.style.transform = "none"} />
                                    <div style={{ fontSize: 11, fontWeight: 600, color: T.ink, lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{m.title}</div>
                                    {m.originalYear && <div style={{ fontSize: 10, color: T.muted, marginTop: 1 }}>{m.originalYear}</div>}
                                </div>
                            ))}
                        </div>
                }
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════ */
export default function Home({ heroBlocks = [], telugu = [], heroMovies = [] }) {
    const safeTelugu = Array.isArray(telugu) ? telugu : [];

    return (
        <>
            <Head>
                <title>CINEQ — Telugu Cinema Intelligence</title>
                <meta name="description" content="CINEQ — Sharp, data-driven Telugu cinema. Trending films, trailers, OTT releases." />
            </Head>

            <Header />
            <LiveTicker />

            <main style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 64px", background: T.paper }}>

                {/* Hero */}
                <HeroSection heroMovies={heroMovies} />

                <BirthdayBar />
                <AdScroller />
                <RadarRow items={safeTelugu} />
                <OTTRadarRow />

                {/* 3-col: Trending | Trailer Drop | Buzz */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 280px", gap: 18, margin: "28px 0" }}>
                    <TrendingTeluguBlock />
                    <TrailerDropBlock />
                    <CINEQBuzzCard />
                </div>

                {/* 2-col: YouTube + Bhavani */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 28 }}>
                    <Card><CardHead title="YOUTUBE TRENDING" right="India" /><div style={{ padding: 4 }}><YoutubeFlash /></div></Card>
                    <BhavaniGossips />
                </div>

                {/* Box Office Pulse + South Blockbusters */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 28 }}>
                    <BoxOfficePulse />
                    <SouthBlockbusters />
                </div>

                {/* CINEQ Specials */}
                <SectionHead title="CINEQ SPECIALS" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                    <Card><CardHead title="BIGG BOSS WINNERS" /><div style={{ padding: 16 }}><BiggBossWinners /></div></Card>
                    <SouthLatestPosters />
                </div>

            </main>

            <Footer />

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
                body { background: #FAF8F4; }
                @keyframes cineqTicker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
                @keyframes cineqMarquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
                @keyframes cineqPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.3)} }
                @keyframes cineqShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
                .cineq-hide-scroll::-webkit-scrollbar{display:none}
                .cineq-hide-scroll{-ms-overflow-style:none;scrollbar-width:none}
                .cineq-custom-scroll::-webkit-scrollbar{width:4px}
                .cineq-custom-scroll::-webkit-scrollbar-track{background:transparent}
                .cineq-custom-scroll::-webkit-scrollbar-thumb{background:#E2DDD5;border-radius:99px}
                @media(max-width:1024px){
                    main>div[style*="grid-template-columns: 1fr 1fr 280px"]{display:flex!important;flex-direction:column!important}
                    main>div[style*="grid-template-columns: 1fr 260px"]{display:flex!important;flex-direction:column!important}
                    main>div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important}
                    main>div[style*="grid-template-columns: 2fr 1fr"]{grid-template-columns:1fr!important}
                }
            `}</style>
        </>
    );
}
