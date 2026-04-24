import { useState, useEffect, useCallback } from "react";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

interface Task {
  id: string;
  label: string;
}

interface Phase {
  id: number;
  name: string;
  time: string;
  tasks: Task[];
}

interface TimeBlock {
  label: string;
  emoji: string;
  color: string;
  bg: string;
}

export interface CardEntry {
  taskId: string;
  taskLabel: string;
  phase: string;
  phaseNumber: number;
  notes: string;
  prospectName: string;
  result: string;
  savedAt: string;
}

function getTimeBlock(): TimeBlock {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  if (mins >= 9 * 60 && mins < 14 * 60 + 30)
    return { label: "Power Block — Deep Work Time", emoji: "🟢", color: "#C9A84C", bg: "#C9A84C18" };
  if (mins >= 14 * 60 + 30 && mins < 16 * 60 + 30)
    return { label: "School Pickup — Transitioning", emoji: "🟡", color: "#F2C94C", bg: "#F2C94C18" };
  if (mins >= 16 * 60 + 30 && mins < 21 * 60)
    return { label: "Evening Block — Follow-ups & Admin", emoji: "🔵", color: "#56CCF2", bg: "#56CCF218" };
  if (mins >= 21 * 60 || mins < 4 * 60)
    return { label: "Night Work — Planning & Review", emoji: "🌙", color: "#9B51E0", bg: "#9B51E018" };
  return { label: "Early Morning — Prep & Research", emoji: "⏳", color: "#6FCF97", bg: "#6FCF9718" };
}

export const TODAY = new Date().toISOString().split("T")[0];
export const LOCAL_KEY = `omri-sop-${TODAY}`;
export const CARDS_KEY = `omri-cards-${TODAY}`;

export const PHASES: Phase[] = [
  {
    id: 1,
    name: "Research & Prospect",
    time: "~5 min",
    tasks: [
      { id: "p1-1", label: "Open Claude Project — new conversation" },
      { id: "p1-2", label: "Type the promo hunt command for niche + city" },
      { id: "p1-3", label: "Review OMRI ranked prospect list" },
      { id: "p1-4", label: "Identify top 3 Priority Targets (score 8+)" },
      { id: "p1-5", label: "Confirm each has a website" },
      { id: "p1-6", label: "Copy prospects into pipeline tracker" },
      { id: "p1-7", label: "Save OMRI outreach messages" },
    ],
  },
  {
    id: 2,
    name: "Brand DNA Pull",
    time: "~5 min per prospect",
    tasks: [
      { id: "p2-1", label: "Open Google Brand DNA tool" },
      { id: "p2-2", label: "Run Brand DNA for Prospect 1 — record hex colours + tone + logo" },
      { id: "p2-3", label: "Run Brand DNA for Prospect 2 — record hex colours + tone + logo" },
      { id: "p2-4", label: "Run Brand DNA for Prospect 3 — record hex colours + tone + logo" },
      { id: "p2-5", label: "Save all Brand DNA fields in tracker" },
    ],
  },
  {
    id: 3,
    name: "Outreach",
    time: "~10 min",
    tasks: [
      { id: "p3-1", label: "Send outreach message to Prospect 1" },
      { id: "p3-2", label: "Log send date + platform for Prospect 1" },
      { id: "p3-3", label: "Set 48hr follow-up reminder for Prospect 1" },
      { id: "p3-4", label: "Send outreach message to Prospect 2" },
      { id: "p3-5", label: "Log send date + platform for Prospect 2" },
      { id: "p3-6", label: "Set 48hr follow-up reminder for Prospect 2" },
      { id: "p3-7", label: "Send outreach message to Prospect 3" },
      { id: "p3-8", label: "Check inbox for replies from previous outreach" },
      { id: "p3-9", label: "Reply to any responses same day" },
    ],
  },
  {
    id: 4,
    name: "Demo Build",
    time: "~20 min · only when confirmed",
    tasks: [
      { id: "p4-1", label: "Confirm prospect replied YES" },
      { id: "p4-2", label: "Open scratch-off master template" },
      { id: "p4-3", label: "Update all BRAND config fields (name, colours, promo, logo)" },
      { id: "p4-4", label: "Convert logo to base64" },
      { id: "p4-5", label: "Push to GitHub" },
      { id: "p4-6", label: "Wait for Vercel deploy (60 sec)" },
      { id: "p4-7", label: "Test live URL on phone" },
      { id: "p4-8", label: "Send demo link to prospect" },
    ],
  },
  {
    id: 5,
    name: "Close",
    time: "~30 min",
    tasks: [
      { id: "p5-1", label: "Record prospect reaction to demo" },
      { id: "p5-2", label: "Answer questions — no over-explaining" },
      { id: "p5-3", label: "Send payment link when they say yes" },
      { id: "p5-4", label: "Confirm payment received" },
      { id: "p5-5", label: "Mark prospect CLOSED in tracker" },
    ],
  },
  {
    id: 6,
    name: "Deploy & Hand Off",
    time: "~20 min",
    tasks: [
      { id: "p6-1", label: "Confirm demo is live on Vercel" },
      { id: "p6-2", label: "Send handoff message with live URL to client" },
      { id: "p6-3", label: "Teach client 3 ways to share the link (Instagram bio, story, text to regulars)" },
      { id: "p6-4", label: "Set Day 7 check-in reminder" },
      { id: "p6-5", label: "Set Day 14 reminder — export and send lead list as CSV" },
      { id: "p6-6", label: "Document result in case study log — screenshot lead count, note any walk-ins" },
    ],
  },
  {
    id: 7,
    name: "Follow-Up & Upsell",
    time: "Ongoing",
    tasks: [
      { id: "p7-1", label: "Day 7: Check in — how many scratches, any customers walked in?" },
      { id: "p7-2", label: "Day 14: Export lead list from Firestore, send to client as CSV" },
      { id: "p7-3", label: "Day 30: Ask about running next month's promotion" },
      { id: "p7-4", label: "Day 30: Introduce GHL if client has 20+ leads captured" },
      { id: "p7-5", label: "Day 30: Make the referral ask — $200 per paid referral they send" },
      { id: "p7-6", label: "Update promo when it expires — this justifies the $100/month retainer" },
    ],
  },
];

export const TOTAL_TASKS = PHASES.reduce((sum, p) => sum + p.tasks.length, 0);

export function loadLocal(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLocal(data: Record<string, boolean>) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
  } catch {}
}

function loadCardCounts(): Record<string, number> {
  try {
    const raw = localStorage.getItem(CARDS_KEY);
    if (!raw) return {};
    const cards: CardEntry[] = JSON.parse(raw);
    const counts: Record<string, number> = {};
    cards.forEach((c) => {
      counts[c.taskId] = (counts[c.taskId] || 0) + 1;
    });
    return counts;
  } catch {
    return {};
  }
}

function appendCard(card: CardEntry) {
  try {
    const existing: CardEntry[] = JSON.parse(localStorage.getItem(CARDS_KEY) || "[]");
    existing.push(card);
    localStorage.setItem(CARDS_KEY, JSON.stringify(existing));
  } catch {}
}

export default function TodayTab() {
  const [timeBlock, setTimeBlock] = useState<TimeBlock>(getTimeBlock);
  const [completed, setCompleted] = useState<Record<string, boolean>>(loadLocal);
  const [cardCounts, setCardCounts] = useState<Record<string, number>>(loadCardCounts);
  const [modalTask, setModalTask] = useState<Task | null>(null);
  const [modalPhase, setModalPhase] = useState<Phase | null>(null);
  const [notes, setNotes] = useState("");
  const [prospectName, setProspectName] = useState("");
  const [result, setResult] = useState("");
  const [saving, setSaving] = useState(false);
  const [modalTs, setModalTs] = useState("");
  const [collapsedPhases, setCollapsedPhases] = useState<Set<number>>(new Set());

  const togglePhase = (id: number) => {
    setCollapsedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allCollapsed = collapsedPhases.size === PHASES.length;
  const toggleAll = () =>
    setCollapsedPhases(allCollapsed ? new Set() : new Set(PHASES.map((p) => p.id)));

  // Load Firestore completions on mount
  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "completions"), where("date", "==", TODAY));
    getDocs(q)
      .then((snap) => {
        const fromFirestore: Record<string, boolean> = {};
        snap.forEach((doc) => {
          const d = doc.data();
          if (d.taskId) fromFirestore[d.taskId] = true;
        });
        if (Object.keys(fromFirestore).length > 0) {
          setCompleted((prev) => {
            const merged = { ...prev, ...fromFirestore };
            saveLocal(merged);
            return merged;
          });
        }
      })
      .catch(() => {});
  }, []);

  // Update time block every minute
  useEffect(() => {
    const id = setInterval(() => setTimeBlock(getTimeBlock()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Toggle: check if unchecked, uncheck if checked
  const toggleTask = useCallback(
    async (task: Task, phase: Phase) => {
      const alreadyDone = completed[task.id];

      if (alreadyDone) {
        const next = { ...completed, [task.id]: false };
        setCompleted(next);
        saveLocal(next);
      } else {
        const next = { ...completed, [task.id]: true };
        setCompleted(next);
        saveLocal(next);
        if (db) {
          try {
            await addDoc(collection(db, "completions"), {
              taskId: task.id,
              taskLabel: task.label,
              phase: phase.name,
              phaseNumber: phase.id,
              completedAt: serverTimestamp(),
              date: TODAY,
              notes: "",
              prospectName: "",
              result: "",
            });
          } catch {}
        }
      }
    },
    [completed]
  );

  const openModal = (task: Task, phase: Phase) => {
    setModalTask(task);
    setModalPhase(phase);
    setNotes("");
    setProspectName("");
    setResult("");
    setModalTs(new Date().toLocaleString());
  };

  const closeModal = () => {
    setModalTask(null);
    setModalPhase(null);
  };

  const saveCard = async () => {
    if (!modalTask || !modalPhase) return;
    setSaving(true);

    const cardData: CardEntry = {
      taskId: modalTask.id,
      taskLabel: modalTask.label,
      phase: modalPhase.name,
      phaseNumber: modalPhase.id,
      notes,
      prospectName,
      result,
      savedAt: new Date().toISOString(),
    };

    // Always persist to localStorage so ActivityTab can read it
    appendCard(cardData);

    // Also write to Firestore if configured
    if (db) {
      try {
        await addDoc(collection(db, "completions"), {
          ...cardData,
          completedAt: serverTimestamp(),
          date: TODAY,
          isCard: true,
        });
      } catch {}
    }

    // Update card count badge
    setCardCounts((prev) => ({
      ...prev,
      [modalTask.id]: (prev[modalTask.id] || 0) + 1,
    }));

    // Mark task complete when a card is saved
    const next = { ...completed, [modalTask.id]: true };
    setCompleted(next);
    saveLocal(next);

    setSaving(false);
    closeModal();
  };

  const completedCount = Object.values(completed).filter(Boolean).length;
  const progress = Math.round((completedCount / TOTAL_TASKS) * 100);
  const todayLabel = new Date().toLocaleDateString("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <div style={{ paddingBottom: 100 }}>
        {/* Time block banner */}
        <div
          style={{
            margin: "16px 16px 0",
            background: timeBlock.bg,
            border: `1px solid ${timeBlock.color}44`,
            borderRadius: 12,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 22, lineHeight: 1 }}>{timeBlock.emoji}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: timeBlock.color }}>
              {timeBlock.label}
            </div>
            <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{todayLabel}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ padding: "16px 16px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 1 }}>
              {completedCount} of {TOTAL_TASKS} tasks completed
            </span>
            <span style={{ fontSize: 11, color: progress === 100 ? "#C9A84C" : "#555" }}>
              {progress}%
            </span>
          </div>
          <div style={{ height: 4, background: "#1a1a1a", borderRadius: 2, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #C9A84C, #f0c86a)",
                borderRadius: 2,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* Phase list */}
        <div style={{ padding: "20px 16px 0" }}>
          {/* Collapse/expand all */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <button
              onClick={toggleAll}
              style={{
                background: "none",
                border: "none",
                color: "#555",
                fontSize: 11,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: 1,
                padding: 0,
                fontFamily: "inherit",
              }}
            >
              {allCollapsed ? "Expand All" : "Collapse All"}
            </button>
          </div>

          {PHASES.map((phase) => {
            const doneCount = phase.tasks.filter((t) => completed[t.id]).length;
            const allDone = doneCount === phase.tasks.length;
            const isCollapsed = collapsedPhases.has(phase.id);

            return (
              <div key={phase.id} style={{ marginBottom: 16 }}>
                {/* Phase header — tap to collapse/expand */}
                <button
                  onClick={() => togglePhase(phase.id)}
                  style={{
                    width: "100%",
                    background: allDone ? "#111800" : "#141414",
                    border: `1px solid ${allDone ? "#C9A84C33" : "#222"}`,
                    borderRadius: isCollapsed ? 10 : "10px 10px 0 0",
                    padding: "10px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "border-radius 0.15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: allDone ? "#C9A84C" : "#1a1a1a",
                        border: `1px solid ${allDone ? "#C9A84C" : "#333"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 800,
                        color: allDone ? "#0F0F0F" : "#555",
                        flexShrink: 0,
                        transition: "all 0.2s",
                      }}
                    >
                      {allDone ? "✓" : phase.id}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: allDone ? "#C9A84C" : "#F5F0E8",
                          transition: "color 0.2s",
                        }}
                      >
                        Phase {phase.id} — {phase.name}
                      </div>
                      <div style={{ fontSize: 11, color: "#555", marginTop: 1 }}>{phase.time}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: allDone ? "#C9A84C" : "#444" }}>
                      {doneCount}/{phase.tasks.length}
                    </span>
                    <span style={{ fontSize: 10, color: "#444" }}>{isCollapsed ? "▼" : "▲"}</span>
                  </div>
                </button>

                {/* Task rows */}
                {!isCollapsed && <div
                  style={{
                    background: "#0F0F0F",
                    border: "1px solid #1a1a1a",
                    borderTop: "none",
                    borderRadius: "0 0 10px 10px",
                    overflow: "hidden",
                  }}
                >
                  {phase.tasks.map((task, idx) => {
                    const done = !!completed[task.id];
                    const count = cardCounts[task.id] || 0;
                    const isLast = idx === phase.tasks.length - 1;

                    return (
                      <div
                        key={task.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "12px 14px",
                          borderBottom: isLast ? "none" : "1px solid #161616",
                          background: done ? "#0d1300" : "transparent",
                          transition: "background 0.25s",
                        }}
                      >
                        {/* Circular checkbox — tap to toggle */}
                        <button
                          onClick={() => toggleTask(task, phase)}
                          aria-label={done ? "Uncheck task" : "Mark complete"}
                          title={done ? "Tap to uncheck" : "Tap to complete"}
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            border: done ? "none" : "2px solid #333",
                            background: done ? "#C9A84C" : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            flexShrink: 0,
                            transition: "all 0.2s",
                            color: "#0F0F0F",
                            fontSize: 13,
                            fontWeight: 800,
                            padding: 0,
                          }}
                        >
                          {done && "✓"}
                        </button>

                        {/* Label */}
                        <div
                          style={{
                            flex: 1,
                            fontSize: 13,
                            color: done ? "#555" : "#EDE8DF",
                            lineHeight: 1.45,
                            textDecoration: done ? "line-through" : "none",
                            transition: "all 0.2s",
                          }}
                        >
                          {task.label}
                        </div>

                        {/* Card (+) button with count badge */}
                        <div style={{ position: "relative", flexShrink: 0 }}>
                          <button
                            onClick={() => openModal(task, phase)}
                            aria-label="Add card"
                            style={{
                              width: 30,
                              height: 28,
                              border: "1px solid #C9A84C55",
                              borderRadius: 6,
                              background: count > 0 ? "#C9A84C18" : "none",
                              color: "#C9A84C",
                              fontSize: 16,
                              fontWeight: 400,
                              lineHeight: 1,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: 0,
                            }}
                          >
                            +
                          </button>
                          {count > 0 && (
                            <div
                              style={{
                                position: "absolute",
                                top: -6,
                                right: -6,
                                width: 16,
                                height: 16,
                                background: "#C9A84C",
                                borderRadius: "50%",
                                fontSize: 9,
                                fontWeight: 800,
                                color: "#0F0F0F",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                pointerEvents: "none",
                              }}
                            >
                              {count}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom sheet modal */}
      {modalTask && (
        <>
          <div
            onClick={closeModal}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", zIndex: 50 }}
          />
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "100%",
              maxWidth: 480,
              background: "#141414",
              borderRadius: "20px 20px 0 0",
              borderTop: "1px solid #2a2a2a",
              zIndex: 51,
              padding: "20px 20px 44px",
              animation: "slideUp 0.22s ease",
            }}
          >
            <div style={{ width: 36, height: 4, background: "#333", borderRadius: 2, margin: "0 auto 20px" }} />

            <div style={{ fontSize: 15, fontWeight: 700, color: "#F5F0E8", lineHeight: 1.4, marginBottom: 4 }}>
              {modalTask.label}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#C9A84C",
                textTransform: "uppercase",
                letterSpacing: 1.5,
                marginBottom: 4,
              }}
            >
              Phase {modalPhase?.id} — {modalPhase?.name}
            </div>
            {(cardCounts[modalTask.id] || 0) > 0 && (
              <div style={{ fontSize: 11, color: "#555", marginBottom: 18 }}>
                {cardCounts[modalTask.id]} card{cardCounts[modalTask.id] > 1 ? "s" : ""} already saved — adding another
              </div>
            )}
            {!(cardCounts[modalTask.id] > 0) && <div style={{ marginBottom: 18 }} />}

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                Notes
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What happened? What did you find?"
                rows={3}
                style={{
                  width: "100%",
                  background: "#0F0F0F",
                  border: "1px solid #2a2a2a",
                  borderRadius: 8,
                  padding: "10px 12px",
                  color: "#F5F0E8",
                  fontSize: 13,
                  lineHeight: 1.5,
                  resize: "none",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                Prospect Name
              </div>
              <input
                value={prospectName}
                onChange={(e) => setProspectName(e.target.value)}
                placeholder="Business name or @handle"
                style={{
                  width: "100%",
                  background: "#0F0F0F",
                  border: "1px solid #2a2a2a",
                  borderRadius: 8,
                  padding: "10px 12px",
                  color: "#F5F0E8",
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                Result
              </div>
              <input
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="What was the outcome?"
                style={{
                  width: "100%",
                  background: "#0F0F0F",
                  border: "1px solid #2a2a2a",
                  borderRadius: 8,
                  padding: "10px 12px",
                  color: "#F5F0E8",
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div style={{ fontSize: 10, color: "#333", textAlign: "center", marginBottom: 20, letterSpacing: 0.5 }}>
              {modalTs}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={saveCard}
                disabled={saving}
                style={{
                  flex: 1,
                  background: saving ? "#8a7030" : "#C9A84C",
                  color: "#0F0F0F",
                  border: "none",
                  borderRadius: 10,
                  padding: "14px 0",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: saving ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  transition: "background 0.2s",
                }}
              >
                {saving ? "Saving…" : "Save Card"}
              </button>
              <button
                onClick={closeModal}
                style={{
                  background: "none",
                  border: "1px solid #2a2a2a",
                  borderRadius: 10,
                  padding: "14px 20px",
                  color: "#666",
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Close
              </button>
            </div>
          </div>

          <style>{`
            @keyframes slideUp {
              from { transform: translateX(-50%) translateY(100%); }
              to   { transform: translateX(-50%) translateY(0); }
            }
          `}</style>
        </>
      )}
    </>
  );
}
