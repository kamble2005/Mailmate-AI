
import { useState, useEffect } from "react";

const API_URL = "https://mailmate-ai-2.onrender.com";

function App() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestedReplies, setSuggestedReplies] = useState({});

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [showCompose, setShowCompose] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [drafts, setDrafts] = useState([]);

  const categories = [
    "All",
    "Important",
    "Work",
    "Promotions",
    "Personal"
  ];

  // Fetch Emails
  useEffect(() => {
    fetch(`${API_URL}/api/emails`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setEmails(data.emails);
        }
      })
      .catch((error) => {
        console.log("Backend Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Dashboard Calculations
  const totalEmails = emails.length;

  const pendingReplies = emails.filter(
    (email) => email.replyStatus === "Needs Reply"
  ).length;

  const highPriorityEmails = emails.filter(
    (email) => email.priority === "High"
  ).length;

  const assistantTasks = emails.filter(
    (email) =>
      email.replyStatus === "Needs Reply" ||
      email.priority === "High"
  ).length;

  // Search and Filters
  const filteredEmails = emails.filter((email) => {
    const matchesSearch =
      (email.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (email.subject || "").toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || email.category === category;

    const matchesPriority =
      priorityFilter === "All" ||
      email.priority === priorityFilter;

    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Save Draft
  function saveDraft() {
    if (!to || !subject || !message) {
      alert("Please fill all fields!");
      return;
    }

    setDrafts((previous) => [
      ...previous,
      { to, subject, message }
    ]);

    alert("Draft saved successfully!");

    setTo("");
    setSubject("");
    setMessage("");
    setShowCompose(false);
  }

  // Send Email (Demo)
  function sendEmail() {
    if (!to || !subject || !message) {
      alert("Please fill all fields!");
      return;
    }

    alert("Email sent successfully! (Demo only)");

    setTo("");
    setSubject("");
    setMessage("");
    setShowCompose(false);
  }

  // Update Reply Status
  function updateReplyStatus(index, newStatus) {
    setEmails((previous) =>
      previous.map((email, i) =>
        i === index
          ? { ...email, replyStatus: newStatus }
          : email
      )
    );
  }

  // Update Priority
  async function updatePriority(index, newPriority) {
  const email = emails[index];

  setEmails((previous) =>
    previous.map((item, i) =>
      i === index
        ? { ...item, priority: newPriority }
        : item
    )
  );

  try {
    const response = await fetch(
      `${API_URL}/api/emails/${email.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          priority: newPriority
        })
      }
    );

    if (!response.ok) {
      throw new Error("Update failed");
    }

    console.log("Priority saved to backend!");
  } catch (error) {
    console.log("Priority Update Error:", error);
    alert("Backend update failed!");
  }
}

  // Update Category
  function updateCategory(index, newCategory) {
    setEmails((previous) =>
      previous.map((email, i) =>
        i === index
          ? { ...email, category: newCategory }
          : email
      )
    );
  }

  // Toggle Read
  function toggleRead(index) {
    setEmails((previous) =>
      previous.map((email, i) =>
        i === index
          ? { ...email, read: !email.read }
          : email
      )
    );
  }

  // Delete Email
  function deleteEmail(index) {
    setEmails((previous) =>
      previous.filter((email, i) => i !== index)
    );
  }

  // AI Suggested Reply
  function getSuggestedReply(email) {
    const emailSubject = (email.subject || "").toLowerCase();

    if (emailSubject.includes("interview")) {
      return "Thank you for the interview opportunity. I am looking forward to discussing this opportunity with you.";
    }

    if (emailSubject.includes("assignment")) {
      return "Thank you for the update. I will complete the assignment and submit it on time.";
    }

    if (emailSubject.includes("meeting")) {
      return "Thank you for informing me. I confirm my availability for the meeting.";
    }

    if (email.category === "Work") {
      return "Thank you for your email. I have received your message and will get back to you shortly.";
    }

    if (email.category === "Promotions") {
      return "Thank you for sharing this offer. I appreciate the information.";
    }

    if (email.category === "Personal") {
      return "Hello! Thank you for your message. I hope you are doing well.";
    }

    return "Thank you for your email. I appreciate your message and will respond soon.";
  }

  function generateReply(index) {
    setSuggestedReplies((previous) => ({
      ...previous,
      [index]: getSuggestedReply(emails[index])
    }));
  }

  // Smart Auto Classification
  function autoClassifyEmail(index) {
    const email = emails[index];
    const text = (
      (email.name || "") + " " + (email.subject || "")
    ).toLowerCase();

    let newCategory = "Personal";
    let newPriority = "Medium";

    if (text.includes("google") || text.includes("account")) {
      newCategory = "Important";
      newPriority = "High";
    } else if (
      text.includes("assignment") ||
      text.includes("college") ||
      text.includes("meeting")
    ) {
      newCategory = "Work";
      newPriority = "High";
    } else if (
      text.includes("order") ||
      text.includes("offer") ||
      text.includes("sale")
    ) {
      newCategory = "Promotions";
      newPriority = "Low";
    }

    setEmails((previous) =>
      previous.map((item, i) =>
        i === index
          ? {
              ...item,
              category: newCategory,
              priority: newPriority
            }
          : item
      )
    );

    alert("Smart classification completed!");
  }

  return (
    <div style={{
      fontFamily: "Arial",
      padding: "20px",
      background: "#f4f6fb",
      minHeight: "100vh"
    }}>

      <h1 style={{ color: "#4f46e5" }}>
        MailMate AI
      </h1>

      {loading && <h2>Loading Emails...</h2>}

      <h2>Client Dashboard</h2>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        marginBottom: "20px"
      }}>
        <div style={cardStyle}>
          <h3>Total Emails</h3>
          <h2>{totalEmails}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Pending Replies</h3>
          <h2>{pendingReplies}</h2>
        </div>

        <div style={cardStyle}>
          <h3>High Priority</h3>
          <h2>{highPriorityEmails}</h2>
        </div>
      </div>

      <h2>Assistant Dashboard</h2>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        marginBottom: "20px"
      }}>
        <div style={cardStyle}>
          <h3>Emails Needing Reply</h3>
          <h2>{pendingReplies}</h2>
        </div>

        <div style={cardStyle}>
          <h3>High Priority Emails</h3>
          <h2>{highPriorityEmails}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Total Pending Tasks</h3>
          <h2>{assistantTasks}</h2>
        </div>
      </div>

      <h2>Email Inbox</h2>

      <button onClick={() => setShowCompose(!showCompose)}>
        Compose Email
      </button>

      {showCompose && (
        <div style={{
          background: "white",
          padding: "15px",
          marginTop: "15px",
          borderRadius: "10px"
        }}>
          <h3>New Email</h3>

          <input
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />

          <br /><br />

          <input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <br /><br />

          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <br /><br />

          <button onClick={saveDraft}>Save Draft</button>
          <button onClick={sendEmail}>Send Email</button>
        </div>
      )}

      <h3>Search Emails</h3>

      <input
        placeholder="Search emails..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h3>Filter by Priority</h3>

      {["All", "High", "Medium", "Low"].map((item) => (
        <button
          key={item}
          onClick={() => setPriorityFilter(item)}
          style={{
            padding: "10px",
            margin: "4px",
            background: priorityFilter === item ? "#4f46e5" : "white",
            color: priorityFilter === item ? "white" : "black",
            border: "none",
            borderRadius: "8px"
          }}
        >
          {item}
        </button>
      ))}

      <h3>Email Categories</h3>

      {categories.map((item) => (
        <button
          key={item}
          onClick={() => setCategory(item)}
          style={{
            padding: "10px",
            margin: "4px",
            background: category === item ? "#4f46e5" : "white",
            color: category === item ? "white" : "black",
            border: "none",
            borderRadius: "8px"
          }}
        >
          {item}
        </button>
      ))}

      <h3>Saved Drafts ({drafts.length})</h3>

      {drafts.map((draft, index) => (
        <div key={index} style={cardStyle}>
          <h4>{draft.to}</h4>
          <p>{draft.subject}</p>
          <p>{draft.message}</p>

          <button onClick={() => {
            setDrafts((previous) =>
              previous.filter((_, i) => i !== index)
            );
          }}>
            Delete Draft
          </button>
        </div>
      ))}

      <h3>Emails</h3>

      {filteredEmails.map((email) => {
        const originalIndex = emails.indexOf(email);

        return (
          <div key={email.id || email.name + originalIndex}
            style={cardStyle}>

            <h3>{email.name}</h3>
            <p>{email.subject}</p>

            <button
              onClick={() => generateReply(originalIndex)}
              style={purpleButton}
            >
              ✨ Generate AI Reply
            </button>

            {suggestedReplies[originalIndex] && (
              <div>
                <p><b>AI Reply:</b></p>
                <p>{suggestedReplies[originalIndex]}</p>
              </div>
            )}

            <button
              onClick={() => autoClassifyEmail(originalIndex)}
              style={purpleButton}
            >
              ✨ Auto Classify
            </button>

            <p>Current Category: {email.category}</p>

            <select
              value={email.category || "Personal"}
              onChange={(e) =>
                updateCategory(originalIndex, e.target.value)
              }
            >
              {categories.filter((item) => item !== "All").map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <p>AI Reply Status: {email.replyStatus}</p>

            <select
              value={email.replyStatus || "Needs Reply"}
              onChange={(e) =>
                updateReplyStatus(originalIndex, e.target.value)
              }
            >
              <option value="Needs Reply">Needs Reply</option>
              <option value="No Reply Needed">No Reply Needed</option>
            </select>

            <p>
              Email Priority:{" "}
              <b style={{
                color:
                  email.priority === "High" ? "red" :
                  email.priority === "Medium" ? "#d97706" :
                  "green"
              }}>
                {email.priority}
              </b>
            </p>

            <select
              value={email.priority || "Medium"}
              onChange={(e) =>
                updatePriority(originalIndex, e.target.value)
              }
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            <button onClick={() => alert(getSuggestedReply(email))}>
              Suggest Reply
            </button>

            <p>Status: {email.read ? "Read" : "Unread"}</p>

            <button onClick={() => toggleRead(originalIndex)}>
              Mark as {email.read ? "Unread" : "Read"}
            </button>

            <button
              onClick={() => deleteEmail(originalIndex)}
              style={{
                background: "red",
                color: "white",
                padding: "10px",
                border: "none",
                borderRadius: "8px"
              }}
            >
              Delete Email
            </button>

          </div>
        );
      })}

      {filteredEmails.length === 0 && !loading && (
        <p>No emails found!</p>
      )}

    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "15px",
  marginTop: "15px",
  borderRadius: "10px",
  flex: "1",
  minWidth: "120px"
};

const purpleButton = {
  background: "#7c3aed",
  color: "white",
  padding: "10px",
  border: "none",
  borderRadius: "8px",
  margin: "5px"
};

export default App;
