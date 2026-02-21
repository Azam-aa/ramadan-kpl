import { useEffect, useState } from "react";

export default function App() {
  const [todayData, setTodayData] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const [progress, setProgress] = useState(0);
  const [today, setToday] = useState("");
  const [visits, setVisits] = useState(0);
  const [visibleCount, setVisibleCount] = useState(10);

  const API_KEY = "ut_znOnVNVrZIssedHgZo4WyDTA0mSZk9PUkbYeoLJY";
  const WORKSPACE = "yourworkspace";

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
    { roza: 11, date: "2026-03-01", sehri: "05:27", iftar: "18:37" },
{ roza: 12, date: "2026-03-02", sehri: "05:25", iftar: "18:37" },
{ roza: 13, date: "2026-03-03", sehri: "05:25", iftar: "18:37" },
{ roza: 14, date: "2026-03-04", sehri: "05:24", iftar: "18:38" },
{ roza: 15, date: "2026-03-05", sehri: "05:24", iftar: "18:39" },
{ roza: 16, date: "2026-03-06", sehri: "05:23", iftar: "18:39" },
{ roza: 17, date: "2026-03-07", sehri: "05:22", iftar: "18:39" },
{ roza: 18, date: "2026-03-08", sehri: "05:22", iftar: "18:39" },
{ roza: 19, date: "2026-03-09", sehri: "05:21", iftar: "18:39" },
{ roza: 20, date: "2026-03-10", sehri: "05:20", iftar: "18:39" },
{ roza: 21, date: "2026-03-11", sehri: "05:19", iftar: "18:39" },
{ roza: 22, date: "2026-03-12", sehri: "05:19", iftar: "18:40" },
{ roza: 23, date: "2026-03-13", sehri: "05:18", iftar: "18:40" },
{ roza: 24, date: "2026-03-14", sehri: "05:17", iftar: "18:40" },
{ roza: 25, date: "2026-03-15", sehri: "05:16", iftar: "18:40" },
{ roza: 26, date: "2026-03-16", sehri: "05:16", iftar: "18:41" },
{ roza: 27, date: "2026-03-17", sehri: "05:15", iftar: "18:41" },
{ roza: 28, date: "2026-03-18", sehri: "05:14", iftar: "18:41" },
{ roza: 29, date: "2026-03-19", sehri: "05:14", iftar: "18:41" },
{ roza: 30, date: "2026-03-20", sehri: "05:14", iftar: "18:42" },
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

    // CounterAPI V2 Secure
    fetch(`https://api.counterapi.dev/v2/${WORKSPACE}/ramadan-visits/up`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setVisits(data.value))
      .catch(() => setVisits(0));
  }, []);

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

      const diff = iftarTime - now;

      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-900 text-white px-4">

      <div className="text-center py-12">
        <h1 className="text-4xl font-bold">
          🌙 Ramadan Sehri & Iftar - Koppal
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

          <div className="mt-12 max-w-5xl mx-auto bg-green-900/30 p-8 rounded-3xl text-center shadow-2xl">
            <h2 className="text-2xl mb-6">⏳ Iftar Remaining Time</h2>

            <div className="flex justify-center gap-6 text-4xl font-bold text-green-400">
              <div>{timeLeft.hours || "00"}h</div>
              <div>{timeLeft.minutes || "00"}m</div>
              <div>{timeLeft.seconds || "00"}s</div>
            </div>

            <div className="flex justify-between mt-6 text-sm text-green-300">
              <span>☀ {format12Hour(todayData.sehri)}</span>
              <span>🌙 {format12Hour(todayData.iftar)}</span>
            </div>

            <div className="w-full bg-green-950 rounded-full h-4 mt-2">
              <div
                className="bg-green-500 h-4 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <p className="mt-3 text-green-400">
              {progress.toFixed(0)}% fasting completed
            </p>
          </div>
        </>
      )}

      {/* DUAS */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl mb-4">🤲 Roza Ki Niyyat</h2>
        <p className="text-green-300">
          Navaitu An Asoomu Gadan Yauma Lillahi Taala Min Farzil Ramzaan
        </p>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl mb-4">🌙 Iftaar Ki Dua</h2>
        <p className="text-green-300">
          Allahumma inni Lakaa Sumtu Va Bika Aamantu Va Alaika Tavakkaltu
          Va Alaa Rizqi-ka Aftartu Fataqabbal Minni
        </p>
      </div>

      {/* CALENDAR */}
<div className="mt-24 max-w-5xl mx-auto">
  <h2 className="text-3xl text-center mb-8 font-bold tracking-wide">
    📅 Koppal Ramadan Calendar 2026
  </h2>

  <div className="bg-green-900/30 backdrop-blur-lg border border-green-800/50 rounded-3xl shadow-2xl overflow-hidden">

    <div className="grid grid-cols-4 bg-green-800/40 text-green-200 font-semibold text-sm md:text-base py-4 px-4">
      <div>Roza</div>
      <div>Date</div>
      <div>Sehri</div>
      <div>Iftar</div>
    </div>

    {ramadanData.slice(0, visibleCount).map((day) => (
      <div
        key={day.roza}
        className={`grid grid-cols-4 px-4 py-4 text-sm md:text-base border-t border-green-800/30 transition-all duration-300
        ${
          day.date === today
            ? "bg-green-600 text-white font-bold"
            : "hover:bg-green-800/30"
        }`}
      >
        <div>{day.roza}</div>
        <div>{day.date}</div>
        <div>{format12Hour(day.sehri)}</div>
        <div>{format12Hour(day.iftar)}</div>
      </div>
    ))}
  </div>

  {/* LOAD MORE BUTTON */}
  {visibleCount < ramadanData.length && (
    <div className="text-center mt-8">
      <button
        onClick={() => setVisibleCount((prev) => prev + 10)}
        className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
      >
        View More
      </button>
    </div>
  )}
</div>

      <footer className="mt-20 text-center py-12 bg-black/60">
        <p className="text-green-400 text-lg">
          👥 Visitors: {visits}
        </p>

        <p className="mt-4">📧 azamp442@gmail.com</p>

        <a
          href="https://github.com/Azam-aa"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-400 block mt-2"
        >
          🔗 GitHub: Azam-aa
        </a>
      </footer>
    </div>
  );
}