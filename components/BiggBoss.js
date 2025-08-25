import React, { useState } from "react";

export default function BiggBossWinners() {
    const winners = [
        /* ---------------- TELUGU ---------------- */
        { season: "Season 1", year: "2017", language: "Telugu", winner: "Siva Balaji", runnerUp: "Aadarsh Balakrishna", host: "N. T. Rama Rao Jr." },
        { season: "Season 2", year: "2018", language: "Telugu", winner: "Kaushal Manda", runnerUp: "Geetha Madhuri", host: "Nani" },
        { season: "Season 3", year: "2019", language: "Telugu", winner: "Rahul Sipligunj", runnerUp: "Sreemukhi", host: "Nagarjuna" },
        { season: "Season 4", year: "2020", language: "Telugu", winner: "Abijeet Duddala", runnerUp: "Akhil Sarthak", host: "Nagarjuna" },
        { season: "Season 5", year: "2021", language: "Telugu", winner: "VJ Sunny", runnerUp: "Shanmukh Jaswanth", host: "Nagarjuna" },
        { season: "Season 6", year: "2022", language: "Telugu", winner: "Revanth", runnerUp: "Srihan", host: "Nagarjuna" },
        { season: "Season 7", year: "2023", language: "Telugu", winner: "Shivaji", runnerUp: "Amardeep Chowdary", host: "Nagarjuna" },
        { season: "Season 8", year: "2024", language: "Telugu", winner: "Nikhil Maliyakkal", runnerUp: "Priyanka Jain", host: "Nagarjuna" },

        /* ---------------- HINDI ---------------- */
        { season: "Season 1", year: "2006", language: "Hindi", winner: "Rahul Roy", runnerUp: "Carol Gracias", host: "Arshad Warsi" },
        { season: "Season 2", year: "2008", language: "Hindi", winner: "Ashutosh Kaushik", runnerUp: "Raja Chaudhary", host: "Shilpa Shetty" },
        { season: "Season 3", year: "2009", language: "Hindi", winner: "Vindu Dara Singh", runnerUp: "Pravesh Rana", host: "Amitabh Bachchan" },
        { season: "Season 4", year: "2010", language: "Hindi", winner: "Shweta Tiwari", runnerUp: "The Great Khali", host: "Salman Khan" },
        { season: "Season 13", year: "2020", language: "Hindi", winner: "Sidharth Shukla", runnerUp: "Asim Riaz", host: "Salman Khan" },
        { season: "Season 17", year: "2024", language: "Hindi", winner: "Munawar Faruqui", runnerUp: "Abhishek Kumar", host: "Salman Khan" },

        /* ---------------- TAMIL ---------------- */
        { season: "Season 1", year: "2017", language: "Tamil", winner: "Arav", runnerUp: "Snehan", host: "Kamal Haasan" },
        { season: "Season 6", year: "2023", language: "Tamil", winner: "Azeem", runnerUp: "Vikraman", host: "Kamal Haasan" },

        /* ---------------- KANNADA ---------------- */
        { season: "Season 1", year: "2013", language: "Kannada", winner: "Vijay Raghavendra", runnerUp: "Arun Sagar", host: "Sudeep" },
        { season: "Season 9", year: "2022", language: "Kannada", winner: "Rupesh Rajanna", runnerUp: "Roopesh Shetty", host: "Sudeep" },

        /* ---------------- MALAYALAM ---------------- */
        { season: "Season 1", year: "2018", language: "Malayalam", winner: "Sabumon Abdusamad", runnerUp: "Pearle Maaney", host: "Mohanlal" },
        { season: "Season 5", year: "2023", language: "Malayalam", winner: "Reneesha Rahiman", runnerUp: "Shiju AR", host: "Mohanlal" },

        /* ---------------- MARATHI ---------------- */
        { season: "Season 1", year: "2018", language: "Marathi", winner: "Megha Dhade", runnerUp: "Pushkar Jog", host: "Mahesh Manjrekar" },
        { season: "Season 4", year: "2022", language: "Marathi", winner: "Akshay Kelkar", runnerUp: "Apurva Nemlekar", host: "Mahesh Manjrekar" },

        /* ---------------- BENGALI ---------------- */
        { season: "Season 1", year: "2013", language: "Bengali", winner: "Ananya Chatterjee", runnerUp: "Joyjit Banerjee", host: "Mithun Chakraborty" },
        { season: "Season 2", year: "2016", language: "Bengali", winner: "Joey Debroy", runnerUp: "Priya Paul", host: "Mithun Chakraborty" }
    ];

    const [selectedLang, setSelectedLang] = useState("All");

    const filtered =
        selectedLang === "All"
            ? winners
            : winners.filter((w) => w.language === selectedLang);

    const languages = [
        "All",
        "Telugu",
        "Hindi",
        "Tamil",
        "Kannada",
        "Malayalam",
        "Marathi",
        "Bengali",
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold mb-6 text-center">🏆 Bigg Boss Winners</h2>

            {/* Filter buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
                {languages.map((lang) => (
                    <button
                        key={lang}
                        onClick={() => setSelectedLang(lang)}
                        className={`px-3 py-1 rounded-full border text-sm font-medium transition ${selectedLang === lang
                                ? "bg-red-600 text-white border-red-600"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                            }`}
                    >
                        {lang}
                    </button>
                ))}
            </div>

            {/* Horizontal scroll winners */}
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <div className="flex gap-4 pr-4 snap-x snap-mandatory">
                    {filtered.map((w, idx) => (
                        <article
                            key={idx}
                            className="min-w-[200px] sm:min-w-[220px] rounded-2xl border bg-white overflow-hidden hover:shadow-md transition snap-start p-4 text-center"
                        >
                            <h3 className="font-bold text-md">{w.winner}</h3>
                            <p className="text-xs text-gray-500">
                                {w.language} – {w.season} ({w.year})
                            </p>
                            <p className="text-xs text-gray-600">🥈 Runner-up: {w.runnerUp}</p>
                            <p className="text-xs text-gray-600">🎤 Host: {w.host}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
