const express = require("express");
const axios = require("axios");
const app = express();

const API_URL = "https://api.jolpica.com/ergast/f1/current.json";

app.get("/f1", async (req, res) => {
  try {
    const { data } = await axios.get(API_URL, { timeout: 15000 });

    const races = data.MRData.RaceTable.Races;
    const now = new Date();
    let next = null;

    for (const r of races) {
      const d = new Date(r.date + "T" + (r.time || "00:00:00Z"));
      if (d > now) {
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

// PORT 선언은 여기 단 한 번
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("F1 proxy running on " + PORT));
