import Image from 'next/image';

export default function Header() {
    return (
        <header className="flex justify-between items-center p-4 bg-white shadow-md w-full">
            {/* Logo */}
            <div className="flex items-center">
                <Image
                    src="/cineq_logo.png" // Make sure logo is inside public/
                    alt="CINEQ Logo"
                    width={160}
                    height={50}
                    priority
                />
            </div>
        </header>
    );
}
