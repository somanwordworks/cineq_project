import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Header() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formatted = now.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setCurrentTime(formatted);
    };

    updateClock(); // Initialize immediately
    const timer = setInterval(updateClock, 1000); // Update every second
    return () => clearInterval(timer); // Cleanup
  }, []);

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md w-full">
      {/* Logo */}
      <div className="flex items-center">
        <Image
          src="/cineq_logo.png" // Make sure logo is inside public/ as logo.png
          alt="CINEQ Logo"
          width={160}
          height={50}
          priority
        />
      </div>

      {/* Clock */}
      <div className="text-green-600 text-sm md:text-base font-mono tracking-wide">
        {currentTime}
      </div>
    </header>
  );
}
