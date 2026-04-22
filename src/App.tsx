import { useState, useEffect } from "react";
import CashFlowStrategy from "./components/CashFlowStrategy";

const STORAGE_KEYS = {
  dailyLog: "omri-daily-log",
  weeklyConvos: "omri-weekly-convos",
  prospects: "omri-prospects",
  currentWeek: "omri-current-week",
};

const getWeekKey = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return `week-${Math.floor(diff / oneWeek)}-${now.getFullYear()}`;
};

const getTodayKey = () => new Date().toISOString().split("T")[0];

const DAILY_TARGETS = [
  { id: "audit",   label: "Run 1 OMRI Audit",         target: 1,  unit: "audit",    icon: "🔍", color: "#C9A84C" },
  { id: "dms",     label: "Send DMs to Local Owners", target: 10, unit: "DMs",      icon: "📨", color: "#C9A84C" },
  { id: "reels",   label: "Post 1 Reel",              target: 1,  unit: "reel",     icon: "🎬", color: "#C9A84C" },
  { id: "posts",   label: "Post 1–2 Feed Posts",      target: 2,  unit: "posts",    icon: "📸", color: "#C9A84C" },
  { id: "followup",label: "Follow Up w/ Prospects",   target: 1,  unit: "follow-up",icon: "🔁", color: "#C9A84C" },
];

const WEEKLY_TARGET_CONVOS = 5;

function loadStorage(key: string, fallback: any) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key: string, value: any) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export default function OmriDashboard() {
  const todayKey = getTodayKey();
  const weekKey  = getWeekKey();

  const [dailyLog,     setDailyLog]     = useState(() => loadStorage(STORAGE_KEYS.dailyLog, {}));
  const [weeklyConvos, setWeeklyConvos] = useState(() => { const s = loadStorage(STORAGE_KEYS.weeklyConvos, {}); return s[weekKey] || 0; });
  const [prospects,    setProspects]    = useState(() => loadStorage(STORAGE_KEYS.prospects, []));
  const [newProspect,  setNewProspect]  = useState("");
  const [activeTab,    setActiveTab]    = useState("today");
  const [addingProspect, setAddingProspect] = useState(false);
  const [streakDays,   setStreakDays]   = useState(0);

  const todayData = dailyLog[todayKey] || {};

  useEffect(() => {
    saveStorage(STORAGE_KEYS.dailyLog, dailyLog);
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const k = d.toISOString().split("T")[0];
      const log = dailyLog[k];
      if (!log) break;
      const completed = DAILY_TARGETS.filter(t => (log[t.id] || 0) >= t.target).length;
      if (completed >= 3) streak++;
      else if (i > 0) break;
    }
    setStreakDays(streak);
  }, [dailyLog]);

  useEffect(() => {
    const stored = loadStorage(STORAGE_KEYS.weeklyConvos, {});
    stored[weekKey] = weeklyConvos;
    saveStorage(STORAGE_KEYS.weeklyConvos, stored);
  }, [weeklyConvos, weekKey]);

  useEffect(() => { saveStorage(STORAGE_KEYS.prospects, prospects); }, [prospects]);

  const incrementAction = (id: string) => {
    setDailyLog((prev: any) => {
      const today = prev[todayKey] || {};
      const current = today[id] || 0;
      const target = DAILY_TARGETS.find(t => t.id === id)!.target;
      return { ...prev, [todayKey]: { ...today, [id]: Math.min(current + 1, target + 5) } };
    });
  };

  const decrementAction = (id: string) => {
    setDailyLog((prev: any) => {
      const today = prev[todayKey] || {};
      const current = today[id] || 0;
      return { ...prev, [todayKey]: { ...today, [id]: Math.max(0, current - 1) } };
    });
  };

  const addProspect = () => {
    if (!newProspect.trim()) return;
    setProspects((prev: any[]) => [{ id: Date.now(), name: newProspect.trim(), status: "not_contacted", addedDate: todayKey, notes: "" }, ...prev]);
    setNewProspect("");
    setAddingProspect(false);
  };

  const cycleProspectStatus = (id: number) => {
    const statuses = ["not_contacted","contacted","replied","call_booked","closed","dead"];
    setProspects((prev: any[]) => prev.map((p: any) => {
      if (p.id !== id) return p;
      const idx = statuses.indexOf(p.status);
      return { ...p, status: statuses[(idx + 1) % statuses.length] };
    }));
  };

  const deleteProspect = (id: number) => setProspects((prev: any[]) => prev.filter((p: any) => p.id !== id));

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    not_contacted: { label: "Not Sent",    color: "#444",    bg: "#1a1a1a" },
    contacted:     { label: "DM Sent",     color: "#C9A84C", bg: "#2a2000" },
    replied:       { label: "Replied",     color: "#6fcf97", bg: "#0a2a18" },
    call_booked:   { label: "Call Booked", color: "#56CCF2", bg: "#0a1f2a" },
    closed:        { label: "Closed ✓",   color: "#27AE60", bg: "#0a1f10" },
    dead:          { label: "Dead",        color: "#666",    bg: "#111"    },
  };

  const totalActionsToday = DAILY_TARGETS.reduce((sum, t) => sum + Math.min(todayData[t.id] || 0, t.target), 0);
  const totalTargetToday  = DAILY_TARGETS.reduce((sum, t) => sum + t.target, 0);
  const todayPercent      = Math.round((totalActionsToday / totalTargetToday) * 100);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const k = d.toISOString().split("T")[0];
    const log = dailyLog[k] || {};
    const done = DAILY_TARGETS.filter(t => (log[t.id] || 0) >= t.target).length;
    return { key: k, done, label: d.toLocaleDateString("en", { weekday: "short" }) };
  });

  const s = { minHeight: "100vh", background: "#0F0F0F", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#F5F0E8", maxWidth: 480, margin: "0 auto", paddingBottom: 100 };

  return (
    <div style={s}>
      {/* Header */}
      <div style={{ padding: "32px 20px 20px", borderBottom: "1px solid #1a1a1a", background: "linear-gradient(180deg, #111 0%, #0F0F0F 100%)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#C9A84C", textTransform: "uppercase", marginBottom: 4 }}>Omri Media</div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>Execution Engine</div>
            <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{new Date().toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: streakDays > 0 ? "#C9A84C" : "#333" }}>{streakDays}🔥</div>
            <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1 }}>Day streak</div>
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>Today's output</span>
            <span style={{ fontSize: 11, color: todayPercent === 100 ? "#C9A84C" : "#666" }}>{todayPercent}%</span>
          </div>
          <div style={{ height: 4, background: "#1a1a1a", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${todayPercent}%`, background: "linear-gradient(90deg, #C9A84C, #f0c86a)", borderRadius: 2, transition: "width 0.4s ease" }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #1a1a1a", background: "#0F0F0F", position: "sticky", top: 0, zIndex: 10 }}>
        {[{ id: "today", label: "Today" }, { id: "pipeline", label: "Pipeline" }, { id: "week", label: "Week" }, { id: "strategy", label: "Strategy" }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "14px 0", background: "none", border: "none", borderBottom: activeTab === tab.id ? "2px solid #C9A84C" : "2px solid transparent", color: activeTab === tab.id ? "#C9A84C" : "#555", fontSize: 13, fontWeight: 600, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1, transition: "all 0.2s" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* TODAY */}
      {activeTab === "today" && (
        <div style={{ padding: "20px 16px" }}>
          <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>Daily Non-Negotiables</div>
          {DAILY_TARGETS.map(task => {
            const current = todayData[task.id] || 0;
            const done = current >= task.target;
            const pct = Math.min((current / task.target) * 100, 100);
            return (
              <div key={task.id} style={{ background: done ? "#111800" : "#141414", border: `1px solid ${done ? "#C9A84C33" : "#222"}`, borderRadius: 12, padding: 16, marginBottom: 10, transition: "all 0.3s" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{task.icon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: done ? "#C9A84C" : "#F5F0E8" }}>{task.label}</div>
                      <div style={{ fontSize: 11, color: "#555", marginTop: 1 }}>Target: {task.target} {task.unit}</div>
                    </div>
                  </div>
                  {done && <div style={{ background: "#C9A84C", color: "#0F0F0F", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 4, letterSpacing: 1 }}>DONE</div>}
                </div>
                <div style={{ height: 3, background: "#222", borderRadius: 2, marginBottom: 12 }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: done ? "#C9A84C" : "#333", borderRadius: 2, transition: "width 0.3s ease" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button onClick={() => decrementAction(task.id)} style={{ width: 36, height: 36, background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, color: "#666", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                  <div style={{ flex: 1, textAlign: "center", fontSize: 20, fontWeight: 800, color: done ? "#C9A84C" : "#F5F0E8" }}>
                    {current} <span style={{ fontSize: 13, color: "#555", fontWeight: 400 }}>/ {task.target}</span>
                  </div>
                  <button onClick={() => incrementAction(task.id)} style={{ width: 36, height: 36, background: done ? "#C9A84C22" : "#C9A84C", border: "none", borderRadius: 8, color: done ? "#C9A84C" : "#0F0F0F", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>+</button>
                </div>
              </div>
            );
          })}
          <div style={{ background: "#141414", border: "1px solid #222", borderRadius: 12, padding: 16, marginTop: 20 }}>
            <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Weekly Conversations</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => setWeeklyConvos((v: number) => Math.max(0, v - 1))} style={{ width: 36, height: 36, background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, color: "#666", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
              <div style={{ flex: 1, textAlign: "center" }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: weeklyConvos >= WEEKLY_TARGET_CONVOS ? "#C9A84C" : "#F5F0E8" }}>{weeklyConvos}</span>
                <span style={{ fontSize: 14, color: "#555" }}> / {WEEKLY_TARGET_CONVOS}</span>
                <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>new conversations this week</div>
              </div>
              <button onClick={() => setWeeklyConvos((v: number) => v + 1)} style={{ width: 36, height: 36, background: "#C9A84C", border: "none", borderRadius: 8, color: "#0F0F0F", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>+</button>
            </div>
            <div style={{ height: 3, background: "#222", borderRadius: 2, marginTop: 12 }}>
              <div style={{ height: "100%", width: `${Math.min((weeklyConvos / WEEKLY_TARGET_CONVOS) * 100, 100)}%`, background: "#C9A84C", borderRadius: 2, transition: "width 0.3s" }} />
            </div>
          </div>
        </div>
      )}

      {/* PIPELINE */}
      {activeTab === "pipeline" && (
        <div style={{ padding: "20px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 2 }}>Prospects ({prospects.length})</div>
            <button onClick={() => setAddingProspect(true)} style={{ background: "#C9A84C", color: "#0F0F0F", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>+ Add</button>
          </div>
          {addingProspect && (
            <div style={{ background: "#141414", border: "1px solid #C9A84C44", borderRadius: 12, padding: 14, marginBottom: 12 }}>
              <input autoFocus value={newProspect} onChange={e => setNewProspect(e.target.value)} onKeyDown={e => e.key === "Enter" && addProspect()} placeholder="Business name or @handle..." style={{ width: "100%", background: "#0F0F0F", border: "1px solid #333", borderRadius: 8, padding: "10px 12px", color: "#F5F0E8", fontSize: 14, marginBottom: 10, boxSizing: "border-box", outline: "none" }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={addProspect} style={{ flex: 1, background: "#C9A84C", color: "#0F0F0F", border: "none", borderRadius: 8, padding: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Add Prospect</button>
                <button onClick={() => setAddingProspect(false)} style={{ background: "#1a1a1a", color: "#666", border: "1px solid #333", borderRadius: 8, padding: "10px 14px", fontSize: 13, cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
            {Object.entries(statusConfig).map(([status, cfg]) => {
              const count = prospects.filter((p: any) => p.status === status).length;
              if (count === 0) return null;
              return <div key={status} style={{ background: cfg.bg, border: `1px solid ${cfg.color}33`, borderRadius: 6, padding: "4px 10px", fontSize: 11, color: cfg.color, fontWeight: 600 }}>{count} {cfg.label}</div>;
            })}
          </div>
          {prospects.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#333" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
              <div style={{ fontSize: 14 }}>No prospects yet.</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Add your first one above.</div>
            </div>
          )}
          {prospects.map((p: any) => {
            const cfg = statusConfig[p.status];
            return (
              <div key={p.id} style={{ background: "#141414", border: `1px solid ${cfg.color}22`, borderRadius: 12, padding: 14, marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#F5F0E8", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: "#555" }}>Added {p.addedDate}</div>
                </div>
                <button onClick={() => cycleProspectStatus(p.id)} style={{ background: cfg.bg, border: `1px solid ${cfg.color}44`, borderRadius: 8, padding: "6px 10px", color: cfg.color, fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{cfg.label}</button>
                <button onClick={() => deleteProspect(p.id)} style={{ background: "none", border: "none", color: "#333", fontSize: 16, cursor: "pointer", padding: 4 }}>✕</button>
              </div>
            );
          })}
        </div>
      )}

      {/* WEEK */}
      {activeTab === "week" && (
        <div style={{ padding: "20px 16px" }}>
          <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>Last 7 Days</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
            {last7Days.map(day => {
              const isToday = day.key === todayKey;
              const full    = day.done >= DAILY_TARGETS.length;
              const partial = day.done >= 3;
              return (
                <div key={day.key} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: isToday ? "#C9A84C" : "#555", marginBottom: 6, textTransform: "uppercase" }}>{day.label}</div>
                  <div style={{ height: 60, background: full ? "#C9A84C" : partial ? "#C9A84C44" : "#1a1a1a", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", border: isToday ? "1px solid #C9A84C" : "1px solid #222" }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: full ? "#0F0F0F" : partial ? "#C9A84C" : "#333" }}>{day.done}</span>
                  </div>
                  <div style={{ fontSize: 9, color: "#444", marginTop: 4 }}>{day.done}/{DAILY_TARGETS.length}</div>
                </div>
              );
            })}
          </div>
          <div style={{ background: "#141414", border: "1px solid #222", borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>This Week</div>
            {[
              { label: "Conversations started",    value: weeklyConvos,                                            target: WEEKLY_TARGET_CONVOS },
              { label: "Days with 3+ tasks done",  value: last7Days.filter(d => d.done >= 3).length,               target: 7 },
              { label: "Full days completed",      value: last7Days.filter(d => d.done >= DAILY_TARGETS.length).length, target: 7 },
            ].map(stat => (
              <div key={stat.label} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "#F5F0E8" }}>{stat.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: stat.value >= stat.target ? "#C9A84C" : "#666" }}>{stat.value}/{stat.target}</span>
                </div>
                <div style={{ height: 3, background: "#222", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${Math.min((stat.value / stat.target) * 100, 100)}%`, background: "#C9A84C", borderRadius: 2, transition: "width 0.3s" }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 12, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#C9A84C", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>The math</div>
            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>
              10 DMs/day → 70/week → 280/month<br />
              10% reply = <span style={{ color: "#C9A84C", fontWeight: 700 }}>28 conversations</span><br />
              10% book = <span style={{ color: "#C9A84C", fontWeight: 700 }}>3 calls</span><br />
              The actions are the job.
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "#333", letterSpacing: 1 }}>Seek first the Kingdom · Matthew 6:33</div>
        </div>
      )}

      {/* STRATEGY */}
      {activeTab === "strategy" && <CashFlowStrategy />}

      {/* Footer */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#0F0F0F", borderTop: "1px solid #1a1a1a", padding: "12px 16px 20px", display: "flex", justifyContent: "center" }}>
        <div style={{ fontSize: 10, color: "#333", letterSpacing: 2, textTransform: "uppercase" }}>@omrimedia · Built to serve. Designed to grow.</div>
      </div>
    </div>
  );
}
