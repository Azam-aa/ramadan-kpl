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

    // Visitor counter (production safe)
    fetch("https://api.countapi.xyz/hit/azam-koppal-ramadan-2026/visits")
      .then((res) => res.json())
      .then((data) => setVisits(data.value))
      .catch(() => setVisits("..."));
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
      const sehriTime = new Date(now);
      sehriTime.setHours(sehriH, sehriM, 0);

      if (now > sehriTime) {
        sehriTime.setDate(sehriTime.getDate() + 1);
      }

      const diff = sehriTime - now;

      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });

      const [iftarH, iftarM] = todayData.iftar.split(":");
      const iftarTime = new Date(now);
      iftarTime.setHours(iftarH, iftarM, 0);

      const total = sehriTime - iftarTime;
      const passed = now - iftarTime;

      if (passed > 0 && total > 0) {
        setProgress(Math.min((passed / total) * 100, 100));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [todayData]);

  const visibleData = showFull ? ramadanData : ramadanData.slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-900 text-white px-4">

      {/* HEADER */}
      <div className="text-center py-12">
        <h1 className="text-3xl md:text-5xl font-bold">
          🌙 Today Sehri & Iftar Time Koppal
        </h1>
        <p className="mt-2 text-green-300">{today}</p>
      </div>

      {/* CARDS */}
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

          {/* COUNTDOWN */}
          <div className="mt-12 max-w-5xl mx-auto bg-green-900/30 p-8 rounded-2xl text-center shadow-2xl">
            <h2 className="text-2xl mb-6">⏳ Sehri Remaining Time</h2>

            <div className="flex justify-center gap-6 text-4xl font-bold">
              <div>{timeLeft.hours || "00"}h</div>
              <div>{timeLeft.minutes || "00"}m</div>
              <div>{timeLeft.seconds || "00"}s</div>
            </div>

            <div className="mt-6 w-full bg-green-950 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <p className="mt-3 text-green-400">
              {progress.toFixed(0)}% remaining until Sehri
            </p>
          </div>
        </>
      )}

      {/* DUAS */}
      <div className="mt-16 text-center max-w-4xl mx-auto">
        <h2 className="text-2xl mb-4">🤲 Roza Ki Niyyat</h2>
        <p className="text-green-300">
          Navaitu An Asoomu Gadan Yauma Lillahi Taala Min Farzil Ramzaan
        </p>
      </div>

      <div className="mt-12 text-center max-w-4xl mx-auto">
        <h2 className="text-2xl mb-4">🌙 Iftaar Ki Dua</h2>
        <p className="text-green-300">
          Allahumma inni Lakaa Sumtu Va Bika Aamantu Va Alaika Tavakkaltu
          Va Alaa Rizqi-ka Aftartu Fataqabbal Minni
        </p>
      </div>

      {/* CALENDAR */}
      <div className="mt-20 max-w-5xl mx-auto">
        <h2 className="text-3xl text-center mb-6 font-semibold">
          📅 Koppal Ramadan Calendar 2026
        </h2>

        <div className="overflow-x-auto rounded-2xl shadow-lg">
          <table className="w-full text-center border border-green-800">
            <thead className="bg-green-800/50 text-green-200">
              <tr>
                <th className="py-3">Roza</th>
                <th>Date</th>
                <th>Sehri</th>
                <th>Iftar</th>
              </tr>
            </thead>

            <tbody>
              {visibleData.map((day) => (
                <tr
                  key={day.roza}
                  className={`border-t border-green-800 ${
                    day.date === today
                      ? "bg-green-600 text-white font-bold"
                      : "hover:bg-green-800/30"
                  }`}
                >
                  <td className="py-3">{day.roza}</td>
                  <td>{day.date}</td>
                  <td>{format12Hour(day.sehri)}</td>
                  <td>{format12Hour(day.iftar)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!showFull && (
          <div className="text-center mt-6">
            <button
              onClick={() => setShowFull(true)}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-xl"
            >
              View Full Calendar
            </button>
          </div>
        )}
      </div>

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