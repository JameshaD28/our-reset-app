import React, { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  CalendarDays,
  Camera,
  CheckCircle2,
  Copy,
  Edit3,
  Gift,
  Heart,
  Home,
  Link2,
  Lock,
  MapPin,
  Menu as MenuIcon,
  MessageCircle,
  Mic,
  Paperclip,
  Plus,
  RefreshCw,
  Settings,
  Sparkles,
  Star,
  Trash2,
  User,
  Video,
  Wand2,
  X,
} from "lucide-react";
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const STORAGE_KEY = "ourResetPremiumFunctionalV5";
const CODE_KEY = "ourResetCoupleCodeV5";
const VAULT_PIN_KEY = "ourResetVaultPinV4";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const today = () => new Date().toISOString().slice(0, 10);
const nowTime = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
const stamp = () => `${today()} • ${nowTime()}`;
const uid = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const timerText = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
const generateCode = () => Math.random().toString(36).replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase();

const defaultData = {
  people: ["Jamesha", "Justin"],
  bond: 50,
  streak: 0,
  xp: 80,
  lastCheckIn: "",
  notes: [],
  messages: [],
  media: [],
  timeline: [],
  plans: [
    {
      id: "plan-1",
      title: "Blue Hour Check-In",
      vibe: "Calm",
      date: today(),
      time: "8:15 PM",
      location: "Home",
      secretMemo: "Keep this soft and low-pressure.",
      blurMemo: true,
      done: false,
      verified: false,
    },
    {
      id: "plan-2",
      title: "Plan Date Night",
      vibe: "Romantic",
      date: today(),
      time: "7:00 PM",
      location: "Pick a cozy spot",
      secretMemo: "Optional surprise detail",
      blurMemo: true,
      done: false,
      verified: false,
    },
  ],
  memories: [],
  vault: [],
  goals: [{ id: "goal-1", title: "Two intentional moments this week", progress: 25 }],
  chores: {},
  rewards: [],
  badges: ["Fresh Start"],
  settings: {
    confirmLocationForRewards: true,
    blurredMemos: true,
    passcode: "",
    enteredPartnerCode: "",
    connected: false,
    connectedAt: "",
  },
};

const moodOptions = [
  { id: "soft", label: "Soft", icon: "🌸", suggestion: "Send one gentle love note before the night ends.", action: "love" },
  { id: "okay", label: "Okay", icon: "🤍", suggestion: "Plan a 10-minute check-in with no phones.", action: "plans" },
  { id: "distant", label: "Distant", icon: "🌙", suggestion: "Start with one kind sentence and one small reset.", action: "conflict" },
  { id: "playful", label: "Playful", icon: "✨", suggestion: "Pick a tiny fun challenge and laugh together tonight.", action: "media" },
];

const loveMoods = [
  { id: "loving", label: "Loving", icon: "❤️" },
  { id: "missing", label: "Missing You", icon: "🥹" },
  { id: "thanks", label: "Appreciation", icon: "🙏" },
  { id: "flirty", label: "Flirty", icon: "😏" },
  { id: "repair", label: "Repair", icon: "🕊️" },
];

const lovePrompts = [
  "Tell them one thing you appreciate today.",
  "Write one sentence that would make them feel chosen.",
  "Tell them what you miss about them.",
  "Say something soft instead of waiting for the perfect moment.",
  "Write an open-when note for a hard day.",
  "Give them credit for one thing they tried.",
];

const quickReplies = ["I love you", "I need a reset", "Can we talk?", "Thank you", "I miss you"];
const reactions = ["❤️", "🥹", "😂", "🔥", "🫶"];

const choreOptions = [
  "Dishes Reset", "Trash + Quick Pickup", "Laundry Switch", "Fold Laundry", "Bedroom Reset", "Kitchen Reset",
  "Bathroom Wipe Down", "Sweep/Vacuum", "Meal Prep", "Cook Dinner", "Pack Lunches", "Grocery List",
  "Grocery Run", "Kids Bath Routine", "Kids Bedtime Routine", "School Prep", "Car Cleanout", "Budget Check",
  "Bills Check", "Pet Care", "Take Out Recycling", "Declutter Counter", "Change Sheets", "Water Plants",
  "Plan Tomorrow", "10-Minute Team Sprint", "Deep Clean Zone", "Errand Run", "Family Calendar Update", "Restock Essentials",
];

const rewardIdeas = [
  "Dessert Night", "Massage Night", "Date Night Upgrade", "Weekend Trip Jar", "Breakfast in Bed", "Movie Pick", "No-Chores Pass", "Coffee Run", "Favorite Meal", "Game Night",
  "Couples Playlist", "Candlelit Dinner", "Picnic Date", "Sunset Drive", "Mini Road Trip", "Spa Night", "Foot Rub", "Back Rub", "Bubble Bath", "Slow Dance",
  "Love Letter", "Surprise Snack", "Phone-Free Hour", "Arcade Night", "Bowling Date", "Ice Cream Run", "Bookstore Date", "Museum Date", "Zoo/Aquarium Day", "Park Walk",
  "Workout Together", "Cook Together", "Bake Together", "Paint Night", "Vision Board Date", "Home Café Morning", "Karaoke Night", "Comedy Night", "DIY Project Date", "Plant Shopping",
  "Thrift Date", "Target Run Date", "Farmers Market", "Brunch Date", "Late-Night Drive", "Stargazing", "Beach/Lake Day", "Hike Together", "Puzzle Night", "Board Game Night",
  "Video Game Night", "Matching Pajamas", "Couples Photos", "Memory Jar", "Scrapbook Hour", "Love Coupon", "Favorite Drink", "Dessert Bake-Off", "Taco Night", "Wing Night",
  "Sushi Date", "Pizza Picnic", "Breakfast Date", "Lunch Date", "Fancy Dinner", "Budget Date Challenge", "$10 Date", "Surprise Flower", "Tiny Gift", "Self-Care Basket",
  "Bath Bomb Night", "Skincare Night", "Hair Wash Help", "Car Wash Together", "Closet Reset Help", "Nap Pass", "Sleep-In Morning", "Solo Hobby Time", "Quiet Hour", "Forgiveness Note",
  "Repair Talk Reward", "Therapy-Style Check-In", "Gratitude Exchange", "Compliment Challenge", "Flirty Text Day", "Secret Date Reveal", "New Restaurant", "Old Favorite Spot", "Photo Booth", "Matching Keychain",
  "Couple Challenge", "Dance Challenge", "Memory Recreate", "First-Date Recreate", "Love Map Questions", "Dream Planning", "Savings Jar Boost", "Home Upgrade", "Room Refresh", "Weekend Reset",
];

const addActions = [
  { id: "love", title: "Love Note", subtitle: "Sweet, flirty, repair, or appreciation", icon: "💌" },
  { id: "media", title: "Voice, Video & Pictures", subtitle: "Save voice memos, videos, and pictures", icon: "🎙️" },
  { id: "messages", title: "Message", subtitle: "Date/time stamped messages you can edit or delete", icon: "💬" },
  { id: "timeline", title: "Timeline", subtitle: "Automatic moments with dates, time, and location", icon: "🕰️" },
  { id: "vault", title: "Private Vault", subtitle: "Locked private memories", icon: "🔒" },
  { id: "conflict", title: "Conflict Resolution", subtitle: "Functional guided repair flow", icon: "🕊️" },
  { id: "coach", title: "SUPER AI Coach", subtitle: "Deeper prompts and next steps", icon: "🧠" },
  { id: "chores", title: "Team Chores", subtitle: "More shared household options", icon: "✅" },
];

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...defaultData, ...(saved || {}), settings: { ...defaultData.settings, ...(saved?.settings || {}) } };
  } catch {
    return defaultData;
  }
}

function Card({ children, className = "" }) {
  return <section className={`card ${className}`}>{children}</section>;
}

function Empty({ children }) {
  return <p className="empty">{children}</p>;
}

function StatCard({ icon, label, value }) {
  return (
    <Card className="stat-card">
      <div className="stat-icon">{icon}</div>
      <b>{value}</b>
      <span>{label}</span>
    </Card>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [data, setData] = useState(loadData);
  const dataRef = useRef(data);
  const [coupleCode, setCoupleCode] = useState(() => localStorage.getItem(CODE_KEY) || "");
  const [syncStatus, setSyncStatus] = useState(supabase ? "Ready for Supabase sync" : "Missing Supabase env keys");
  const [toast, setToast] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const [selectedMood, setSelectedMood] = useState("soft");
  const [noteText, setNoteText] = useState("");
  const [noteMood, setNoteMood] = useState("loving");
  const [notePinned, setNotePinned] = useState(false);
  const [notePrivacy, setNotePrivacy] = useState("shared");
  const [promptIndex, setPromptIndex] = useState(0);

  const [planTitle, setPlanTitle] = useState("");
  const [planDate, setPlanDate] = useState(today());
  const [planTime, setPlanTime] = useState("7:00 PM");
  const [planVibe, setPlanVibe] = useState("Romantic");
  const [planLocation, setPlanLocation] = useState("");
  const [planMemo, setPlanMemo] = useState("");
  const [planBlur, setPlanBlur] = useState(true);

  const [messageText, setMessageText] = useState("");
  const [messageSender, setMessageSender] = useState("Jamesha");
  const [timelineText, setTimelineText] = useState("");
  const [timelineLocation, setTimelineLocation] = useState("");

  const [goalTitle, setGoalTitle] = useState("");
  const [coachInput, setCoachInput] = useState("");
  const [coachReply, setCoachReply] = useState("Tell SUPER AI what happened, what you need, and what tone you want. I’ll give you a calmer next step.");

  const [resetSeconds, setResetSeconds] = useState(60);
  const [resetRunning, setResetRunning] = useState(false);
  const [conflictStep, setConflictStep] = useState(0);
  const [conflictNotes, setConflictNotes] = useState({ issue: "", feeling: "", need: "", agreement: "" });

  const [vaultLocked, setVaultLocked] = useState(true);
  const [vaultPin, setVaultPin] = useState("");
  const [vaultPinSaved, setVaultPinSaved] = useState(() => localStorage.getItem(VAULT_PIN_KEY) || "1234");
  const [vaultTitle, setVaultTitle] = useState("");
  const [vaultNote, setVaultNote] = useState("");

  const [mediaTitle, setMediaTitle] = useState("");
  const [mediaLocation, setMediaLocation] = useState("");
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [partnerEntry, setPartnerEntry] = useState(data.settings.enteredPartnerCode || "");

  const currentMood = useMemo(() => moodOptions.find((mood) => mood.id === selectedMood) || moodOptions[0], [selectedMood]);
  const sortedNotes = useMemo(() => [...(data.notes || [])].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))), [data.notes]);
  const todayChores = data.chores?.[today()] || {};
  const completedChores = Object.values(todayChores).filter(Boolean).length;
  const notifications = (data.messages?.length || 0) + (data.notes?.length || 0) + (data.timeline?.length || 0);
  const rewardCatalog = useMemo(
    () => rewardIdeas.map((title, index) => ({ title, cost: 20 + (index % 10) * 15 + Math.floor(index / 10) * 10, icon: ["🌹", "🍰", "🎁", "✨", "💞", "🗓️", "🏆", "🧸", "☕", "🎬"][index % 10] })),
    []
  );

  useEffect(() => {
    dataRef.current = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  async function cloudSave(code, nextData) {
    if (!supabase || !code) return;
    setSyncStatus("Saving...");
    const { error } = await supabase
      .from("couple_state")
      .upsert({ code, data: nextData, updated_at: new Date().toISOString() }, { onConflict: "code" });
    setSyncStatus(error ? `Sync error: ${error.message}` : "Saved to cloud");
  }

  function mergeCloudData(cloudData) {
    return {
      ...defaultData,
      ...(cloudData || {}),
      settings: { ...defaultData.settings, ...(cloudData?.settings || {}) },
    };
  }

  useEffect(() => {
    if (!supabase || !coupleCode || !data.settings.connected) return undefined;
    let cancelled = false;
    async function loadCloudRoom() {
      setSyncStatus("Loading shared room...");
      const { data: row, error } = await supabase
        .from("couple_state")
        .select("data")
        .eq("code", coupleCode)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        setSyncStatus(`Load error: ${error.message}`);
        return;
      }
      if (row?.data) {
        const merged = mergeCloudData(row.data);
        merged.settings = { ...merged.settings, connected: true, passcode: coupleCode, enteredPartnerCode: coupleCode };
        setData(merged);
        setSyncStatus("Loaded shared room");
      } else {
        await cloudSave(coupleCode, dataRef.current);
      }
    }
    loadCloudRoom();
    const channel = supabase
      .channel(`couple_state_${coupleCode}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "couple_state", filter: `code=eq.${coupleCode}` }, (payload) => {
        if (!payload.new?.data) return;
        const merged = mergeCloudData(payload.new.data);
        merged.settings = { ...merged.settings, connected: true, passcode: coupleCode, enteredPartnerCode: coupleCode };
        setData(merged);
        setSyncStatus("Live synced");
      })
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [coupleCode, data.settings.connected]);

  useEffect(() => {
    if (!resetRunning) return undefined;
    const timer = setInterval(() => {
      setResetSeconds((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          setResetRunning(false);
          return 0;
        }
        return previous - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [resetRunning]);

  function updateData(updater, syncToCloud = true) {
    setData((previous) => {
      const next = typeof updater === "function" ? updater(previous) : { ...previous, ...updater };
      const activeCode = coupleCode || next.settings?.passcode;
      if (syncToCloud && supabase && next.settings?.connected && activeCode) {
        cloudSave(activeCode, next);
      }
      return next;
    });
  }

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  function reward(points, message) {
    updateData((previous) => ({ ...previous, xp: previous.xp + points, bond: clamp(previous.bond + Math.ceil(points / 2), 0, 100) }));
    showToast(message);
  }

  function addTimeline(type, title, text, location = "") {
    updateData((previous) => ({
      ...previous,
      timeline: [{ id: uid("timeline"), type, title, text, location, createdAt: stamp() }, ...(previous.timeline || [])].slice(0, 200),
    }));
  }

  function go(tab) {
    setActiveTab(tab);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveCheckIn(destination = "love") {
    const alreadyToday = data.lastCheckIn === today();
    updateData((previous) => ({
      ...previous,
      lastCheckIn: today(),
      streak: alreadyToday ? previous.streak : previous.streak + 1,
      memories: [{ id: uid("memory"), title: "Daily Connection", text: `${currentMood.label}: ${currentMood.suggestion}`, createdAt: stamp() }, ...previous.memories],
      timeline: [{ id: uid("timeline"), type: "check-in", title: "Daily Connection", text: `${currentMood.label}: ${currentMood.suggestion}`, location: "", createdAt: stamp() }, ...(previous.timeline || [])],
    }));
    reward(alreadyToday ? 3 : 10, alreadyToday ? "Check-in updated" : "Daily connection saved 🔥");
    go(destination);
  }

  function addNote() {
    if (!noteText.trim()) return;
    const mood = loveMoods.find((item) => item.id === noteMood) || loveMoods[0];
    const note = { id: uid("note"), text: noteText.trim(), mood: mood.label, icon: mood.icon, pinned: notePinned, privacy: notePrivacy, reactions: [], createdAt: stamp() };
    updateData((previous) => ({
      ...previous,
      notes: [note, ...previous.notes],
      timeline: [{ id: uid("timeline"), type: "love", title: `${mood.icon} ${mood.label} Note`, text: note.text, location: "", createdAt: note.createdAt }, ...(previous.timeline || [])],
    }));
    setNoteText("");
    setNotePinned(false);
    reward(notePinned ? 9 : 5, "Love note saved 💌");
  }

  function editInList(collection, id, field, label) {
    const item = data[collection].find((entry) => entry.id === id);
    const next = window.prompt(label, item?.[field] || "");
    if (next === null) return;
    updateData((previous) => ({ ...previous, [collection]: previous[collection].map((entry) => (entry.id === id ? { ...entry, [field]: next.trim() || entry[field] } : entry)) }));
  }

  function deleteFromList(collection, id) {
    updateData((previous) => ({ ...previous, [collection]: previous[collection].filter((entry) => entry.id !== id) }));
  }

  function togglePinNote(id) {
    updateData((previous) => ({ ...previous, notes: previous.notes.map((note) => (note.id === id ? { ...note, pinned: !note.pinned } : note)) }));
  }

  function reactToNote(id, reaction) {
    updateData((previous) => ({
      ...previous,
      notes: previous.notes.map((note) => {
        if (note.id !== id) return note;
        const current = note.reactions || [];
        return { ...note, reactions: current.includes(reaction) ? current.filter((item) => item !== reaction) : [...current, reaction] };
      }),
    }));
  }

  function addPlan() {
    if (!planTitle.trim()) return;
    const plan = { id: uid("plan"), title: planTitle.trim(), vibe: planVibe, date: planDate, time: planTime, location: planLocation.trim(), secretMemo: planMemo.trim(), blurMemo: planBlur, done: false, verified: false };
    updateData((previous) => ({
      ...previous,
      plans: [plan, ...previous.plans],
      timeline: [{ id: uid("timeline"), type: "plan", title: `Plan created: ${plan.title}`, text: `${plan.date} at ${plan.time}`, location: plan.location, createdAt: stamp() }, ...(previous.timeline || [])],
    }));
    setPlanTitle("");
    setPlanLocation("");
    setPlanMemo("");
    setPlanBlur(true);
    reward(6, "Plan created 📅");
  }

  function editPlan(plan) {
    const title = window.prompt("Edit plan title", plan.title);
    if (title === null) return;
    const location = window.prompt("Edit location", plan.location || "");
    if (location === null) return;
    updateData((previous) => ({ ...previous, plans: previous.plans.map((item) => (item.id === plan.id ? { ...item, title: title.trim() || item.title, location: location.trim() } : item)) }));
  }

  function completePlan(plan, verify = false) {
    let bonus = 8;
    const locationText = verify ? window.prompt("Confirm where this date happened", plan.location || "") : "";
    if (verify && locationText !== null && locationText.trim()) bonus = 25;
    updateData((previous) => ({
      ...previous,
      plans: previous.plans.map((item) => (item.id === plan.id ? { ...item, done: true, verified: verify && !!locationText?.trim(), confirmedLocation: locationText?.trim() || item.confirmedLocation } : item)),
      timeline: [{ id: uid("timeline"), type: "follow-through", title: `Follow-through: ${plan.title}`, text: verify ? "Location confirmed for bonus points." : "Plan marked complete.", location: locationText?.trim() || plan.location || "", createdAt: stamp() }, ...(previous.timeline || [])],
    }));
    reward(bonus, verify && locationText?.trim() ? "+25 follow-through points unlocked 📍" : "Plan completed 💞");
  }

  function addMessage(text = messageText) {
    if (!text.trim()) return;
    const item = { id: uid("message"), sender: messageSender, text: text.trim(), createdAt: stamp() };
    updateData((previous) => ({
      ...previous,
      messages: [item, ...previous.messages],
      timeline: [{ id: uid("timeline"), type: "message", title: `${item.sender} saved a message`, text: item.text, location: "", createdAt: item.createdAt }, ...(previous.timeline || [])],
    }));
    setMessageText("");
    reward(4, "Message saved 💬");
  }

  function addManualTimeline() {
    if (!timelineText.trim()) return;
    addTimeline("moment", "Timeline Moment", timelineText.trim(), timelineLocation.trim());
    setTimelineText("");
    setTimelineLocation("");
    reward(5, "Timeline moment added 🕰️");
  }

  async function useCurrentLocation(setter) {
    if (!navigator.geolocation) return showToast("Location is not available on this browser");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const value = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
        setter(value);
        showToast("Location added 📍");
      },
      () => showToast("Location permission was not allowed")
    );
  }

  async function startVoiceMemo() {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) return showToast("Voice recording is not supported here");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    recorder.ondataavailable = (event) => chunksRef.current.push(event.data);
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const reader = new FileReader();
      reader.onload = () => saveMediaItem({ title: mediaTitle || "Voice Memo", type: "voice", src: reader.result, location: mediaLocation });
      reader.readAsDataURL(blob);
      stream.getTracks().forEach((track) => track.stop());
    };
    recorder.start();
    setRecording(true);
  }

  function stopVoiceMemo() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  function saveMediaItem(item) {
    const saved = { id: uid("media"), title: item.title || "Saved Media", type: item.type, src: item.src, location: item.location || "", createdAt: stamp() };
    updateData((previous) => ({
      ...previous,
      media: [saved, ...(previous.media || [])].slice(0, 60),
      timeline: [{ id: uid("timeline"), type: saved.type, title: saved.title, text: `${saved.type} saved`, location: saved.location, createdAt: saved.createdAt }, ...(previous.timeline || [])],
    }));
    setMediaTitle("");
    setMediaLocation("");
    reward(6, `${saved.type === "voice" ? "Voice memo" : "Media"} saved ✨`);
  }

  function addMediaFiles(event) {
    const files = Array.from(event.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => saveMediaItem({ title: mediaTitle || file.name, type: file.type.startsWith("video") ? "video" : "picture", src: reader.result, location: mediaLocation });
      reader.readAsDataURL(file);
    });
    event.target.value = "";
  }

  function coachTip() {
    const text = coachInput.toLowerCase();
    const tone = text.includes("angry") || text.includes("mad") || text.includes("fight") ? "heated" : text.includes("trust") || text.includes("lie") ? "trust" : text.includes("chores") || text.includes("clean") ? "teamwork" : text.includes("distant") || text.includes("space") ? "distance" : "general";
    const replies = {
      heated: "SUPER AI: Pause the debate. Use this exact line: ‘I’m not trying to win against you. I want us calm enough to actually hear each other.’ Then take 60 seconds and each name one feeling, one need, and one repair action.",
      trust: "SUPER AI: Trust needs proof, not pressure. Ask for one visible action that can be repeated: consistency, transparency, or a clear boundary. Keep the request specific enough to measure.",
      teamwork: "SUPER AI: Turn it into a two-person reset. One person starts the task, the other finishes. Add a timer, thank each other out loud, and claim the chore points after.",
      distance: "SUPER AI: Don’t chase a whole conversation yet. Offer a low-pressure bridge: ‘I miss feeling close to you. Can we sit together for ten minutes with no fixing, just softness?’",
      general: "SUPER AI: Name the pattern, not the person. Try: ‘The problem is the cycle we keep falling into. I want us to fight the cycle together.’ Then choose one next action that can happen today.",
    };
    setCoachReply(replies[tone]);
    addTimeline("coach", "SUPER AI Coach", replies[tone], "");
    setCoachInput("");
    reward(3, "SUPER AI created a next step 🧠");
  }

  function beginReset() {
    setResetSeconds(60);
    setResetRunning(true);
    setConflictStep(1);
    showToast("60-second reset started");
  }

  function saveConflictAgreement() {
    const text = `Issue: ${conflictNotes.issue || "Not added"}. Feeling: ${conflictNotes.feeling || "Not added"}. Need: ${conflictNotes.need || "Not added"}. Agreement: ${conflictNotes.agreement || "Not added"}.`;
    addTimeline("repair", "Conflict Resolution Saved", text, "");
    setConflictNotes({ issue: "", feeling: "", need: "", agreement: "" });
    setConflictStep(0);
    reward(15, "Repair agreement saved 🕊️");
  }

  function toggleChore(chore) {
    const nextValue = !todayChores[chore];
    updateData((previous) => ({ ...previous, chores: { ...previous.chores, [today()]: { ...(previous.chores?.[today()] || {}), [chore]: nextValue } } }));
    if (nextValue) {
      addTimeline("chore", "Team Chore Complete", chore, "");
      reward(4, "Chore complete ✅");
    }
  }

  function claimReward(item) {
    if (data.xp < item.cost) return showToast(`${item.title} needs ${item.cost - data.xp} more XP`);
    updateData((previous) => ({ ...previous, xp: previous.xp - item.cost, rewards: [{ ...item, id: uid("reward"), createdAt: stamp() }, ...previous.rewards] }));
    showToast(`${item.title} unlocked 🎁`);
  }

  function addGoal() {
    if (!goalTitle.trim()) return;
    updateData((previous) => ({ ...previous, goals: [{ id: uid("goal"), title: goalTitle.trim(), progress: 0 }, ...previous.goals] }));
    setGoalTitle("");
  }

  function improveGoal(id) {
    updateData((previous) => ({ ...previous, goals: previous.goals.map((goal) => (goal.id === id ? { ...goal, progress: clamp(goal.progress + 25, 0, 100) } : goal)) }));
    reward(5, "Goal progress added ⭐");
  }

  function unlockVault() {
    if (vaultPin === vaultPinSaved) {
      setVaultLocked(false);
      setVaultPin("");
      showToast("Vault unlocked");
    } else {
      showToast("Wrong PIN");
    }
  }

  function saveVaultNote() {
    if (!vaultTitle.trim() && !vaultNote.trim()) return;
    const item = { id: uid("vault"), title: vaultTitle.trim() || "Private Note", note: vaultNote.trim(), type: "note", createdAt: stamp() };
    updateData((previous) => ({ ...previous, vault: [item, ...previous.vault] }));
    setVaultTitle("");
    setVaultNote("");
    showToast("Saved to vault 🔒");
  }

  function saveVaultFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const item = { id: uid("vault"), title: vaultTitle.trim() || file.name, note: vaultNote.trim(), type: file.type.startsWith("video") ? "video" : file.type.startsWith("audio") ? "audio" : "image", src: reader.result, createdAt: stamp() };
      updateData((previous) => ({ ...previous, vault: [item, ...previous.vault] }));
      setVaultTitle("");
      setVaultNote("");
      showToast("Private file saved 🔒");
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function changeVaultPin() {
    const next = window.prompt("New vault PIN", vaultPinSaved);
    if (!next) return;
    localStorage.setItem(VAULT_PIN_KEY, next);
    setVaultPinSaved(next);
    showToast("Vault PIN updated");
  }

  async function generatePasscode() {
    const code = generateCode();
    const timelineItem = { id: uid("timeline"), type: "settings", title: "Couple passcode generated", text: `Code ${code} created in Settings.`, location: "", createdAt: stamp() };
    const nextData = {
      ...dataRef.current,
      settings: { ...dataRef.current.settings, passcode: code, enteredPartnerCode: code, connected: true, connectedAt: stamp() },
      timeline: [timelineItem, ...(dataRef.current.timeline || [])],
    };
    setPartnerEntry(code);
    setCoupleCode(code);
    localStorage.setItem(CODE_KEY, code);
    if (!supabase) {
      setData(nextData);
      showToast("Code generated locally. Add Supabase keys for live sync.");
      return;
    }
    setSyncStatus("Creating shared room...");
    const { error: coupleError } = await supabase
      .from("couples")
      .upsert({ code, person_one: nextData.people?.[0] || "Jamesha", person_two: nextData.people?.[1] || "Justin" }, { onConflict: "code" });
    if (coupleError) {
      setSyncStatus(`Room error: ${coupleError.message}`);
      showToast("Could not create shared room");
      return;
    }
    setData(nextData);
    await cloudSave(code, nextData);
    showToast("Couple code generated and synced 🔗");
  }

  function copyPasscode() {
    const code = coupleCode || data.settings.passcode;
    if (!code) return showToast("Generate a code first");
    navigator.clipboard?.writeText(code);
    showToast("Code copied");
  }

  async function connectPartner() {
    const cleanEntry = partnerEntry.trim().toUpperCase();
    if (!cleanEntry) return showToast("Enter your partner code first");
    if (!supabase) {
      updateData((previous) => ({
        ...previous,
        settings: { ...previous.settings, enteredPartnerCode: cleanEntry, passcode: cleanEntry, connected: true, connectedAt: stamp() },
        timeline: [{ id: uid("timeline"), type: "connect", title: "Partner Connected", text: `Partner code ${cleanEntry} saved locally.`, location: "", createdAt: stamp() }, ...(previous.timeline || [])],
      }), false);
      setCoupleCode(cleanEntry);
      localStorage.setItem(CODE_KEY, cleanEntry);
      showToast("Connected locally. Add Supabase keys for live sync.");
      return;
    }
    setSyncStatus("Connecting...");
    const { data: room, error: roomError } = await supabase.from("couples").select("code").eq("code", cleanEntry).maybeSingle();
    if (roomError) {
      setSyncStatus(`Connect error: ${roomError.message}`);
      showToast("Connection error");
      return;
    }
    if (!room) {
      setSyncStatus("Code not found");
      showToast("Invalid code");
      return;
    }
    const { data: cloudRow, error: stateError } = await supabase.from("couple_state").select("data").eq("code", cleanEntry).maybeSingle();
    if (stateError) {
      setSyncStatus(`Sync error: ${stateError.message}`);
      showToast("Could not load shared room");
      return;
    }
    const nextData = mergeCloudData(cloudRow?.data || dataRef.current);
    nextData.settings = { ...nextData.settings, passcode: cleanEntry, enteredPartnerCode: cleanEntry, connected: true, connectedAt: stamp() };
    nextData.timeline = [{ id: uid("timeline"), type: "connect", title: "Partner Connected", text: "This device joined the shared couple room.", location: "", createdAt: stamp() }, ...(nextData.timeline || [])];
    setCoupleCode(cleanEntry);
    localStorage.setItem(CODE_KEY, cleanEntry);
    setData(nextData);
    await cloudSave(cleanEntry, nextData);
    
    await supabase
  .from("couples")
  .update({ person_two: "Partner" })
  .eq("code", cleanEntry);
    setSyncStatus("Connected and synced");
    showToast("Partner connected permanently 🔗");
  }

  function disconnectPartner() {
    localStorage.removeItem(CODE_KEY);
    setCoupleCode("");
    setPartnerEntry("");
    updateData((previous) => ({
      ...previous,
      settings: { ...previous.settings, enteredPartnerCode: "", passcode: "", connected: false, connectedAt: "" },
    }), false);
    setSyncStatus("Unlinked on this device");
    showToast("This device was unlinked. Cloud room is still saved.");
  }

  function renderHome() {
    return (
      <section className="screen">
        <Card className="hero-card premium-hero">
          <div className="hero-glow"><Heart size={52} /></div>
          <p className="eyebrow">Jamesha + Justin</p>
          <h2>A softer place to reset, reconnect, and remember the good.</h2>
          <p className="lead">Choose the mood, save the moment, plan the repair, and let the app keep your timeline organized.</p>
          <div className="mood-grid">
            {moodOptions.map((mood) => (
              <button key={mood.id} className={selectedMood === mood.id ? "selected" : ""} onClick={() => setSelectedMood(mood.id)} type="button">
                <span>{mood.icon}</span><b>{mood.label}</b>
              </button>
            ))}
          </div>
          <button className="primary" onClick={() => saveCheckIn(currentMood.action)} type="button"><Sparkles size={18} /> Save Today’s Check-In</button>
        </Card>

        <div className="pulse-grid">
          <StatCard icon="💞" label="Bond" value={`${data.bond}%`} />
          <StatCard icon="🔥" label="Streak" value={data.streak} />
          <StatCard icon="✨" label="XP" value={data.xp} />
        </div>

        <Card className="moment-card">
          <div>
            <p className="eyebrow">Quick Action</p>
            <h3>Most useful next move</h3>
            <p className="lead">{currentMood.suggestion}</p>
          </div>
          <div className="button-stack">
            <button className="primary" onClick={() => go(currentMood.action)} type="button">Open Tool</button>
            <button className="ghost-button" onClick={() => setPromptIndex((promptIndex + 1) % lovePrompts.length)} type="button">New Prompt</button>
          </div>
        </Card>

        <Card>
          <div className="section-head compact"><div><p className="eyebrow">Fast Menu</p><h3>Jump in</h3></div><Sparkles /></div>
          <div className="quick-grid">
            <button onClick={() => go("love")} type="button"><Heart /> <b>1. Love Note</b><span>Save something soft.</span></button>
            <button onClick={() => go("plans")} type="button"><CalendarDays /> <b>2. Plans</b><span>Add dates, location, and memos.</span></button>
            <button onClick={() => go("settings")} type="button"><Link2 /> <b>3. Connect</b><span>Generate or enter partner code.</span></button>
          </div>
        </Card>
      </section>
    );
  }

  function renderAdd() {
    return (
      <section className="screen">
        <Card>
          <p className="eyebrow">Add</p>
          <h2>Add memories, messages, media, or repair tools.</h2>
          <p className="lead">Plans Moment was removed from this tab. Plans now live in the Plans screen, and messages live in Messages.</p>
          <div className="feature-grid upgraded-add-grid">
            {addActions.map((action) => (
              <button key={action.id} onClick={() => go(action.id)} type="button">
                <span className="feature-icon">{action.icon}</span>
                <b>{action.title}</b>
                <small>{action.subtitle}</small>
              </button>
            ))}
          </div>
        </Card>
      </section>
    );
  }

  function renderLove() {
    return (
      <section className="screen two-column">
        <Card>
          <div className="prompt-box">
            <div><p className="eyebrow">Prompt</p><p>{lovePrompts[promptIndex]}</p></div>
            <button className="ghost-button" onClick={() => setPromptIndex((promptIndex + 1) % lovePrompts.length)} type="button"><RefreshCw size={16} /> New</button>
          </div>
          <p className="eyebrow">Love Note</p>
          <h2>Write something worth keeping.</h2>
          <div className="mood-row">
            {loveMoods.map((mood) => <button key={mood.id} className={noteMood === mood.id ? "active" : ""} onClick={() => setNoteMood(mood.id)} type="button">{mood.icon} {mood.label}</button>)}
          </div>
          <textarea value={noteText} onChange={(event) => setNoteText(event.target.value)} placeholder="Type your note..." />
          <details className="options-panel">
            <summary>Options</summary>
            <div className="options-grid">
              <label><input type="checkbox" checked={notePinned} onChange={(event) => setNotePinned(event.target.checked)} /> Pin this note</label>
              <label><input type="checkbox" checked={notePrivacy === "private"} onChange={(event) => setNotePrivacy(event.target.checked ? "private" : "shared")} /> Mark private</label>
            </div>
          </details>
          <button className="primary" onClick={addNote} type="button"><Heart size={18} /> Save Love Note</button>
        </Card>

        <Card>
          <div className="section-head compact"><div><p className="eyebrow">Saved</p><h3>Love Notes</h3></div><Heart /></div>
          <div className="list">
            {sortedNotes.length ? sortedNotes.map((note) => (
              <div key={note.id} className={`item love-note ${note.pinned ? "pinned" : ""}`}>
                <div className="item-title-row"><b>{note.icon} {note.mood}</b><small>{note.createdAt}</small></div>
                <p>{note.text}</p>
                <small>{note.privacy === "private" ? "Private" : "Shared"}</small>
                <div className="reaction-row">{reactions.map((reaction) => <button key={reaction} className={note.reactions?.includes(reaction) ? "active" : ""} onClick={() => reactToNote(note.id, reaction)} type="button">{reaction}</button>)}</div>
                <div className="item-actions">
                  <button onClick={() => togglePinNote(note.id)} type="button"><Star size={15} /> {note.pinned ? "Unpin" : "Pin"}</button>
                  <button onClick={() => editInList("notes", note.id, "text", "Edit note")} type="button"><Edit3 size={15} /> Edit</button>
                  <button onClick={() => deleteFromList("notes", note.id)} type="button"><Trash2 size={15} /> Delete</button>
                </div>
              </div>
            )) : <Empty>No love notes yet.</Empty>}
          </div>
        </Card>
      </section>
    );
  }

  function renderPlans() {
    return (
      <section className="screen two-column">
        <Card>
          <p className="eyebrow">Plans</p>
          <h2>Plan dates with location and optional secret memos.</h2>
          <input value={planTitle} onChange={(event) => setPlanTitle(event.target.value)} placeholder="Plan title" />
          <div className="form-row">
            <input type="date" value={planDate} onChange={(event) => setPlanDate(event.target.value)} />
            <input value={planTime} onChange={(event) => setPlanTime(event.target.value)} placeholder="Time" />
          </div>
          <div className="form-row">
            <select value={planVibe} onChange={(event) => setPlanVibe(event.target.value)}><option>Romantic</option><option>Calm</option><option>Fun</option><option>Repair</option><option>Family</option></select>
            <div className="location-row"><input value={planLocation} onChange={(event) => setPlanLocation(event.target.value)} placeholder="Location" /><button className="ghost-button" onClick={() => useCurrentLocation(setPlanLocation)} type="button"><MapPin size={16} /> Use GPS</button></div>
          </div>
          <textarea value={planMemo} onChange={(event) => setPlanMemo(event.target.value)} placeholder="Secret memo (optional)" />
          <label className="soft-check"><input type="checkbox" checked={planBlur} onChange={(event) => setPlanBlur(event.target.checked)} /> Blur memo until tapped/hovered</label>
          <button className="primary" onClick={addPlan} type="button"><CalendarDays size={18} /> Save Plan</button>
        </Card>

        <Card>
          <div className="section-head compact"><div><p className="eyebrow">Upcoming</p><h3>Plans</h3></div><CalendarDays /></div>
          <div className="list">
            {data.plans.length ? data.plans.map((plan) => (
              <div key={plan.id} className={`item ${plan.done ? "done" : ""}`}>
                <div className="item-title-row"><b>{plan.title}</b><small>{plan.date} • {plan.time}</small></div>
                <small><MapPin size={14} /> {plan.location || "No location yet"}</small>
                {plan.secretMemo && <p className={plan.blurMemo && data.settings.blurredMemos ? "blur-memo" : ""}>{plan.secretMemo}</p>}
                <small>{plan.vibe}{plan.verified ? " • Location verified" : ""}</small>
                <div className="item-actions">
                  <button onClick={() => completePlan(plan, false)} type="button"><CheckCircle2 size={15} /> Done</button>
                  <button onClick={() => completePlan(plan, true)} type="button"><MapPin size={15} /> Confirm Location</button>
                  <button onClick={() => editPlan(plan)} type="button"><Edit3 size={15} /> Edit</button>
                  <button onClick={() => deleteFromList("plans", plan.id)} type="button"><Trash2 size={15} /> Delete</button>
                </div>
              </div>
            )) : <Empty>No plans yet.</Empty>}
          </div>
        </Card>
      </section>
    );
  }

  function renderMessages() {
    return (
      <section className="screen two-column">
        <Card>
          <p className="eyebrow">Messages</p>
          <h2>Date and time stamped messages.</h2>
          <select value={messageSender} onChange={(event) => setMessageSender(event.target.value)}>{data.people.map((person) => <option key={person}>{person}</option>)}</select>
          <textarea value={messageText} onChange={(event) => setMessageText(event.target.value)} placeholder="Write a message..." />
          <button className="primary" onClick={() => addMessage()} type="button"><MessageCircle size={18} /> Save Message</button>
          <div className="chips">{quickReplies.map((reply) => <button key={reply} onClick={() => addMessage(reply)} type="button">{reply}</button>)}</div>
        </Card>
        <Card>
          <div className="section-head compact"><div><p className="eyebrow">Saved</p><h3>Messages</h3></div><MessageCircle /></div>
          <div className="list">
            {data.messages.length ? data.messages.map((message) => (
              <div key={message.id} className="item">
                <div className="item-title-row"><b>{message.sender}</b><small>{message.createdAt}</small></div>
                <p>{message.text}</p>
                <div className="item-actions"><button onClick={() => editInList("messages", message.id, "text", "Edit message")} type="button"><Edit3 size={15} /> Edit</button><button onClick={() => deleteFromList("messages", message.id)} type="button"><Trash2 size={15} /> Delete</button></div>
              </div>
            )) : <Empty>No messages yet.</Empty>}
          </div>
        </Card>
      </section>
    );
  }

  function renderMedia() {
    return (
      <section className="screen two-column">
        <Card>
          <p className="eyebrow">Media</p>
          <h2>Voice memos, videos, and pictures.</h2>
          <input value={mediaTitle} onChange={(event) => setMediaTitle(event.target.value)} placeholder="Title" />
          <div className="location-row"><input value={mediaLocation} onChange={(event) => setMediaLocation(event.target.value)} placeholder="Location" /><button className="ghost-button" onClick={() => useCurrentLocation(setMediaLocation)} type="button"><MapPin size={16} /> GPS</button></div>
          <div className="media-actions">
            {!recording ? <button className="primary" onClick={startVoiceMemo} type="button"><Mic size={18} /> Start Voice Memo</button> : <button className="danger" onClick={stopVoiceMemo} type="button"><Mic size={18} /> Stop Recording</button>}
            <label className="upload-pill"><Paperclip size={18} /> Upload Pictures or Videos<input type="file" accept="image/*,video/*" multiple onChange={addMediaFiles} /></label>
          </div>
        </Card>
        <Card>
          <div className="section-head compact"><div><p className="eyebrow">Saved</p><h3>Media</h3></div><Camera /></div>
          <div className="list">
            {data.media.length ? data.media.map((item) => (
              <div key={item.id} className="item">
                <b>{item.type === "voice" ? "🎙️" : item.type === "video" ? "🎥" : "🖼️"} {item.title}</b>
                <small>{item.createdAt} {item.location ? `• ${item.location}` : ""}</small>
                {item.type === "voice" && <audio controls src={item.src} />}
                {item.type === "video" && <video controls src={item.src} />}
                {item.type === "picture" && <img alt={item.title} src={item.src} />}
                <div className="item-actions"><button onClick={() => editInList("media", item.id, "title", "Edit media title")} type="button"><Edit3 size={15} /> Edit</button><button onClick={() => deleteFromList("media", item.id)} type="button"><Trash2 size={15} /> Delete</button></div>
              </div>
            )) : <Empty>No media yet.</Empty>}
          </div>
        </Card>
      </section>
    );
  }

  function renderTimeline() {
    return (
      <section className="screen two-column">
        <Card>
          <p className="eyebrow">Timeline</p>
          <h2>Automatic timeline with date, time, and location.</h2>
          <textarea value={timelineText} onChange={(event) => setTimelineText(event.target.value)} placeholder="Add a timeline moment manually..." />
          <div className="location-row"><input value={timelineLocation} onChange={(event) => setTimelineLocation(event.target.value)} placeholder="Location" /><button className="ghost-button" onClick={() => useCurrentLocation(setTimelineLocation)} type="button"><MapPin size={16} /> GPS</button></div>
          <button className="primary" onClick={addManualTimeline} type="button"><CalendarDays size={18} /> Add Timeline Moment</button>
        </Card>
        <Card>
          <div className="section-head compact"><div><p className="eyebrow">Live History</p><h3>Timeline</h3></div><CalendarDays /></div>
          <div className="timeline-list">
            {data.timeline.length ? data.timeline.map((item) => (
              <div key={item.id} className="timeline-item">
                <span className="dot" />
                <div><b>{item.title}</b><p>{item.text}</p><small>{item.createdAt}{item.location ? ` • ${item.location}` : ""}</small><div className="item-actions"><button onClick={() => editInList("timeline", item.id, "text", "Edit timeline text")} type="button"><Edit3 size={15} /> Edit</button><button onClick={() => deleteFromList("timeline", item.id)} type="button"><Trash2 size={15} /> Delete</button></div></div>
              </div>
            )) : <Empty>Your timeline will build automatically as you save things.</Empty>}
          </div>
        </Card>
      </section>
    );
  }

  function renderCoach() {
    return (
      <section className="screen two-column">
        <Card className="coach-card">
          <Wand2 size={44} />
          <p className="eyebrow">SUPER AI Coach</p>
          <h2>Get a softer next step.</h2>
          <textarea value={coachInput} onChange={(event) => setCoachInput(event.target.value)} placeholder="Example: We are arguing about chores and I feel unappreciated..." />
          <button className="primary" onClick={coachTip} type="button"><Wand2 size={18} /> Generate SUPER AI Response</button>
        </Card>
        <Card><p className="eyebrow">Guidance</p><div className="coach-reply">{coachReply}</div></Card>
      </section>
    );
  }

  function renderConflict() {
    const steps = ["Pause", "Feeling", "Need", "Agreement"];
    return (
      <section className="screen two-column">
        <Card className="reset-card">
          <div className="reset-icon"><Heart size={48} /></div>
          <p className="eyebrow">Conflict Resolution</p>
          <h2>A real repair flow that saves the agreement.</h2>
          <button className="reset-button" onClick={beginReset} type="button">Start Reset</button>
          {conflictStep > 0 && <div className="timer-panel"><div className="timer">{timerText(resetSeconds)}</div><p>Breathe first. Then move through the steps.</p></div>}
        </Card>
        <Card>
          <div className="step-dots">{steps.map((step, index) => <button key={step} className={conflictStep === index + 1 ? "active" : ""} onClick={() => setConflictStep(index + 1)} type="button">{index + 1}</button>)}</div>
          <p className="eyebrow">Repair notes</p>
          <textarea value={conflictNotes.issue} onChange={(event) => setConflictNotes({ ...conflictNotes, issue: event.target.value })} placeholder="What is the issue?" />
          <textarea value={conflictNotes.feeling} onChange={(event) => setConflictNotes({ ...conflictNotes, feeling: event.target.value })} placeholder="What feeling needs to be heard?" />
          <textarea value={conflictNotes.need} onChange={(event) => setConflictNotes({ ...conflictNotes, need: event.target.value })} placeholder="What do you need next?" />
          <textarea value={conflictNotes.agreement} onChange={(event) => setConflictNotes({ ...conflictNotes, agreement: event.target.value })} placeholder="What agreement are you making?" />
          <button className="primary" onClick={saveConflictAgreement} type="button"><CheckCircle2 size={18} /> Save Repair Agreement</button>
        </Card>
      </section>
    );
  }

  function renderChores() {
    return (
      <section className="screen two-column">
        <Card>
          <p className="eyebrow">Team Chores</p>
          <h2>More options for a true team reset.</h2>
          <p className="lead">Completed today: {completedChores}/{choreOptions.length}</p>
          <div className="progress-line"><i style={{ width: `${(completedChores / choreOptions.length) * 100}%` }} /></div>
        </Card>
        <Card>
          <div className="chores-grid">
            {choreOptions.map((chore) => <button key={chore} className={`chore-button ${todayChores[chore] ? "done" : ""}`} onClick={() => toggleChore(chore)} type="button">{todayChores[chore] ? "✅" : "⬜"} {chore}</button>)}
          </div>
        </Card>
      </section>
    );
  }

  function renderVault() {
    if (vaultLocked) {
      return (
        <section className="screen"><Card className="vault-card"><Lock size={54} /><p className="eyebrow">Private Vault</p><h2>Enter PIN to unlock.</h2><input value={vaultPin} onChange={(event) => setVaultPin(event.target.value)} placeholder="PIN" type="password" /><button className="primary" onClick={unlockVault} type="button">Unlock Vault</button><button className="ghost-button" onClick={changeVaultPin} type="button">Change PIN</button><p className="muted">Default PIN is 1234 unless you changed it.</p></Card></section>
      );
    }
    return (
      <section className="screen two-column">
        <Card>
          <p className="eyebrow">Vault</p><h2>Private memories.</h2>
          <input value={vaultTitle} onChange={(event) => setVaultTitle(event.target.value)} placeholder="Title" />
          <textarea value={vaultNote} onChange={(event) => setVaultNote(event.target.value)} placeholder="Private note" />
          <div className="item-actions centered-actions"><button className="primary" onClick={saveVaultNote} type="button">Save Note</button><label className="upload-pill"><Paperclip size={18} /> Save File<input type="file" accept="image/*,video/*,audio/*" onChange={saveVaultFile} /></label><button className="ghost-button" onClick={() => setVaultLocked(true)} type="button">Lock</button></div>
        </Card>
        <Card>
          <div className="vault-grid">
            {data.vault.length ? data.vault.map((item) => <div key={item.id} className="vault-item"><b>{item.title}</b><small>{item.createdAt}</small>{item.note && <p>{item.note}</p>}<div className="vault-media">{item.type === "image" && <img alt={item.title} src={item.src} />}{item.type === "video" && <video controls src={item.src} />}{item.type === "audio" && <audio controls src={item.src} />}{item.type === "note" && <Lock />}</div><button onClick={() => deleteFromList("vault", item.id)} type="button"><Trash2 size={15} /> Delete</button></div>) : <Empty>No private items yet.</Empty>}
          </div>
        </Card>
      </section>
    );
  }

  function renderProfile() {
    return (
      <section className="screen">
        <Card>
          <p className="eyebrow">Profile</p><h2>Rewards, stats, and progress.</h2>
          <div className="profile-grid">
            <div><b>{data.xp}</b><span>XP</span></div>
            <div><b>{data.bond}%</b><span>Bond</span></div>
            <div><b>{data.streak}</b><span>Streak</span></div>
          </div>
        </Card>
        <section className="two-column">
          <Card><div className="section-head compact"><div><p className="eyebrow">Rewards</p><h3>Reward Shop</h3></div><Gift /></div><div className="reward-grid">{rewardCatalog.map((item) => <button key={item.title} className="reward-button" onClick={() => claimReward(item)} type="button"><span>{item.icon} {item.title}</span><b>{item.cost} XP</b></button>)}</div></Card>
          <Card><p className="eyebrow">Goals</p><input value={goalTitle} onChange={(event) => setGoalTitle(event.target.value)} placeholder="New goal" /><button className="primary" onClick={addGoal} type="button">Add Goal</button><div className="list">{data.goals.map((goal) => <div key={goal.id} className="item"><b>{goal.title}</b><div className="progress-line"><i style={{ width: `${goal.progress}%` }} /></div><small>{goal.progress}%</small><div className="item-actions"><button onClick={() => improveGoal(goal.id)} type="button"><Star size={15} /> +25%</button><button onClick={() => deleteFromList("goals", goal.id)} type="button"><Trash2 size={15} /> Delete</button></div></div>)}</div></Card>
        </section>
      </section>
    );
  }

  function renderSettings() {
    return (
      <section className="screen two-column">
        <Card>
          <Settings size={42} />
          <p className="eyebrow">Settings</p>
          <h2>Couple connection</h2>
          <p className="lead">One person generates a code. The other person enters that same code. Everything stays synced permanently until you unlink this device.</p>
          <button className="primary" onClick={generatePasscode} type="button"><RefreshCw size={18} /> Generate My Code</button>
          {(coupleCode || data.settings.passcode) ? (
            <>
              <div className="passcode-box">{coupleCode || data.settings.passcode}</div><p className="muted">Sync status: {syncStatus}</p>
              <button className="ghost-button inline" onClick={copyPasscode} type="button"><Copy size={16} /> Copy My Code</button>
            </>
          ) : <Empty>No code generated yet.</Empty>}
        </Card>

        <Card>
          <Link2 size={42} />
          <p className="eyebrow">Partner Code</p>
          <h2>Add partner code</h2>
          <p className="lead">Enter the couple code here. Once connected, messages, plans, timeline, chores, rewards, notes, vault items, and media metadata sync through Supabase.</p>
          <input value={partnerEntry} onChange={(event) => setPartnerEntry(event.target.value.toUpperCase())} placeholder="Enter partner code" maxLength={8} />
          <button className="primary" onClick={connectPartner} type="button"><Link2 size={18} /> Connect Partner</button>
          {data.settings.connected ? <p className="connected-box">✅ Connected to cloud room {coupleCode || data.settings.passcode} • {data.settings.connectedAt}</p> : <p className="muted">Not connected yet.</p>}
          {data.settings.connected && <button className="ghost-button" onClick={disconnectPartner} type="button">Unlink This Device</button>}
        </Card>

        <Card>
          <p className="eyebrow">Preferences</p>
          <label className="soft-check"><input type="checkbox" checked={data.settings.confirmLocationForRewards} onChange={(event) => updateData((previous) => ({ ...previous, settings: { ...previous.settings, confirmLocationForRewards: event.target.checked } }))} /> Reward follow-through with location confirmation</label>
          <label className="soft-check"><input type="checkbox" checked={data.settings.blurredMemos} onChange={(event) => updateData((previous) => ({ ...previous, settings: { ...previous.settings, blurredMemos: event.target.checked } }))} /> Keep secret date memos blurred by default</label>
          <button className="danger" onClick={() => { if (window.confirm("Clear local data on this browser only? Cloud room stays saved.")) { localStorage.removeItem(STORAGE_KEY); setData(defaultData); } }} type="button">Clear Local Data</button>
        </Card>
      </section>
    );
  }

  const screens = { home: renderHome, add: renderAdd, love: renderLove, plans: renderPlans, messages: renderMessages, media: renderMedia, timeline: renderTimeline, coach: renderCoach, conflict: renderConflict, chores: renderChores, vault: renderVault, profile: renderProfile, settings: renderSettings };

  return (
    <div className="or-app">
      <style>{styles}</style>
      {toast && <div className="toast">{toast}</div>}
      <header className="topbar">
        <button className="icon-button" onClick={() => setMenuOpen(true)} type="button"><MenuIcon /></button>
        <div className="brand"><h1>Our Reset</h1><p>Jamesha + Justin</p></div>
        <button className="icon-button notification-button" onClick={() => go("timeline")} type="button"><Sparkles />{notifications > 0 && <span>{notifications}</span>}</button>
      </header>
      {menuOpen && (
        <Card className="menu-card">
          <div className="section-head compact"><div><p className="eyebrow">Menu</p><h3>Tools</h3></div><button className="icon-button" onClick={() => setMenuOpen(false)} type="button"><X /></button></div>
          <div className="admin-grid"><button onClick={() => go("vault")} type="button"><Lock size={18} /> Vault</button><button onClick={() => go("settings")} type="button"><Settings size={18} /> Settings</button></div>
        </Card>
      )}
      <main className="main">{(screens[activeTab] || renderHome)()}</main>
      <nav className="bottom-nav">
        <button className={`nav-home ${activeTab === "home" ? "active" : ""}`} onClick={() => go("home")} type="button"><Home size={18} /><span>Home</span></button>
        <button className={activeTab === "timeline" ? "active" : ""} onClick={() => go("timeline")} type="button"><CalendarDays size={19} /><span>Timeline</span></button>
        <button className={`nav-add ${activeTab === "add" ? "active" : ""}`} onClick={() => go("add")} type="button"><Plus size={25} /><span>Add</span></button>
        <button className={activeTab === "messages" ? "active" : ""} onClick={() => go("messages")} type="button"><MessageCircle size={19} /><span>Messages</span></button>
        <button className={activeTab === "profile" ? "active" : ""} onClick={() => go("profile")} type="button"><User size={19} /><span>Profile</span></button>
      </nav>
    </div>
  );
}

const styles = `
*{box-sizing:border-box}
body{margin:0;background:radial-gradient(circle at top,#fff7fa,#fff 44%,#fff4f7);font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:#171116}
button,input,textarea,select{font:inherit;border:0;outline:0}
button{cursor:pointer}
input,textarea,select{width:100%;border-radius:22px;background:#fff7fa;border:1px solid #f2d4de;padding:16px 18px;color:#171116;font-weight:800;margin:7px 0}
textarea{min-height:135px;resize:vertical}
h2,h3,p{margin-top:0}
h2{font-size:clamp(34px,5vw,64px);line-height:.98;margin-bottom:14px;font-weight:1000;color:#090609!important}
h3{font-size:clamp(25px,3vw,38px);line-height:1.12;margin-bottom:12px;font-weight:950;color:#090609!important}
b,strong{color:#090609!important}
.or-app{min-height:100vh;padding-bottom:102px}
.topbar{position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;padding:18px min(6vw,70px);background:rgba(255,250,252,.86);border-bottom:1px solid #f6dce5;backdrop-filter:blur(18px)}
.brand{text-align:center}.brand h1{font-family:"Brush Script MT","Segoe Script",cursive;font-weight:400;font-size:clamp(46px,6vw,90px);line-height:.85;margin:0;color:#df6b86!important}.brand p,.eyebrow{letter-spacing:.32em;text-transform:uppercase;font-weight:950;color:#8a7a82}
.icon-button{position:relative;width:48px;height:48px;border-radius:999px;background:#fff;color:#df5d80;box-shadow:0 10px 28px rgba(81,49,63,.08);display:grid;place-items:center}
.notification-button span{position:absolute;right:-3px;top:-3px;background:#111;color:#fff;border-radius:999px;font-size:12px;font-weight:900;padding:3px 7px}
.main{width:min(1120px,92vw);margin:0 auto;padding:28px 0}.screen{display:grid;gap:22px}.two-column{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);align-items:start;gap:22px}.card{background:rgba(255,255,255,.92);border:1px solid #f1d6df;border-radius:34px;padding:clamp(22px,4vw,40px);box-shadow:0 24px 70px rgba(82,51,64,.09)}
.hero-card{text-align:center;display:grid;gap:16px;place-items:center}.premium-hero{background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(255,246,250,.94));position:relative;overflow:hidden}.premium-hero:before{content:"";position:absolute;inset:-120px auto auto -120px;width:260px;height:260px;border-radius:999px;background:rgba(232,83,120,.12);filter:blur(8px)}
.hero-glow,.reset-icon{width:108px;height:108px;border-radius:999px;display:grid;place-items:center;background:radial-gradient(circle,#fff,#ffeaf1);color:#e65378;box-shadow:0 20px 50px rgba(232,78,120,.18)}
.lead{font-size:clamp(18px,2vw,24px);line-height:1.45;color:#655960;font-weight:650}.muted,.empty{color:#74666d;font-weight:650}.connected-box{background:#ecfff3;border:1px solid #bce7c9;color:#137a3a;border-radius:20px;padding:14px;font-weight:900}
.mood-grid{width:100%;display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.mood-grid button,.quick-grid button,.feature-grid button{background:#fff7fa;border:1px solid #f2d4de;border-radius:26px;padding:20px;display:grid;gap:7px;text-align:left;box-shadow:0 12px 28px rgba(82,51,64,.06)}.mood-grid button{text-align:center;place-items:center}.mood-grid button span{font-size:30px}.mood-grid button.selected{background:linear-gradient(135deg,#f86f96,#e65378);color:#fff}.mood-grid button.selected b{color:#fff!important}
.moment-card{display:flex;align-items:center;justify-content:space-between;gap:22px}.button-stack{display:grid;gap:10px}.primary,.reset-button{display:inline-flex;gap:8px;align-items:center;justify-content:center;border-radius:999px;padding:17px 26px;background:linear-gradient(135deg,#fb6f98,#e65378);color:white!important;font-weight:1000;box-shadow:0 18px 40px rgba(232,78,120,.23)}.ghost-button{border-radius:999px;padding:14px 20px;background:#fff1f5;color:#e65378;font-weight:950}.ghost-button.inline{display:inline-flex;align-items:center;gap:8px;justify-content:center}.danger{display:inline-flex;gap:8px;align-items:center;justify-content:center;border-radius:999px;padding:17px 26px;background:#171116;color:white!important;font-weight:1000}.pulse-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.stat-card{display:grid;place-items:center;text-align:center;gap:8px}.stat-icon{font-size:28px}.stat-card b{font-size:34px}.section-head{display:flex;align-items:center;justify-content:space-between;gap:14px}.section-head svg{color:#e65378}.compact{margin-bottom:16px}.quick-grid,.feature-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.feature-grid small,.quick-grid button span{color:#766871;font-weight:700}.feature-icon{font-size:34px!important}.upgraded-add-grid button{min-height:145px;transition:transform .18s ease,box-shadow .18s ease}.upgraded-add-grid button:hover{transform:translateY(-3px);box-shadow:0 18px 38px rgba(82,51,64,.1)}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}.location-row{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center}.list{display:grid;gap:14px;margin-top:10px}.item{background:#fff7fa;border:1px solid #f2d6df;border-radius:24px;padding:18px;display:grid;gap:9px}.item img,.item video{width:100%;max-height:320px;object-fit:cover;border-radius:20px}.item audio{width:100%}.item.done{opacity:.74}.item p{margin:0;color:#55474e}.item small{color:#766871;font-weight:800;display:flex;align-items:center;gap:5px}.item button,.item-actions button,.chips button,.mood-row button{display:inline-flex;align-items:center;gap:7px;width:max-content;border-radius:999px;background:#fff;color:#e65378;font-weight:900;padding:10px 14px;box-shadow:0 8px 18px rgba(82,51,64,.07)}.item-actions{display:flex;gap:10px;flex-wrap:wrap}.item-title-row{display:flex;align-items:center;justify-content:space-between;gap:10px}.love-note.pinned{border-color:#ef97ad;background:#fff0f5}.prompt-box{display:flex;align-items:center;justify-content:space-between;gap:16px;background:#fff7fa;border:1px solid #f2d4de;border-radius:24px;padding:18px;margin-bottom:16px}.prompt-box p{margin:8px 0 0;color:#55474e}.mood-row,.chips,.reaction-row{display:flex;flex-wrap:wrap;gap:10px;margin:14px 0}.mood-row button.active,.reaction-row button.active{background:#e65378;color:#fff}.options-panel{margin:14px 0}.options-panel summary{cursor:pointer;background:#fff7fa;border:1px solid #f2d4de;border-radius:18px;padding:14px 16px;font-weight:950;color:#e65378}.options-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}.options-grid label,.soft-check{display:flex;align-items:center;gap:10px;background:#fff7fa;border:1px solid #f2d4de;border-radius:18px;padding:14px;font-weight:900;color:#55474e}.options-grid input[type="checkbox"],.soft-check input{width:auto}.reaction-row button{background:white;border-radius:999px;padding:8px 12px}.blur-memo{filter:blur(5px);transition:.2s;user-select:none}.blur-memo:hover,.blur-memo:active{filter:blur(0);user-select:auto}.media-actions{display:grid;gap:12px}.upload-pill{display:inline-flex;align-items:center;justify-content:center;gap:10px;border-radius:999px;padding:16px 20px;background:#fff1f5;color:#e65378;font-weight:1000;cursor:pointer}.upload-pill input{display:none}.reset-card{text-align:center;display:grid;place-items:center;gap:14px}.reset-button{min-width:220px;min-height:64px;font-size:20px}.timer-panel{width:100%;background:#fff7fa;border:1px solid #f2d4de;border-radius:28px;padding:24px;margin-top:12px}.timer{font-size:72px;font-weight:1000;color:#e65378;line-height:1}.step-dots{display:flex;gap:8px;margin-bottom:15px}.step-dots button{width:42px;height:42px;border-radius:999px;background:#fff1f5;color:#e65378;font-weight:1000}.step-dots button.active{background:#e65378;color:#fff}.vault-card{text-align:center;display:grid;place-items:center;gap:12px}.vault-card svg{color:#e65378}.centered-actions{justify-content:center}.vault-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.vault-item{background:white;border:1px solid #f2d7df;border-radius:24px;padding:14px;display:grid;gap:8px;text-align:left}.vault-media{width:100%;aspect-ratio:1/1;border-radius:18px;overflow:hidden;background:#fff0f5;display:grid;place-items:center}.vault-media img,.vault-media video{width:100%;height:100%;object-fit:cover;display:block}.vault-media audio{width:92%}.coach-card{display:grid;gap:12px;place-items:start}.coach-card svg{color:#e65378}.coach-reply{background:#fff7fa;border:1px solid #f2d4de;border-radius:26px;padding:22px;color:#55474e;font-size:18px;line-height:1.5;font-weight:800}.chores-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.chore-button{width:100%;text-align:left;border-radius:20px;padding:18px;background:#fff7fa;color:#55474e;font-weight:950;border:1px solid #f2d6df}.chore-button.done{background:#ffeaf1;color:#e65378}.progress-line{height:14px;border-radius:999px;background:#f0e8ec;overflow:hidden}.progress-line i{display:block;height:100%;background:linear-gradient(90deg,#fb6f98,#f0b44f)}.reward-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;max-height:680px;overflow:auto;padding-right:6px}.reward-button{width:100%;display:flex;justify-content:space-between;align-items:center;border-radius:22px;background:#fff7fa;border:1px solid #f2d6df;padding:18px;font-weight:950;text-align:left}.profile-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.profile-grid div{background:#fff7fa;border:1px solid #f2d6df;border-radius:24px;padding:20px;display:grid;gap:6px}.profile-grid b{font-size:30px}.profile-grid span{color:#766871;font-weight:800}.menu-card{position:fixed;top:100px;left:min(6vw,70px);z-index:60;width:min(420px,90vw)}.admin-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.admin-grid button{display:flex;align-items:center;gap:8px;border-radius:18px;background:#fff7fa;color:#e65378;padding:14px;font-weight:900}.passcode-box{font-size:40px;font-weight:1000;letter-spacing:.16em;background:#fff7fa;border:1px solid #f2d4de;border-radius:24px;padding:18px;text-align:center;margin:14px 0}.timeline-list{display:grid;gap:14px}.timeline-item{display:grid;grid-template-columns:22px 1fr;gap:12px;position:relative}.timeline-item:before{content:"";position:absolute;left:10px;top:22px;bottom:-18px;width:2px;background:#f2d4de}.timeline-item:last-child:before{display:none}.dot{width:22px;height:22px;border-radius:999px;background:#e65378;box-shadow:0 0 0 7px #fff1f5}.timeline-item>div{background:#fff7fa;border:1px solid #f2d6df;border-radius:24px;padding:18px;display:grid;gap:8px}.timeline-item p{margin:0;color:#55474e}.timeline-item small{color:#766871;font-weight:800}.toast{position:fixed;z-index:99;top:18px;left:50%;transform:translateX(-50%);background:#111;color:#fff;border-radius:999px;padding:14px 22px;font-weight:900;box-shadow:0 20px 50px rgba(0,0,0,.24)}
.bottom-nav{position:fixed;left:50%;bottom:14px;z-index:50;transform:translateX(-50%);width:min(520px,88vw);display:grid;grid-template-columns:1fr 1fr 72px 1fr 1fr;align-items:center;background:rgba(255,255,255,.9);border:1px solid rgba(242,214,223,.9);border-radius:999px;padding:7px 10px;box-shadow:0 12px 38px rgba(82,51,64,.14);backdrop-filter:blur(18px)}
.bottom-nav button{background:transparent;color:#81747a;font-weight:950;display:grid;place-items:center;gap:2px;font-size:11px;min-height:42px;line-height:1}
.bottom-nav button svg{width:18px;height:18px}.bottom-nav button.active{color:#e65378}.bottom-nav .nav-home{transform:scale(.84);opacity:.82}.bottom-nav .nav-add{width:62px;height:62px;border-radius:999px;background:linear-gradient(135deg,#fb6f98,#e65378);color:white;transform:translateY(-17px);box-shadow:0 14px 34px rgba(232,78,120,.28);font-size:11px}.bottom-nav .nav-add span,.bottom-nav .nav-add svg{color:#fff}
@media(max-width:860px){.mood-grid,.quick-grid,.feature-grid,.reward-grid,.chores-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:760px){.topbar{padding:14px}.brand h1{font-size:46px}.brand p{font-size:12px}.main{width:92vw;padding-top:18px}.two-column,.mood-grid,.pulse-grid,.quick-grid,.feature-grid,.form-row,.profile-grid,.options-grid,.vault-grid,.reward-grid,.chores-grid{grid-template-columns:1fr}.card{border-radius:28px}.moment-card,.prompt-box{display:grid}.primary,.reset-button,.danger{width:100%}.location-row{grid-template-columns:1fr}.bottom-nav{bottom:8px;width:94vw}.bottom-nav span{font-size:10px}.timer{font-size:58px}.menu-card{left:5vw;top:92px}.mood-row button{width:100%}}
`;