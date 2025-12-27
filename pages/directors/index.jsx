

////pages/directors/index.jsx//

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function DirectorsHome() {
  return (
    <>
      <Header />   {/* ← Added */}

      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-3xl font-bold mb-2">Director Lineage</h1>
        <p className="text-gray-400 mb-6">
          Choose an industry to explore director relationships.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          <Link href="/directors/telugu">
            <div className="bg-gray-800 p-6 rounded-xl cursor-pointer hover:bg-gray-700 transition text-center">
              Telugu
            </div>
          </Link>

                  {/* <Link href="/directors/tamil">
            <div className="bg-gray-800 p-6 rounded-xl cursor-pointer hover:bg-gray-700 transition text-center">
              Tamil
            </div>
          </Link>

          <Link href="/directors/malayalam">
            <div className="bg-gray-800 p-6 rounded-xl cursor-pointer hover:bg-gray-700 transition text-center">
              Malayalam
            </div>
          </Link>

          <Link href="/directors/kannada">
            <div className="bg-gray-800 p-6 rounded-xl cursor-pointer hover:bg-gray-700 transition text-center">
              Kannada
            </div>
          </Link> */}
        </div>
      </div>

      <Footer />  {/* Already present */}
    </>
  );
}
