import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | CINEQ</title>
        <meta name="description" content="Privacy Policy for CINEQ" />
      </Head>

      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10 text-gray-800 leading-relaxed">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <p className="mb-4">
          CINEQ respects your privacy and is committed to protecting any
          information you share with us. This policy explains how we collect,
          use, and safeguard your information.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Basic information you voluntarily provide (email, comments)</li>
          <li>Non-personal data such as IP address, browser type, device information</li>
          <li>Usage data for analytics and performance improvement</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Cookies</h2>
        <p className="mb-4">
          We use cookies to improve user experience, analyze traffic, and serve
          relevant content.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Advertising & Google AdSense
        </h2>
        <p className="mb-4">
          CINEQ uses Google AdSense, a third-party advertising service. Google
          uses cookies, including the DoubleClick cookie, to serve ads to users
          based on their visits to this and other websites.
        </p>
        <p className="mb-4">
          Third-party vendors, including Google, may show ads based on a user’s
          prior visits to this website. Users may opt out of personalized
          advertising by visiting{" "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Google Ads Settings
          </a>.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Third-Party Services</h2>
        <p className="mb-4">
          Embedded content (YouTube, social media, analytics tools) follows the
          respective third-party privacy policies.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Your Rights</h2>
        <p className="mb-4">
          You may request access, correction, or deletion of your data by
          contacting us at{" "}
          <strong>contact@dnvarc.com</strong>.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Children’s Information</h2>
        <p className="mb-4">
          CINEQ does not knowingly collect information from children under 13.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Policy Updates</h2>
        <p className="mb-4">
          This policy may be updated periodically. Continued use of the site
          constitutes acceptance of changes.
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
