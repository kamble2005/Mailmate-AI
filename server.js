
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("MailMate AI Backend is Running!");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "MailMate AI Backend Connected Successfully"
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
