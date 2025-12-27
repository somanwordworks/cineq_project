

import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function YouTubeFlash() {
    const { data, error } = useSWR("/api/youtube-trending", fetcher);

    if (error) return <div className="text-red-500">Failed to load YouTube data.</div>;
    if (!data?.results) return <div className="text-gray-500">Loading YouTube…</div>;

    const list = data.results.slice(0, 10); // Top 10

    return (
        <div className="bg-white rounded-xl shadow p-4 border border-[#F4E4B8] flex flex-col"
            style={{ maxHeight: "645px" }}>


            <h2 className="text-lg font-bold text-[#C62828] mb-3">
                🔥 Trending on YouTube (Top 10)
            </h2>

            <div className="overflow-y-auto pr-2 space-y-3"
                style={{ maxHeight: "590px" }}>


                {list.map((vid, i) => (
                    <div
                        key={vid.id}
                        className="group relative flex items-center gap-3 bg-[#FFF7E5] hover:bg-[#FFE9C2] transition p-2 rounded-lg cursor-default"
                    >

                        {/* Tooltip */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 
                  bg-black text-white text-xs px-2 py-1 rounded 
                  opacity-0 group-hover:opacity-100 transition 
                  pointer-events-none whitespace-nowrap z-50">
                            Visit YouTube Stats Page
                        </div>

                        {/* Thumbnail */}
                        <img
                            src={vid.thumbnail}
                            className="w-20 h-14 rounded object-cover"
                            alt={vid.title}
                        />

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold text-[#8B1A1A] text-sm truncate">
                                {i + 1}. {vid.title}
                            </div>
                            <div className="text-xs text-gray-600 truncate">
                                {vid.channelTitle}
                            </div>
                            <div className="text-xs font-bold text-[#C62828]">
                                {Number(vid.viewsPerHour).toLocaleString()} / hr
                            </div>
                        </div>
                    </div>

                    
                ))}
            </div>
        </div>
    );
}
