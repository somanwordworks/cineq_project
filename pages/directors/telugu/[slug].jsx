// pages/directors/telugu/[slug].jsx
// Shows the full director lineage tree, centred on the selected director
// The tree renders ALL directors + their student chains

import { useRouter } from "next/router";
import { directorsTelugu } from "../../../data/directors-telugu";
import DirectorTree from "../../../components/DirectorTree";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function DirectorTreePage() {
  const router = useRouter();
  const { slug } = router.query;

  if (!slug) {
    return (
      <div style={{ background: "#0F0F0F", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#8A8680", fontFamily: "system-ui" }}>Loading...</p>
      </div>
    );
  }

  const director = directorsTelugu[slug];

  return (
    <>
      <Header />
      <div style={{ background: "#0F0F0F", minHeight: "100vh" }}>

        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16,
          padding: "16px 24px",
          borderBottom: "1px solid #1a1a1a",
        }}>
          <button
            onClick={() => router.push("/directors/telugu")}
            style={{
              background: "#1A1A1A",
              border: "1px solid #333",
              color: "#8A8680",
              padding: "8px 16px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "system-ui",
            }}
          >
            ← Telugu Directors
          </button>

          {director && (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img
                src={director.photo || "/directors/placeholder.jpg"}
                onError={(e) => { e.target.src = "/directors/placeholder.jpg"; }}
                alt={director.name}
                style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "2px solid #E6B852" }}
              />
              <div>
                <h1 style={{
                  fontFamily: "'Bebas Neue', Impact, sans-serif",
                  fontSize: 22, color: "#fff", margin: 0, letterSpacing: 1,
                }}>
                  {director.name}
                </h1>
                <p style={{ color: "#8A8680", fontSize: 12, fontFamily: "system-ui", margin: 0 }}>
                  Full lineage tree · click any node to explore
                </p>
              </div>
            </div>
          )}
        </div>

        {/* The Tree */}
        <DirectorTree lang="te" />

      </div>
      <Footer />
    </>
  );
}

// Pre-render all Telugu director slugs at build time
export async function getStaticPaths() {
  const { directorsTelugu } = require("../../../data/directors-telugu");
  const paths = Object.keys(directorsTelugu).map((slug) => ({
    params: { slug },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  return { props: {} };
}
