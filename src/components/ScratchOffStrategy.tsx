import { useState } from "react";

const PHASE_COLORS = ["#C9A84C", "#56CCF2", "#6FCF97", "#9B51E0", "#F2994A", "#EB5757", "#F2C94C"];

const PHASES = [
  {
    id: 1,
    name: "Research & Prospect",
    time: "5 min",
    who: "OMRI Agent",
    output: "Ranked prospect list",
    goal: "Get a ranked list of repeat-visit businesses in the Golden Horseshoe running active promotions with no lead capture.",
    rule: "Only prospects with a website move forward. No website = no Brand DNA = skip.",
    sections: [
      {
        id: "p1s1",
        title: "Trigger OMRI",
        steps: [
          "Open a new conversation in this Claude Project",
          "Type exactly: Run the promo hunt for [niche] in [city]",
          "Example: 'Run the promo hunt for barbershops in Brampton'",
          "OMRI searches Instagram, Facebook, and Google Maps and returns a ranked list",
        ],
      },
      {
        id: "p1s2",
        title: "What OMRI Returns",
        steps: [
          "Business name and location",
          "Platform where they are running a promotion",
          "What their promotion says",
          "Whether they have a website (required for Phase 2)",
          "An Opportunity Score out of 14",
          "A personalised outreach message ready to send",
        ],
      },
      {
        id: "p1s3",
        title: "Your Only Job",
        steps: [
          "Review the list",
          "Pick the top 3 Priority Targets — score 8 or higher with a website",
          "Copy them into the pipeline tracker",
          "Move to Phase 2",
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Brand DNA Pull",
    time: "5 min",
    who: "You or team",
    output: "Colours, tone, logo",
    goal: "Extract the business's brand colours, tone, and logo so the scratch-off demo looks exactly like their brand — not a generic template.",
    rule: "No website = skip. Brand DNA cannot run without a website URL.",
    sections: [
      {
        id: "p2s1",
        title: "Tool to Use",
        steps: [
          "Google's Promethean Brand DNA tool",
          "Input: the prospect's website URL",
          "Output: brand colours, fonts, tone, and how Google perceives the business",
        ],
      },
      {
        id: "p2s2",
        title: "What to Extract",
        steps: [
          "Primary Colour — dominant colour in logo/buttons, record as hex (e.g. #C9714A)",
          "Secondary Colour — background or accent, usually lighter version of primary",
          "Brand Tone — Bold and confident? Friendly and casual? Premium and quiet?",
          "Logo — screenshot it or note the URL",
          "Active Promotion — copy the exact offer wording from their site",
        ],
      },
      {
        id: "p2s3",
        title: "Where to Save",
        steps: [
          "Add all five fields to the prospect's row in the pipeline tracker",
          "You will need them in Phase 4 when you build the demo",
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Outreach",
    time: "10 min",
    who: "You or team",
    output: "First message sent",
    goal: "Send one message to each Priority Target. The goal is not to sell. The goal is to get a reply.",
    rule: "Do not send more than one follow-up per prospect.",
    sections: [
      {
        id: "p3s1",
        title: "Message Structure",
        steps: [
          "Line 1: Reference their specific promotion by name",
          "Line 2: Tell them you started building something for them",
          "Line 3: Say you need to confirm their brand colours before finishing",
          "Line 4: Ask if you can send them what the brand tool found",
          "No price. No pitch. One question only.",
        ],
        note: "OMRI generates the personalised message at the end of the promo hunt. Use it exactly as written.",
      },
      {
        id: "p3s2",
        title: "Where to Send",
        steps: [
          "1st — Instagram DM (most business owners check daily)",
          "2nd — Facebook page message",
          "3rd — Website contact form",
          "4th — Phone call or text if number is listed",
        ],
      },
      {
        id: "p3s3",
        title: "After Sending",
        steps: [
          "Log the send in the pipeline tracker — date sent, platform used",
          "Set a follow-up reminder for 48 hours later",
          "Do not send more than one follow-up",
          "If no reply after follow-up — mark as cold, move on",
        ],
      },
      {
        id: "p3s4",
        title: "When They Reply",
        steps: [
          "Yes to seeing brand report → Move to Phase 4 immediately. Build the demo same day.",
          "Ask about cost → 'Nothing yet. I just want to make sure it looks right before I show you anything.'",
          "No → Thank them, mark as cold, do not follow up again",
        ],
      },
    ],
  },
  {
    id: 4,
    name: "Demo Build",
    time: "20 min",
    who: "You",
    output: "Live scratch-off URL",
    goal: "Build a personalised, live, working scratch-off demo using their brand colours and active promotion. The demo closes the conversation.",
    rule: "Do not build the demo before they confirm interest.",
    sections: [
      {
        id: "p4s1",
        title: "What You Need First",
        steps: [
          "Their primary hex colour (from Phase 2)",
          "Their secondary hex colour (from Phase 2)",
          "Their logo file or URL (from Phase 2)",
          "Their active promotion wording (from Phase 2)",
          "Their business name and address",
        ],
      },
      {
        id: "p4s2",
        title: "Build the Demo",
        steps: [
          "Open the scratch-off template: kappakuts-blackfriday-demo.jsx",
          "Scroll to the BRAND config section at the top",
          "Change: name, tagline, promo, promoDetail, expiry, confirmMsg",
          "Change: gold/primaryColor to their primary hex",
          "Change: bg/secondaryColor to their background hex",
          "Change: LOGO_B64 to their logo as a base64 string",
        ],
      },
      {
        id: "p4s3",
        title: "Get Logo as Base64",
        steps: [
          "Right-click their logo on their website → Save image as → desktop",
          "Go to base64.guru/converter/encode/image",
          "Upload the logo file",
          "Copy the output string",
          "Paste it where LOGO_B64 is in the config",
        ],
      },
      {
        id: "p4s4",
        title: "Deploy",
        steps: [
          "Open your GitHub repository for the scratch-off project",
          "Replace App.jsx with your updated file",
          "Commit with message: '[Client name] demo build'",
          "Push to main branch",
          "Vercel auto-deploys in 60 seconds",
          "Copy the live URL from the Vercel dashboard",
        ],
      },
      {
        id: "p4s5",
        title: "Send the Demo",
        steps: [
          "Reply to their original message with the live link",
          "'Here's what I built using your brand. Try it yourself — [link].'",
          "'This is what your [promo name] looks like when a customer finds it on their phone.'",
          "'Their email goes straight to you when they claim. Let me know what you think.'",
        ],
      },
    ],
  },
  {
    id: 5,
    name: "Close",
    time: "30 min",
    who: "You",
    output: "$500 setup payment",
    goal: "Convert their reaction to the demo into a $500 setup payment. You are not pitching. You are answering questions and making it easy to say yes.",
    rule: "Never pitch a price before sending the demo. Never deploy before payment is received.",
    sections: [
      {
        id: "p5s1",
        title: "How to Respond",
        steps: [
          "'This is amazing' → '$500 one time. I can have it live and capturing real emails by tomorrow.'",
          "'How much?' → '$500 setup and $100/month to keep it running. You keep every lead it captures.'",
          "'Can I think about it?' → 'Of course. It's ready whenever you are. Anything you want to see differently?'",
          "No response after demo → Follow up once at 48 hours: 'Just checking if you had a chance to try it.'",
        ],
      },
      {
        id: "p5s2",
        title: "Collect Payment",
        steps: [
          "E-transfer — your Canadian bank email",
          "PayPal — paypal.me/omrimedia",
          "Stripe — create a $500 payment link at stripe.com",
          "When they agree, send the payment link immediately",
          "Do not start Phase 6 until payment is received or confirmed in writing",
        ],
      },
    ],
  },
  {
    id: 6,
    name: "Deploy & Hand Off",
    time: "20 min",
    who: "You",
    output: "Client has live URL",
    goal: "Get the client's live scratch-off URL in front of them and make sure they know how to use it. This is the moment they become a believer.",
    sections: [
      {
        id: "p6s1",
        title: "After Payment Clears",
        steps: [
          "Confirm the demo is deployed and live (should already be from Phase 4)",
          "Send the handoff message: 'You're live. Here's your link: [URL]'",
          "'Share this anywhere — Instagram story, WhatsApp, text to customers.'",
          "'When someone scratches and enters their email, it goes into your lead list.'",
          "Send 3 ways to share: copy the link, add to Instagram bio, text it to regulars",
          "Set a 7-day reminder to check in",
        ],
      },
      {
        id: "p6s2",
        title: "Document the Result",
        steps: [
          "Screenshot the lead count in Firestore after week 1",
          "Ask the client if any customers came in showing the scratch-off",
          "Record the result: 'X leads captured in Y days'",
          "Post as educational content on Omri Media social — no pitch, just the result",
        ],
        note: "Every client result becomes your sales tool for the next client. This step is critical.",
      },
    ],
  },
  {
    id: 7,
    name: "Follow-Up & Upsell",
    time: "Ongoing",
    who: "You or automation",
    output: "Monthly retainer",
    goal: "Keep the client active, document results, and open the door to the monthly retainer and GHL upsell when the time is right.",
    sections: [
      {
        id: "p7s1",
        title: "Check-In Rhythm",
        steps: [
          "Day 7 — 'How many scratches? Any customers came in?' Builds trust fast.",
          "Day 14 — Send their lead list from Firestore as a CSV. Shows tangible value.",
          "Day 30 — 'Want to run a new promotion next month?' Opens the retainer.",
          "Day 30 — Introduce GHL if they have 20+ leads. Ready for automation upsell.",
          "Ongoing — Update their promo when it expires. Justifies the $100/month.",
        ],
      },
      {
        id: "p7s2",
        title: "The Referral Ask",
        steps: [
          "At day 30 if the client is happy, say this:",
          "'If you know any other [niche] owners who'd want something like this, send them my way.'",
          "'If they sign up, I'll send you $200 when their payment clears. No limit on referrals.'",
          "They know other business owners. They talk. Let them sell for you.",
        ],
      },
      {
        id: "p7s3",
        title: "The GHL Upsell",
        steps: [
          "Trigger: when client has 20+ leads captured",
          "'You've got [X] emails now. Want me to set up automatic follow-up messages?'",
          "'Every new lead gets a text or email from you automatically. I can have it running this week.'",
          "Price: $500 setup + $150/month added to their current plan",
        ],
      },
    ],
  },
];

const PRICING = [
  { item: "Brand DNA Report", price: "FREE", note: "Always free — opens the door" },
  { item: "Scratch-Off Demo", price: "FREE", note: "Built after they confirm colours" },
  { item: "Setup fee", price: "$500", note: "One-time, before you deploy" },
  { item: "Monthly maintenance", price: "$100/mo", note: "Recurring after setup" },
  { item: "GHL automation", price: "$500 + $150/mo", note: "After 20+ leads captured" },
  { item: "Referral payout", price: "$200", note: "Per referral when they pay" },
];

export default function ScratchOffStrategy() {
  const [activePhase, setActivePhase] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const phase = PHASES[activePhase];
  const color = PHASE_COLORS[activePhase];

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Pipeline overview */}
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ display: "flex", gap: 3, marginBottom: 20, overflowX: "auto" }}>
          {PHASES.map((p, i) => (
            <div
              key={p.id}
              onClick={() => { setActivePhase(i); setExpandedSection(null); }}
              style={{
                flex: "0 0 auto",
                textAlign: "center",
                cursor: "pointer",
                minWidth: 44,
              }}
            >
              <div style={{
                height: 28 + i * 6,
                background: i === activePhase ? PHASE_COLORS[i] : "#1a1a1a",
                borderRadius: "4px 4px 0 0",
                border: `1px solid ${i === activePhase ? PHASE_COLORS[i] : "#222"}`,
                marginBottom: 4,
                transition: "all 0.2s",
              }} />
              <div style={{ fontSize: 9, color: i === activePhase ? PHASE_COLORS[i] : "#333", fontWeight: 700 }}>
                P{p.id}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phase tabs */}
      <div style={{
        display: "flex",
        borderBottom: "1px solid #1a1a1a",
        overflowX: "auto",
        background: "#0F0F0F",
        position: "sticky",
        top: 48,
        zIndex: 9,
      }}>
        {PHASES.map((p, i) => (
          <button
            key={p.id}
            onClick={() => { setActivePhase(i); setExpandedSection(null); }}
            style={{
              flex: "0 0 auto",
              padding: "12px 14px",
              background: "none",
              border: "none",
              borderBottom: activePhase === i ? `2px solid ${PHASE_COLORS[i]}` : "2px solid transparent",
              color: activePhase === i ? PHASE_COLORS[i] : "#444",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: 0.8,
              whiteSpace: "nowrap",
            }}
          >
            P{p.id} · {p.name}
          </button>
        ))}
      </div>

      {/* Phase content */}
      <div style={{ padding: "20px 16px" }}>
        {/* Phase header */}
        <div style={{
          background: "#111",
          border: `1px solid ${color}22`,
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>
                Phase {phase.id} · {phase.time}
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#F5F0E8", marginBottom: 2 }}>
                {phase.name}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
              <div style={{ fontSize: 11, color: "#555", marginBottom: 2 }}>{phase.who}</div>
              <div style={{ fontSize: 11, color, fontWeight: 700 }}>{phase.output}</div>
            </div>
          </div>

          <div style={{
            background: "#0F0F0F",
            borderRadius: 8,
            padding: "10px 12px",
            borderLeft: `3px solid ${color}`,
            marginBottom: phase.rule ? 10 : 0,
          }}>
            <div style={{ fontSize: 12, color, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>
              Goal
            </div>
            <div style={{ fontSize: 13, color: "#F5F0E8", lineHeight: 1.5 }}>{phase.goal}</div>
          </div>

          {phase.rule && (
            <div style={{
              background: "#0F0F0F",
              borderRadius: 8,
              padding: "8px 12px",
              borderLeft: "3px solid #333",
            }}>
              <div style={{ fontSize: 11, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>
                Rule
              </div>
              <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>{phase.rule}</div>
            </div>
          )}
        </div>

        {/* Sections */}
        <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>
          Steps — {phase.sections.length} section{phase.sections.length > 1 ? "s" : ""}
        </div>

        {phase.sections.map((section, si) => {
          const isOpen = expandedSection === section.id;
          return (
            <div
              key={section.id}
              style={{
                background: "#141414",
                border: `1px solid ${isOpen ? color + "44" : "#222"}`,
                borderRadius: 12,
                marginBottom: 10,
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
            >
              <button
                onClick={() => setExpandedSection(isOpen ? null : section.id)}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  padding: 16,
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    background: color,
                    color: "#0F0F0F",
                    fontSize: 10,
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: 4,
                    letterSpacing: 1,
                    flexShrink: 0,
                  }}>
                    {String(si + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#F5F0E8" }}>{section.title}</span>
                </div>
                <div style={{ color: "#444", fontSize: 16, flexShrink: 0 }}>
                  {isOpen ? "▲" : "▼"}
                </div>
              </button>

              {isOpen && (
                <div style={{ padding: "0 16px 16px" }}>
                  {section.note && (
                    <div style={{
                      fontSize: 12,
                      color: "#666",
                      fontStyle: "italic",
                      lineHeight: 1.6,
                      marginBottom: 14,
                      padding: "10px 12px",
                      background: "#0F0F0F",
                      borderRadius: 8,
                      borderLeft: `2px solid ${color}44`,
                    }}>
                      {section.note}
                    </div>
                  )}
                  {section.steps.map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                      <div style={{
                        width: 20,
                        height: 20,
                        background: color,
                        color: "#0F0F0F",
                        borderRadius: "50%",
                        fontSize: 10,
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 2,
                      }}>
                        {i + 1}
                      </div>
                      <div style={{ fontSize: 13, color: "#EDE8DF", lineHeight: 1.6 }}>{step}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Pricing quick ref — only show on phase 5 or 7 */}
        {(activePhase === 4 || activePhase === 6) && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>
              Pricing Reference
            </div>
            {PRICING.map((p, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "10px 14px",
                background: "#141414",
                borderRadius: 8,
                marginBottom: 6,
                gap: 12,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#F5F0E8", fontWeight: 600, marginBottom: 2 }}>{p.item}</div>
                  <div style={{ fontSize: 11, color: "#555" }}>{p.note}</div>
                </div>
                <div style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: p.price === "FREE" ? "#6FCF97" : "#C9A84C",
                  flexShrink: 0,
                }}>
                  {p.price}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom */}
        <div style={{
          marginTop: 24,
          padding: 16,
          background: "#111",
          borderRadius: 12,
          textAlign: "center",
          border: "1px solid #1a1a1a",
        }}>
          <div style={{ fontSize: 11, color: "#C9A84C", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
            Rules that never change
          </div>
          <div style={{ fontSize: 13, color: "#555", lineHeight: 1.9, textAlign: "left" }}>
            {[
              "No website = skip the prospect",
              "Never pitch a price before sending the demo",
              "Never build the demo before they confirm interest",
              "Never follow up more than once on any message",
              "Never deploy before payment is received",
              "Always document the result — every result is a sales tool",
            ].map((rule, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                <span style={{ color: "#C9A84C", flexShrink: 0 }}>·</span>
                <span>{rule}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, fontSize: 11, color: "#333", letterSpacing: 1 }}>
            Seek first the Kingdom · Matthew 6:33
          </div>
        </div>
      </div>
    </div>
  );
}
