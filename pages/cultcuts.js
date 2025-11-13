// /pages/cultcuts.js
import React, { useState } from "react";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";

const directors = [
    {
        name: "Ram Gopal Varma",
        tagline: "The Anarchist Who Made Chaos a Genre",
        desc: "He changed how India heard cinema — Siva’s chain, Satya’s silence, Rangeela’s rhythm. RGV made sound emotional, violence philosophical, and storytelling fearless.",
        image: "/images/rgv.jpg",
        topScenes: [
            { title: "Siva", note: "The chain that changed how India heard sound." },
            { title: "Satya", note: "Realism turned rebellion — the birth of Mumbai noir." },
            { title: "Rangeela", note: "Desire became rhythm; intimacy turned poetic." },
            { title: "Company", note: "Silence became the new sound of power." },
        ],
    },
    {
        name: "Krishna Vamsi",
        tagline: "The Poet of Emotion and Fire",
        desc: "He frames not people, but morality. Every shot in Antahpuram and Khadgam feels like an emotional confession. His camera captures conflict, color, and conscience.",
        image: "/images/kv.jpg",
        topScenes: [
            { title: "Antahpuram", note: "A mother’s fear and defiance in raw realism." },
            { title: "Khadgam", note: "The flag rose not with pride, but with purpose." },
            { title: "Murari", note: "Faith and fate intertwined in divine storytelling." },
        ],
    },
    {
        name: "Sandeep Reddy Vanga",
        tagline: "The Provocateur of Emotion",
        desc: "His camera doesn’t record; it bleeds. Love, rage, and obsession — Vanga films them raw and unfiltered. His cinema redefined vulnerability as strength.",
        image: "/images/vanga.jpg",
        topScenes: [
            { title: "Arjun Reddy", note: "Confession as chaos — love with open wounds." },
            { title: "Kabir Singh", note: "Anger became heartbreak’s only language." },
            { title: "Animal", note: "Violence redefined as a father’s emotional war." },
        ],
    },
    {
        name: "Upendra Rao",
        tagline: "The Philosopher of Madness",
        desc: "Decades ahead of his time, Upendra turned cinema into self-reflection. His films remain futuristic even today — spiritual, surreal, and socially sharp.",
        image: "/images/upendra.jpg",
        topScenes: [
            { title: "Om", note: "Crime met karma — a gangster’s soul in turmoil." },
            { title: "A", note: "A loop of love, ego, and illusion — postmodern before its time." },
            { title: "Upendra", note: "A mirror held to mankind’s ego and insanity." },
        ],
    },
];

export default function CultCuts() {
    const [selectedDirector, setSelectedDirector] = useState(null);

    return (
        <>
            <Header />

            <main className="bg-black text-white min-h-screen">
                {/* Hero Section */}
                <section className="text-center py-20 bg-gradient-to-b from-black via-neutral-900 to-black">
                    <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-3 tracking-wide">
                        CULT CUTS
                    </h1>
                    <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
                        Celebrating India’s boldest filmmakers — the ones who turned chaos,
                        conscience, and cinema into art.
                    </p>
                </section>

                {/* Directors Grid */}
                <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 md:px-20 pb-20">
                    {directors.map((dir, idx) => (
                        <div
                            key={idx}
                            className="relative group overflow-hidden rounded-xl shadow-md cursor-pointer hover:shadow-xl transition-all duration-300"
                            onClick={() => setSelectedDirector(dir)}
                        >
                            <div className="relative w-full h-[320px]">
                                <Image
                                    src={dir.image}
                                    alt={dir.name}
                                    layout="fill"
                                    objectFit="cover"
                                    className="transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col items-center justify-end pb-5">
                                <h2 className="text-lg md:text-xl font-bold text-yellow-400">
                                    {dir.name}
                                </h2>
                                <p className="italic text-gray-300 text-xs mb-2 px-2 text-center">
                                    {dir.tagline}
                                </p>
                                <button className="px-3 py-1 border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors text-xs rounded">
                                    View Cult Cuts
                                </button>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Modal */}
                {selectedDirector && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                        <div className="bg-neutral-900 rounded-xl shadow-2xl max-w-2xl w-full p-6 relative">
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedDirector(null)}
                                className="absolute top-3 right-3 text-gray-400 hover:text-yellow-400 text-lg"
                            >
                                ✕
                            </button>

                            {/* Content */}
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-lg overflow-hidden">
                                    <Image
                                        src={selectedDirector.image}
                                        alt={selectedDirector.name}
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>

                                <div className="flex-1 text-left">
                                    <h2 className="text-2xl font-bold text-yellow-400 mb-1">
                                        {selectedDirector.name}
                                    </h2>
                                    <h3 className="italic text-gray-300 mb-3 text-sm">
                                        {selectedDirector.tagline}
                                    </h3>
                                    <p className="text-gray-200 text-sm leading-relaxed mb-4">
                                        {selectedDirector.desc}
                                    </p>

                                    <h4 className="text-yellow-400 font-semibold text-sm mb-2">
                                        Top Cult Scenes
                                    </h4>
                                    <ul className="text-gray-300 text-xs space-y-1">
                                        {selectedDirector.topScenes.map((scene, i) => (
                                            <li key={i}>
                                                <span className="text-yellow-400">🎬 {scene.title}</span>{" "}
                                                – {scene.note}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </>
    );
}
