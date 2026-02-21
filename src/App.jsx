import { useEffect, useState } from "react";

export default function App() {
  const [todayData, setTodayData] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const [progress, setProgress] = useState(0);
  const [today, setToday] = useState("");
  const [showFull, setShowFull] = useState(false);
  const [visits, setVisits] = useState(0);

  const ramadanData = [
    { roza: 1, date: "2026-02-19", sehri: "05:33", iftar: "18:34" },
    { roza: 2, date: "2026-02-20", sehri: "05:32", iftar: "18:34" },
    { roza: 3, date: "2026-02-21", sehri: "05:32", iftar: "18:35" },
    { roza: 4, date: "2026-02-22", sehri: "05:32", iftar: "18:35" },
    { roza: 5, date: "2026-02-23", sehri: "05:31", iftar: "18:36" },
    { roza: 6, date: "2026-02-24", sehri: "05:31", iftar: "18:36" },
    { roza: 7, date: "2026-02-25", sehri: "05:29", iftar: "18:36" },
    { roza: 8, date: "2026-02-26", sehri: "05:29", iftar: "18:36" },
    { roza: 9, date: "2026-02-27", sehri: "05:28", iftar: "18:37" },
    { roza: 10, date: "2026-02-28", sehri: "05:28", iftar: "18:37" },
  ];

  const format12Hour = (time24) => {
    const [h, m] = time24.split(":");
    const date = new Date();
    date.setHours(h, m);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    const indiaDate = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    setToday(indiaDate);
    const found = ramadanData.find((d) => d.date === indiaDate);
    setTodayData(found);

    // ✅ FIXED Visitor Counter (Works on Vercel)
    fetch("https://api.countapi.xyz/hit/azam-koppal-ramadan-vercel/visits")
      .then((res) => res.json())
      .then((data) => setVisits(data.value))
      .catch(() => setVisits(0));
  }, []);

  // ✅ IFTAR Remaining Countdown (Fixed)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!todayData) return;

      const now = new Date(
        new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        })
      );

      const [sehriH, sehriM] = todayData.sehri.split(":");
      const [iftarH, iftarM] = todayData.iftar.split(":");

      const sehriTime = new Date(now);
      sehriTime.setHours(sehriH, sehriM, 0);

      const iftarTime = new Date(now);
      iftarTime.setHours(iftarH, iftarM, 0);

      // 🔥 IFTAR Remaining Time
      const diff = iftarTime - now;

      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }

      // 🔥 Fasting Progress (Sehri → Iftar)
      const totalFast = iftarTime - sehriTime;
      const passed = now - sehriTime;

      if (passed > 0 && totalFast > 0) {
        setProgress(Math.min((passed / totalFast) * 100, 100));
      } else {
        setProgress(0);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [todayData]);

  const visibleData = showFull ? ramadanData : ramadanData.slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-900 text-white px-4">

      <div className="text-center py-12">
        <h1 className="text-3xl md:text-5xl font-bold">
          🌙 Today Sehri & Iftar Time Koppal
        </h1>
        <p className="mt-2 text-green-300">{today}</p>
      </div>

      {todayData && (
        <>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-green-900/40 p-8 rounded-2xl text-center shadow-xl">
              <h2 className="text-green-400 mb-3">SEHRI TIME</h2>
              <p className="text-4xl font-bold">
                {format12Hour(todayData.sehri)}
              </p>
            </div>

            <div className="bg-green-900/40 p-8 rounded-2xl text-center shadow-xl">
              <h2 className="text-green-400 mb-3">IFTAR TIME</h2>
              <p className="text-4xl font-bold">
                {format12Hour(todayData.iftar)}
              </p>
            </div>
          </div>

          {/* 🔥 IFTAR REMAINING SECTION */}
          <div className="mt-12 max-w-5xl mx-auto bg-green-900/30 p-8 rounded-3xl text-center shadow-2xl">
            <h2 className="text-2xl mb-6">⏳ Iftar Remaining Time</h2>

            <div className="flex justify-center gap-6 text-4xl font-bold text-green-400">
              <div>{timeLeft.hours?.toString().padStart(2, "0") || "00"}h</div>
              <div>{timeLeft.minutes?.toString().padStart(2, "0") || "00"}m</div>
              <div>{timeLeft.seconds?.toString().padStart(2, "0") || "00"}s</div>
            </div>

            <div className="flex justify-between mt-6 text-sm text-green-300">
              <span>☀ {format12Hour(todayData.sehri)}</span>
              <span>🌙 {format12Hour(todayData.iftar)}</span>
            </div>

            <div className="w-full bg-green-950 rounded-full h-4 mt-2">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <p className="mt-3 text-green-400">
              {progress.toFixed(0)}% fasting completed
            </p>
          </div>
        </>
      )}

      {/* FOOTER */}
      <footer className="mt-20 text-center py-12 bg-black/60 rounded-t-3xl">
        <p className="text-green-400 text-lg font-semibold">
          👥 Visitors: {visits}
        </p>

        <p className="mt-4 text-gray-300">
          📧 azamp442@gmail.com
        </p>

        <a
          href="https://github.com/Azam-aa"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-400 hover:text-green-500 block mt-2 transition"
        >
          🔗 GitHub: Azam-aa
        </a>

        <p className="mt-6 text-gray-500 text-sm">
          © 2026 Ramadan Koppal • Made with by Azam
        </p>
      </footer>
    </div>
  );
}