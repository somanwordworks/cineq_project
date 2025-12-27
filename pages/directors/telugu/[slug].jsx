
///pages/directors/telugu/[slug].jsx//

import { useRouter } from "next/router";
import DirectorTree from "@/components/DirectorTree";

export default function DirectorTreePage() {
  const router = useRouter();
  const { slug } = router.query;

  if (!slug) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="p-6 bg-black min-h-screen text-white">

      {/* Back to List */}
      <button
        onClick={() => router.push("/directors/telugu")}
        className="mb-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 
                   text-white rounded-lg border border-gray-700"
      >
        ← Back to Telugu Directors
      </button>

      <DirectorTree slug={slug} />
    </div>
  );
}
