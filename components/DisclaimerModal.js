import { useState } from 'react';

export default function DisclaimerModal() {
    const [isVisible, setIsVisible] = useState(true);

    const handleAccept = () => {
        setIsVisible(false);
    };

    return isVisible ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="relative bg-white rounded-xl shadow-lg p-6 max-w-xl w-full text-center overflow-hidden">

                {/* 🔵 CINEQ Logo Shadow */}
                <div className="absolute inset-0 flex justify-center items-center opacity-30 z-0">
                    <img
                        src="/cineq_logo.png"
                        alt="CINEQ Logo"
                        className="w-48 h-48 object-contain blur-none "
                    />
                </div>

                {/* 🔵 Text Content */}
                <div className="relative z-10">
                    <h2 className="text-lg font-bold mb-4 text-gray-900">Disclaimer</h2>
                    <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                        The movie reviews published on <strong>CINEQ</strong> are personal opinions and do not intend to influence or persuade anyone to agree with the reviewer’s perspective. They are shared purely for informational and entertainment purposes. Viewers are encouraged to form their own judgments after watching the movies or exploring other sources. <strong>CINEQ</strong> does not promote or defame any individual, production, or creative entity through its content. By proceeding, you acknowledge and accept that the views expressed are subjective, and <strong>CINEQ</strong> holds no responsibility for any interpretations or decisions based on them.
                    </p>
                    <button
                        onClick={handleAccept}
                        className="mt-2 px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    >
                        I Understand & Accept
                    </button>
                </div>

            </div>
        </div>
    ) : null;
}
