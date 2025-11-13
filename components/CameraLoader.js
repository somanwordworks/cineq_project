
///components/CameraLoader.js/

import { FaVideo } from "react-icons/fa"; // camera icon

export default function CameraLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-[9999]">
      <div className="flex flex-col items-center gap-4">
        <FaVideo 
          className="text-[#C62828] animate-ping" 
          size={80}
        />
        <p className="text-[#C62828] font-semibold text-lg">
          Loading...
        </p>
      </div>
    </div>
  );
}
