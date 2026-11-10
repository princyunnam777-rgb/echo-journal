
import { useEffect, useState } from "react";
import "./App.css";

const affirmations = [
  "I am capable of achieving beautiful things through consistent effort.",
  "Every day, I am becoming a stronger and wiser version of myself.",
  "I choose progress over perfection.",
  "My dreams are worth my dedication.",
  "I have the courage to begin again.",
  "Small steps every day create meaningful changes.",
  "I am proud of how far I have come.",
  "I deserve peace, growth and happiness.",
  "I trust the process and keep moving forward.",
  "Today is another opportunity to become better.",
  "I can learn, improve and achieve my goals.",
  "My future is shaped by the choices I make today.",
  "I choose faith over fear and courage over doubt.",
  "I am growing at my own pace, and that is enough.",
  "I will keep showing up for my dreams."
];

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getAffirmation() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const today = new Date();
  const dayNumber = Math.floor((today - start) / 86400000);
  return affirmations[dayNumber % affirmations.length];
}

function getSavedEntries() {
  try {
    return JSON.parse(localStorage.getItem("echoEntries")) || {};
  } catch {
    return {};
  }
}

function App() {
  const [pin, setPin] = useState(localStorage.getItem("echoPin") || "");
  const [unlocked, setUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [page, setPage] = useState("dashboard");

  const [entries, setEntries] = useState(getSavedEntries);
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    localStorage.setItem("echoEntries", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    if (pin) {
      setTitle(entries[selectedDate]?.title || "");
      setContent(entries[selectedDate]?.content || "");
    }
  }, []);

  function handlePin() {
    if (!/^\d{4}$/.test(pinInput)) {
      alert("Please enter exactly 4 digits.");
      return;
    }

    if (!pin) {
      localStorage.setItem("echoPin", pinInput);
      setPin(pinInput);
      setUnlocked(true);
      setPinInput("");
    } else if (pinInput === pin) {
      setUnlocked(true);
      setPinInput("");
    } else {
      alert("Incorrect PIN. Please try again.");
      setPinInput("");
    }
  }

  function selectDate(date) {
    setSelectedDate(date);
    setTitle(entries[date]?.title || "");
    setContent(entries[date]?.content || "");
    setPage("dashboard");
  }

  function saveEntry() {
    if (!title.trim() && !content.trim()) {
      alert("Write something before saving your entry.");
      return;
    }

    setEntries((previous) => ({
      ...previous,
      [selectedDate]: {
        title: title.trim(),
        content: content.trim()
      }
    }));

    alert("Your journal entry has been saved!");
  }

  function deleteEntry() {
    if (!entries[selectedDate]) return;

    if (window.confirm("Are you sure you want to delete this entry?")) {
      setEntries((previous) => {
        const updated = { ...previous };
        delete updated[selectedDate];
        return updated;
      });
      setTitle("");
      setContent("");
    }
  }

  function changeMonth(amount) {
    const date = new Date(year, month + amount, 1);
    setMonth(date.getMonth());
    setYear(date.getFullYear());
  }

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarCells = [
    ...Array((firstDay + 6) % 7).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];

  const memoryList = Object.entries(entries)
    .filter(([date]) => !searchDate || date === searchDate)
    .sort(([a], [b]) => b.localeCompare(a));

  if (!unlocked) {
    return (
      <main className="lock-page">
        <div className="lock-card">
          <div className="logo-mark">E</div>
          <h1>Echo Journal</h1>
          <p className="subtitle">A private space for your thoughts.</p>

          <h2>{pin ? "Welcome Back" : "Create Your PIN"}</h2>
          <p className="muted">
            {pin
              ? "Enter your 4-digit PIN to unlock your journal."
              : "Set a 4-digit PIN to protect your journal on this browser."}
          </p>

          <input
            className="pin-input"
            type="password"
            inputMode="numeric"
            maxLength="4"
            placeholder="Enter 4-digit PIN"
            value={pinInput}
            onChange={(e) =>
              setPinInput(e.target.value.replace(/\D/g, ""))
            }
            onKeyDown={(e) => e.key === "Enter" && handlePin()}
          />

          <button className="primary-btn full-btn" onClick={handlePin}>
            {pin ? "Unlock Journal" : "Create PIN"}
          </button>

          <p className="lock-note">
            Your journal is saved in this browser.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="small-logo">E</div>
          <div>
            <h2>Echo Journal</h2>
            <p>Your thoughts. Your memories.</p>
          </div>
        </div>

        <nav>
          <button
            className={page === "dashboard" ? "nav-btn active" : "nav-btn"}
            onClick={() => setPage("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={page === "memories" ? "nav-btn active" : "nav-btn"}
            onClick={() => setPage("memories")}
          >
            My Memories
          </button>
          <button className="lock-btn" onClick={() => setUnlocked(false)}>
            Lock
          </button>
        </nav>
      </header>

      <main className="main-content">
        {page === "dashboard" ? (
          <>
            <section className="welcome">
              <p className="eyebrow">YOUR PERSONAL SPACE</p>
              <h1>Welcome to your journal.</h1>
              <p>Take a moment for yourself. Your thoughts matter.</p>
            </section>

            <section className="affirmation-card">
              <p className="eyebrow">✦ TODAY'S AFFIRMATION</p>
              <h2>"{getAffirmation()}"</h2>
              <p className="affirmation-date">{new Date().toDateString()}</p>
            </section>

            <div className="journal-layout">
              <section className="panel calendar-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">YOUR JOURNAL</p>
                    <h2>Calendar</h2>
                  </div>
                  <div className="month-controls">
                    <button onClick={() => changeMonth(-1)}>‹</button>
                    <button onClick={() => changeMonth(1)}>›</button>
                  </div>
                </div>

                <h3 className="month-title">
                  {new Date(year, month).toLocaleString("default", {
                    month: "long",
                    year: "numeric"
                  })}
                </h3>

                <div className="calendar-grid">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => <div className="weekday" key={day}>{day}</div>
                  )}

                  {calendarCells.map((day, index) => {
                    if (!day) return <div key={`empty-${index}`} />;

                    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const isSelected = date === selectedDate;
                    const hasEntry = Boolean(entries[date]);
                    const isToday = date === getToday();

                    return (
                      <button
                        key={date}
                        className={`calendar-day ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`}
                        onClick={() => selectDate(date)}
                      >
                        {day}
                        {hasEntry && <span className="entry-dot" />}
                      </button>
                    );
                  })}
                </div>
                <p className="calendar-hint">A small dot means you saved an entry.</p>
              </section>

              <section className="panel editor-panel">
                <p className="eyebrow">WRITE YOUR HEART OUT</p>
                <h2>My Journal</h2>
                <label className="field-label">Selected date</label>
                <input
                  className="date-input"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => selectDate(e.target.value)}
                />

                <label className="field-label">Entry title</label>
                <input
                  className="text-input"
                  type="text"
                  placeholder="Give your day a title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <label className="field-label">Your thoughts</label>
                <textarea
                  className="journal-textarea"
                  placeholder="Dear diary, today I feel..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />

                <div className="editor-actions">
                  <button className="primary-btn" onClick={saveEntry}>
                    Save Entry
                  </button>
                  {entries[selectedDate] && (
                    <button className="delete-btn" onClick={deleteEntry}>
                      Delete
                    </button>
                  )}
                </div>
              </section>
            </div>
          </>
        ) : (
          <section className="memories-page">
            <p className="eyebrow">YOUR JOURNEY IN WORDS</p>
            <h1>My Memories</h1>
            <p className="memories-intro">
              Every entry is a little piece of your story.
            </p>

            <div className="search-area">
              <label className="field-label">Find an entry by date</label>
              <input
                type="date"
                className="date-input search-input"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
              {searchDate && (
                <button className="clear-btn" onClick={() => setSearchDate("")}>
                  Clear search
                </button>
              )}
            </div>

            {memoryList.length === 0 ? (
              <div className="empty-state">
                <h2>No memories found yet.</h2>
                <p>Your saved journal entries will appear here.</p>
                <button className="primary-btn" onClick={() => setPage("dashboard")}>
                  Write an Entry
                </button>
              </div>
            ) : (
              <div className="memory-list">
                {memoryList.map(([date, entry]) => (
                  <button
                    className="memory-card"
                    key={date}
                    onClick={() => selectDate(date)}
                  >
                    <span className="memory-date">{date}</span>
                    <h2>{entry.title || "Untitled Entry"}</h2>
                    <p>{entry.content || "No written thoughts."}</p>
                    <span className="read-more">Open and edit →</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="footer">
        <p>Echo Journal © 2026 · A little space for every thought.</p>
      </footer>
    </div>
  );
}

export default App;
