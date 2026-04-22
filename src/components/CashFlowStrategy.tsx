import { useState } from "react";

const phases = [
  {
    id: 1,
    timeline: "Week 1–2",
    label: "The Experiment",
    tagline: "Same energy as the lumping texts. Just send.",
    color: "#C9A84C",
    income: "$0–$500",
    incomeNote: "Paid audit or sample post",
    goal: "Start 5 real conversations with local contractors",
    keyInsight: "You proved this works with lumping companies. Same playbook. Different niche. Higher ticket.",
    experiments: [
      {
        id: "exp1",
        name: "The Live Audit Text",
        effort: "1 hour",
        tool: "OMRI Agent + Google Maps",
        cashPotential: "$0 now → opens door",
        how: [
          "Search 'HVAC Brampton' or 'electrician Mississauga' on Google Maps",
          "Run the OMRI audit on their business — takes 5 min",
          "Text or DM them ONE specific finding. Not a pitch. A finding.",
          "Example: 'Hey — I noticed your Google profile has no booking link. You're showing up in Maps but people can't book from it. I put together a quick audit if you want to see it.'",
          "Send to 10 businesses today. Track responses in the pipeline.",
        ],
        why: "Same as lumping. You researched, you found a number, you sent. This is that — but the finding is the hook instead of a rate.",
      },
      {
        id: "exp2",
        name: "The Free Sample Post",
        effort: "2 hours",
        tool: "Brand DNA + Canva/Google AI Studio",
        cashPotential: "$0 now → $1K/month later",
        how: [
          "Pick a contractor from Google Maps with a dead Instagram",
          "Pull their brand colours and tone from their website",
          "Build ONE carousel or reel thumbnail in their brand using your tools",
          "DM them the image: 'I made this for you — no strings. This is what your Instagram could look like if it was active.'",
          "Follow up once. If they respond, book a call.",
        ],
        why: "The wow factor closes before you pitch anything. You're not selling — you're showing.",
      },
      {
        id: "exp3",
        name: "The $97 Digital Score Report",
        effort: "1–2 hours",
        tool: "OMRI Agent + Notion or PDF",
        cashPotential: "$97–$250 per report",
        how: [
          "Run the full OMRI 6-task audit on a business",
          "Package it as a clean PDF or Notion page — their score, their gaps, their competitor context",
          "Offer it for $97. Not free. Paid means they're invested.",
          "Position it: 'For $97 I'll run a full digital audit of your business and show you exactly where you're losing jobs online.'",
          "Post this offer in 2–3 local GTA Facebook business groups this week.",
        ],
        why: "This is the fastest path to actual cash in hand. $97 × 5 = $485 this week. Each report becomes the pitch for the $1K retainer.",
      },
    ],
  },
  {
    id: 2,
    timeline: "Week 3–4",
    label: "First Cash In",
    tagline: "Convert conversations into paid agreements.",
    color: "#C9A84C",
    income: "$97–$1,000",
    incomeNote: "1 report sale or 1 retainer deposit",
    goal: "Close 1 paid client — any amount",
    keyInsight: "One yes changes your psychology completely. You stop asking if this works and start asking how to do more of it.",
    experiments: [
      {
        id: "exp4",
        name: "The Discovery Call Offer",
        effort: "30 min call",
        tool: "Discovery Call Cheat Sheet",
        cashPotential: "$500–$1,000 setup + $1K/month",
        how: [
          "From week 1 conversations — book a 30 min call with anyone who replied",
          "Open with: 'I'm going to show you exactly what I found. No pitch until you ask.'",
          "Walk through their audit findings. Let them feel the gap.",
          "Ask: 'Which of these is costing you the most right now?'",
          "Present only the GHL features that solve what they named.",
          "Close with a setup fee ($500) + first month ($1,000) or a trial month at reduced rate.",
        ],
        why: "The audit already sold them. The call just confirms the prescription.",
      },
      {
        id: "exp5",
        name: "The Facebook Group Post",
        effort: "20 min",
        tool: "Phone + Facebook",
        cashPotential: "$97–$500 inbound",
        how: [
          "Join 3 GTA contractor or small business Facebook groups",
          "Post: 'I'm doing free 10-minute digital audits for 5 local contractors this week. I'll tell you exactly why people are finding your competitors instead of you on Google. Comment below or DM me.'",
          "Respond to every comment within the hour",
          "Convert free audit to $97 paid report or direct to discovery call",
        ],
        why: "Inbound is easier to close than cold outreach. The post does the qualifying for you.",
      },
    ],
  },
  {
    id: 3,
    timeline: "Month 2",
    label: "The Engine",
    tagline: "Systematise what worked. Repeat it.",
    color: "#C9A84C",
    income: "$1,000–$3,000",
    incomeNote: "1–3 retainer clients",
    goal: "3 clients at $1,000/month = $3K MRR",
    keyInsight: "By now you know what message gets replies, what offer gets paid, and what call closes. You stop experimenting and start executing the thing that worked.",
    experiments: [
      {
        id: "exp6",
        name: "The Daily 10 DM System",
        effort: "45 min/day",
        tool: "OMRI Agent + Execution Dashboard",
        cashPotential: "$3,000 MRR",
        how: [
          "Every morning: run 1 audit, identify 10 prospects from Google Maps",
          "Send 10 personalised DMs using the outreach template from the audit",
          "Log every send in the pipeline dashboard",
          "Follow up with anyone who hasn't replied after 48 hours — once only",
          "Book calls from replies. Close from calls.",
        ],
        why: "10 DMs/day = 300/month. At 10% reply rate = 30 conversations. At 10% close = 3 clients. That's the math.",
      },
      {
        id: "exp7",
        name: "GHL Setup for First Client",
        effort: "4–6 hours once",
        tool: "GoHighLevel sub-account",
        cashPotential: "Funds GHL subscription",
        how: [
          "Once first client pays — set up their GHL sub-account",
          "Install: missed call text-back, pipeline CRM, booking calendar, review requests",
          "Connect their social accounts for auto-posting",
          "Show them one result in week one — a captured lead, a booked call, a review",
          "That result is your case study for every future prospect",
        ],
        why: "The first client funds the tool. The result funds the pitch. The system pays for itself.",
      },
    ],
  },
  {
    id: 4,
    timeline: "Month 3+",
    label: "Compounding",
    tagline: "Results become the sales team.",
    color: "#C9A84C",
    income: "$3,000–$10,000",
    incomeNote: "3–10 retainer clients",
    goal: "10 clients = $10K MRR. GHL SaaS mode unlocked.",
    keyInsight: "At 3 clients you have proof. At 5 you have momentum. At 10 you have a business. Each result you document becomes a door that opens itself.",
    experiments: [
      {
        id: "exp8",
        name: "The Case Study Post",
        effort: "1 hour",
        tool: "Omri Media social + results data",
        cashPotential: "Inbound pipeline",
        how: [
          "Document every result your first clients get — screenshot the booked jobs, the review uptick, the missed call captures",
          "Post the result as educational content on Omri Media's own channels",
          "Format: 'Here's what happened when a [trade] contractor in [city] stopped missing calls.'",
          "No pitch. Just the result. The DMs come to you.",
        ],
        why: "You stop being the one chasing. Results chase for you.",
      },
    ],
  },
];

const totalPotential = [
  { label: "Week 1–2", low: 0, high: 500 },
  { label: "Week 3–4", low: 97, high: 1000 },
  { label: "Month 2", low: 1000, high: 3000 },
  { label: "Month 3+", low: 3000, high: 10000 },
];

export default function CashFlowStrategy() {
  const [activePhase, setActivePhase] = useState(0);
  const [expandedExp, setExpandedExp] = useState<string | null>(null);

  const phase = phases[activePhase];

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Revenue arc */}
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ marginBottom: 20, display: "flex", gap: 4 }}>
          {totalPotential.map((p, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div
                style={{
                  height: 40 + i * 16,
                  background: i === activePhase ? "#C9A84C" : "#1a1a1a",
                  borderRadius: "4px 4px 0 0",
                  border: `1px solid ${i === activePhase ? "#C9A84C" : "#222"}`,
                  marginBottom: 4,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onClick={() => { setActivePhase(i); setExpandedExp(null); }}
              />
              <div style={{ fontSize: 9, color: i === activePhase ? "#C9A84C" : "#444", textTransform: "uppercase", letterSpacing: 0.5 }}>
                {p.label}
              </div>
              <div style={{ fontSize: 10, color: i === activePhase ? "#C9A84C" : "#333", fontWeight: 700 }}>
                ${p.low === 0 ? "0" : p.low >= 1000 ? `${p.low / 1000}K` : p.low}–{p.high >= 1000 ? `${p.high / 1000}K` : p.high}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phase selector */}
      <div style={{
        display: "flex",
        borderBottom: "1px solid #1a1a1a",
        overflowX: "auto",
        background: "#0F0F0F",
        position: "sticky",
        top: 48,
        zIndex: 9,
      }}>
        {phases.map((p, i) => (
          <button
            key={p.id}
            onClick={() => { setActivePhase(i); setExpandedExp(null); }}
            style={{
              flex: "0 0 auto",
              padding: "12px 16px",
              background: "none",
              border: "none",
              borderBottom: activePhase === i ? "2px solid #C9A84C" : "2px solid transparent",
              color: activePhase === i ? "#C9A84C" : "#444",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: 1,
              whiteSpace: "nowrap",
            }}
          >
            {p.timeline}
          </button>
        ))}
      </div>

      {/* Phase content */}
      <div style={{ padding: "20px 16px" }}>
        {/* Phase header */}
        <div style={{
          background: "#111",
          border: "1px solid #C9A84C22",
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#F5F0E8", marginBottom: 2 }}>
                Phase {phase.id}: {phase.label}
              </div>
              <div style={{ fontSize: 13, color: "#666" }}>{phase.tagline}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#C9A84C" }}>{phase.income}</div>
              <div style={{ fontSize: 10, color: "#555" }}>{phase.incomeNote}</div>
            </div>
          </div>
          <div style={{
            background: "#0F0F0F",
            borderRadius: 8,
            padding: "10px 12px",
            borderLeft: "3px solid #C9A84C",
            marginBottom: 10,
          }}>
            <div style={{ fontSize: 12, color: "#C9A84C", fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>
              The Goal
            </div>
            <div style={{ fontSize: 13, color: "#F5F0E8", lineHeight: 1.5 }}>{phase.goal}</div>
          </div>
          <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6, fontStyle: "italic" }}>
            {phase.keyInsight}
          </div>
        </div>

        {/* Experiments */}
        <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>
          Experiments — {phase.experiments.length} action{phase.experiments.length > 1 ? "s" : ""}
        </div>

        {phase.experiments.map((exp, i) => {
          const isOpen = expandedExp === exp.id;
          return (
            <div
              key={exp.id}
              style={{
                background: "#141414",
                border: `1px solid ${isOpen ? "#C9A84C44" : "#222"}`,
                borderRadius: 12,
                marginBottom: 10,
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
            >
              <button
                onClick={() => setExpandedExp(isOpen ? null : exp.id)}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  padding: "16px",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{
                      background: "#C9A84C",
                      color: "#0F0F0F",
                      fontSize: 10,
                      fontWeight: 800,
                      padding: "2px 8px",
                      borderRadius: 4,
                      letterSpacing: 1,
                    }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#F5F0E8" }}>{exp.name}</span>
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ fontSize: 11, color: "#555" }}>⏱ {exp.effort}</div>
                    <div style={{ fontSize: 11, color: "#C9A84C" }}>💰 {exp.cashPotential}</div>
                  </div>
                </div>
                <div style={{ color: "#444", fontSize: 16, flexShrink: 0, marginTop: 2 }}>
                  {isOpen ? "▲" : "▼"}
                </div>
              </button>

              {isOpen && (
                <div style={{ padding: "0 16px 16px" }}>
                  <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                    Tool: {exp.tool}
                  </div>
                  <div style={{ fontSize: 11, color: "#666", fontStyle: "italic", lineHeight: 1.6, marginBottom: 14, padding: "10px 12px", background: "#0F0F0F", borderRadius: 8, borderLeft: "2px solid #C9A84C44" }}>
                    {exp.why}
                  </div>
                  <div style={{ fontSize: 11, color: "#C9A84C", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                    How to execute — step by step
                  </div>
                  {exp.how.map((step, si) => (
                    <div key={si} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                      <div style={{
                        width: 20,
                        height: 20,
                        background: "#C9A84C",
                        color: "#0F0F0F",
                        borderRadius: "50%",
                        fontSize: 10,
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 1,
                      }}>
                        {si + 1}
                      </div>
                      <div style={{ fontSize: 13, color: "#EDE8DF", lineHeight: 1.6 }}>{step}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Bottom principle */}
        <div style={{
          marginTop: 24,
          padding: "16px",
          background: "#111",
          borderRadius: 12,
          textAlign: "center",
          border: "1px solid #1a1a1a",
        }}>
          <div style={{ fontSize: 11, color: "#C9A84C", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
            The only rule
          </div>
          <div style={{ fontSize: 14, color: "#666", lineHeight: 1.7 }}>
            You don't need more tools.<br />
            You don't need a better pitch.<br />
            You need to <span style={{ color: "#F5F0E8", fontWeight: 700 }}>send the thing.</span><br />
            The lumping companies proved it.
          </div>
          <div style={{ marginTop: 14, fontSize: 11, color: "#333", letterSpacing: 1 }}>
            Seek first the Kingdom · Matthew 6:33
          </div>
        </div>
      </div>
    </div>
  );
}
