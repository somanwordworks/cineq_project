import Head from 'next/head'
import Header from '../components/Header'
import DisclaimerModal from '../components/DisclaimerModal'
import { getReviews, getTrailers, getGossips } from '../lib/airtable'

export async function getStaticProps() {
    const reviews = await getReviews()
    const trailers = await getTrailers()
    const gossips = await getGossips()
    return {
        props: { reviews, trailers, gossips },
        revalidate: 60,
    }
}

export default function Home({ reviews = [], trailers = [], gossips = [] }) {
    return (
        <>
            <Head>
                <title>CINEQ - Honest Movie Reviews</title>
                <meta name="description" content="CINEQ brings you sharp, clean, and honest movie reviews." />
            </Head>

            <DisclaimerModal />
            <Header />

            <main className="max-w-7xl mx-auto px-4 py-6 scroll-smooth">
                {/* 🎬 Hero Banner */}
                <div className="mb-6">
                    <img
                        src="/hero-banner.jpg"
                        alt="CINEQ Hero"
                        className="rounded-xl w-full h-auto object-cover"
                    />
                </div>

                {/* 📢 Scrolling Promo */}
                <div className="bg-black py-2 mb-8 rounded shadow overflow-hidden">
                    <div className="whitespace-nowrap animate-marquee text-green-400 text-lg font-semibold">
                        🌟 Promote your movie, OTT show, or trailer here – contact CINEQ for banner space, featured posts, or hero visibility!
                    </div>
                </div>

                {/* Main Grid Section */}
                <section className="mb-16" id="reviews-trailers-gossips">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Reviews */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-center">🎬 Latest Movie Reviews</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {reviews.map((review) => (
                                    <div key={review.slug} className="bg-white shadow-md rounded-lg overflow-hidden">
                                        <div className="w-full h-[200px] overflow-hidden bg-gray-100 flex items-center justify-center">
                                            <img
                                                src={review.poster || '/placeholder.jpg'}
                                                alt={review.title}
                                                className="object-contain h-full"
                                            />
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
                            <div className="grid grid-cols-1 gap-4">
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

                {/* 📌 Footer */}
                <footer className="text-center text-gray-500 text-sm py-6 border-t border-gray-200">
                    © 2025 CINEQ. All rights reserved.
                </footer>
            </main>

            <style jsx>{`
        .animate-marquee {
          display: inline-block;
          padding-left: 100%;
          animation: marquee 15s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
        </>
    )
}
