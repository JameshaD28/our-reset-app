import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Gift,
  Heart,
  HeartHandshake,
  Home,
  ListChecks,
  Menu,
  MessageCircle,
  Mic,
  Camera,
  Video,
  Lock,
  Plus,
  Sparkles,
  Star,
  User,
} from "lucide-react";

const STORAGE_KEY = "our-reset-full-fixed-v1";

const todayKey = () => new Date().toISOString().slice(0, 10);
const nowTime = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
const makeId = () => crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
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
  vault: [],
  chores: {},
  daily: {},
  badges: ["Fresh Start"],
  sync: "Local save is active",
};

const features = [
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

const chores = ["Dishes Reset", "Trash + Quick Pickup", "Laundry Switch", "Bedroom Reset"];
const quickReplies = ["I love you", "I need a reset", "Can we talk?", "Thank you", "I miss you"];
const rewardItems = [
  { title: "Dessert Night", cost: 25, icon: "🍰" },
  { title: "Massage Night", cost: 75, icon: "💆🏽‍♀️" },
  { title: "Date Night Upgrade", cost: 150, icon: "🌹" },
  { title: "Weekend Trip Jar", cost: 300, icon: "🧳" },
];

function loadData() {
  try {
    return { ...starterData, ...(JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}) };
  } catch {
    return starterData;
  }
}

function Card({ children, id, className = "" }) {
  return <section id={id} className={`or-card ${className}`}>{children}</section>;
}

function SoftIcon({ children, className = "" }) {
  return <div className={`or-soft-icon ${className}`}>{children}</div>;
}

export default function OurResetApp() {
  const [data, setData] = useState(loadData);
  const [adminOpen, setAdminOpen] = useState(false);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState("Jamesha");
  const [planTitle, setPlanTitle] = useState("");
  const [planDate, setPlanDate] = useState(todayKey());
  const [planTime, setPlanTime] = useState("7:00 PM");
  const [memoryTitle, setMemoryTitle] = useState("");
  const [memoryText, setMemoryText] = useState("");
  const [goalTitle, setGoalTitle] = useState("");
  const [coachInput, setCoachInput] = useState("");
  const [coachReply, setCoachReply] = useState("Smart tips just for you.");
  const [vaultTitle, setVaultTitle] = useState("");
  const [vaultNote, setVaultNote] = useState("");
  const [vaultLocked, setVaultLocked] = useState(true);
  const [vaultPin, setVaultPin] = useState("");
  const [vaultPinSaved, setVaultPinSaved] = useState(() => localStorage.getItem("our-reset-vault-pin") || "1234");
  const [timerOpen, setTimerOpen] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [status, setStatus] = useState("");

  const today = todayKey();
  const todaysChores = data.chores?.[today] || {};
  const level = Math.floor(data.xp / 100) + 1;
  const progress = data.xp % 100;
  const notifications = data.messages.length + data.notes.length;
  const tests = useMemo(() => [
    { name: "Timer formats 600 as 10:00", pass: formatTimer(600) === "10:00" },
    { name: "Features restored", pass: features.length === 9 },
    { name: "Bottom nav restored", pass: navItems.length === 5 },
    { name: "Saved lists exist", pass: Array.isArray(data.notes) && Array.isArray(data.messages) && Array.isArray(data.plans) },
    { name: "Private vault exists", pass: Array.isArray(data.vault) },
  ], [data]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (!running || seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(t);
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

  function rewardXP(points, text = "Saved") {
    setData((old) => ({ ...old, xp: old.xp + points, bond: Math.min(100, old.bond + Math.ceil(points / 3)) }));
    setStatus(text);
    setTimeout(() => setStatus(""), 1600);
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
    setStatus("Reset started 💗");
  }

  function handleResetAction(action) {
    if (action === "Need 10 more mins") {
      setSeconds(600);
      setRunning(true);
      setStatus("10 more minutes added");
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
    setStatus(action);
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
      setStatus(`${item.title} needs ${item.cost - data.xp} more XP`);
      return;
    }
    patch({ xp: data.xp - item.cost });
    setStatus(`${item.icon} ${item.title} claimed`);
  }

  function unlockVault() {
    if (vaultPin === vaultPinSaved) {
      setVaultLocked(false);
      setVaultPin("");
      setStatus("Private Vault unlocked 🔒");
    } else {
      setStatus("Wrong vault PIN");
    }
  }

  function changeVaultPin() {
    const nextPin = window.prompt("Create a new Private Vault PIN", vaultPinSaved);
    if (!nextPin) return;
    localStorage.setItem("our-reset-vault-pin", nextPin.trim());
    setVaultPinSaved(nextPin.trim());
    setStatus("Vault PIN updated");
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
    setStatus("Private memory saved 🔒");
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
          <button className="top-icon left" onClick={() => setAdminOpen((v) => !v)} type="button"><Menu /></button>
          <div>
            <h1>Our Reset ♡</h1>
            <p>{data.people[0]} & {data.people[1]}</p>
          </div>
          <button className="top-icon right" onClick={() => scrollTo("messages")} type="button">
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
          <div className="insight-icon"><Heart size={38} /></div>
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
          {features.map(({ id, title, text, Icon }) => (
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
            {data.people.map((person, index) => <div className="field-card" key={person}><b>{person}</b><select><option>😊 Good</option><option>😐 Off</option><option>😞 Drained</option><option>😡 Irritated</option></select></div>)}
          </Card>
          <Card id="chores">
            <h2>Couple Chores</h2>
            {chores.map((chore) => <button key={chore} onClick={() => toggleChore(chore)} type="button" className={`list-button ${todaysChores[chore] ? "done" : ""}`}>{todaysChores[chore] ? <CheckCircle2 /> : <span className="empty-circle" />} {chore}</button>)}
          </Card>
        </section>

        <section className="grid two">
          <Card id="calendar">
            <h2>Calendar Plans</h2>
            <div className="form-row"><input value={planTitle} onChange={(e) => setPlanTitle(e.target.value)} placeholder="Plan title" /><input type="date" value={planDate} onChange={(e) => setPlanDate(e.target.value)} /><input value={planTime} onChange={(e) => setPlanTime(e.target.value)} /></div>
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
          <div className="form-row"><select value={sender} onChange={(e) => setSender(e.target.value)}>{data.people.map((p) => <option key={p}>{p}</option>)}</select><input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." onKeyDown={(e) => e.key === "Enter" && sendMessage()} /><button className="primary" onClick={() => sendMessage()} type="button">Send</button></div>
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
              <button type="button" className="lock-btn" onClick={() => setVaultLocked((v) => !v)}>{vaultLocked ? <Lock /> : <Heart />}</button>
            </div>

            {vaultLocked ? (
              <div className="vault-lock-screen">
                <SoftIcon><Lock size={38} /></SoftIcon>
                <h3>Private Memories Locked</h3>
                <p>{vaultPinSaved === '1234' ? 'Default PIN is 1234. Enter it to unlock, then change it in settings.' : 'Your private memories are protected. Enter your PIN to unlock and manage settings.'}</p>
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
                      <div className="actions">
                        <button type="button" onClick={() => editVaultItem(item)}>Edit</button>
                        <button type="button" onClick={() => deleteVaultItem(item.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                  {!data.vault?.length && <p className="empty">Nothing saved yet. Add your first private memory.</p>}
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
        </section>

        <Card id="profile">
          <h2>Profile + Goals</h2>
          <div className="form-row"><input value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} placeholder="New couple goal" /><button className="primary" onClick={addGoal} type="button">Add Goal</button></div>
          <List items={data.goals} render={(item) => <><b>{item.title}</b><div className="progress"><i style={{ width: `${item.progress}%` }} /></div><small>{item.progress}% complete</small></>} onEdit={editGoal} onDelete={deleteGoal} />
        </Card>
      </main>

      <nav className="bottom-nav">
        {navItems.map(({ id, label, Icon }) => <button key={id} onClick={() => scrollTo(id)} className={activeTab === id ? "active" : ""} type="button"><span><Icon size={id === "add" ? 32 : 25} /></span><b>{label}</b></button>)}
      </nav>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return <div className="stat-card"><span>{icon}</span><p>{label}</p><b>{value}</b></div>;
}

function List({ items, render, onEdit, onDelete }) {
  if (!items.length) return <p className="empty">Nothing saved yet.</p>;
  return <div className="saved-list">{items.map((item) => <div className="saved-item" key={item.id}>{render(item)}<div className="actions"><button type="button" onClick={() => onEdit(item)}>Edit</button><button type="button" onClick={() => onDelete(item.id)}>Delete</button></div></div>)}</div>;
}

const styles = `
.insight-card h2,
.rescue-copy h2,
.or-card h2 {
  color: #08070a !important;
  opacity: 1 !important;
  -webkit-text-fill-color: #08070a !important;
  text-shadow: none !important;
  font-weight: 950 !important;
}

.insight-card {
  background: #ffffff !important;
}`;
