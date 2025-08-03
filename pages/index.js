import Head from 'next/head';
import Image from 'next/image';
import { getReviews, getTrailers } from '../lib/airtable';
import Header from '../components/Header';

export async function getStaticProps() {
    const reviews = await getReviews();
    const trailers = await getTrailers();
    return {
        props: { reviews, trailers },
        revalidate: 60,
    };
}

export default function Home({ reviews, trailers }) {
    return (
        <>
            <Head>
                <title>CINEQ - Movie Reviews</title>
                <meta name="description" content="CINEQ brings you sharp, clean, and honest movie reviews." />
            </Head>

            <Header />

            <main className="max-w-7xl mx-auto px-4 py-6 scroll-smooth">
                {/* 🎥 Hero Banner */}
                <div className="mb-6">
                    <Image
                        src="/hero-banner.jpg"
                        alt="CINEQ Banner"
                        width={1920}
                        height={500}
                        className="rounded-xl w-full"
                        priority
                    />
                </div>

                {/* 🔁 Scrolling Promo Banner */}
                <div className="bg-black py-2 mb-8 rounded shadow overflow-hidden">
                    <div className="whitespace-nowrap animate-marquee text-green-400 text-lg font-semibold">
                        🎯 Promote your movie, OTT show, or trailer here – contact CINEQ for banner space, featured posts, or hero visibility! 🔥
                    </div>
                </div>

                {/* 🎞️ Reviews + Trailers Section */}
                <section className="mb-16" id="reviews-trailers">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* 🎬 Reviews Block */}
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-center">🎬 Latest Movie Reviews</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {reviews.map((review) => (
                                    <div
                                        key={review.slug}
                                        className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="w-full h-[260px] flex items-center justify-center overflow-hidden">
                                            <Image
                                                src={review.poster || '/placeholder.jpg'}
                                                alt={review.title}
                                                width={160}
                                                height={240}
                                                className="object-contain h-full"
                                            />
                                        </div>
                                        <div className="p-3">
                                            <h3 className="text-base font-bold mb-1">{review.title}</h3>
                                            <p className="text-sm text-gray-700 mb-1">🎭 Cast: {review.cast}</p>
                                            <p className="text-xs text-gray-600 mb-2 line-clamp-3">{review.summary}</p>
                                            <p className="text-sm font-semibold text-green-700 mb-1">📝 {review.verdict}</p>
                                            <p className="text-xs text-gray-600 mb-1">🎬 Director: {review.director}</p>
                                            <p className="text-xs text-gray-600 mb-1">💼 Producer: {review.producer}</p>
                                            <p className="text-xs text-gray-600 mb-2">🏢 Production: {review.productionHouse}</p>
                                            <p className="text-xs text-gray-500">📅 {review.releaseDate}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 🎞️ Trailers Block */}
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-center">🎞️ Watch Latest Trailers</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                                            <h3 className="text-base font-bold text-gray-800">{trailer.title}</h3>
                                        </div>
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

            {/* 🔁 Marquee Animation CSS */}
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
    );
}
