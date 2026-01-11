const express = require("express");
const axios = require("axios");
const app = express();

app.get("/f1", async (req, res) => {
  try {
    const { data } = await axios.get("https://ergast.com/api/f1/current.json");

    const races = data.MRData.RaceTable.Races;
    const now = new Date();
    let next = null;

    for (const r of races) {
      const d = new Date(r.date + "T" + r.time);
      if (d > now) {
        next = r;
        break;
      }
    }

    if (!next) return res.json({ error: "no_race" });

    res.json(next);
  } catch (e) {
    res.json({ error: "api_error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("F1 proxy running"));
