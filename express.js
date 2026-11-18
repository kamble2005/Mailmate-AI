
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to MailMate AI Backend!");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "MailMate AI Backend is Running!"
  });
});

app.get("/api/emails", (req, res) => {
  res.json({
    success: true,
    emails: [
      {
        id: 1,
        name: "Google",
        subject: "Welcome to Google",
        category: "Important"
      },
      {
        id: 2,
        name: "College",
        subject: "Assignment Submission",
        category: "Work"
      }
    ]
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`MailMate AI Server running on port ${PORT}`);
});
