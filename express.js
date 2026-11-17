
const express = require("express");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

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
