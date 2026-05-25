"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      const res = await axios.get("http://localhost:4000/live");
      setMatches(res.data);
      setLoading(false);
    } catch (err) {
      console.log("Error fetching matches");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();

    // auto refresh every 10 seconds (LIVE FEEL)
    const interval = setInterval(fetchMatches, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">⚽ 4AMSCORE LIVE</h1>

      {loading ? (
        <p>Loading matches...</p>
      ) : matches.length === 0 ? (
        <p>No live matches right now</p>
      ) : (
        <div className="grid gap-4">
          {matches.map((m) => (
            <div
              key={m.id}
              className="bg-gray-900 p-4 rounded-xl border border-gray-700"
            >
              <div className="text-sm text-gray-400">
                {m.league} • {m.country}
              </div>

              <div className="text-lg font-bold mt-2">
                {m.homeTeam} {m.homeGoals} - {m.awayGoals} {m.awayTeam}
              </div>

              <div className="text-sm mt-1 text-green-400">
                {m.status} {m.elapsed ? `• ${m.elapsed}'` : ""}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}