import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer"; // ✅ Added universal footer
// import DisclaimerModal from "../components/DisclaimerModal";
import {
    getHeroBlocks,
    getReviews,
    getGossips,
    getTrailers,
    getMustWatchOTT,
    getRetrospect,
    getCINEQSpeaks,
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
        poster: m.poster_path
            ? `https://image.tmdb.org/t/p/w342${m.poster_path}`
            : null,
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
        if (opts.withLang !== false)
            url.searchParams.set("with_original_language", TELUGU);
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

    let res = await doFetch(
        mkDiscover({ region: true, releaseType: true, withDates: true })
    );
    if (!res.length)
        res = await doFetch(mkDiscover({ region: true, withDates: true }));
    if (!res.length) res = await doFetch(mkDiscover({ withDates: true }));
    if (!res.length)
        res = await doFetch(
            mkDiscover({ withDates: false, sortBy: "popularity.desc" })
        );
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
        getHeroBlocks().catch(() => []),
        getReviews().catch(() => []),
        getGossips().catch(() => []),
        getTrailers().catch(() => []),
        getMustWatchOTT().catch(() => []),
        getRetrospect().catch(() => []),
        getCINEQSpeaks().catch(() => []),
    ]);

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
        },
    };
}

/* ------------------------- Page ------------------------- */
export default function Home({
    heroBlocks = [],
    reviews = [],
    gossips = [],
    trailers = [],
    mustWatch = [],
    retrospect = [],
    CINEQspeaks = [],
    telugu = [],
}) {
    const leftBlocks = heroBlocks.filter(
        (b) => (b.side || "").toLowerCase() === "left"
    );
    const rightBlocks = heroBlocks.filter(
        (b) => (b.side || "").toLowerCase() === "right"
    );

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
                    {/* HeroCarousel components remain unchanged */}
                </div>

                {/* 🎉 Birthday Banner */}
                <div className="w-full overflow-hidden bg-yellow-100 border border-yellow-300 rounded-lg py-2 mb-8">
                    <div className="whitespace-nowrap text-center text-sm font-medium text-gray-800 animate-marquee">
                        <BirthdayBanner />
                    </div>
                </div>



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

                        {/* Gossips */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-center">🧨 Is It True Bhavani !!</h2>
                            <div className="h-[600px] overflow-y-auto pr-2 space-y-4">
                                {gossips.map((g, idx) => (
                                    <div key={idx} className="bg-yellow-50 border border-yellow-200 p-3 rounded shadow">
                                        <p className="text-sm text-gray-800">{g.content}</p>
                                        {idx !== gossips.length - 1 && <hr className="border-dotted border-gray-300 mt-3" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </section>


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
