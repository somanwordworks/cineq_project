import Image from "next/image";
import { useState } from "react";
import LegalModal from "./LegalModal";

export default function Footer() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <footer className="bg-[#C62828] text-white mt-12">
                {/* Gold accent line */}
                <div className="h-1 bg-[#E6B852]" />

                <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">

                    {/* LEFT COLUMN — DNV ARC */}
                    <div className="flex flex-col justify-between h-full">
                        <div></div>

                        <div
                            className="opacity-80 text-white text-xs"
                            style={{
                                fontFamily: "BankGothicLtBTLight",
                                letterSpacing: "0.10em",
                                textTransform: "uppercase",
                            }}
                        >
                            A DNV ARC DIGITAL EXPERIENCE
                        </div>
                    </div>

                    {/* CENTER COLUMN — Logo + Tagline */}
                    <div className="flex flex-col items-center text-center">
                        <Image
                            src="/cineq-logo.png"
                            alt="CINEQ Logo"
                            width={140}
                            height={140}
                            className="mb-3"
                        />

                        <p className="text-[#F9D65C] text-sm italic">
                            Lights. Camera. Data.
                        </p>

                        <div className="w-24 h-[2px] bg-[#E6B852] mt-3" />
                    </div>

                    {/* RIGHT COLUMN — Contact + Legal */}
                    <div className="text-right text-sm text-gray-100">
                        <p className="mb-4">
                            For collaborations, media partnerships, or queries:
                            <br />
                            <a
                                href="mailto:contact@rhinotribe.in"
                                className="text-[#F9D65C] hover:text-[#E6B852] transition-colors"
                            >
                                contact@rhinotribe.in
                            </a>
                        </p>

                        <p className="text-xs mb-4">
                            © {new Date().getFullYear()}{" "}
                            <span className="font-semibold">CINEQ</span> • Powered by{" "}
                            <span className="text-[#F9D65C]">Rhino Tribe</span>
                        </p>

                        <a
                            href="https://www.rhinotribe.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#F9D65C] underline text-xs"
                        >
                            www.rhinotribe.in
                        </a>

                        {/* Terms & Privacy */}
                        <div className="mt-4 flex justify-end">
                            <span
                                onClick={() => setOpen(true)}
                                className="cursor-pointer text-[10px] text-gray-200 hover:text-[#F9D65C] transition"
                            >
                                Terms & Privacy
                            </span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Legal Modal */}
            <LegalModal open={open} setOpen={setOpen} />
        </>
    );
}
