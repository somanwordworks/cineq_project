import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
    BarChart, Bar, Tooltip, XAxis, YAxis,
    ResponsiveContainer, CartesianGrid, Cell,
    LineChart, Line, PieChart, Pie, Legend,
} from "recharts";

/* ─── Design tokens ─── */
const T = {
    ink: "#0F0F0F", paper: "#FAF8F4", paper2: "#F2EFE8",
    border: "#E2DDD5", muted: "#8A8680",
    red: "#C62828", gold: "#E6B852", white: "#FFFFFF",
};

/* ─── Language config ─── */
const LANGS = [
    { key: "te", label: "Telugu",    color: "#C62828" },
    { key: "ta", label: "Tamil",     color: "#1D4ED8" },
    { key: "ml", label: "Malayalam", color: "#166534" },
    { key: "kn", label: "Kannada",   color: "#7C3AED" },
    { key: "hi", label: "Hindi",     color: "#92400E" },
];

const PLATFORMS = [
    { key: "all",       label: "All",       color: "#374151" },
    { key: "netflix",   label: "Netflix",   color: "#E50914" },
    { key: "prime",     label: "Prime",     color: "#00A8E0" },
    { key: "hotstar",   label: "Hotstar",   color: "#1F3C88" },
    { key: "aha",       label: "Aha",       color: "#F5830A" },
    { key: "zee5",      label: "ZEE5",      color: "#6B21A8" },
    { key: "jiocinema", label: "JioCinema", color: "#7C3AED" },
];

const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

/* ─── Helpers ─── */
function SectionHead({ title, sub }) {
    return (
        <div style={{ marginBottom: 20, paddingBottom: 14, borderBottom: `2px solid ${T.gold}` }}>
            <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 26, letterSpacing: "0.12em", color: T.ink }}>{title}</div>
            {sub && <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>{sub}</div>}
        </div>
    );
}

function Card({ children, style = {} }) {
    return <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", ...style }}>{children}</div>;
}

function Shimmer({ h = 200 }) {
    return <div style={{ height: h, borderRadius: 12, animation: "cineqShimmer 1.5s infinite", background: `linear-gradient(90deg, ${T.paper2} 25%, ${T.border} 50%, ${T.paper2} 75%)`, backgroundSize: "200% 100%" }} />;
}

function KpiCard({ label, value, accent }) {
    return (
        <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px 20px", borderTop: `3px solid ${accent || T.red}` }}>
            <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{label}</div>
            <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 28, color: accent || T.red, letterSpacing: "0.05em", lineHeight: 1 }}>{value || "—"}</div>
        </div>
    );
}

/* ─── Pill filters ─── */
function PillGroup({ items, active, onSelect, small = false }) {
    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {items.map(item => (
                <button key={item.key} onClick={() => onSelect(item.key)}
                    style={{ padding: small ? "5px 12px" : "7px 16px", borderRadius: 100, fontSize: small ? 11 : 12, fontWeight: 600, border: `1.5px solid ${active === item.key ? (item.color || T.red) : T.border}`, background: active === item.key ? (item.color || T.red) : T.white, color: active === item.key ? T.white : T.muted, cursor: "pointer", transition: "all 0.15s", letterSpacing: "0.03em" }}>
                    {item.label}
                </button>
            ))}
        </div>
    );
}

function YearSelect({ value, onChange }) {
    return (
        <select value={value} onChange={e => onChange(e.target.value)}
            style={{ padding: "7px 14px", borderRadius: 8, border: `1.5px solid ${T.border}`, background: T.white, color: T.ink, fontSize: 13, fontWeight: 600, cursor: "pointer", outline: "none" }}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
    );
}

/* ─── Movie poster grid ─── */
function PosterGrid({ movies, emptyMsg = "No data available" }) {
    if (!movies?.length) return (
        <div style={{ padding: 32, textAlign: "center", color: T.muted, fontSize: 13, fontStyle: "italic" }}>{emptyMsg}</div>
    );
    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 14 }}>
            {movies.map((m, i) => (
                <div key={i} style={{ cursor: "pointer" }}>
                    <div style={{ position: "relative", marginBottom: 8 }}>
                        <img src={m.Poster || m.poster || "https://placehold.co/130x195?text=?"} alt={m.Title || m.title}
                            style={{ width: "100%", aspectRatio: "2/3", borderRadius: 10, objectFit: "cover", display: "block", transition: "transform 0.2s" }}
                            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "none"} />
                        <div style={{ position: "absolute", top: 7, left: 7, background: "rgba(0,0,0,0.75)", color: T.gold, fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 14, padding: "1px 7px", borderRadius: 3 }}>
                            #{i + 1}
                        </div>
                        {(m.Rating || m.vote_average) && (
                            <span style={{ position: "absolute", bottom: 6, right: 6, fontSize: 10, fontWeight: 700, background: "rgba(0,0,0,0.8)", color: parseFloat(m.Rating || m.vote_average) >= 7 ? "#4ADE80" : parseFloat(m.Rating || m.vote_average) >= 5 ? T.gold : "#F87171", padding: "2px 6px", borderRadius: 4 }}>
                                ★ {parseFloat(m.Rating || m.vote_average).toFixed(1)}
                            </span>
                        )}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: T.ink, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{m.Title || m.title}</div>
                    {(m.Popularity || m.popularity) && (
                        <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>Pop: {m.Popularity || Math.round(m.popularity)}</div>
                    )}
                </div>
            ))}
        </div>
    );
}

/* ─── OTT Platform bar chart ─── */
function PlatformBarChart({ data }) {
    if (!data?.length) return null;
    const COLORS = ["#E50914", "#00A8E0", "#1F3C88", "#F5830A", "#6B21A8", "#7C3AED", "#374151"];
    return (
        <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis dataKey="Platform" tick={{ fontSize: 11, fill: T.muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: T.muted }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: T.ink, border: "none", borderRadius: 8, color: T.white, fontSize: 12 }} />
                <Bar dataKey="Titles" barSize={28} radius={[4, 4, 0, 0]}>
                    {data.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

/* ─── Popularity line chart ─── */
function PopularityLineChart({ movies }) {
    if (!movies?.length) return null;
    const data = movies.map(m => ({ name: (m.Title || m.title || "").split(" ")[0], pop: m.Popularity || Math.round(m.popularity || 0) }));
    return (
        <ResponsiveContainer width="100%" height={180}>
            <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: T.muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: T.muted }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: T.ink, border: "none", borderRadius: 8, color: T.white, fontSize: 12 }} />
                <Line type="monotone" dataKey="pop" stroke={T.red} strokeWidth={2} dot={{ fill: T.gold, r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
        </ResponsiveContainer>
    );
}

/* ═══════════════════════════════════════════════════
   OTT SECTION
═══════════════════════════════════════════════════ */
function OTTSection() {
    const [lang, setLang] = useState("te");
    const [year, setYear] = useState(new Date().getFullYear());
    const [platform, setPlatform] = useState("all");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/insights/ott_top_watched?lang=${lang}&year=${year}&ott=${platform}`)
            .then(r => r.json())
            .then(d => setData(d))
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, [lang, year, platform]);

    const metrics = data?.metrics || {};
    const movies = data?.movies || [];
    const platforms = data?.platforms || [];

    return (
        <section style={{ marginBottom: 56 }}>
            <SectionHead title="OTT INSIGHTS" sub="Most popular movies streaming now across South Indian platforms" />

            {/* Controls */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", marginBottom: 20 }}>
                <PillGroup items={LANGS} active={lang} onSelect={setLang} />
                <div style={{ width: 1, height: 28, background: T.border }} />
                <YearSelect value={year} onChange={setYear} />
            </div>

            <div style={{ marginBottom: 16 }}>
                <PillGroup items={PLATFORMS} active={platform} onSelect={setPlatform} small />
            </div>

            {loading ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                    {[1,2,3,4].map(i => <Shimmer key={i} h={80} />)}
                </div>
            ) : (
                <>
                    {/* KPIs */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                        <KpiCard label="Movies Tracked" value={metrics.totalMovies || movies.length} accent={T.red} />
                        <KpiCard label="Top Movie" value={metrics.topMovie} accent={T.gold} />
                        <KpiCard label="Peak Popularity" value={metrics.topScore || metrics.topPopularity} accent="#8B1A1A" />
                        <KpiCard label="Top Platform" value={metrics.topPlatform} accent="#1D4ED8" />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                        {/* Platform chart */}
                        {platforms.length > 0 && (
                            <Card>
                                <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.border}` }}>
                                    <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 15, letterSpacing: "0.1em", color: T.ink }}>PLATFORM BREAKDOWN</span>
                                </div>
                                <div style={{ padding: "12px 16px" }}>
                                    <PlatformBarChart data={platforms} />
                                </div>
                            </Card>
                        )}

                        {/* Popularity trend */}
                        {movies.length > 0 && (
                            <Card>
                                <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.border}` }}>
                                    <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 15, letterSpacing: "0.1em", color: T.ink }}>POPULARITY TREND</span>
                                </div>
                                <div style={{ padding: "12px 16px" }}>
                                    <PopularityLineChart movies={movies} />
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Movie grid */}
                    <Card>
                        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 15, letterSpacing: "0.1em", color: T.ink }}>TOP WATCHED ON OTT</span>
                            <span style={{ fontSize: 11, color: T.muted }}>{LANGS.find(l => l.key === lang)?.label} · {year}</span>
                        </div>
                        <div style={{ padding: 16 }}>
                            <PosterGrid movies={movies} emptyMsg="No OTT data for this selection. Try a different language or year." />
                        </div>
                    </Card>
                </>
            )}
        </section>
    );
}

/* ═══════════════════════════════════════════════════
   THEATRE SECTION
═══════════════════════════════════════════════════ */
function TheatreSection() {
    const [lang, setLang] = useState("te");
    const [year, setYear] = useState(new Date().getFullYear());
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/insights/trending_movies?lang=${lang}&year=${year}`)
            .then(r => r.json())
            .then(d => setData(d))
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, [lang, year]);

    const metrics = data?.metrics || {};
    const movies = data?.movies || [];

    return (
        <section style={{ marginBottom: 56 }}>
            <SectionHead title="THEATRE INSIGHTS" sub="Buzz, hype and trending theatrical releases by language" />

            {/* Controls */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", marginBottom: 20 }}>
                <PillGroup items={LANGS} active={lang} onSelect={setLang} />
                <div style={{ width: 1, height: 28, background: T.border }} />
                <YearSelect value={year} onChange={setYear} />
            </div>

            {loading ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                    {[1,2,3,4].map(i => <Shimmer key={i} h={80} />)}
                </div>
            ) : (
                <>
                    {/* KPIs */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                        <KpiCard label="Movies Tracked" value={metrics.totalMovies || movies.length} accent={T.red} />
                        <KpiCard label="Top Movie" value={metrics.topMovie} accent={T.gold} />
                        <KpiCard label="Peak Popularity" value={metrics.topPopularity} accent="#8B1A1A" />
                        <KpiCard label="Language" value={LANGS.find(l => l.key === lang)?.label} accent={LANGS.find(l => l.key === lang)?.color} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 24 }}>
                        {/* Movie grid */}
                        <Card>
                            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 15, letterSpacing: "0.1em", color: T.ink }}>TRENDING IN THEATRES</span>
                                <span style={{ fontSize: 11, color: T.muted }}>{LANGS.find(l => l.key === lang)?.label} · {year}</span>
                            </div>
                            <div style={{ padding: 16 }}>
                                <PosterGrid movies={movies} emptyMsg="No theatre data for this selection." />
                            </div>
                        </Card>

                        {/* Popularity chart */}
                        <Card>
                            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.border}` }}>
                                <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 15, letterSpacing: "0.1em", color: T.ink }}>POPULARITY CURVE</span>
                            </div>
                            <div style={{ padding: "12px 8px" }}>
                                <PopularityLineChart movies={movies} />
                            </div>

                            {/* Top 5 list */}
                            <div style={{ padding: "0 16px 16px" }}>
                                {movies.slice(0, 5).map((m, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 4 ? `1px solid ${T.border}` : "none" }}>
                                        <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 20, color: i === 0 ? T.gold : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : T.border, width: 24, flexShrink: 0 }}>{i + 1}</span>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 12, fontWeight: 600, color: T.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.Title || m.title}</div>
                                            <div style={{ fontSize: 10, color: T.muted }}>Pop: {m.Popularity || Math.round(m.popularity || 0)}</div>
                                        </div>
                                        {(m.Rating || m.vote_average) && (
                                            <span style={{ fontSize: 11, fontWeight: 700, color: T.red, flexShrink: 0 }}>★ {parseFloat(m.Rating || m.vote_average).toFixed(1)}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </>
            )}
        </section>
    );
}

/* ═══════════════════════════════════════════════════
   CROSS-LANGUAGE COMPARISON
═══════════════════════════════════════════════════ */
function CrossLangSection() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [allData, setAllData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const langs = ["te", "ta", "ml", "hi"];
        Promise.all(
            langs.map(l =>
                fetch(`/api/insights/trending_movies?lang=${l}&year=${year}`)
                    .then(r => r.json())
                    .then(d => ({ lang: l, movies: d.movies || [], metrics: d.metrics || {} }))
                    .catch(() => ({ lang: l, movies: [], metrics: {} }))
            )
        ).then(results => {
            const obj = {};
            results.forEach(r => { obj[r.lang] = r; });
            setAllData(obj);
            setLoading(false);
        });
    }, [year]);

    const chartData = LANGS.filter(l => l.key !== "kn").map(l => ({
        lang: l.label,
        movies: allData[l.key]?.movies?.length || 0,
        topPop: allData[l.key]?.movies?.[0]?.Popularity || 0,
        color: l.color,
    }));

    return (
        <section style={{ marginBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 14, borderBottom: `2px solid ${T.gold}` }}>
                <div>
                    <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 26, letterSpacing: "0.12em", color: T.ink }}>SOUTH VS HINDI — HEAD TO HEAD</div>
                    <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>Popularity comparison across languages for {year}</div>
                </div>
                <YearSelect value={year} onChange={setYear} />
            </div>

            {loading ? (
                <Shimmer h={240} />
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <Card>
                        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.border}` }}>
                            <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 15, letterSpacing: "0.1em", color: T.ink }}>TOP POPULARITY BY LANGUAGE</span>
                        </div>
                        <div style={{ padding: "12px 16px" }}>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                                    <XAxis dataKey="lang" tick={{ fontSize: 11, fill: T.muted }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: T.muted }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ background: T.ink, border: "none", borderRadius: 8, color: T.white, fontSize: 12 }} />
                                    <Bar dataKey="topPop" barSize={32} radius={[4, 4, 0, 0]} label={{ position: "top", fontSize: 10, fill: T.muted }}>
                                        {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card>
                        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.border}` }}>
                            <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 15, letterSpacing: "0.1em", color: T.ink }}>#1 MOVIE PER LANGUAGE</span>
                        </div>
                        <div style={{ padding: "0 16px" }}>
                            {LANGS.filter(l => l.key !== "kn").map(l => {
                                const top = allData[l.key]?.movies?.[0];
                                return (
                                    <div key={l.key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${T.border}` }}>
                                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: l.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <span style={{ fontSize: 10, fontWeight: 800, color: "white", letterSpacing: "0.05em" }}>{l.label.slice(0, 2).toUpperCase()}</span>
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 12, fontWeight: 600, color: T.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{top?.Title || top?.title || "No data"}</div>
                                            <div style={{ fontSize: 10, color: T.muted }}>
                                                {top ? `Pop: ${top.Popularity || Math.round(top.popularity || 0)} · ${top.ReleaseDate || top.release_date || ""}` : ""}
                                            </div>
                                        </div>
                                        {top?.Poster && (
                                            <img src={top.Poster} alt="" style={{ width: 32, height: 48, borderRadius: 4, objectFit: "cover", flexShrink: 0 }} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>
            )}
        </section>
    );
}

/* ─── How to read ─── */
function HowToRead() {
    const [open, setOpen] = useState(false);
    return (
        <Card style={{ marginTop: 32 }}>
            <button onClick={() => setOpen(!open)}
                style={{ width: "100%", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer" }}>
                <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 16, letterSpacing: "0.1em", color: T.ink }}>HOW TO READ THIS DASHBOARD</span>
                <span style={{ fontSize: 18, color: T.muted, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
            </button>
            {open && (
                <div style={{ padding: "0 20px 20px", borderTop: `1px solid ${T.border}` }}>
                    {[
                        ["OTT Insights", "Shows movies popular on streaming platforms. Filter by South Indian language (Telugu, Tamil, Malayalam, Kannada) or Hindi, year, and platform. Data from TMDB watch providers (India region)."],
                        ["Theatre Insights", "Trending theatrical releases sorted by TMDB popularity score — a composite of searches, views and discussions. Includes upcoming announced films."],
                        ["South vs Hindi", "Side-by-side comparison of the #1 most popular film per language for the selected year. Useful to see which industry is generating the most buzz."],
                        ["Data Source", "All data from TMDB (The Movie Database) API, updated regularly. Popularity reflects audience engagement, not verified box-office figures."],
                    ].map(([h, p]) => (
                        <div key={h} style={{ marginTop: 16 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: T.red, marginBottom: 4 }}>{h}</div>
                            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>{p}</div>
                        </div>
                    ))}
                    <div style={{ marginTop: 16, padding: "10px 14px", background: T.paper2, borderRadius: 8, fontSize: 11, color: T.muted, lineHeight: 1.5 }}>
                        ⚠️ Disclaimer: This dashboard reflects global TMDB audience engagement. It does not represent verified box-office collections or official OTT viewership numbers.
                    </div>
                </div>
            )}
        </Card>
    );
}

/* ═══════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════ */
export default function InsightsPage() {
    return (
        <>
            <Head>
                <title>OTT & Theatre Insights — CINEQ</title>
                <meta name="description" content="South Indian cinema OTT and theatre insights dashboard." />
            </Head>

            <Header />

            <main style={{ background: T.paper, minHeight: "100vh" }}>

                {/* Page header */}
                <div style={{ background: T.ink, borderBottom: "1px solid #1A1A1A" }}>
                    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 32px" }}>
                        <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 36, letterSpacing: "0.12em", color: T.white, lineHeight: 1 }}>
                            CINEQ INSIGHTS DASHBOARD
                        </div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 6, letterSpacing: "0.05em" }}>
                            OTT popularity · Theatre trends · South vs Hindi · Live from TMDB
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 32px 64px" }}>
                    <OTTSection />
                    <TheatreSection />
                    <CrossLangSection />
                    <HowToRead />
                </div>

            </main>

            <Footer />

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
                body { background: #FAF8F4; }
                @keyframes cineqShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
                @media(max-width: 768px) {
                    div[style*="grid-template-columns: repeat(4"] { grid-template-columns: 1fr 1fr !important; }
                    div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
                    div[style*="grid-template-columns: 2fr 1fr"] { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </>
    );
}
