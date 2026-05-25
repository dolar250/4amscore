const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 4000;

/**
 * ✅ HEALTH CHECK
 */
app.get("/", (req, res) => {
  res.json({
    status: "4AMSCORE backend running",
  });
});

/**
 * ⚽ LIVE MATCHES (REALISTIC + STABLE)
 */
app.get("/live", async (req, res) => {
  try {
    const response = await axios.get(
      "https://v3.football.api-sports.io/fixtures?live=all",
      {
        headers: {
          "x-apisports-key": process.env.API_KEY,
        },
        timeout: 10000,
      }
    );

    const matches = response.data.response || [];

    // ONLY SAFE VALIDATION (NOT FILTERING LEAGUES)
    const clean = matches
      .filter((m) => {
        return (
          m?.fixture &&
          m?.league &&
          m?.teams &&
          m?.goals &&
          m?.fixture?.status?.short
        );
      })
      .map((m) => ({
        id: m.fixture.id,
        league: m.league.name,
        country: m.league.country,
        homeTeam: m.teams.home.name,
        awayTeam: m.teams.away.name,
        homeGoals: m.goals.home,
        awayGoals: m.goals.away,
        status: m.fixture.status.short,
        elapsed: m.fixture.status.elapsed,
      }));

    return res.json(clean.slice(0, 20));
  } catch (err) {
    console.log("API ERROR:", err.message);

    return res.json({
      error: "API failed",
    });
  }
});

/**
 * 🚀 START SERVER
 */
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});