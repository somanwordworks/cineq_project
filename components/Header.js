import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Camera } from "lucide-react";

export default function Header() {
    const router = useRouter();
    const [loadingHome, setLoadingHome] = useState(false);

    const handleLogoClick = (e) => {
        e.preventDefault();
        setLoadingHome(true);

        setTimeout(() => {
            setLoadingHome(false);
            router.push("/");
        }, 1200);
    };

    // ✅ CLEAN, SINGLE navItems ARRAY (no merge junk)
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
        <header className="flex justify-between items-center px-8 py-4 bg-white shadow-md w-full z-50 sticky top-0">
            {/* Logo */}
            <div
                className="relative flex items-center cursor-pointer"
                onClick={handleLogoClick}
            >
                <Image
                    src="/cineq_logo.png"
                    alt="CINEQ Logo"
                    width={160}
                    height={50}
                    priority
                    className={`transition-opacity duration-300 ${loadingHome ? "opacity-60" : "opacity-100"
                        }`}
                />

                {loadingHome && (
                    <div className="absolute left-[165px] animate-spin-slow">
                        <Camera
                            size={20}
                            strokeWidth={2.5}
                            className="text-[#C62828]"
                        />
                    </div>
                )}
            </div>

            {/* Center Ad */}
            <div className="hidden md:flex justify-center items-center w-full max-w-[728px] aspect-[728/90] bg-gray-100 rounded-lg mx-6 overflow-hidden relative">
                <Image
                    src="/ads/header-banner.jpg"
                    alt="Advertisement"
                    fill
                    className="object-contain"
                />
            </div>

            {/* Navigation */}
            <nav className="flex space-x-6 text-gray-700 font-medium">
                {navItems.map((item) => (
                    <div key={item.name} className="relative group">
                        {!item.submenu && (
                            <Link href={item.path}>
                                <span
                                    className={`cursor-pointer text-lg font-semibold transition-colors ${router.pathname === item.path
                                            ? "text-[#0078D4]"
                                            : "hover:text-[#E91E63]"
                                        }`}
                                >
                                    {item.name}
                                </span>
                            </Link>
                        )}

                        {item.submenu && (
                            <>
                                <span className="cursor-pointer text-lg font-semibold hover:text-[#E91E63]">
                                    {item.name} ▾
                                </span>

                                <div className="absolute left-0 top-full bg-white shadow-lg rounded-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50 py-2 w-48">
                                    {item.submenu.map((sub) => (
                                        <Link key={sub.name} href={sub.path}>
                                            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
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

            <style jsx>{`
                .animate-spin-slow {
                    animation: spin 1.2s linear infinite;
                }
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </header>
    );
}
