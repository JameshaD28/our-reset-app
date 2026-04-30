import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Bell,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  Gift,
  Heart,
  HeartHandshake,
  Home,
  ListChecks,
  Lock,
  Menu,
  MessageCircle,
  Plus,
  Sparkles,
  Star,
  User,
  Video,
} from "lucide-react";

const STORAGE_KEY = "our-reset-final-clean-v2";
const VAULT_PIN_KEY = "our-reset-vault-pin";

const todayKey = () => new Date().toISOString().slice(0, 10);
const nowTime = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
const formatTimer = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

const starterData = {
  people: ["Jamesha", "Justin"],
  bond: 50,
  xp: 80,
  streak: 0,
  notes: [],
  messages: [],
  plans: [
    { id: "p1", title: "Blue Hour Check-In", date: todayKey(), time: "8:15 PM" },
    { id: "p2", title: "Plan Date Night", date: todayKey(), time: "7:00 PM" },
  ],
  memories: [{ id: "m1", title: "Our Reset Started", text: "A fresh start, every day.", date: todayKey() }],
  goals: [{ id: "g1", title: "Two date nights this month", progress: 20 }],
  chores: {},
  vault: [],
  badges: ["Fresh Start"],
  sync: "Local save is active",
};

const featureCards = [
  { id: "mood", title: "Mood Check-In", text: "How are you both feeling?", Icon: Heart },
  { id: "chores", title: "Chores", text: "Split it fair. Keep it clean.", Icon: ListChecks },
  { id: "calendar", title: "Calendar", text: "Plan, schedule, and stay on track.", Icon: CalendarDays },
  { id: "rewards", title: "Rewards", text: "Earn together. Enjoy together.", Icon: Gift },
  { id: "love", title: "Love Wall", text: "Leave sweet notes for each other.", Icon: Heart },
  { id: "timeline", title: "Our Timeline", text: "Remember the good times.", Icon: Star },
  { id: "intimacy", title: "Intimacy", text: "Keep the spark alive.", Icon: Sparkles },
  { id: "vault", title: "Private Vault", text: "Photos, videos, and just-us memories.", Icon: Lock },
  { id: "calm", title: "Conflict Rescue", text: "Reset. Refocus. Reconnect.", Icon: HeartHandshake },
  { id: "coach", title: "AI Coach", text: "Smart tips just for you.", Icon: Sparkles },
];

const navItems = [
  { id: "home", label: "Home", Icon: Home },
  { id: "progress", label: "Progress", Icon: BarChart3 },
  { id: "add", label: "Add", Icon: Plus },
  { id: "messages", label: "Messages", Icon: MessageCircle },
  { id: "profile", label: "Profile", Icon: User },
];

const choresList = ["Dishes Reset", "Trash + Quick Pickup", "Laundry Switch", "Bedroom Reset"];
const quickReplies = ["I love you", "I need a reset", "Can we talk?", "Thank you", "I miss you"];
const rewardItems = [
  { title: "Dessert Night", cost: 25, icon: "🍰" },
  { title: "Massage Night", cost: 75, icon: "💆🏽‍♀️" },
  { title: "Date Night Upgrade", cost: 150, icon: "🌹" },
  { title: "Weekend Trip Jar", cost: 300, icon: "🧳" },
];

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...starterData, ...(saved || {}) };
  } catch {
    return starterData;
  }
}

function Card({ children, id, className = "" }) {
  return <section id={id} className={`or-card ${className}`}>{children}</section>;
}

function SoftIcon({ children, className = "" }) {
  return <div className={`soft-icon ${className}`}>{children}</div>;
}

function List({ items, render, onEdit, onDelete }) {
  if (!items?.length) return <p className="empty-text">Nothing saved yet.</p>;
  return (
    <div className="saved-list">
      {items.map((item) => (
        <div className="saved-item" key={item.id}>
          {render(item)}
          <div className="item-actions">
            <button type="button" onClick={() => onEdit(item)}>Edit</button>
            <button type="button" onClick={() => onDelete(item.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="stat-card">
      <span>{icon}</span>
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}

export default function OurResetApp() {
  const [data, setData] = useState(loadData);
  const [activeTab, setActiveTab] = useState("home");
  const [adminOpen, setAdminOpen] = useState(false);
  const [status, setStatus] = useState("");

  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState(data.people?.[0] || "Jamesha");

  const [planTitle, setPlanTitle] = useState("");
  const [planDate, setPlanDate] = useState(todayKey());
  const [planTime, setPlanTime] = useState("7:00 PM");

  const [memoryTitle, setMemoryTitle] = useState("");
  const [memoryText, setMemoryText] = useState("");
  const [goalTitle, setGoalTitle] = useState("");

  const [coachInput, setCoachInput] = useState("");
  const [coachReply, setCoachReply] = useState("Smart tips just for you.");

  const [timerOpen, setTimerOpen] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [running, setRunning] = useState(false);

  const [vaultLocked, setVaultLocked] = useState(true);
  const [vaultPin, setVaultPin] = useState("");
  const [vaultPinSaved, setVaultPinSaved] = useState(() => localStorage.getItem(VAULT_PIN_KEY) || "1234");
  const [vaultTitle, setVaultTitle] = useState("");
  const [vaultNote, setVaultNote] = useState("");

  const today = todayKey();
  const todaysChores = data.chores?.[today] || {};
  const level = Math.floor(data.xp / 100) + 1;
  const progress = data.xp % 100;
  const notifications = data.messages.length + data.notes.length;

  const tests = useMemo(() => [
    { name: "Timer formats 600 as 10:00", pass: formatTimer(600) === "10:00" },
    { name: "Features restored", pass: featureCards.length >= 10 },
    { name: "Bottom nav restored", pass: navItems.length === 5 },
    { name: "Saved lists exist", pass: Array.isArray(data.notes) && Array.isArray(data.messages) && Array.isArray(data.plans) },
    { name: "Private vault exists", pass: Array.isArray(data.vault) },
  ], [data]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (!running || seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(timer);
  }, [running, seconds]);

  useEffect(() => {
    if (seconds === 0 && running) {
      setRunning(false);
      rewardXP(8, "Conflict reset complete 💗");
    }
  }, [seconds, running]);

  function patch(update) {
    setData((old) => ({ ...old, ...update }));
  }

  function showStatus(text) {
    setStatus(text);
    setTimeout(() => setStatus(""), 1700);
  }

  function rewardXP(points, text = "Saved") {
    setData((old) => ({ ...old, xp: old.xp + points, bond: Math.min(100, old.bond + Math.ceil(points / 3)) }));
    showStatus(text);
  }

  function scrollTo(id) {
    setActiveTab(id);
    if (id === "home") window.scrollTo({ top: 0, behavior: "smooth" });
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function addNote() {
    if (!note.trim()) return;
    patch({ notes: [{ id: makeId(), text: note.trim(), time: nowTime() }, ...data.notes] });
    setNote("");
    rewardXP(5, "Love note saved 💌");
  }

  function editNote(item) {
    const text = window.prompt("Edit love note", item.text);
    if (text === null) return;
    patch({ notes: data.notes.map((n) => n.id === item.id ? { ...n, text: text.trim() || n.text } : n) });
  }

  function deleteNote(id) {
    patch({ notes: data.notes.filter((n) => n.id !== id) });
  }

  function sendMessage(text = message) {
    if (!text.trim()) return;
    patch({ messages: [{ id: makeId(), sender, text: text.trim(), time: nowTime(), edited: false }, ...data.messages] });
    setMessage("");
    rewardXP(3, "Message sent 💬");
  }

  function editMessage(item) {
    const text = window.prompt("Edit message", item.text);
    if (text === null) return;
    patch({ messages: data.messages.map((m) => m.id === item.id ? { ...m, text: text.trim() || m.text, edited: true } : m) });
  }

  function deleteMessage(id) {
    patch({ messages: data.messages.filter((m) => m.id !== id) });
  }

  function addPlan() {
    if (!planTitle.trim()) return;
    patch({ plans: [{ id: makeId(), title: planTitle.trim(), date: planDate, time: planTime }, ...data.plans] });
    setPlanTitle("");
    rewardXP(4, "Plan added 📅");
  }

  function editPlan(item) {
    const title = window.prompt("Edit plan", item.title);
    if (title === null) return;
    patch({ plans: data.plans.map((p) => p.id === item.id ? { ...p, title: title.trim() || p.title } : p) });
  }

  function deletePlan(id) {
    patch({ plans: data.plans.filter((p) => p.id !== id) });
  }

  function addMemory() {
    if (!memoryTitle.trim() && !memoryText.trim()) return;
    patch({ memories: [{ id: makeId(), title: memoryTitle.trim() || "Memory", text: memoryText.trim() || "A moment worth saving.", date: todayKey() }, ...data.memories] });
    setMemoryTitle("");
    setMemoryText("");
    rewardXP(5, "Memory saved ✨");
  }

  function editMemory(item) {
    const title = window.prompt("Edit memory title", item.title);
    if (title === null) return;
    patch({ memories: data.memories.map((m) => m.id === item.id ? { ...m, title: title.trim() || m.title } : m) });
  }

  function deleteMemory(id) {
    patch({ memories: data.memories.filter((m) => m.id !== id) });
  }

  function addGoal() {
    if (!goalTitle.trim()) return;
    patch({ goals: [{ id: makeId(), title: goalTitle.trim(), progress: 0 }, ...data.goals] });
    setGoalTitle("");
    rewardXP(2, "Goal added ⭐");
  }

  function editGoal(item) {
    const progressValue = Number(window.prompt("Progress 0-100", String(item.progress)));
    patch({ goals: data.goals.map((g) => g.id === item.id ? { ...g, progress: Number.isNaN(progressValue) ? g.progress : Math.max(0, Math.min(100, progressValue)) } : g) });
  }

  function deleteGoal(id) {
    patch({ goals: data.goals.filter((g) => g.id !== id) });
  }

  function toggleChore(name) {
    const next = { ...todaysChores, [name]: !todaysChores[name] };
    patch({ chores: { ...data.chores, [today]: next } });
    if (!todaysChores[name]) rewardXP(4, "Chore complete ✅");
  }

  function startReset() {
    setTimerOpen(true);
    setSeconds(60);
    setRunning(true);
    showStatus("Reset started 💗");
  }

  function handleResetAction(action) {
    if (action === "Need 10 more mins") {
      setSeconds(600);
      setRunning(true);
      showStatus("10 more minutes added");
      return;
    }
    if (action === "Use AI Coach") {
      scrollTo("coach");
      return;
    }
    if (action === "Leave a note instead") {
      scrollTo("messages");
      return;
    }
    showStatus(action);
  }

  function getCoachTip() {
    const text = coachInput.toLowerCase();
    let reply = "Lower expectations tonight and do one reset together.";
    if (text.includes("mad") || text.includes("fight") || text.includes("argue")) reply = "Pause first. Start with: I want us to understand each other, not win.";
    if (text.includes("clean") || text.includes("chore")) reply = "Pick one task and make it a team reset: one starts, one finishes.";
    if (text.includes("trust") || text.includes("lie")) reply = "Trust rebuilds through repeated proof, not one big promise.";
    setCoachReply(reply);
    setCoachInput("");
    rewardXP(2, "Coach tip created 🧠");
  }

  function claimReward(item) {
    if (data.xp < item.cost) {
      showStatus(`${item.title} needs ${item.cost - data.xp} more XP`);
      return;
    }
    patch({ xp: data.xp - item.cost });
    showStatus(`${item.icon} ${item.title} claimed`);
  }

  function unlockVault() {
    if (vaultPin === vaultPinSaved) {
      setVaultLocked(false);
      setVaultPin("");
      showStatus("Private Vault unlocked 🔒");
    } else {
      showStatus("Wrong vault PIN");
    }
  }

  function changeVaultPin() {
    const nextPin = window.prompt("Create a new Private Vault PIN", vaultPinSaved);
    if (!nextPin?.trim()) return;
    localStorage.setItem(VAULT_PIN_KEY, nextPin.trim());
    setVaultPinSaved(nextPin.trim());
    showStatus("Vault PIN updated");
  }

  function addVaultFiles(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const type = file.type.startsWith("video") ? "video" : "photo";
        setData((old) => ({
          ...old,
          vault: [
            {
              id: makeId(),
              title: vaultTitle.trim() || file.name,
              note: vaultNote.trim() || "A private just-us memory.",
              type,
              src: reader.result,
              createdAt: todayKey(),
            },
            ...(old.vault || []),
          ].slice(0, 30),
          xp: old.xp + 4,
          bond: Math.min(100, old.bond + 2),
        }));
      };
      reader.readAsDataURL(file);
    });

    setVaultTitle("");
    setVaultNote("");
    event.target.value = "";
    showStatus("Private memory saved 🔒");
  }

  function editVaultItem(item) {
    const title = window.prompt("Edit title", item.title);
    if (title === null) return;
    const note = window.prompt("Edit note", item.note);
    if (note === null) return;
    patch({ vault: data.vault.map((v) => v.id === item.id ? { ...v, title: title.trim() || v.title, note: note.trim() || v.note } : v) });
  }

  function deleteVaultItem(id) {
    patch({ vault: data.vault.filter((v) => v.id !== id) });
  }

  return (
    <div className="or-app">
      <style>{styles}</style>

      <main className="or-main" id="home">
        <header className="or-header">
          <button className="top-icon left" onClick={() => setAdminOpen((v) => !v)} type="button" aria-label="Open admin menu"><Menu /></button>
          <div className="brand-wrap">
            <h1>Our Reset♡</h1>
            <p>{data.people[0]} & {data.people[1]}</p>
          </div>
          <button className="top-icon right" onClick={() => scrollTo("messages")} type="button" aria-label="Open messages">
            <Bell />
            {notifications > 0 && <span>{notifications}</span>}
          </button>
        </header>

        {status && <div className="save-pop">{status}</div>}

        {adminOpen && (
          <Card className="admin-card">
            <h2>Hidden Admin</h2>
            <p className="muted">Private app controls, test checks, and local save status.</p>
            <div className="grid two">
              {data.people.map((person, index) => (
                <label className="field-card" key={index}>Adult {index + 1}
                  <input value={person} onChange={(e) => patch({ people: data.people.map((p, i) => i === index ? e.target.value : p) })} />
                </label>
              ))}
            </div>
            <div className="checks">
              {tests.map((test) => <span key={test.name}>{test.pass ? "✅" : "❌"} {test.name}</span>)}
            </div>
            <p className="sync">{data.sync}</p>
          </Card>
        )}

        <Card className="insight-card">
          <SoftIcon><Heart size={38} /></SoftIcon>
          <div>
            <h2>AI Insight for You Both ✨</h2>
            <p>If both feel stressed, lower expectations tonight and do one reset together.</p>
          </div>
        </Card>

        <Card className="rescue-card" id="calm">
          <div className="rescue-top">
            <SoftIcon className="rescue-emblem"><HeartHandshake size={64} /></SoftIcon>
            <div className="rescue-copy">
              <h2>Conflict Rescue</h2>
              <h3>NEED A RESET? WE GOT YOU.</h3>
              <p>Hit the button when tensions are high.<br />We’ll guide you both back to calm.</p>
              <button className="reset-button" type="button" onClick={startReset}>
                <span>♡</span>
                <strong>RESET NOW <small>Calm Us Down</small></strong>
                <ChevronRight />
              </button>
            </div>
            <div className="help-list">
              <h4>This will help you:</h4>
              <p><b>Ⅱ</b> Pause & cool down</p>
              <p><b>♥</b> Communicate without blame</p>
              <p><b>✓</b> Reconnect & find solutions</p>
            </div>
          </div>
          <div className="safe-line"><HeartHandshake size={22} /> This is a safe space. No blame. Just solutions. 💗</div>
          {timerOpen && (
            <div className="timer-box">
              <div className="timer-number">{formatTimer(seconds)}</div>
              <p>{seconds > 40 ? "Breathe in slowly. Let your shoulders drop." : seconds > 0 ? "Prepare to speak gently, not to win." : "Good job choosing peace."}</p>
              <div className="progress"><i style={{ width: `${Math.min(100, ((seconds > 60 ? 600 - seconds : 60 - seconds) / (seconds > 60 ? 600 : 60)) * 100)}%` }} /></div>
              <div className="timer-actions">
                {["Talk now", "Need 10 more mins", "Hug first", "Use AI Coach", "Leave a note instead"].map((item) => <button key={item} onClick={() => handleResetAction(item)} type="button">{item}</button>)}
              </div>
            </div>
          )}
        </Card>

        <Card className="level-card" id="progress">
          <div className="gold-medal"><Star fill="currentColor" /></div>
          <div>
            <p>Your Bond Level ✦</p>
            <h2>Level {level} <span>{data.xp} XP</span></h2>
            <p className="muted">Keep building your bond every day!</p>
          </div>
          <div className="level-progress">
            <p>{100 - progress} XP until Level {level + 1} 🎁</p>
            <div className="progress gold"><i style={{ width: `${progress}%` }} /></div>
          </div>
        </Card>

        <section className="stats-grid">
          <Stat icon="💗" label="Bond" value={`${data.bond}%`} />
          <Stat icon="🔥" label="Streak" value={data.streak} />
          <Stat icon="💬" label="Messages" value={data.messages.length} />
          <Stat icon="🏆" label="Badges" value={data.badges.length} />
        </section>

        <section className="feature-grid">
          {featureCards.map(({ id, title, text, Icon }) => (
            <button key={id} className="feature-card" type="button" onClick={() => scrollTo(id)}>
              <SoftIcon><Icon size={34} /></SoftIcon>
              <h3>{title}</h3>
              <p>{text}</p>
            </button>
          ))}
        </section>

        <Card id="add">
          <h2>Quick Add</h2>
          <div className="quick-grid">
            <button onClick={() => scrollTo("love")} type="button">💌 Add Love Note</button>
            <button onClick={() => scrollTo("calendar")} type="button">📅 Add Plan</button>
            <button onClick={() => scrollTo("timeline")} type="button">✨ Add Memory</button>
            <button onClick={() => scrollTo("messages")} type="button">💬 Send Message</button>
          </div>
        </Card>

        <section className="grid two" id="mood">
          <Card>
            <h2>Mood Check-In</h2>
            {data.people.map((person) => <div className="field-card" key={person}><b>{person}</b><select><option>😊 Good</option><option>😐 Off</option><option>😞 Drained</option><option>😡 Irritated</option></select></div>)}
          </Card>
          <Card id="chores">
            <h2>Couple Chores</h2>
            {choresList.map((chore) => <button key={chore} onClick={() => toggleChore(chore)} type="button" className={`list-button ${todaysChores[chore] ? "done" : ""}`}>{todaysChores[chore] ? <CheckCircle2 /> : <span className="empty-circle" />} {chore}</button>)}
          </Card>
        </section>

        <section className="grid two">
          <Card id="calendar">
            <h2>Calendar Plans</h2>
            <div className="form-row plan-row"><input value={planTitle} onChange={(e) => setPlanTitle(e.target.value)} placeholder="Plan title" /><input type="date" value={planDate} onChange={(e) => setPlanDate(e.target.value)} /><input value={planTime} onChange={(e) => setPlanTime(e.target.value)} /></div>
            <button className="primary" onClick={addPlan} type="button">Add Plan</button>
            <List items={data.plans} render={(item) => <><b>{item.title}</b><p>{item.date} • {item.time}</p></>} onEdit={editPlan} onDelete={deletePlan} />
          </Card>
          <Card id="love">
            <h2>Love Wall</h2>
            <div className="form-row"><input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Write something sweet..." /><button className="primary" onClick={addNote} type="button">Add Note</button></div>
            <List items={data.notes} render={(item) => <><b>💌 Love Note</b><p>{item.text}</p><small>{item.time}</small></>} onEdit={editNote} onDelete={deleteNote} />
          </Card>
        </section>

        <Card id="messages">
          <h2>Messages</h2>
          <div className="form-row message-row"><select value={sender} onChange={(e) => setSender(e.target.value)}>{data.people.map((p) => <option key={p}>{p}</option>)}</select><input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." onKeyDown={(e) => e.key === "Enter" && sendMessage()} /><button className="primary" onClick={() => sendMessage()} type="button">Send</button></div>
          <div className="chips">{quickReplies.map((reply) => <button key={reply} onClick={() => sendMessage(reply)} type="button">{reply}</button>)}</div>
          <List items={data.messages} render={(item) => <><b>{item.sender}</b><p>{item.text}</p><small>{item.time}{item.edited ? " • Edited" : ""}</small></>} onEdit={editMessage} onDelete={deleteMessage} />
        </Card>

        <section className="grid two">
          <Card id="timeline">
            <h2>Timeline Memories</h2>
            <input value={memoryTitle} onChange={(e) => setMemoryTitle(e.target.value)} placeholder="Memory title" />
            <textarea value={memoryText} onChange={(e) => setMemoryText(e.target.value)} placeholder="What happened?" />
            <button className="primary" onClick={addMemory} type="button">Add Memory</button>
            <List items={data.memories} render={(item) => <><b>{item.title}</b><p>{item.text}</p><small>{item.date}</small></>} onEdit={editMemory} onDelete={deleteMemory} />
          </Card>
          <Card id="rewards">
            <h2>Rewards Shop</h2>
            {rewardItems.map((item) => <button className="reward" key={item.title} onClick={() => claimReward(item)} type="button"><span>{item.icon} {item.title}</span><b>{item.cost} XP</b></button>)}
          </Card>
        </section>

        <section className="grid two">
          <Card id="intimacy">
            <h2>Private Connection</h2>
            <div className="private-box"><b>Tonight prompt</b><p>What would make you feel loved, safe, or wanted tonight?</p><p>Try a 20-second hug, a no-phone hour, or one honest question.</p></div>
          </Card>

          <Card id="vault" className="vault-card">
            <div className="vault-head">
              <div>
                <h2>Private Vault</h2>
                <p className="muted">Photos, videos, and just-us memories. Locked by PIN.</p>
              </div>
              <button type="button" className="lock-btn" onClick={() => setVaultLocked((v) => !v)} aria-label="Toggle vault lock">{vaultLocked ? <Lock /> : <Heart />}</button>
            </div>

            {vaultLocked ? (
              <div className="vault-lock-screen">
                <SoftIcon><Lock size={38} /></SoftIcon>
                <h3>Private Memories Locked</h3>
                <p>{vaultPinSaved === "1234" ? "Default PIN is 1234. Enter it to unlock, then change it in settings." : "Your private memories are protected. Enter your PIN to unlock and manage settings."}</p>
                <div className="form-row">
                  <input value={vaultPin} onChange={(e) => setVaultPin(e.target.value)} placeholder="Enter vault PIN" type="password" />
                  <button className="primary" type="button" onClick={unlockVault}>Unlock</button>
                </div>
              </div>
            ) : (
              <>
                <div className="vault-upload">
                  <input value={vaultTitle} onChange={(e) => setVaultTitle(e.target.value)} placeholder="Memory title" />
                  <textarea value={vaultNote} onChange={(e) => setVaultNote(e.target.value)} placeholder="Add a private note..." />
                  <label className="upload-tile">
                    <Camera />
                    <span>Add Photos or Videos</span>
                    <input type="file" accept="image/*,video/*" multiple onChange={addVaultFiles} />
                  </label>
                  <div className="chips">
                    <button type="button" onClick={changeVaultPin}>Change PIN</button>
                    <button type="button" onClick={() => setVaultLocked(true)}>Lock Vault</button>
                  </div>
                </div>

                <div className="vault-grid">
                  {(data.vault || []).map((item) => (
                    <div className="vault-item" key={item.id}>
                      <div className="vault-media">
                        {item.type === "video" ? <video src={item.src} controls /> : <img src={item.src} alt={item.title} />}
                      </div>
                      <b>{item.type === "video" ? <Video size={16} /> : <Camera size={16} />} {item.title}</b>
                      <p>{item.note}</p>
                      <small>{item.createdAt}</small>
                      <div className="item-actions">
                        <button type="button" onClick={() => editVaultItem(item)}>Edit</button>
                        <button type="button" onClick={() => deleteVaultItem(item.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                  {!data.vault?.length && <p className="empty-text">Nothing saved yet. Add your first private memory.</p>}
                </div>
              </>
            )}
          </Card>
        </section>

        <section className="grid two">
          <Card id="coach">
            <h2>AI Coach</h2>
            <textarea value={coachInput} onChange={(e) => setCoachInput(e.target.value)} placeholder="What do you need help with tonight?" />
            <button className="primary" onClick={getCoachTip} type="button">Get Tip</button>
            <div className="private-box">{coachReply}</div>
          </Card>

          <Card id="profile">
            <h2>Profile + Goals</h2>
            <div className="form-row"><input value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} placeholder="New couple goal" /><button className="primary" onClick={addGoal} type="button">Add Goal</button></div>
            <List items={data.goals} render={(item) => <><b>{item.title}</b><div className="progress"><i style={{ width: `${item.progress}%` }} /></div><small>{item.progress}% complete</small></>} onEdit={editGoal} onDelete={deleteGoal} />
          </Card>
        </section>
      </main>

      <nav className="bottom-nav">
        {navItems.map(({ id, label, Icon }) => <button key={id} onClick={() => scrollTo(id)} className={activeTab === id ? "active" : ""} type="button"><span><Icon size={id === "add" ? 32 : 25} /></span><b>{label}</b></button>)}
      </nav>
    </div>
  );
}

const styles = `
*{box-sizing:border-box!important}html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}body{margin:0;background:#fff8f7!important;color:#111!important;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important}button,input,textarea,select{font:inherit}button{cursor:pointer;border:0}input,textarea,select{width:100%;border:1px solid #f4d6df;border-radius:18px;padding:14px 16px;background:#fff;color:#111!important;outline:none}textarea{min-height:96px;resize:vertical}h1,h2,h3,h4,h5,h6,b,strong{color:#050505!important;opacity:1!important;filter:none!important;-webkit-text-fill-color:#050505!important;text-shadow:none!important}p,small,span,label,em{opacity:1!important;filter:none!important}.or-app{min-height:100vh;background:radial-gradient(circle at top,#fff 0,#fff4f7 48%,#fffaf8 100%);padding-bottom:112px}.or-main{width:min(1080px,100%);margin:0 auto;padding:26px 22px 40px}.or-header{position:relative;min-height:150px;display:flex;align-items:center;justify-content:center;text-align:center}.brand-wrap h1{margin:0;color:#df7890!important;-webkit-text-fill-color:#df7890!important;font-size:clamp(54px,8vw,86px);line-height:.9;font-weight:400;font-family:"Segoe Script","Brush Script MT",cursive!important;text-shadow:0 12px 28px rgba(224,110,140,.12)!important}.brand-wrap p{margin:18px 0 0;text-transform:uppercase;letter-spacing:.32em;color:#796f73!important;font-weight:900}.top-icon{position:absolute;top:26px;width:50px;height:50px;border-radius:16px;background:transparent;color:#e26582;display:grid;place-items:center}.top-icon.left{left:0}.top-icon.right{right:0;color:#897d80}.top-icon span{position:absolute;right:-2px;top:-3px;background:#e95d7e;color:white!important;-webkit-text-fill-color:white!important;width:24px;height:24px;border-radius:999px;font-size:12px;display:grid;place-items:center;font-weight:900}.save-pop{position:sticky;top:10px;z-index:50;margin:0 auto 12px;width:max-content;background:white;color:#e75c80!important;border:1px solid #f5c8d4;border-radius:999px;padding:10px 18px;font-weight:900;box-shadow:0 12px 30px rgba(177,105,129,.16)}.or-card{background:rgba(255,255,255,.98)!important;border:1px solid #f3d9df;border-radius:30px;padding:26px;margin-bottom:24px;box-shadow:0 16px 40px rgba(82,54,63,.09);opacity:1!important;filter:none!important}.or-card h2{font-size:32px;line-height:1.08;margin:0 0 10px;font-weight:950!important;color:#050505!important;-webkit-text-fill-color:#050505!important}.or-card p,.muted{color:#4f4549!important;-webkit-text-fill-color:#4f4549!important}.sync{margin-top:14px;color:#e05f80!important;font-weight:800}.grid{display:grid;gap:20px}.grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}.insight-card{display:grid;grid-template-columns:106px 1fr;align-items:center;gap:24px;background:#fff!important}.insight-card h2{font-size:34px!important;font-weight:950!important;color:#050505!important;-webkit-text-fill-color:#050505!important;opacity:1!important}.insight-card p{font-size:20px;font-weight:650;color:#4b4246!important;-webkit-text-fill-color:#4b4246!important}.soft-icon{width:88px;height:88px;border-radius:999px;background:linear-gradient(145deg,#ffe8ef,#fff9fb);display:grid;place-items:center;color:#d95b7b;box-shadow:inset 0 0 0 1px #ffe1e9,0 14px 28px rgba(232,105,138,.16)}.rescue-card{overflow:hidden;background:white!important}.rescue-top{display:grid;grid-template-columns:150px 1fr 280px;gap:28px;align-items:center}.rescue-emblem{width:132px;height:132px;color:#d95b7b}.rescue-copy h2{font-size:46px!important;margin-bottom:6px;color:#050505!important;-webkit-text-fill-color:#050505!important;font-weight:950!important}.rescue-copy h3{margin:0 0 22px;color:#d95b7b!important;-webkit-text-fill-color:#d95b7b!important;font-size:18px;letter-spacing:.08em;font-weight:950!important}.rescue-copy p{font-size:20px;line-height:1.45;color:#4f4549!important;-webkit-text-fill-color:#4f4549!important}.reset-button{margin-top:22px;width:min(570px,100%);min-height:105px;border-radius:999px;background:linear-gradient(135deg,#ff87a6,#df5c78);color:white!important;display:flex;align-items:center;justify-content:space-around;gap:20px;box-shadow:0 20px 35px rgba(217,84,115,.25);font-size:42px}.reset-button strong,.reset-button span,.reset-button small{color:white!important;-webkit-text-fill-color:white!important}.reset-button strong{font-size:27px;letter-spacing:.05em}.reset-button small{display:block;font-size:20px;font-weight:500}.help-list{background:#fff7f8;border:1px solid #f7dce4;border-radius:24px;padding:20px}.help-list h4{margin:0 0 16px;font-weight:950!important}.help-list p{display:flex;align-items:center;gap:14px;margin:14px 0;color:#4f4549!important}.help-list b{width:42px;height:42px;border-radius:999px;background:#f57392;color:white!important;-webkit-text-fill-color:white!important;display:grid;place-items:center}.safe-line{margin-top:24px;border:1px solid #f5d9e1;border-radius:18px;padding:16px 20px;color:#6d6064!important;background:#fff8f9;display:flex;gap:12px;align-items:center}.timer-box{margin-top:24px;background:#fff1f4;border-radius:28px;padding:28px;text-align:center}.timer-number{font-size:82px;line-height:1;font-weight:1000;color:#f45d80!important;-webkit-text-fill-color:#f45d80!important}.progress{height:16px;background:#f2eeee;border-radius:999px;overflow:hidden}.progress i{height:100%;display:block;background:linear-gradient(90deg,#fa6385,#f08aa4);border-radius:999px}.progress.gold i{background:linear-gradient(90deg,#d69b25,#f2c85b)}.timer-actions{display:grid;gap:14px;margin-top:22px}.timer-actions button{background:white;color:#ec4773!important;border-radius:22px;padding:18px;font-size:20px;font-weight:900;box-shadow:0 8px 18px rgba(80,50,60,.08)}.level-card{display:grid;grid-template-columns:120px 1fr 320px;align-items:center;gap:28px}.gold-medal{width:98px;height:98px;border-radius:999px;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,#f8cf6a,#d79318);box-shadow:inset 0 0 0 8px #ffe8aa,0 10px 24px rgba(170,111,24,.18)}.gold-medal svg{width:58px;height:58px}.level-card h2 span{font-size:16px;color:#bb8122!important;background:#fff0d4;padding:8px 13px;border-radius:999px}.level-progress p{text-align:right;font-weight:700}.stats-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;margin-bottom:24px}.stat-card{background:white;border:1px solid #f0dbe1;border-radius:26px;padding:22px;text-align:center;box-shadow:0 12px 28px rgba(82,54,63,.08)}.stat-card span{font-size:34px}.stat-card p{margin:10px 0 2px;color:#6d6064!important}.stat-card strong{font-size:34px;color:#f05b80!important;-webkit-text-fill-color:#f05b80!important}.feature-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:18px;margin-bottom:24px}.feature-card{background:white;border:1px solid #f0dfe3;border-radius:24px;min-height:168px;padding:18px;box-shadow:0 12px 28px rgba(82,54,63,.08);transition:.2s;color:#111!important}.feature-card:hover{transform:translateY(-4px)}.feature-card .soft-icon{width:76px;height:76px;margin:0 auto 12px}.feature-card h3{font-size:17px;margin:0 0 5px;font-weight:950!important}.feature-card p{font-size:14px;margin:0;color:#5d5357!important}.quick-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.quick-grid button,.primary,.list-button,.reward{border-radius:18px;padding:16px 18px;background:#fff0f4;color:#e64d75!important;font-weight:900}.primary{background:linear-gradient(135deg,#ff7899,#e85a7c);color:white!important;-webkit-text-fill-color:white!important;margin-top:12px}.field-card,.private-box{background:#fff4f6;border:1px solid #f5dce3;border-radius:22px;padding:18px;margin:12px 0;color:#111!important}.field-card input,.field-card select{margin-top:8px}.form-row{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;margin:12px 0}.plan-row{grid-template-columns:1fr 170px 120px}.message-row{grid-template-columns:160px 1fr auto}.list-button{width:100%;margin:9px 0;display:flex;gap:10px;align-items:center;justify-content:flex-start;background:#fff5f7;color:#241d1f!important}.list-button.done{background:#ffe5ed;color:#e64d75!important}.empty-circle{width:20px;height:20px;border:2px solid #e7b2c0;border-radius:999px}.saved-list{display:grid;gap:12px;margin-top:16px}.saved-item{background:#fff6f8;border:1px solid #f2dde4;border-radius:20px;padding:16px}.saved-item p{margin:5px 0;color:#4f4549!important}.saved-item small{color:#7d7074!important}.item-actions{display:flex;gap:10px;margin-top:12px}.item-actions button{background:white;border-radius:999px;padding:8px 14px;color:#e65378!important;font-weight:900;box-shadow:0 6px 14px rgba(80,50,60,.08)}.chips{display:flex;gap:10px;flex-wrap:wrap}.chips button{background:#fff0f4;color:#e65378!important;border-radius:999px;padding:10px 14px;font-weight:800}.reward{width:100%;display:flex;justify-content:space-between;margin:10px 0;background:#fff8e8;color:#9d6b16!important}.checks{display:grid;gap:8px;margin-top:16px}.checks span{background:#f8fff7;border-radius:14px;padding:10px;color:#111!important}.empty-text{color:#7c6f73!important}.vault-card{background:linear-gradient(145deg,rgba(255,255,255,.99),rgba(255,242,247,.99))!important}.vault-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.lock-btn{width:52px;height:52px;border-radius:18px;background:#fff0f5;color:#e75d7d;display:grid;place-items:center}.vault-lock-screen{text-align:center;background:#fff6f9;border:1px solid #f3dbe3;border-radius:24px;padding:24px;margin-top:16px}.vault-lock-screen .soft-icon{margin:0 auto 12px}.vault-lock-screen h3{font-size:25px!important;font-weight:950!important}.vault-upload{display:grid;gap:12px;margin-top:12px}.upload-tile{min-height:116px;border:2px dashed #efb7c7;border-radius:24px;background:#fff8fa;color:#e75d7d!important;display:grid;place-items:center;text-align:center;font-weight:900;cursor:pointer;padding:18px}.upload-tile svg{width:34px;height:34px}.upload-tile input{display:none}.vault-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:18px}.vault-item{background:white;border:1px solid #f1dbe2;border-radius:22px;padding:12px;box-shadow:0 10px 22px rgba(82,54,63,.08)}.vault-media{width:100%;aspect-ratio:1/1;border-radius:18px;overflow:hidden;background:#fff0f4;margin-bottom:10px}.vault-media img,.vault-media video{width:100%;height:100%;object-fit:cover;display:block}.vault-item b{display:flex;align-items:center;gap:6px}.vault-item p{margin:6px 0;color:#5d5357!important;font-size:14px}.vault-item small{color:#7d7074!important}.bottom-nav{position:fixed;left:0;right:0;bottom:0;z-index:100;background:rgba(255,255,255,.97);backdrop-filter:blur(14px);border-top:1px solid #f0d7df;display:grid;grid-template-columns:repeat(5,1fr);padding:10px max(10px,calc((100vw - 1080px)/2)) 12px;box-shadow:0 -12px 34px rgba(80,50,60,.08)}.bottom-nav button{background:transparent;color:#837579!important;display:flex;flex-direction:column;align-items:center;gap:5px;font-weight:900}.bottom-nav button span{width:48px;height:42px;border-radius:18px;display:grid;place-items:center;color:inherit!important}.bottom-nav button.active{color:#e75d7d!important}.bottom-nav button b{color:inherit!important;-webkit-text-fill-color:currentColor!important}.bottom-nav button:nth-child(3) span{width:68px;height:68px;margin-top:-34px;border-radius:999px;background:linear-gradient(135deg,#f684a3,#df5578);color:white!important;box-shadow:0 16px 30px rgba(216,81,112,.28)}@media(max-width:900px){.grid.two,.rescue-top,.level-card,.stats-grid{grid-template-columns:1fr}.feature-grid{grid-template-columns:repeat(2,1fr)}.quick-grid{grid-template-columns:1fr 1fr}.insight-card{grid-template-columns:1fr;text-align:center}.insight-card .soft-icon{margin:auto}.insight-card h2{font-size:32px!important;color:#050505!important;-webkit-text-fill-color:#050505!important;opacity:1!important}.rescue-top{text-align:center}.rescue-emblem{margin:auto}.level-progress p{text-align:left}.form-row,.plan-row,.message-row{grid-template-columns:1fr}.form-row select{width:100%}.or-main{padding:18px 14px 38px}.or-header{min-height:135px}.bottom-nav b{font-size:12px}.vault-grid{grid-template-columns:1fr}}@media(max-width:520px){.feature-grid,.quick-grid{grid-template-columns:1fr}.stats-grid{grid-template-columns:repeat(2,1fr)}.or-card{padding:20px;border-radius:24px}.reset-button{min-height:88px}.reset-button strong{font-size:21px}.reset-button span{font-size:32px}.timer-number{font-size:64px}.rescue-copy h2{font-size:36px!important}.brand-wrap h1{font-size:56px}.insight-card h2{font-size:30px!important;color:#050505!important;-webkit-text-fill-color:#050505!important;background:transparent!important}.insight-card{background:#fff!important}}
`;
