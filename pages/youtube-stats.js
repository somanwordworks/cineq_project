import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

/* ─── Design tokens ─── */
const T = {
    ink:    "#0F0F0F",
    paper:  "#FAF8F4",
    paper2: "#F2EFE8",
    border: "#E2DDD5",
    muted:  "#8A8680",
    red:    "#C62828",
    gold:   "#E6B852",
    white:  "#FFFFFF",
};

/* ─── Helpers ─── */
function fmtNum(n) {
    if (typeof n !== "number") return String(n || "");
    if (n >= 1e7) return (n / 1e7).toFixed(1) + "Cr";
    if (n >= 1e5) return (n / 1e5).toFixed(1) + "L";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return String(n);
}

function timeAgo(h) {
    if (typeof h !== "number" || isNaN(h)) return "—";
    if (h < 1) return `${Math.round(h * 60)}m ago`;
    if (h < 24) return `${Math.round(h)}h ago`;
    return `${Math.round(h / 24)}d ago`;
}

function contentType(title = "") {
    const t = title.toLowerCase();
    if (t.includes("song") || t.includes("lyrical") || t.includes("single") || t.includes("theme") || t.includes("audio"))
        return { label: "SONG", bg: "#166534", color: "#fff" };
    if (t.includes("trailer"))
        return { label: "TRAILER", bg: "#1D4ED8", color: "#fff" };
    if (t.includes("teaser") || t.includes("glimpse") || t.includes("first look"))
        return { label: "TEASER", bg: "#7C3AED", color: "#fff" };
    if (t.includes("promo") || t.includes("scene"))
        return { label: "PROMO", bg: "#92400E", color: "#fff" };
    return { label: "VIDEO", bg: "#374151", color: "#fff" };
}

/* ─── Language tabs config ─── */
const LANGS = [
    { key: "telugu",    label: "Telugu",    flag: "🎬" },
    { key: "tamil",     label: "Tamil",     flag: "🎭" },
    { key: "hindi",     label: "Hindi",     flag: "🎪" },
    { key: "all",       label: "All India", flag: "🇮🇳" },
];

/* ─── Badge ─── */
function TypeBadge({ title }) {
    const ct = contentType(title);
    return (
        <span style={{ background: ct.bg, color: ct.color, fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3, letterSpacing: "0.05em", flexShrink: 0 }}>
            {ct.label}
        </span>
    );
}

function NewBadge({ hours }) {
    if (hours > 8) return null;
    return (
        <span style={{ background: T.red, color: "white", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3, letterSpacing: "0.05em", flexShrink: 0, animation: "cineqPulse 2s infinite" }}>
            NEW
        </span>
    );
}

/* ─── Hero Card (top 1) ─── */
function HeroCard({ video }) {
    if (!video) return null;
    const ct = contentType(video.title);

    return (
        <div style={{ position: "relative", width: "100%", borderRadius: 14, overflow: "hidden", background: T.ink }}>
            <img src={video.thumbnail} alt={video.title}
                style={{ width: "100%", height: 320, objectFit: "cover", opacity: 0.75, display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ background: T.red, color: "white", fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 3, letterSpacing: "0.1em" }}>
                        #1 TRENDING
                    </span>
                    <TypeBadge title={video.title} />
                    <NewBadge hours={video.hoursSincePublished} />
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "white", lineHeight: 1.25, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {video.title}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{video.channelTitle}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 22, fontWeight: 800, color: T.gold }}>{fmtNum(video.viewCount)}</span>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>views</span>
                    </div>
                    <div style={{ background: "rgba(230,184,82,0.15)", border: `1px solid ${T.gold}`, color: T.gold, fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
                        {fmtNum(video.viewsPerHour)}/hr
                    </div>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{timeAgo(video.hoursSincePublished)}</span>
                </div>
            </div>
            <a href={video.url} target="_blank" rel="noreferrer"
                style={{ position: "absolute", top: 16, right: 16, background: T.red, color: "white", padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 700, textDecoration: "none", letterSpacing: "0.05em" }}>
                ▶ Watch
            </a>
        </div>
    );
}

/* ─── Top 3 podium ─── */
function TopThree({ list }) {
    if (list.length < 3) return null;

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 16 }}>
            {list.slice(1, 4).map((v, i) => (
                <a key={v.id} href={v.url} target="_blank" rel="noreferrer"
                    style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden", textDecoration: "none", display: "block", transition: "border-color 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = T.red}
                    onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>
                    <div style={{ position: "relative" }}>
                        <img src={v.thumbnail} alt={v.title} style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }} />
                        <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.75)", color: T.gold, fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 18, padding: "1px 8px", borderRadius: 4 }}>
                            #{i + 2}
                        </div>
                    </div>
                    <div style={{ padding: "10px 12px" }}>
                        <div style={{ display: "flex", gap: 5, marginBottom: 5 }}>
                            <TypeBadge title={v.title} />
                            <NewBadge hours={v.hoursSincePublished} />
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: T.ink, lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: 6 }}>
                            {v.title}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: T.red }}>{fmtNum(v.viewsPerHour)}/hr</span>
                            <span style={{ fontSize: 10, color: T.muted }}>{fmtNum(v.viewCount)} views</span>
                        </div>
                    </div>
                </a>
            ))}
        </div>
    );
}

/* ─── Fastest growing strip ─── */
function FastestGrowing({ list }) {
    const fastest = list
        .filter(v => v.hoursSincePublished <= 24)
        .sort((a, b) => b.viewsPerHour - a.viewsPerHour)
        .slice(0, 5);

    if (!fastest.length) return null;

    return (
        <div style={{ marginTop: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${T.border}` }}>
                <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 20, letterSpacing: "0.12em", color: T.ink }}>FASTEST GROWING TODAY</span>
                <span style={{ fontSize: 11, background: T.red, color: "white", padding: "2px 8px", borderRadius: 3, fontWeight: 700, letterSpacing: "0.05em" }}>LIVE</span>
            </div>
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 6 }} className="cineq-hide-scroll">
                {fastest.map((v, i) => (
                    <a key={v.id} href={v.url} target="_blank" rel="noreferrer"
                        style={{ flexShrink: 0, width: 180, background: T.white, border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden", textDecoration: "none", display: "block", transition: "border-color 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = T.red}
                        onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>
                        <div style={{ position: "relative" }}>
                            <img src={v.thumbnail} alt={v.title} style={{ width: "100%", height: 100, objectFit: "cover", display: "block" }} />
                            <div style={{ position: "absolute", top: 6, left: 6, background: T.red, color: "white", fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 3 }}>
                                ⚡ #{i + 1}
                            </div>
                        </div>
                        <div style={{ padding: "8px 10px" }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: T.ink, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: 5 }}>
                                {v.title}
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 800, color: T.red }}>{fmtNum(v.viewsPerHour)}/hr</div>
                            <div style={{ fontSize: 10, color: T.muted }}>{timeAgo(v.hoursSincePublished)}</div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

/* ─── Full trending list ─── */
function TrendingList({ list }) {
    return (
        <div style={{ marginTop: 32 }}>
            <div style={{ marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${T.border}` }}>
                <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 20, letterSpacing: "0.12em", color: T.ink }}>TRENDING WALL</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
                {list.map((v, idx) => (
                    <a key={v.id} href={v.url} target="_blank" rel="noreferrer"
                        style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden", textDecoration: "none", display: "block", transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = T.red; e.currentTarget.style.transform = "translateY(-2px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "none"; }}>
                        <div style={{ position: "relative" }}>
                            <img src={v.thumbnail} alt={v.title} style={{ width: "100%", height: 118, objectFit: "cover", display: "block" }} />
                            <div style={{ position: "absolute", top: 6, left: 6, background: "rgba(0,0,0,0.7)", color: T.gold, fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 15, padding: "1px 7px", borderRadius: 3 }}>
                                #{idx + 1}
                            </div>
                        </div>
                        <div style={{ padding: "9px 11px" }}>
                            <div style={{ display: "flex", gap: 4, marginBottom: 5, flexWrap: "wrap" }}>
                                <TypeBadge title={v.title} />
                                <NewBadge hours={v.hoursSincePublished} />
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: T.ink, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: 6 }}>
                                {v.title}
                            </div>
                            <div style={{ fontSize: 10, color: T.muted, marginBottom: 5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {v.channelTitle}
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: 12, fontWeight: 800, color: T.red }}>{fmtNum(v.viewsPerHour)}/hr</span>
                                <span style={{ fontSize: 10, color: T.muted }}>{fmtNum(v.viewCount)}</span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

/* ─── Skeleton loader ─── */
function Skeleton() {
    return (
        <div>
            <div style={{ height: 320, borderRadius: 14, background: `linear-gradient(90deg, ${T.paper2} 25%, ${T.border} 50%, ${T.paper2} 75%)`, backgroundSize: "200% 100%", animation: "cineqShimmer 1.5s infinite", marginBottom: 16 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[1,2,3].map(i => <div key={i} style={{ height: 160, borderRadius: 12, background: `linear-gradient(90deg, ${T.paper2} 25%, ${T.border} 50%, ${T.paper2} 75%)`, backgroundSize: "200% 100%", animation: "cineqShimmer 1.5s infinite" }} />)}
            </div>
        </div>
    );
}

/* ─── Main page ─── */
export default function YouTubeStats() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeLang, setActiveLang] = useState("telugu");

    async function fetchData(lang) {
        setLoading(true);
        setData(null);
        try {
            const url = lang === "all"
                ? "/api/youtube-trending"
                : `/api/youtube-trending?lang=${lang}`;
            const res = await fetch(url);
            const json = await res.json();
            setData(json);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData(activeLang);
        const id = setInterval(() => fetchData(activeLang), 10 * 60 * 1000);
        return () => clearInterval(id);
    }, [activeLang]);

    const list = data?.results || [];
    const hero = list[0] || null;

    return (
        <>
            <Head>
                <title>YouTube Trending — CINEQ</title>
                <meta name="description" content="Live YouTube trending for Telugu, Tamil, Hindi cinema." />
            </Head>

            <Header />

            <main style={{ background: T.paper, minHeight: "100vh" }}>

                {/* ── Page Header ── */}
                <div style={{ background: T.ink, borderBottom: `1px solid #1A1A1A` }}>
                    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 32px" }}>
                        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                            <div>
                                <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 36, letterSpacing: "0.12em", color: T.white, lineHeight: 1 }}>
                                    YOUTUBE TRENDING
                                </div>
                                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 6, letterSpacing: "0.05em" }}>
                                    Songs · Teasers · Trailers · Updated every 10 minutes
                                    {data?.fetchedAt && (
                                        <span style={{ marginLeft: 16, color: T.gold }}>
                                            Last updated: {new Date(data.fetchedAt).toLocaleTimeString("en-IN")}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Language tabs */}
                            <div style={{ display: "flex", gap: 6 }}>
                                {LANGS.map(l => (
                                    <button key={l.key} onClick={() => setActiveLang(l.key)}
                                        style={{ padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.15s", letterSpacing: "0.05em", background: activeLang === l.key ? T.red : "rgba(255,255,255,0.08)", color: activeLang === l.key ? "white" : "rgba(255,255,255,0.55)" }}
                                        onMouseEnter={e => { if (activeLang !== l.key) e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
                                        onMouseLeave={e => { if (activeLang !== l.key) e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}>
                                        {l.flag} {l.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Content ── */}
                <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 32px 64px" }}>

                    {loading ? (
                        <Skeleton />
                    ) : !hero ? (
                        <div style={{ padding: 64, textAlign: "center", color: T.muted, fontSize: 14 }}>
                            No trending data available right now. Try a different language tab.
                        </div>
                    ) : (
                        <>
                            {/* Hero + top 3 */}
                            <HeroCard video={hero} />
                            <TopThree list={list} />

                            {/* Stats strip */}
                            {list.length > 0 && (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 24 }}>
                                    {[
                                        { label: "Total Videos", value: list.length },
                                        { label: "Top Views/hr", value: fmtNum(list[0]?.viewsPerHour) },
                                        { label: "Fresh (< 6h)", value: list.filter(v => v.hoursSincePublished <= 6).length },
                                        { label: "Songs", value: list.filter(v => contentType(v.title).label === "SONG").length },
                                    ].map(s => (
                                        <div key={s.label} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 16px" }}>
                                            <div style={{ fontSize: 11, color: T.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{s.label}</div>
                                            <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 28, color: T.red, letterSpacing: "0.05em" }}>{s.value}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <FastestGrowing list={list} />
                            <TrendingList list={list.slice(0, 30)} />
                        </>
                    )}
                </div>
            </main>

            <Footer />

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
                @keyframes cineqPulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
                @keyframes cineqShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
                .cineq-hide-scroll::-webkit-scrollbar { display: none; }
                .cineq-hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </>
    );
}