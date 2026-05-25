"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [matches, setMatches] = useState([]);

  const fetchMatches = async () => {
    try {
      const res = await axios.get(
        "https://YOUR-BACKEND.onrender.com/live"
      );
      setMatches(res.data);
    } catch (err) {
      console.log("Error loading matches");
    }
  };

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20, background: "#111", color: "#fff", minHeight: "100vh" }}>
      <h1>⚽ 4AMSCORE LIVE</h1>

      {matches.length === 0 ? (
        <p>No live matches</p>
      ) : (
        matches.map((m) => (
          <div key={m.id} style={{ margin: 10, padding: 10, background: "#222", borderRadius: 8 }}>
            <h3>{m.homeTeam} {m.homeGoals} - {m.awayGoals} {m.awayTeam}</h3>
            <p>{m.league} • {m.status} {m.elapsed ? `(${m.elapsed}')` : ""}</p>
          </div>
        ))
      )}
    </div>
  );
}