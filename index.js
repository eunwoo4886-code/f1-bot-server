const express = require("express");
const axios = require("axios");
const app = express();

// F1 일정 JSON (공개, CORS/차단 문제 없음)
const DATA_URL =
  "https://raw.githubusercontent.com/sportstimes/f1/main/_db/f1.json";

app.get("/f1", async (req, res) => {
  try {
    const { data } = await axios.get(DATA_URL, { timeout: 15000 });

    const races = data.races;
    const now = new Date();
    let next = null;

    for (const r of races) {
      const raceDate = new Date(r.sessions.race);
      if (raceDate > now) {
        next = r;
        break;
      }
    }

    if (!next) return res.json({ error: "no_race" });

    res.json(next);
  } catch (e) {
    res.json({ error: "api_error", msg: String(e) });
  }
});

app.get("/", (req, res) => {
  res.send("F1 Bot Server is running. Use /f1");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("F1 proxy running"));
