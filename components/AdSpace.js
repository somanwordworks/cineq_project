import Image from "next/image";

export default function AdSpace({ src, alt = "Advertisement", width, height, className }) {
  return (
    <div
      className={`flex justify-center items-center bg-gray-100 rounded-lg shadow-sm overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <Image
        src={src || "/ads/default-banner.jpg"}
        alt={alt}
        width={width}
        height={height}
        className="object-cover"
      />
    </div>
  );
}
