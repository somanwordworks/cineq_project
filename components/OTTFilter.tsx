"use client";

type OTT =
  | "all"
  | "netflix"
  | "prime"
  | "hotstar"
  | "jiocinema"
  | "zee5"
  | "aha";

type Props = {
  value: OTT;
  onChange: (ott: OTT) => void;
};

const OTTS: { key: OTT; label: string }[] = [
  { key: "all", label: "All" },
  { key: "netflix", label: "Netflix" },
  { key: "prime", label: "Amazon Prime" },
  { key: "hotstar", label: "Disney+ Hotstar" },
  { key: "jiocinema", label: "JioCinema" },
  { key: "zee5", label: "ZEE5" },
  { key: "aha", label: "Aha" },
];

export default function OTTFilter({ value, onChange }: Props) {
  return (
    <div className="mt-6">
      <div className="text-sm font-semibold text-gray-600 mb-2">
        OTT Platforms
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {OTTS.map((ott) => {
          const active = value === ott.key;

          return (
            <button
              key={ott.key}
              onClick={() => onChange(ott.key)}
              className={`px-5 py-2 rounded-full border text-sm font-medium transition
                ${
                  active
                    ? "bg-red-600 text-white border-red-600 shadow"
                    : "bg-white text-gray-700 border-gray-300 hover:border-red-400 hover:text-red-600"
                }`}
            >
              {ott.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
