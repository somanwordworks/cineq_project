import { useEffect, useState } from "react";
import { starBirthdays } from "../data/birthdays";

const BirthdayBanner = () => {
    const [todayBirthdays, setTodayBirthdays] = useState([]);
    const [todayKey, setTodayKey] = useState("");

    useEffect(() => {
        const todayIST = new Date().toLocaleDateString("en-CA", {
            timeZone: "Asia/Kolkata",
        }); // YYYY-MM-DD
        const key = todayIST.slice(5); // MM-DD
        setTodayKey(key);

        const matches = starBirthdays.filter(
            (star) => star.dob && star.dob.slice(5) === key
        );

        setTodayBirthdays(matches);
        console.log("Today:", key, "Matches:", matches);
    }, []);

    if (todayBirthdays.length === 0) {
        return <span>🌟 DATA RHINO - The News-Rhino of Tech. 🌟 Rhino Academy 🌟 Insights Group (Insightsgroup.io) </span>;
    }

    return (
        <>
            {todayBirthdays.map((star, idx) => (
                <span key={idx} className="mx-4">
                    🎂 Happy Birthday {star.name}!
                </span>
            ))}
        </>
    );
};

export default BirthdayBanner;
