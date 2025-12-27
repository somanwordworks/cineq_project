

////pages/directors/telugu/index.jsx//


import React, { useState } from "react";
import Link from "next/link";
import { directorsTelugu } from "@/data/directors-telugu";
import Header from "@/components/Header";     // ← Added
import Footer from "@/components/Footer";

export default function TeluguDirectorsPage() {
  const [search, setSearch] = useState("");

  const directorList = Object.values(directorsTelugu);

  const filtered = directorList.filter((dir) =>
    dir.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />  {/* ← Added */}

      <div className="min-h-screen bg-black text-white p-6">
        <h1 className="text-3xl font-bold mb-4">Telugu Directors</h1>

        <input
          type="text"
          placeholder="Search director..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 mb-6"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filtered.map((director) => (
            <Link
              key={director.slug}
              href={`/directors/telugu/${director.slug}`}
              className="bg-gray-900 p-4 rounded-xl border border-gray-800 hover:border-purple-400 hover:scale-105 transition transform"
            >
              <div className="flex flex-col items-center">
                <img
                  src={director.photo || "/directors/placeholder.jpg"}
                  className="w-24 h-24 rounded-full object-cover border border-gray-700 mb-3"
                  alt={director.name}
                />

                <p className="text-center font-semibold text-sm">
                  {director.name}
                </p>

                <span className="text-xs text-gray-400 mt-1">
                  {director.language}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
