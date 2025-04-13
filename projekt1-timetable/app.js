import express from "express";
import cors from "cors";
import { initializeDatabase, dbAll, dbGet, dbRun, resetIds } from "./util/database.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.json());

app.get("/timetable", async (req, res) => {
  const timetable = await dbAll("SELECT * FROM timetable");
  res.status(200).json(timetable);
});

app.get("/timetable/:id", async (req, res) => {
  const id = req.params.id;
  const timetable = await dbGet("SELECT * FROM timetable WHERE id = ?;", [id]);
  if (!timetable) {
    return res.status(404).json({ message: "timetable not found" });
  }
  res.status(200).json(timetable);
});

app.post("/timetable", async (req, res) => {
  const { date, hour, subject } = req.body;
  if (!date || !hour || !subject) {
    return res.status(400).send("date, hour and subject are required");
  }
  const result = await dbRun(
    "INSERT INTO timetable (date, hour, subject) VALUES (?, ?, ?)",
    [date, hour, subject]
  );
  res.status(201).json({ id: result.lastID, date, hour, subject });
});

app.put("/timetable/:id", async (req, res) => {
    const id = req.params.id;
    const { date, hour, subject } = req.body;

    if (!date || !hour || !subject) {
        return res.status(400).send("date, hour, and subject are required");
    }

    const result = await dbRun(
        "UPDATE timetable SET date = ?, hour = ?, subject = ? WHERE id = ?",
        [date, hour, subject, id]
    );

    if (result.changes === 0) {
        return res.status(404).send("Timetable entry not found");
    }

    res.status(200).send("Timetable entry updated successfully");
});

app.delete("/timetable/:id", async (req, res) => {
    const id = req.params.id;
    const timetable = await dbGet("SELECT * FROM timetable WHERE id = ?", [id]);
    if (!timetable) {
        return res.status(404).json({ message: "Timetable entry not found" });
    }

    await dbRun("DELETE FROM timetable WHERE id = ?", [id]); // Delete the specific row

    try {
        await resetIds(); // Reset the IDs
    } catch (error) {
        console.error("Error resetting IDs:", error);
        return res.status(500).json({ message: "Failed to reset IDs" });
    }

    res.status(200).send("Timetable entry deleted and IDs reset");
});

// app.use((err, req, res, next) => {
//     res.status(500).json({ message: `Error: ${err.message}` });
//   });

async function startServer() {
  await initializeDatabase();
  app.listen(3000, () => {
    console.log("Server runs on port 3000");
  });
}
startServer();
