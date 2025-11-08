// pages/insights.js

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
    BarChart,
    Bar,
    Tooltip,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Legend,
    CartesianGrid,
} from "recharts";

export default function InsightsPage() {
    const [langTab, setLangTab] = useState("en");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [ottMetrics, setOttMetrics] = useState({});
    const [ottPlatforms, setOttPlatforms] = useState([]);
    const [ottMovies, setOttMovies] = useState([]);
    const [trending, setTrending] = useState([]);
    const [trendingMetrics, setTrendingMetrics] = useState({});
    const [loading, setLoading] = useState(true);

    // 📡 Unified Data Fetch
    useEffect(() => {
        async function fetchAllData() {
            setLoading(true);
            try {
                const [ottData, trendingData] = await Promise.all([
                    fetch(`/api/insights/ott_top_watched?lang=${langTab}&year=${selectedYear}`).then((r) => r.json()),
                    fetch(`/api/insights/trending_movies?lang=${langTab}&year=${selectedYear}`).then((r) => r.json()),
                ]);

                setOttMetrics(ottData.metrics || {});
                setOttPlatforms(ottData.platforms || []);
                setOttMovies(ottData.movies || []);

                setTrending(trendingData.movies || []);
                setTrendingMetrics(trendingData.metrics || {});
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchAllData();
    }, [langTab, selectedYear]);

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i); // last 5 years

    return (
        <>
            <Header />
            <main className="max-w-7xl mx-auto px-4 py-10">
                {/* Title */}
                <h1 className="text-4xl font-bold text-center mb-6 text-[#C62828] flex items-center justify-center gap-3">
                    🎬 CINEQ Insights Dashboard
                </h1>

                {/* Unified Filters */}
                <div className="flex flex-col md:flex-row items-center justify-center mb-8 gap-3">
                    {/* Language Tabs */}
                    <div className="flex justify-center">
                        {[
                            { code: "en", label: "English" },
                            { code: "te", label: "Telugu" },
                            { code: "hi", label: "Hindi" },
                        ].map((l) => (
                            <button
                                key={l.code}
                                onClick={() => setLangTab(l.code)}
                                className={`px-6 py-2 mx-2 rounded-lg font-semibold transition ${langTab === l.code
                                        ? "bg-[#C62828] text-white shadow-md"
                                        : "bg-[#FFF8E1] text-[#C62828] border border-[#E6B852]"
                                    }`}
                            >
                                {l.label}
                            </button>
                        ))}
                    </div>

                    {/* Year Dropdown */}
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="border border-[#E6B852] bg-[#FFF8E1] text-[#C62828] rounded-lg px-4 py-2 font-semibold shadow-sm"
                    >
                        {years.map((yr) => (
                            <option key={yr} value={yr}>
                                {yr}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Loading */}
                {loading ? (
                    <p className="text-center text-gray-500 py-10">
                        Fetching insights for {selectedYear}...
                    </p>
                ) : (
                    <>
                        {/* 🔝 Top Watched OTT Movies */}
                        <SectionTitle title={`🔝 Top Watched OTT Movies (${langTab.toUpperCase()}, ${selectedYear})`} />
                        <KpiGrid metrics={ottMetrics} />
                        <PlatformChart data={ottPlatforms} />
                        <MovieGrid movies={ottMovies} label="Most Watched on OTT" />

                        {/* 🌍 Top 10 Trending Movies */}
                        <SectionTitle title={`🌍 Top 10 Trending Movies (${langTab.toUpperCase()}, ${selectedYear})`} />
                        <KpiGrid metrics={trendingMetrics} />
                        <MovieGrid movies={trending} label="Trending Movies" />

                        {/* 🧭 How to Read Section */}
                        <HowToReadCineqInsights />
                    </>
                )}
            </main>
            <Footer />
        </>
    );
}

/* -------------------------- COMPONENTS -------------------------- */

function SectionTitle({ title }) {
    return (
        <h2 className="text-2xl font-bold text-[#C62828] mb-4 text-center mt-10">
            {title}
        </h2>
    );
}

function KpiGrid({ metrics }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
            <KpiCard title="🎞️ Movies Tracked" value={metrics.totalMovies || 0} color="#C62828" />
            <KpiCard title="🏆 Top Movie" value={metrics.topMovie || "N/A"} color="#E6B852" />
            <KpiCard title="📈 Peak Popularity" value={metrics.topScore || metrics.topPopularity || "N/A"} color="#8B1A1A" />
            <KpiCard title="📺 Top Platform" value={metrics.topPlatform || "N/A"} color="#F9D65C" />
        </div>
    );
}

function KpiCard({ title, value, color }) {
    return (
        <div
            className="bg-[#FFF8E1] rounded-xl shadow p-4 text-center border-t-4"
            style={{ borderColor: color }}
        >
            <p className="text-gray-600 text-sm">{title}</p>
            <h2 className="text-2xl font-bold" style={{ color }}>
                {value}
            </h2>
        </div>
    );
}

function PlatformChart({ data }) {
    if (!data?.length) return null;

    return (
        <div className="bg-white rounded-2xl shadow p-6 border-t-4 border-[#C62828] mb-10">
            <h3 className="font-semibold text-[#C62828] mb-1 text-center">
                📊 Most Watched OTT Platforms
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Platform" angle={-25} textAnchor="end" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Titles" fill="#C62828" radius={[6, 6, 0, 0]} barSize={28} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

function MovieGrid({ movies, label }) {
    if (!movies?.length) return null;

    return (
        <div className="bg-white rounded-2xl shadow p-6 border-t-4 border-[#E6B852] mb-10">
            <h3 className="font-semibold text-[#C62828] mb-3 text-center">
                🎥 {label}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {movies.map((movie, idx) => (
                    <div
                        key={idx}
                        className="flex bg-[#FFF8E1] border border-[#E6B852]/50 rounded-xl p-3 items-center gap-3 shadow-sm"
                    >
                        {movie.Poster && (
                            <img src={movie.Poster} alt={movie.Title} className="w-16 h-20 rounded-lg object-cover" />
                        )}
                        <div>
                            <p className="font-semibold text-[#C62828]">{movie.Title}</p>
                            {movie.Providers && (
                                <p className="text-xs text-gray-600 mt-1">
                                    Platforms: {movie.Providers.join(", ")}
                                </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Popularity: {movie.Popularity}</p>
                            {movie.ReleaseDate && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Release: {movie.ReleaseDate}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* -------------------------- HOW TO READ SECTION -------------------------- */

function HowToReadCineqInsights() {
    return (
        <div className="mt-16 bg-[#FFF8E1] border border-[#E6B852] rounded-2xl p-6 shadow-sm text-gray-700">
            <h2 className="text-2xl font-bold text-[#C62828] mb-4 text-center">
                🧭 How to Read This Dashboard
            </h2>

            <p className="mb-4 text-center">
                This dashboard presents real-time insights into movie performance and audience behavior across
                English, Telugu, and Hindi content. Data is sourced live from TMDB (The Movie Database) APIs.
            </p>

            <h3 className="font-semibold text-[#C62828] mt-4">🎬 Top Watched OTT Movies</h3>
            <p className="text-sm">
                Shows currently streaming titles that are most popular across OTT platforms like Netflix,
                Prime Video, and Disney+ Hotstar. Key metrics include:
            </p>
            <ul className="list-disc ml-6 text-sm">
                <li><strong>🎞️ Movies Tracked:</strong> Number of top titles considered per language.</li>
                <li><strong>🏆 Top Movie:</strong> The highest-ranked movie currently watched on OTT.</li>
                <li><strong>📈 Peak Popularity:</strong> Popularity score reflecting audience engagement.</li>
                <li><strong>📺 Top Platform:</strong> The OTT platform with the most titles in this list.</li>
            </ul>

            <h3 className="font-semibold text-[#C62828] mt-4">🔥 Top 10 Trending Movies</h3>
            <p className="text-sm">
                Displays the most searched and talked-about movies of the selected year — based on TMDB’s
                popularity index (combining searches, votes, and discussions). These are audience favorites
                generating buzz, not necessarily streaming yet.
            </p>

            <h3 className="font-semibold text-[#C62828] mt-4">⚙️ Filters</h3>
            <ul className="list-disc ml-6 text-sm">
                <li><strong>🌐 Language Tabs:</strong> Switch between English, Telugu, or Hindi.</li>
                <li><strong>📅 Year Selector:</strong> Focuses both sections on one year of releases.</li>
            </ul>

            <h3 className="font-semibold text-[#C62828] mt-4">📊 Data Source</h3>
            <p className="text-sm">
                All information comes from TMDB (The Movie Database) APIs, updated daily. The popularity index
                reflects audience searches, views, and engagement metrics.
            </p>

            <p className="text-xs text-gray-500 mt-4 text-center">
                ⚠️ Disclaimer: This dashboard reflects global audience engagement and popularity, not verified
                box-office or OTT viewership figures.
            </p>
        </div>
    );
}
