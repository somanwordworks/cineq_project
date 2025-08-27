import { useEffect, useState } from "react";
import { starBirthdays } from "../data/birthdays";

const BirthdayBanner = () => {
  const [todayBirthdays, setTodayBirthdays] = useState([]);

  useEffect(() => {
    const todayIST = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    }); // YYYY-MM-DD
    const todayKey = todayIST.slice(5); // MM-DD

    const matches = starBirthdays.filter((star) => star.dob === todayKey);
    setTodayBirthdays(matches);
  }, []);

  if (todayBirthdays.length === 0) {
    return (
      <div className="bg-yellow-50 text-center py-2 text-gray-700 text-sm">
        🌟 DATA TALKIES - Your Daily Dose of Cloud, AI, and Data News !
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 text-center py-2 text-gray-700 text-sm whitespace-nowrap overflow-hidden">
      <marquee>
        {todayBirthdays.map((star, idx) => (
          <span key={idx} className="mx-4">
            🎂 Happy Birthday {star.name}!
          </span>
        ))}
      </marquee>
    </div>
  );
};

export default BirthdayBanner;
