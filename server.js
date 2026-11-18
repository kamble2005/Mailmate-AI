
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

let emailsCollection;

// MongoDB Connection
async function startServer() {
  try {
    if (!MONGODB_URI) {
      throw new Error("MongoDB URI is missing");
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db("mailmateAI");
    emailsCollection = db.collection("emails");

    console.log("MongoDB Connected Successfully!");

    // Add sample emails only once
    const count = await emailsCollection.countDocuments();

    if (count === 0) {
      await emailsCollection.insertMany([
        {
          id: 1,
          name: "Google",
          subject: "Welcome to Google",
          category: "Important",
          priority: "High",
          replyStatus: "No Reply Needed",
          read: false
        },
        {
          id: 2,
          name: "College",
          subject: "Assignment Submission",
          category: "Work",
          priority: "Medium",
          replyStatus: "Needs Reply",
          read: false
        }
      ]);
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server Error:", error.message);
  }
}

// Home
app.get("/", (req, res) => {
  res.send("MailMate AI Backend is Running!");
});

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "MailMate AI Backend Connected Successfully"
  });
});

// Get Emails
app.get("/api/emails", async (req, res) => {
  try {
    const emails = await emailsCollection
      .find({})
      .sort({ id: 1 })
      .toArray();

    res.json({
      success: true,
      emails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update Email
app.put("/api/emails/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await emailsCollection.updateOne(
      { id },
      { $set: req.body }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Email not found"
      });
    }

    const email = await emailsCollection.findOne({ id });

    res.json({
      success: true,
      email
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// AI Email Reply
app.post("/api/generate-reply", async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        error: "Subject and message are required"
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "Gemini API Key is missing"
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Write a professional email reply.

Subject: ${subject}
Email: ${message}

Generate only the reply.`
            }]
          }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Gemini API failed");
    }

    res.json({
      success: true,
      reply: data.candidates[0].content.parts[0].text
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

startServer();
