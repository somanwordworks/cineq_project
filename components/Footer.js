import { useState } from "react";
import LegalModal from "./LegalModal";

export default function Footer() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <footer style={{ background: "#0F0F0F", borderTop: "2px solid #E6B852", marginTop: 48 }}>

                <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 32px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 40, alignItems: "start" }}>

                    {/* ── LEFT — DNV ARC ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {/* Film strip logo inline SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" height="36" width="144">
                            <rect x="0" y="0" width="20" height="80" fill="#C62828"/>
                            <rect x="0" y="2"  width="20" height="7" fill="#E6B852"/>
                            <rect x="0" y="13" width="20" height="7" fill="#E6B852"/>
                            <rect x="0" y="24" width="20" height="7" fill="#E6B852"/>
                            <rect x="0" y="35" width="20" height="7" fill="#E6B852"/>
                            <rect x="0" y="46" width="20" height="7" fill="#E6B852"/>
                            <rect x="0" y="57" width="20" height="7" fill="#E6B852"/>
                            <rect x="0" y="68" width="20" height="7" fill="#E6B852"/>
                            <text x="30" y="57"
                                fontFamily="'Bebas Neue', Impact, 'Arial Black', sans-serif"
                                fontSize="61" fontWeight="700" fill="#FFFFFF" letterSpacing="5">CINEQ</text>
                            <rect x="30" y="65" width="288" height="2" fill="#C62828"/>
                            <text x="30" y="77"
                                fontFamily="Arial, Helvetica, sans-serif"
                                fontSize="9" fill="#E6B852" letterSpacing="4">CINEMA · INTELLIGENCE</text>
                        </svg>

                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginTop: 4 }}>
                            Sharp, data-driven Telugu cinema coverage. Trending films, trailers, OTT releases — updated daily.
                        </p>

                        <div style={{ fontFamily: "BankGothicLtBTLight, Arial, sans-serif", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 8 }}>
                            A DNV ARC Digital Experience
                        </div>
                    </div>

                    {/* ── CENTER — Tagline + Divider ── */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingTop: 4 }}>
                        <div style={{ width: 1, height: 40, background: "rgba(230,184,82,0.3)", marginBottom: 20 }} />

                        <p style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 22, letterSpacing: "0.18em", color: "#E6B852", marginBottom: 8 }}>
                            LIGHTS · CAMERA · DATA
                        </p>

                        <div style={{ width: 60, height: 2, background: "#C62828", marginBottom: 20 }} />

                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                            Telugu · Tamil · Hindi · Malayalam · Kannada
                        </p>

                        <div style={{ width: 1, height: 40, background: "rgba(230,184,82,0.3)", marginTop: 20 }} />
                    </div>

                    {/* ── RIGHT — Contact + Legal ── */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12, textAlign: "right" }}>
                        <div>
                            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                                Collaborations &amp; Partnerships
                            </p>
                            <a href="mailto:contact@dnvarc.com"
                                style={{ fontSize: 14, color: "#E6B852", textDecoration: "none", fontWeight: 600, letterSpacing: "0.02em" }}
                                onMouseEnter={e => e.currentTarget.style.color = "#FFFFFF"}
                                onMouseLeave={e => e.currentTarget.style.color = "#E6B852"}>
                                contact@dnvarc.com
                            </a>
                        </div>

                        <a href="https://www.DNVARC.COM" target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none", letterSpacing: "0.05em" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#E6B852"}
                            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
                            www.dnvarc.com
                        </a>

                        <button onClick={() => setOpen(true)}
                            style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: 0, letterSpacing: "0.05em" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#E6B852"}
                            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
                            Terms &amp; Privacy
                        </button>
                    </div>

                </div>

                {/* ── Bottom bar ── */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "14px 32px", maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>
                        © {new Date().getFullYear()} <span style={{ color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>CINEQ</span> · Powered by <span style={{ color: "#E6B852" }}>DNV ARC</span>
                    </p>
                    <div style={{ display: "flex", gap: 6 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C62828" }} />
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#E6B852" }} />
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C62828" }} />
                    </div>
                </div>

            </footer>

            <LegalModal open={open} setOpen={setOpen} />

            <style jsx>{`
                @media (max-width: 768px) {
                    footer > div:first-of-type {
                        grid-template-columns: 1fr !important;
                        text-align: center;
                    }
                    footer > div:first-of-type > div:last-child {
                        align-items: center !important;
                        text-align: center !important;
                    }
                }
            `}</style>
        </>
    );
}