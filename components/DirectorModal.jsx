
////components/DirectorModal.jsx//


import React from "react";

export default function DirectorModal({ director, onClose }) {
  if (!director) return null;

  return (
    <div className="
      fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center 
      z-50 p-4
    ">
      <div className="bg-gray-900 text-white rounded-xl p-6 w-full max-w-lg shadow-xl relative">

        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center space-x-4">
          <img
            src={director.photo || "/directors/placeholder.jpg"}
            alt={director.name}
            className="w-20 h-20 object-cover rounded-full border border-gray-600"
          />

          <div>
            <h2 className="text-xl font-bold">{director.name}</h2>
            <p className="text-sm text-gray-400">
              {director.language} Cinema
                </p>
          </div>
        </div>

        {/* Body */}
        <div className="mt-4 space-y-3 text-sm">

          <div>
            <h3 className="font-semibold text-green-400">Worked Under</h3>
            <p className="text-gray-300">
              {director.workedUnder?.length
                ? director.workedUnder.join(", ")
                : "None"}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-orange-400">Influenced By</h3>
            <p className="text-gray-300">
              {director.influencedBy?.length
                ? director.influencedBy.join(", ")
                : "None"}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-blue-400">Associated Team</h3>
            <p className="text-gray-300">
              {director.associatedTeam?.length
                ? director.associatedTeam.join(", ")
                : "None"}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-yellow-400">Students</h3>
            <p className="text-gray-300">
              {director.students?.length
                ? director.students.join(", ")
                : "None"}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
