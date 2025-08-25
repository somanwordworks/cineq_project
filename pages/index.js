import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import DisclaimerModal from '../components/DisclaimerModal'
import { getReviews, getTrailers, getGossips } from '../lib/airtable'
import BiggBossWinners from "../components/BiggBoss";
import PosterPathshalaDemo from "../components/PosterPathshalaDemo";
import BirthdayBanner from "../components/BirthdayBanner";

const formatDate = (date) =>
    new Intl.DateTimeFormat('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata',
    }).format(date).replace(',', '')

/* ------------------------- Helpers ------------------------- */
const TELUGU = 'te'
const toISO = (d) => d.toISOString().slice(0, 10)
function mapResults(list) {
    return (list || []).map(m => ({
        id: m.id,
        title: m.title || m.original_title,
        releaseDate: m.release_date || 'Coming Soon',
        poster: m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : null,
        overview: m.overview,
    }))
}

async function fetchUpcomingTeluguServer() {
    const v3 = process.env.TMDB_API_KEY
    const v4 = process.env.TMDB_ACCESS_TOKEN
    if (!v3 && !v4) return []

    const today = new Date()
    const in180 = new Date(); in180.setDate(today.getDate() + 180)

    const doFetch = async (url) => {
        const resp = await fetch(url, v4 ? {
            headers: { Authorization: `Bearer ${v4}`, accept: 'application/json' }
        } : undefined)
        if (!resp.ok) return []
        const data = await resp.json()
        return mapResults(data.results || [])
    }

    const mkDiscover = (opts = {}) => {
        const url = new URL('https://api.themoviedb.org/3/discover/movie')
        url.searchParams.set('include_adult', 'false')
        url.searchParams.set('include_video', 'false')
        if (opts.withLang !== false) url.searchParams.set('with_original_language', TELUGU)
        url.searchParams.set('sort_by', opts.sortBy || 'primary_release_date.asc')
        if (opts.withDates !== false) {
            url.searchParams.set('primary_release_date.gte', toISO(today))
            url.searchParams.set('primary_release_date.lte', toISO(in180))
        }
        if (opts.region) url.searchParams.set('region', 'IN')
        if (opts.releaseType) url.searchParams.set('with_release_type', '2|3')
        if (!v4 && v3) url.searchParams.set('api_key', v3)
        return url.toString()
    }

    let res = await doFetch(mkDiscover({ region: true, releaseType: true, withDates: true }))
    if (!res.length) res = await doFetch(mkDiscover({ region: true, withDates: true }))
    if (!res.length) res = await doFetch(mkDiscover({ withDates: true }))
    if (!res.length) res = await doFetch(mkDiscover({ withDates: false, sortBy: 'popularity.desc' }))
    return res
}

export async function getServerSideProps() {
    const [reviews, trailers, gossips] = await Promise.all([
        getReviews().catch(() => []),
        getTrailers().catch(() => []),
        getGossips().catch(() => []),
    ])

    let telugu = []
    try {
        telugu = await fetchUpcomingTeluguServer()
    } catch { }

    return { props: { reviews, trailers, gossips, telugu } }
}

/* ------------------------- Radar Telugu ------------------------- */
function CineqTeluguRow({ items }) {
    const [list, setList] = useState(items || [])
    const [votes, setVotes] = useState({})

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
        const d = new Date(releaseDate + 'T00:00:00')
        if (isNaN(d.getTime())) return { label: 'TBA', tone: 'muted' }
        const today = new Date(new Date().toDateString())
        if (d >= today) return { label: 'Releasing Soon', tone: 'soon', date: d }
        return { label: 'Released', tone: 'released', date: d }
    }

    return (
        <section className="max-w-7xl mx-auto px-4 py-2 mb-12">
            <h2 className="text-2xl font-semibold mb-3">CINEQ Radar · Telugu</h2>
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <div className="flex gap-4 pr-4 snap-x snap-mandatory">
                    {list.map(m => {
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
                                        <button className={`flex-1 h-8 rounded-xl border text-xs ${v === 1 ? 'bg-green-600 text-white' : 'bg-white hover:bg-green-50'}`}>
                                            👍 Like
                                        </button>
                                        <button className={`flex-1 h-8 rounded-xl border text-xs ${v === -1 ? 'bg-red-600 text-white' : 'bg-white hover:bg-red-50'}`}>
                                            👎 Dislike
                                        </button>
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

/* ------------------------- Radar OTT ------------------------- */
function CineqOTTRow() {
    const [list, setList] = useState([])
    useEffect(() => {
        fetch('/api/ott-releasing?ts=' + Date.now())
            .then(r => r.json())
            .then(d => setList(d.results || []))
    }, [])

    const badgeClass = (tone) => {
        const base = "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border"
        if (tone === 'released') return base + " bg-green-100 text-green-800 border-green-200"
        if (tone === 'announcement') return base + " bg-blue-100 text-blue-800 border-blue-200"
        return base + " bg-gray-100 text-gray-700 border-gray-200"
    }

    const statusForOTT = (platform) => {
        if (!platform || platform === "TBA") return { label: "Platform TBA", tone: "announcement" }
        return { label: platform, tone: "released" }
    }

    return (
        <section className="max-w-7xl mx-auto px-4 py-2 mb-12">
            <h2 className="text-2xl font-semibold mb-3">CINEQ Radar · OTT (Telugu)</h2>
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <div className="flex gap-4 pr-4 snap-x snap-mandatory">
                    {list.map(m => {
                        const st = statusForOTT(m.platform)
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

/* ------------------------- Page ------------------------- */
export default function Home({ reviews = [], trailers = [], gossips = [], telugu = [] }) {
    return (
        <>
            <Head>
                <title>CINEQ - Honest Movie Reviews</title>
                <meta name="description" content="CINEQ brings you sharp, clean, and honest movie reviews." />
            </Head>

            <Header />

            <main className="max-w-7xl mx-auto px-4 py-6 scroll-smooth">
                <div className="mb-6">
                    <img src="/hero-banner.jpg" alt="CINEQ Hero" className="rounded-xl w-full h-auto object-cover" />
                </div>

                {/* 🔔 Birthday Banner with marquee */}
                <div className="w-full overflow-hidden bg-yellow-100 border border-yellow-300 rounded-lg py-2 mb-6">
                    <div className="animate-marquee whitespace-nowrap text-center text-sm font-medium text-gray-800">
                        <BirthdayBanner />
                    </div>
                </div>

                <CineqTeluguRow items={telugu} />
                <CineqOTTRow />

                <section className="mb-16" id="reviews-trailers-gossips">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Reviews */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-center">🎬 Latest Movie Reviews</h2>
                            <div className="h-[600px] overflow-y-auto pr-2 space-y-4">
                                {reviews.map((review) => (
                                    <div key={review.slug} className="bg-white shadow-md rounded-lg overflow-hidden">
                                        <div className="w-full h-[200px] overflow-hidden bg-gray-100 flex items-center justify-center">
                                            <img src={review.poster || '/placeholder.jpg'} alt={review.title} className="object-contain h-full" />
                                        </div>
                                        <div className="p-3 text-sm">
                                            <h3 className="font-bold mb-1">{review.title}</h3>
                                            <p className="text-gray-700 mb-1">🎭 Cast: {review.cast}</p>
                                            <p className="line-clamp-3 mb-2">{review.summary}</p>
                                            <p className="text-green-700 font-semibold mb-1">📝 {review.verdict}</p>
                                            <p className="text-gray-600 mb-1">🎬 Director: {review.director}</p>
                                            <p className="text-gray-600 mb-1">💼 Producer: {review.producer}</p>
                                            <p className="text-gray-600 mb-1">🏢 Production: {review.productionHouse}</p>
                                            <p className="text-xs text-gray-500">📅 {review.releaseDate}</p>
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
                            <div className="space-y-4">
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

               {/* 🔥 CINEQ Specials Section */}
<section className="max-w-7xl mx-auto px-4 py-12">
  <h2 className="text-3xl font-extrabold text-center mb-10">
    🔥 CINEQ Specials
  </h2>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
    {/* 🏆 Bigg Boss Winners */}
    <div className="bg-white rounded-2xl shadow-md p-6">
      <BiggBossWinners />
    </div>

    {/* 🎨 Poster Pathshala */}
    <div className="bg-white rounded-2xl shadow-md p-6">
      <PosterPathshalaDemo />
    </div>
  </div>
</section>


                <footer className="text-center text-gray-500 text-sm py-6 border-t border-gray-200">
                    © 2025 CINEQ. All rights reserved.
                </footer>
            </main>

            <style jsx>{`
        .animate-marquee { display: inline-block; padding-left: 100%; animation: marquee 15s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }
        .scrollbar-thin::-webkit-scrollbar { height: 8px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 9999px; }
      `}</style>
        </>
    )
}
