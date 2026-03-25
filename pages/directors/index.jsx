// pages/directors/index.jsx
// Updated: all 5 language tabs shown, Telugu active, others coming soon

import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const LANGUAGES = [
  { label: "Telugu", href: "/directors/telugu", active: true },
  { label: "Tamil", href: "/directors/tamil", active: false },
  { label: "Malayalam", href: "/directors/malayalam", active: false },
  { label: "Kannada", href: "/directors/kannada", active: false },
  { label: "Hindi", href: "/directors/hindi", active: false },
];

export default function DirectorsHome() {
  return (
    <>
      <Header />
      <div style={{ minHeight: "100vh", background: "#0F0F0F", color: "#fff", padding: "48px 32px" }}>

        <h1 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: 42, letterSpacing: 2, marginBottom: 8, color: "#fff",
        }}>
          Director Lineage
        </h1>
        <p style={{ color: "#8A8680", marginBottom: 40, fontSize: 15 }}>
          Explore who mentored whom across South Indian cinema.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {LANGUAGES.map(({ label, href, active }) => (
            active ? (
              <Link key={label} href={href} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "#1A1A1A",
                  border: "2px solid #E6B852",
                  borderRadius: 12,
                  padding: "28px 40px",
                  cursor: "pointer",
                  textAlign: "center",
                  color: "#E6B852",
                  fontFamily: "'Bebas Neue', Impact, sans-serif",
                  fontSize: 22,
                  letterSpacing: 2,
                  transition: "transform 0.2s",
                  minWidth: 160,
                }}>
                  {label}
                  <div style={{ fontSize: 11, color: "#8A8680", fontFamily: "system-ui", marginTop: 6, letterSpacing: 1 }}>
                    EXPLORE →
                  </div>
                </div>
              </Link>
            ) : (
              <div key={label} style={{
                background: "#111",
                border: "1px solid #222",
                borderRadius: 12,
                padding: "28px 40px",
                textAlign: "center",
                color: "#444",
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: 22,
                letterSpacing: 2,
                minWidth: 160,
                position: "relative",
              }}>
                {label}
                <div style={{ fontSize: 10, color: "#333", fontFamily: "system-ui", marginTop: 6, letterSpacing: 1 }}>
                  COMING SOON
                </div>
              </div>
            )
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
