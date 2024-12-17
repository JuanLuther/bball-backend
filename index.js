import express from "express";
import cors from "cors";
import { CourtModel } from "./models/CourtModel.js";

const app = express();
app.use(cors());

app.get("/api/courts", (req, res) => {
  try {
    const courtModel = new CourtModel();
    const courts = courtModel.findAll();
    res.json(courts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching courts");
  }
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello, World" }); // Respond with JSON
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
