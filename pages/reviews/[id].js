import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { getReviews } from '../../lib/airtable';

export async function getStaticPaths() {
    const reviews = await getReviews();

    const paths = reviews.map((review) => ({
        params: { slug: review.slug },
    }));

    return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
    const reviews = await getReviews();
    const review = reviews.find((r) => r.slug === params.slug);

    if (!review) {
        return { notFound: true };
    }

    return {
        props: { review },
        revalidate: 60, // ISR every 60 seconds
    };
}

export default function ReviewPage({ review }) {
    const router = useRouter();

    if (router.isFallback) {
        return <div className="text-center py-10 text-lg">Loading...</div>;
    }

    return (
        <>
            <Head>
                <title>{review.title} - Review | CINEQ</title>
            </Head>

            <main className="max-w-3xl mx-auto px-4 py-10">
                {/* Poster Image */}
                <div className="mb-6">
                    <Image
                        src={review.poster || '/placeholder.jpg'}
                        alt={review.title}
                        width={800}
                        height={400}
                        className="rounded-lg w-full object-cover"
                    />
                </div>

                {/* Movie Title */}
                <h1 className="text-3xl font-bold mb-3">{review.title}</h1>

                {/* Cast and Date */}
                <div className="text-gray-800 text-lg mb-2">🎭 Cast: {review.cast}</div>
                <div className="text-gray-600 mb-4">📅 Release Date: {review.releaseDate}</div>

                {/* Review Summary */}
                <p className="text-gray-900 text-base mb-4">{review.summary}</p>

                {/* Verdict and Watchability */}
                <p className="font-semibold text-green-700 mb-2">
                    Verdict: {review.verdict}
                </p>
                <p className="text-sm">
                    {review.watchable?.toLowerCase() === 'yes'
                        ? '✅ Watchable'
                        : '🚫 Not Watchable'}
                </p>

                {/* Back Link */}
                <div className="mt-6">
                    <Link href="/reviews" className="text-blue-600 hover:underline">
                        ← Back to All Reviews
                    </Link>
                </div>
            </main>
        </>
    );
}
