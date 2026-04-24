import { useState, useEffect } from "react";
import { PHASES, TOTAL_TASKS, CardEntry } from "./TodayTab";

interface DayActivity {
  date: string;
  label: string;
  isToday: boolean;
  completedCount: number;
  cards: CardEntry[];
}

function getDateLabel(dateStr: string): string {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (dateStr === today) return "Today";
  if (dateStr === yesterday) return "Yesterday";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" });
}

function getPhaseColor(phaseNumber: number): string {
  const colors = ["#C9A84C", "#56CCF2", "#6FCF97", "#9B51E0", "#F2994A", "#EB5757", "#F2C94C"];
  return colors[(phaseNumber - 1) % colors.length];
}

export default function ActivityTab() {
  const [days, setDays] = useState<DayActivity[]>([]);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [totalCards, setTotalCards] = useState(0);

  useEffect(() => {
    const result: DayActivity[] = [];
    let cardTotal = 0;

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const isToday = i === 0;

      // Load completions
      let completedCount = 0;
      try {
        const raw = localStorage.getItem(`omri-sop-${dateStr}`);
        if (raw) {
          const comp = JSON.parse(raw);
          completedCount = Object.values(comp).filter(Boolean).length;
        }
      } catch {}

      // Load cards
      let cards: CardEntry[] = [];
      try {
        const raw = localStorage.getItem(`omri-cards-${dateStr}`);
        if (raw) {
          cards = JSON.parse(raw);
          cardTotal += cards.length;
        }
      } catch {}

      // Only include days with any activity
      if (completedCount > 0 || cards.length > 0 || isToday) {
        result.push({
          date: dateStr,
          label: getDateLabel(dateStr),
          isToday,
          completedCount,
          cards: [...cards].reverse(), // newest first
        });
      }
    }

    setDays(result);
    setTotalCards(cardTotal);
  }, []);

  const todayActivity = days.find((d) => d.isToday);
  const todayProgress = todayActivity
    ? Math.round((todayActivity.completedCount / TOTAL_TASKS) * 100)
    : 0;

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Summary header */}
      <div style={{ padding: "20px 16px 0" }}>
        <div
          style={{
            background: "#111",
            border: "1px solid #1a1a1a",
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#555",
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 12,
            }}
          >
            Today's Progress
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "#F5F0E8" }}>
              {todayActivity?.completedCount ?? 0} of {TOTAL_TASKS} tasks done
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: todayProgress === 100 ? "#C9A84C" : "#555",
              }}
            >
              {todayProgress}%
            </span>
          </div>
          <div style={{ height: 4, background: "#1a1a1a", borderRadius: 2, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${todayProgress}%`,
                background: "linear-gradient(90deg, #C9A84C, #f0c86a)",
                borderRadius: 2,
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 14,
              paddingTop: 14,
              borderTop: "1px solid #1a1a1a",
            }}
          >
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#C9A84C" }}>{totalCards}</div>
              <div style={{ fontSize: 11, color: "#555" }}>cards saved</div>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#F5F0E8" }}>
                {days.filter((d) => d.completedCount > 0).length}
              </div>
              <div style={{ fontSize: 11, color: "#555" }}>active days</div>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#F5F0E8" }}>
                {PHASES.length}
              </div>
              <div style={{ fontSize: 11, color: "#555" }}>phases</div>
            </div>
          </div>
        </div>

        {/* Day-by-day activity feed */}
        {days.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#333" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 14, color: "#444" }}>No activity yet today.</div>
            <div style={{ fontSize: 12, color: "#333", marginTop: 4 }}>
              Complete tasks and save cards in the Today tab.
            </div>
          </div>
        )}

        {days.map((day) => (
          <div key={day.date} style={{ marginBottom: 24 }}>
            {/* Day label */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: day.isToday ? "#C9A84C" : "#555",
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                }}
              >
                {day.label}
              </div>
              <div style={{ fontSize: 11, color: "#444" }}>
                {day.completedCount} task{day.completedCount !== 1 ? "s" : ""} ·{" "}
                {day.cards.length} card{day.cards.length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Completed tasks summary (phase breakdown) */}
            {day.completedCount > 0 && (
              <div
                style={{
                  background: "#141414",
                  border: "1px solid #1a1a1a",
                  borderRadius: 10,
                  padding: "12px 14px",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: "#555",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 10,
                  }}
                >
                  Completed Tasks
                </div>
                {PHASES.map((phase) => {
                  let completedInPhase = 0;
                  try {
                    const raw = localStorage.getItem(`omri-sop-${day.date}`);
                    if (raw) {
                      const comp = JSON.parse(raw);
                      completedInPhase = phase.tasks.filter((t) => comp[t.id]).length;
                    }
                  } catch {}
                  if (completedInPhase === 0) return null;
                  const phaseColor = getPhaseColor(phase.id);
                  return (
                    <div
                      key={phase.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: phaseColor,
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ fontSize: 12, color: "#888" }}>
                          Phase {phase.id} — {phase.name}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: completedInPhase === phase.tasks.length ? phaseColor : "#555",
                        }}
                      >
                        {completedInPhase}/{phase.tasks.length}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Cards */}
            {day.cards.map((card, idx) => {
              const cardId = `${day.date}-${card.taskId}-${idx}`;
              const isExpanded = expandedCard === cardId;
              const phaseColor = getPhaseColor(card.phaseNumber);
              const time = new Date(card.savedAt).toLocaleTimeString("en", {
                hour: "numeric",
                minute: "2-digit",
              });

              return (
                <div
                  key={cardId}
                  style={{
                    background: "#141414",
                    border: `1px solid ${isExpanded ? "#C9A84C33" : "#1a1a1a"}`,
                    borderRadius: 10,
                    marginBottom: 8,
                    overflow: "hidden",
                    transition: "border-color 0.2s",
                  }}
                >
                  <button
                    onClick={() => setExpandedCard(isExpanded ? null : cardId)}
                    style={{
                      width: "100%",
                      background: "none",
                      border: "none",
                      padding: "12px 14px",
                      cursor: "pointer",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                    }}
                  >
                    {/* Phase colour dot */}
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: phaseColor,
                        flexShrink: 0,
                        marginTop: 4,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#F5F0E8",
                          marginBottom: 3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {card.taskLabel}
                      </div>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        {card.prospectName && (
                          <span style={{ fontSize: 11, color: "#C9A84C" }}>
                            {card.prospectName}
                          </span>
                        )}
                        <span style={{ fontSize: 11, color: "#444" }}>
                          Phase {card.phaseNumber}
                        </span>
                        <span style={{ fontSize: 11, color: "#333" }}>{time}</span>
                      </div>
                    </div>
                    <div style={{ color: "#333", fontSize: 12, flexShrink: 0 }}>
                      {isExpanded ? "▲" : "▼"}
                    </div>
                  </button>

                  {isExpanded && (
                    <div
                      style={{
                        padding: "0 14px 14px",
                        borderTop: "1px solid #1a1a1a",
                      }}
                    >
                      <div style={{ paddingTop: 12 }}>
                        {card.notes ? (
                          <div style={{ marginBottom: 10 }}>
                            <div
                              style={{
                                fontSize: 10,
                                color: "#555",
                                textTransform: "uppercase",
                                letterSpacing: 1,
                                marginBottom: 4,
                              }}
                            >
                              Notes
                            </div>
                            <div
                              style={{
                                fontSize: 13,
                                color: "#CCC",
                                lineHeight: 1.6,
                                background: "#0F0F0F",
                                borderRadius: 6,
                                padding: "8px 10px",
                              }}
                            >
                              {card.notes}
                            </div>
                          </div>
                        ) : null}

                        {card.result ? (
                          <div style={{ marginBottom: 10 }}>
                            <div
                              style={{
                                fontSize: 10,
                                color: "#555",
                                textTransform: "uppercase",
                                letterSpacing: 1,
                                marginBottom: 4,
                              }}
                            >
                              Result
                            </div>
                            <div
                              style={{
                                fontSize: 13,
                                color: "#6FCF97",
                                lineHeight: 1.5,
                                fontWeight: 600,
                              }}
                            >
                              {card.result}
                            </div>
                          </div>
                        ) : null}

                        {!card.notes && !card.result && (
                          <div style={{ fontSize: 12, color: "#444", fontStyle: "italic" }}>
                            No notes or result recorded.
                          </div>
                        )}

                        <div
                          style={{
                            fontSize: 10,
                            color: "#2a2a2a",
                            marginTop: 10,
                            letterSpacing: 0.5,
                          }}
                        >
                          {new Date(card.savedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {day.completedCount === 0 && day.cards.length === 0 && day.isToday && (
              <div
                style={{
                  background: "#141414",
                  border: "1px solid #1a1a1a",
                  borderRadius: 10,
                  padding: "20px 14px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 12, color: "#333" }}>
                  No activity yet — head to Today to start.
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
