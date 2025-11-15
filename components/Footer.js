import Image from "next/image";
import { useState } from "react";   // ⭐ Added
import LegalModal from "./LegalModal";  // ⭐ Added

export default function Footer() {

    const [open, setOpen] = useState(false); // ⭐ Added

    return (
        <>
            <footer className="bg-[#C62828] text-white mt-12">
                {/* Gold accent line */}
                <div className="h-1 bg-[#E6B852]" />

                <div className="max-w-7xl mx-auto px-6 py-10 text-center">
                    {/* Logo + Title */}
                    <div className="flex flex-col items-center justify-center mb-3">
                        <Image
                            src="/cineq-logo.png" // ✅ logo should be in /public
                            alt="CINEQ Logo"
                            width={140}
                            height={140}
                            className="mb-3"
                        />
                        <h2 className="text-3xl font-bold tracking-wide"></h2>
                        <p className="text-[#F9D65C] text-sm italic mt-1">
                            Lights. Camera. Data.
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="w-24 h-[2px] bg-[#E6B852] mx-auto mb-6" />

                    {/* 📨 Contact Section */}
                    <div className="text-sm text-gray-100 mb-6">
                        <p>
                            For collaborations, media partnerships, or queries, contact us at{" "}
                            <a
                                href="mailto:contact@rhinotribe.in"
                                className="text-[#F9D65C] hover:text-[#E6B852] font-medium transition-colors"
                            >
                                contact@rhinotribe.in
                            </a>
                        </p>
                    </div>

                    {/* Footer note */}
                    <p className="text-xs text-gray-100">
                        © {new Date().getFullYear()}{" "}
                        <span className="font-semibold">CINEQ</span> • Powered by{" "}
                        <span className="text-[#F9D65C]">Rhino Tribe</span>
                    </p>

                    <p className="text-xs text-gray-100 mt-1">
                        <a
                            href="https://www.rhinotribe.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#F9D65C] underline"
                        >
                            www.rhinotribe.in
                        </a>
                    </p>

                    {/* ⭐ NEW — Terms & Privacy Link (RIGHT SIDE) */}
                    <div className="mt-4 flex justify-end">
                        <span
                            onClick={() => setOpen(true)}
                            className="cursor-pointer text-[10px] text-gray-200 hover:text-[#F9D65C] transition"
                        >
                            Terms & Privacy
                        </span>
                    </div>

                </div>
            </footer>

            {/* ⭐ Legal Modal */}
            <LegalModal open={open} setOpen={setOpen} />
        </>
    );
}
