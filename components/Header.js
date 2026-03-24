import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Camera } from "lucide-react";
import { starBirthdays } from "../data/birthdays";


export default function Header() {
    const router = useRouter();
    const [loadingHome, setLoadingHome] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const today = new Date();
    const todayStr = today.toISOString().slice(5, 10);

    const todayBirthdays = starBirthdays.filter(
        (b) => b.dob.slice(5, 10) === todayStr
    );

    const handleLogoClick = (e) => {
        e.preventDefault();
        setLoadingHome(true);
        setTimeout(() => {
            setLoadingHome(false);
            router.push("/");
        }, 1200);
    };



    const navItems = [
        { name: "YouTube Stats", path: "/youtube-stats" },
        {
            name: "Directors Universe",
            submenu: [
                { name: "Cult Cuts", path: "/cultcuts" },
                { name: "Director Lineage", path: "/directors" },
            ],
        },
        { name: "OTT Insights", path: "/insights" },
    ];

    return (
        <>
            <header
                className="w-full z-50 sticky top-0"
                style={{ background: "#0F0F0F", borderBottom: "2px solid #E6B852" }}
            >
                <div className="flex justify-between items-center px-8 py-0 h-16">

                    {/* ── Logo ── */}
                    <div
                        className="relative flex items-center cursor-pointer flex-shrink-0"
                        onClick={handleLogoClick}
                        style={{ height: 44 }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 320 80"
                            height="40"
                            width="160"
                            className={`transition-opacity duration-300 ${loadingHome ? "opacity-50" : "opacity-100"}`}
                        >
                            <rect x="0" y="0" width="20" height="80" fill="#C62828" />
                            <rect x="0" y="2" width="20" height="7" fill="#E6B852" />
                            <rect x="0" y="13" width="20" height="7" fill="#E6B852" />
                            <rect x="0" y="24" width="20" height="7" fill="#E6B852" />
                            <rect x="0" y="35" width="20" height="7" fill="#E6B852" />
                            <rect x="0" y="46" width="20" height="7" fill="#E6B852" />
                            <rect x="0" y="57" width="20" height="7" fill="#E6B852" />
                            <rect x="0" y="68" width="20" height="7" fill="#E6B852" />
                            <text x="30" y="57"
                                fontFamily="'Bebas Neue', Impact, 'Arial Black', sans-serif"
                                fontSize="61" fontWeight="700" fill="#FFFFFF" letterSpacing="5">CINEQ</text>
                            <rect x="30" y="65" width="288" height="2" fill="#C62828" />
                            <text x="30" y="77"
                                fontFamily="Arial, Helvetica, sans-serif"
                                fontSize="9" fill="#E6B852" letterSpacing="4">CINEMA · INTELLIGENCE</text>
                        </svg>

                        {loadingHome && (
                            <div className="absolute left-[164px] animate-spin-slow">
                                <Camera size={16} strokeWidth={2.5} style={{ color: "#E6B852" }} />
                            </div>
                        )}
                    </div>

                    {/* 🔍 NEW: Search (Netflix style) */}
                    <div className="hidden md:flex flex-1 max-w-md mx-6">
                        <input
                            type="text"
                            placeholder="Search movies, actors, directors..."
                            className="w-full px-4 py-2 rounded-md text-sm"
                            style={{
                                background: "#1A1A1A",
                                color: "#FFFFFF",
                                border: "1px solid #333",
                                outline: "none"
                            }}
                        />
                    </div>

                    {/* 🎬 NEW: Live Info */}
                    <div className="hidden lg:flex items-center text-xs text-gray-400 whitespace-nowrap mr-4">
                        <span style={{ color: "#E6B852" }}>● LIVE</span>

                        <span className="ml-2">
                            {todayBirthdays.length === 0
                                ? "No birthdays today"
                                : `${todayBirthdays.length} Birthdays today`}
                        </span>

                        {todayBirthdays.length > 0 && (
                            <>
                                <span className="mx-2">•</span>
                                <span>{todayBirthdays.length} Celebrations</span>
                            </>
                        )}
                    </div>

                   

                    {/* ── Desktop Nav ── */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <div key={item.name} className="relative group">
                                {!item.submenu ? (
                                    <Link href={item.path}>
                                        <span
                                            className="block px-4 py-2 rounded-md text-sm font-semibold cursor-pointer transition-all duration-150"
                                            style={{
                                                color: router.pathname === item.path ? "#E6B852" : "#AAAAAA",
                                                background: router.pathname === item.path ? "rgba(230,184,82,0.08)" : "transparent",
                                            }}
                                            onMouseEnter={e => { if (router.pathname !== item.path) e.currentTarget.style.color = "#FFFFFF"; }}
                                            onMouseLeave={e => { if (router.pathname !== item.path) e.currentTarget.style.color = "#AAAAAA"; }}
                                        >
                                            {item.name}
                                        </span>
                                    </Link>
                                ) : (
                                    <>
                                        <span
                                            className="block px-4 py-2 rounded-md text-sm font-semibold cursor-pointer transition-colors duration-150"
                                            style={{ color: "#AAAAAA" }}
                                            onMouseEnter={e => e.currentTarget.style.color = "#FFFFFF"}
                                            onMouseLeave={e => e.currentTarget.style.color = "#AAAAAA"}
                                        >
                                            {item.name} ▾
                                        </span>
                                        <div
                                            className="absolute right-0 top-full mt-1 rounded-xl py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                                            style={{ background: "#1A1A1A", border: "1px solid #333", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}
                                        >
                                            {item.submenu.map((sub) => (
                                                <Link key={sub.name} href={sub.path}>
                                                    <div
                                                        className="px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150"
                                                        style={{ color: "#AAAAAA" }}
                                                        onMouseEnter={e => { e.currentTarget.style.color = "#E6B852"; e.currentTarget.style.background = "rgba(230,184,82,0.06)"; }}
                                                        onMouseLeave={e => { e.currentTarget.style.color = "#AAAAAA"; e.currentTarget.style.background = "transparent"; }}
                                                    >
                                                        {sub.name}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* ── Mobile Hamburger ── */}
                    <button className="md:hidden flex flex-col justify-center gap-1.5 p-2 ml-2"
                        onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
                        <span style={{ width: 22, height: 2, display: "block", borderRadius: 2, background: mobileOpen ? "#E6B852" : "#AAAAAA", transition: "all 0.2s", transform: mobileOpen ? "rotate(45deg) translate(3px, 3px)" : "none" }} />
                        <span style={{ width: 22, height: 2, display: "block", borderRadius: 2, background: "#AAAAAA", opacity: mobileOpen ? 0 : 1, transition: "opacity 0.2s" }} />
                        <span style={{ width: 22, height: 2, display: "block", borderRadius: 2, background: mobileOpen ? "#E6B852" : "#AAAAAA", transition: "all 0.2s", transform: mobileOpen ? "rotate(-45deg) translate(3px, -3px)" : "none" }} />
                    </button>

                </div>

                {/* ── Mobile Menu ── */}
                {mobileOpen && (
                    <div className="md:hidden px-6 py-4 flex flex-col gap-1"
                        style={{ background: "#141414", borderTop: "1px solid #222" }}>
                        {navItems.map((item) => (
                            <div key={item.name}>
                                {!item.submenu ? (
                                    <Link href={item.path}>
                                        <div className="py-3 text-sm font-semibold border-b"
                                            style={{ color: router.pathname === item.path ? "#E6B852" : "#AAAAAA", borderColor: "#222" }}
                                            onClick={() => setMobileOpen(false)}>
                                            {item.name}
                                        </div>
                                    </Link>
                                ) : (
                                    <>
                                        <div className="py-3 text-sm font-semibold border-b" style={{ color: "#555", borderColor: "#222" }}>{item.name}</div>
                                        {item.submenu.map((sub) => (
                                            <Link key={sub.name} href={sub.path}>
                                                <div className="py-2 pl-4 text-sm border-b"
                                                    style={{ color: "#888", borderColor: "#222" }}
                                                    onClick={() => setMobileOpen(false)}>
                                                    → {sub.name}
                                                </div>
                                            </Link>
                                        ))}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </header>

            <style jsx>{`
                .animate-spin-slow { animation: spin 1.2s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </>
    );
}