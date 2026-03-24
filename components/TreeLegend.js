
///components/TreeLegend.jsx//

import React from "react";

export default function TreeLegend() {
  return (
    <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-90 text-white 
                    p-4 rounded-lg shadow-lg border border-gray-700 text-sm space-y-2"
    >
      <div className="font-semibold text-yellow-300 mb-1">
        Relationship Legend
      </div>

      <div className="flex items-center space-x-2">
        <span className="inline-block w-6 h-1 bg-green-400"></span>
        <span>Worked Under (Direct Assistant)</span>
      </div>

      <div className="flex items-center space-x-2">
        <span className="inline-block w-6 h-1 border-t-2 border-orange-400 border-dashed"></span>
        <span>Influenced By (Stylistic)</span>
      </div>

      <div className="flex items-center space-x-2">
        <span className="inline-block w-6 h-1 border-t-2 border-blue-400 border-dotted"></span>
        <span>Same Camp / Associated Team</span>
      </div>

      <div className="flex items-center space-x-2">
        <span className="inline-block w-3 h-3 bg-white rounded-full"></span>
        <span>Director Node</span>
      </div>
    </div>
  );
}
