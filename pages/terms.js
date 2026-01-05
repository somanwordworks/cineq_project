import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service | CINEQ</title>
        <meta name="description" content="Terms of Service for CINEQ" />
      </Head>

      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10 text-gray-800 leading-relaxed">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

        <p className="mb-4">
          By accessing or using CINEQ, you agree to comply with these Terms of
          Service.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Allowed Use</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>No copying or scraping of content</li>
          <li>No hacking, abuse, or misuse</li>
          <li>No spam, malware, or piracy links</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Intellectual Property</h2>
        <p className="mb-4">
          All content published on CINEQ belongs to CINEQ unless otherwise
          stated.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">User Content</h2>
        <p className="mb-4">
          By submitting content, you grant CINEQ a non-exclusive right to display
          it.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">External Links</h2>
        <p className="mb-4">
          CINEQ is not responsible for third-party websites or content.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Disclaimer</h2>
        <p className="mb-4">
          Content on CINEQ is opinion-based. We do not guarantee accuracy of box
          office figures, ratings, or interpretations.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Limitation of Liability</h2>
        <p className="mb-4">
          CINEQ shall not be liable for any damages arising from use of the site.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Termination</h2>
        <p className="mb-4">
          Access may be suspended if terms are violated.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
        <p>
          Email: <strong>contact@dnvarc.com</strong>
        </p>
      </main>

      <Footer />
    </>
  );
}
