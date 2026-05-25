"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Match = {
  id: number;
  league: string;
  country: string;
  homeTeam: string;
  awayTeam: string;
  homeGoals: number;
  awayGoals: number;
  status: string;
  elapsed: number | null;
};

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://YOUR-BACKEND-URL.onrender.com/live";

  const fetchMatches = async () => {
    try {
      const res = await axios.get(API_URL);
      setMatches(res.data);
    } catch (err) {
      console.log("Failed to fetch matches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();

    const interval = setInterval(() => {
      fetchMatches();
    }, 10000); // refresh every 10s

    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{ background: "#0f0f0f", color: "white", minHeight: "100vh", padding: 20 }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>⚽ 4AMSCORE LIVE</h1>

      {loading ? (
        <p>Loading live matches...</p>
      ) : matches.length === 0 ? (
        <p>No live matches right now</p>
      ) : (
        matches.map((m) => (
          <div
            key={m.id}
            style={{
              background: "#1c1c1c",
              padding: 12,
              marginBottom: 10,
              borderRadius: 8,
            }}
          >
            <h3>
              {m.homeTeam} {m.homeGoals} - {m.awayGoals} {m.awayTeam}
            </h3>

            <p style={{ opacity: 0.7 }}>
              {m.league} • {m.country}
            </p>

            <p style={{ color: "#00ff88" }}>
              {m.status} {m.elapsed ? `${m.elapsed}'` : ""}
            </p>
          </div>
        ))
      )}
    </main>
  );
}