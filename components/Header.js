import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="shadow-md py-4">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <Link href="/">
          <Image
            src="/03c7e4b9-d677-4bae-9032-1fcb8db702ec.png"
            alt="CINEQ Logo"
            width={120}
            height={50}
            className="cursor-pointer"
          />
        </Link>
        {/* Empty space for future nav or ads if needed */}
        <div></div>
      </div>
    </header>
  );
}
