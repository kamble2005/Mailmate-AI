
import { useState } from "react";

function App() {
  
const [emails, setEmails] = useState([]);
const [loading, setLoading] = useState(true);

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


  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
const [priorityFilter, setPriorityFilter] = useState("All");
  const [showCompose, setShowCompose] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [drafts, setDrafts] = useState([]);

  const categories = [
    "All", "Important", "Work", "Promotions", "Personal"
  ];

  
  
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


const filteredEmails = emails.filter((email) => {
  const matchesSearch =
    email.name.toLowerCase().includes(search.toLowerCase()) ||
    email.subject.toLowerCase().includes(search.toLowerCase());

  const matchesCategory =
    category === "All" || email.category === category;

  const matchesPriority =
    priorityFilter === "All" ||
    email.priority === priorityFilter;

  return matchesSearch && matchesCategory && matchesPriority;
});

  function saveDraft() {
  if (!to || !subject || !message) {
    alert("Please fill all fields!");
    return;
  }

  setDrafts((previousDrafts) => [
    ...previousDrafts,
    { to, subject, message }
  ]);

  alert("Draft saved successfully!");

  setTo("");
  setSubject("");
  setMessage("");
  setShowCompose(false);
}

function updateReplyStatus(index, newStatus) {
  setEmails((previousEmails) =>
    previousEmails.map((email, i) =>
      i === index
        ? { ...email, replyStatus: newStatus }
        : email
    )
  );
}

function updatePriority(index, newPriority) {
  setEmails((previousEmails) =>
    previousEmails.map((email, i) =>
      i === index
        ? { ...email, priority: newPriority }
        : email
    )
  );
}

function updateCategory(index, newCategory) {
  setEmails((previousEmails) =>
    previousEmails.map((email, i) =>
      i === index
        ? { ...email, category: newCategory }
        : email
    )
  );
}
function toggleRead(index) {
  setEmails((previousEmails) =>
    previousEmails.map((email, i) =>
      i === index
        ? { ...email, read: !email.read }
        : email
    )
  );
}

function deleteEmail(index) {
  setEmails((previousEmails) =>
    previousEmails.filter((email, i) => i !== index)
  );
}

function getSuggestedReply(email) {
  if (email.category === "Work") {
    return "Thank you for your email. I will review it and get back to you soon.";
  }

  if (email.category === "Promotions") {
    return "Thank you for sharing this offer.";
  }

  if (email.category === "Personal") {
    return "Hello! Thank you for your message. Hope you are doing well!";
  }

  return "Thank you for your email. I appreciate your message.";
}
  function sendEmail() {
    if (!to || !subject || !message) {
      alert("Please fill all fields!");
      return;
    }

    alert("Email sent successfully!");
    setTo("");
    setSubject("");
    setMessage("");
    setShowCompose(false);
  }

  return
  {loading && <h2>Loading Emails...</h2>}
    (
    <div style={{
      fontFamily: "Arial",
      padding: "20px",
      background: "#f4f6fb",
      minHeight: "100vh"
    }}>

      <h1 style={{ color: "#4f46e5" }}>MailMate AI</h1>
      
<h2>Client Dashboard</h2>

<div style={{
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  marginBottom: "20px"
}}>
  <div style={{
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    flex: "1",
    minWidth: "120px"
  }}>
    <h3>Total Emails</h3>
    <h2>{totalEmails}</h2>
  </div>

  <div style={{
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    flex: "1",
    minWidth: "120px"
  }}>
    <h3>Pending Replies</h3>
    <h2>{pendingReplies}</h2>
  </div>

  <div style={{
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    flex: "1",
    minWidth: "120px"
  }}>
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
  <div style={{
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    flex: "1",
    minWidth: "120px"
  }}>
    <h3>Emails Needing Reply</h3>
    <h2>{pendingReplies}</h2>
  </div>

  <div style={{
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    flex: "1",
    minWidth: "120px"
  }}>
    <h3>High Priority Emails</h3>
    <h2>{highPriorityEmails}</h2>
  </div>

  <div style={{
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    flex: "1",
    minWidth: "120px"
  }}>
    <h3>Total Pending Tasks</h3>
    <h2>{assistantTasks}</h2>
  </div>
</div>

      <h2>Email Inbox</h2>

      <button onClick={() => setShowCompose(!showCompose)}>
        Compose Email
      </button>

      {showCompose && (
        <div style={{ background: "white", padding: "15px", marginTop: "15px" }}>
          <h3>New Email</h3>

          <input placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />

          <br /><br />

          <input placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <br /><br />

          <textarea placeholder="Message"
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

      <h3>Email Categories</h3>
      
      
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
  <div key={index} style={{
    background: "white",
    padding: "15px",
    marginTop: "10px",
    borderRadius: "10px"
  }}>
    <h4>{draft.to}</h4>
    <p>{draft.subject}</p>
    <p>{draft.message}</p>
    <button onClick={() => {
  setDrafts(drafts.filter((_, i) => i !== index));
}}>
  Delete Draft
</button>
  </div>
))}

      <h3>Emails</h3>

      {filteredEmails.map((email) => {
        const originalIndex = emails.indexOf(email);

        return (
<div key={email.name} style={{
            background: "white",
            padding: "15px",
            marginTop: "15px",
            borderRadius: "10px"
          }}>
            <h3>{email.name}</h3>
            <p>{email.subject}</p>

            <p>Current Category: {email.category}</p>

            <select
              value={email.category}
              onChange={(e) =>
                updateCategory(originalIndex, e.target.value)
              }
            >
              {categories.filter((item) => item !== "All").map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            
            
<p>AI Reply Status: {email.replyStatus}</p>

<select
  value={email.replyStatus}
  onChange={(e) =>
    updateReplyStatus(originalIndex, e.target.value)
  }
>
  <option value="Needs Reply">Needs Reply</option>
  <option value="No Reply Needed">No Reply Needed</option>
</select>

<p>
  Email Priority:{" "}
  <span style={{
    color:
      email.priority === "High" ? "red" :
      email.priority === "Medium" ? "#d97706" :
      "green",
    fontWeight: "bold"
  }}>
    {email.priority}
  </span>
</p>
<button
  onClick={() =>
    alert(getSuggestedReply(email))
  }
  style={{
    background: "#4f46e5",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "8px"
  }}
>
  Suggest Reply
</button>
<p>
  Status: {email.read ? "Read" : "Unread"}
</p>

<button
  onClick={() => toggleRead(originalIndex)}
>
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

<select
  value={email.priority}
  onChange={(e) =>
    updatePriority(originalIndex, e.target.value)
  }
>
  <option value="High">High Priority</option>
  <option value="Medium">Medium Priority</option>
  <option value="Low">Low Priority</option>
</select>


          </div>
        );
      })}

      {filteredEmails.length === 0 && <p>No emails found!</p>}

    </div>
  );
}

export default App;
