import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";

const NAVY = "#1B3A6B";
const GOLD = "#C8922A";
const LIGHT_GOLD = "#E8B84B";
const DARK = "#0D1F3C";
const OFF_WHITE = "#F5F1EB";
const MUTED = "#8A9BB5";

const inputStyle: CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: `1px solid rgba(200,146,42,0.3)`,
  borderRadius: "6px",
  color: OFF_WHITE,
  padding: "10px 14px",
  fontSize: "15px",
  width: "100%",
  outline: "none",
  fontFamily: "'DM Mono', monospace",
  transition: "border-color 0.2s",
  boxSizing: "border-box" as const,
};

const labelStyle: CSSProperties = {
  color: MUTED,
  fontSize: "11px",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  marginBottom: "6px",
  display: "block",
  fontFamily: "'DM Sans', sans-serif",
};

const resultStyle: CSSProperties = {
  background: `linear-gradient(135deg, rgba(200,146,42,0.15), rgba(200,146,42,0.05))`,
  border: `1px solid rgba(200,146,42,0.4)`,
  borderRadius: "8px",
  padding: "16px 20px",
  marginTop: "16px",
};

const cardStyle: CSSProperties = {
  background: `linear-gradient(160deg, rgba(27,58,107,0.9) 0%, rgba(13,31,60,0.95) 100%)`,
  border: `1px solid rgba(200,146,42,0.2)`,
  borderRadius: "12px",
  padding: "28px",
  marginBottom: "20px",
  position: "relative",
  overflow: "hidden",
};

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  prefix?: string;
  suffix?: string;
}

function NumberInput({ label, value, onChange, prefix = "", suffix = "" }: NumberInputProps) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {prefix && (
          <span style={{ position: "absolute", left: "12px", color: GOLD, fontFamily: "'DM Mono', monospace", fontSize: "14px" }}>
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          style={{ ...inputStyle, paddingLeft: prefix ? "28px" : "14px", paddingRight: suffix ? "40px" : "14px" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = GOLD)}
          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(200,146,42,0.3)")}
        />
        {suffix && (
          <span style={{ position: "absolute", right: "12px", color: GOLD, fontFamily: "'DM Mono', monospace", fontSize: "14px" }}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

interface ResultRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function ResultRow({ label, value, highlight = false }: ResultRowProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(200,146,42,0.1)" }}>
      <span style={{ color: MUTED, fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
      <span style={{ color: highlight ? LIGHT_GOLD : OFF_WHITE, fontFamily: "'DM Mono', monospace", fontSize: highlight ? "20px" : "15px", fontWeight: highlight ? 700 : 400 }}>
        {value}
      </span>
    </div>
  );
}

interface MetricCardProps {
  number: number;
  title: string;
  subtitle: string;
  children: ReactNode;
}

function MetricCard({ number, title, subtitle, children }: MetricCardProps) {
  return (
    <div style={cardStyle}>
      <div style={{ position: "absolute", top: 0, right: 0, width: "120px", height: "120px", background: `radial-gradient(circle at top right, rgba(200,146,42,0.08), transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "20px" }}>
        <div style={{ background: GOLD, color: DARK, borderRadius: "8px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace", fontSize: "13px", fontWeight: 700, flexShrink: 0 }}>
          {number < 10 ? `0${number}` : number}
        </div>
        <div>
          <h3 style={{ margin: 0, color: OFF_WHITE, fontSize: "18px", fontFamily: "'DM Serif Display', serif", letterSpacing: "0.01em" }}>{title}</h3>
          <p style={{ margin: "4px 0 0", color: MUTED, fontSize: "12px", fontFamily: "'DM Sans', sans-serif" }}>{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function fmt(n: number, type: string = "dollar"): string {
  if (isNaN(n) || !isFinite(n)) return "—";
  if (type === "dollar") return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (type === "percent") return (n * 100).toFixed(1) + "%";
  if (type === "ratio") return n.toFixed(2) + ":1";
  if (type === "months") return n.toFixed(1) + " mos";
  if (type === "number") return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return n.toString();
}

export default function ApexMetrics() {
  const [avgCommission, setAvgCommission] = useState(8500);
  const [splitPercent, setSplitPercent] = useState(70);
  const [flatFeePerClose, setFlatFeePerClose] = useState(500);
  const [revenueModel, setRevenueModel] = useState("both");
  const [avgLifetimeMonths, setAvgLifetimeMonths] = useState(18);
  const [closesPerAgentPerMonth, setClosesPerAgentPerMonth] = useState(1.5);
  const [cogsPercent, setCogsPercent] = useState(15);
  const [marketingMonthly, setMarketingMonthly] = useState(2000);
  const [recruitingLabor, setRecruitingLabor] = useState(3000);
  const [agentsAcquiredPerMonth, setAgentsAcquiredPerMonth] = useState(2);
  const [agentsAtStart, setAgentsAtStart] = useState(20);
  const [agentsLost, setAgentsLost] = useState(2);
  const [costToOnboard, setCostToOnboard] = useState(1500);
  const [annualProfitPerAgent, setAnnualProfitPerAgent] = useState(12000);
  const [cacValue, setCacValue] = useState(2500);
  const [grossProfitPerAgentPerMonth, setGrossProfit] = useState(800);
  const [salesVelocity, setSalesVelocity] = useState(3);

  const splitRevPerClose = avgCommission * (splitPercent / 100);
  const revenuePerClose = revenueModel === "split" ? splitRevPerClose : revenueModel === "flat" ? flatFeePerClose : (splitRevPerClose + flatFeePerClose) / 2;
  const grossRevenuePerAgentPerMonth = revenuePerClose * closesPerAgentPerMonth;
  const cogsPerAgentPerMonth = grossRevenuePerAgentPerMonth * (cogsPercent / 100);
  const netGPPerAgentPerMonth = grossRevenuePerAgentPerMonth - cogsPerAgentPerMonth;
  const ltgp = netGPPerAgentPerMonth * avgLifetimeMonths;
  const totalAcqCost = marketingMonthly + recruitingLabor;
  const cac = agentsAcquiredPerMonth > 0 ? totalAcqCost / agentsAcquiredPerMonth : 0;
  const ltgpCacRatio = cac > 0 ? ltgp / cac : 0;
  const churnRate = agentsAtStart > 0 ? agentsLost / agentsAtStart : 0;
  const avgLifetimeFromChurn = churnRate > 0 ? 1 / churnRate : 0;
  const roic = costToOnboard > 0 ? annualProfitPerAgent / costToOnboard : 0;
  const paybackPeriod = grossProfitPerAgentPerMonth > 0 ? cacValue / grossProfitPerAgentPerMonth : 0;
  const monthlyGrossProfit = salesVelocity * ltgp;
  const maxAgents = churnRate > 0 ? salesVelocity / churnRate : 0;

  return (
    <div style={{ minHeight: "100vh", background: DARK, fontFamily: "'DM Sans', sans-serif", padding: "0" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <div style={{ background: `linear-gradient(180deg, ${NAVY} 0%, rgba(27,58,107,0.85) 100%)`, borderBottom: `1px solid rgba(200,146,42,0.3)`, padding: "28px 32px 24px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
            <div style={{ width: "3px", height: "32px", background: GOLD, borderRadius: "2px" }} />
            <div>
              <div style={{ color: GOLD, fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600 }}>Apex Partners & Co.</div>
              <h1 style={{ margin: 0, color: OFF_WHITE, fontSize: "26px", fontFamily: "'DM Serif Display', serif", letterSpacing: "0.01em" }}>Business Metrics Dashboard</h1>
            </div>
          </div>
          <p style={{ margin: "8px 0 0 15px", color: MUTED, fontSize: "13px" }}>8 core equations to understand your team's unit economics & growth ceiling</p>
        </div>
      </div>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "32px 24px" }}>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "32px" }}>
          {[
            { label: "LTGP / Agent", value: fmt(ltgp), sub: "lifetime gross profit" },
            { label: "CAC", value: fmt(cac), sub: "cost to acquire" },
            { label: "LTGP:CAC", value: fmt(ltgpCacRatio, "ratio"), sub: "efficiency ratio" },
            { label: "Max Agents", value: fmt(maxAgents, "number"), sub: "at current churn" },
          ].map((s) => (
            <div key={s.label} style={{ background: "rgba(27,58,107,0.6)", border: "1px solid rgba(200,146,42,0.2)", borderRadius: "10px", padding: "14px", textAlign: "center" }}>
              <div style={{ color: LIGHT_GOLD, fontSize: "20px", fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{s.value}</div>
              <div style={{ color: OFF_WHITE, fontSize: "11px", marginTop: "4px", fontWeight: 600, letterSpacing: "0.05em" }}>{s.label}</div>
              <div style={{ color: MUTED, fontSize: "10px", marginTop: "2px" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: "28px" }}>
          <label style={labelStyle}>Revenue Model</label>
          <div style={{ display: "flex", gap: "8px" }}>
            {([["split", "Commission Split"], ["flat", "Flat Fee"], ["both", "Both / Mixed"]] as [string, string][]).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setRevenueModel(val)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: `1px solid ${revenueModel === val ? GOLD : "rgba(200,146,42,0.25)"}`,
                  background: revenueModel === val ? `rgba(200,146,42,0.15)` : "transparent",
                  color: revenueModel === val ? LIGHT_GOLD : MUTED,
                  fontSize: "12px",
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: "pointer",
                  fontWeight: revenueModel === val ? 600 : 400,
                  transition: "all 0.2s",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <MetricCard number={1} title="Lifetime Gross Profit" subtitle="How much do you make from each agent over their entire time on the team?">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <NumberInput label="Avg Commission per Close" value={avgCommission} onChange={setAvgCommission} prefix="$" />
            {(revenueModel === "split" || revenueModel === "both") && (
              <NumberInput label="Team Split %" value={splitPercent} onChange={setSplitPercent} suffix="%" />
            )}
            {(revenueModel === "flat" || revenueModel === "both") && (
              <NumberInput label="Flat Fee per Close" value={flatFeePerClose} onChange={setFlatFeePerClose} prefix="$" />
            )}
            <NumberInput label="Closes / Agent / Month" value={closesPerAgentPerMonth} onChange={setClosesPerAgentPerMonth} />
            <NumberInput label="Avg Agent Tenure (months)" value={avgLifetimeMonths} onChange={setAvgLifetimeMonths} suffix="mo" />
            <NumberInput label="COGS % of Gross Revenue" value={cogsPercent} onChange={setCogsPercent} suffix="%" />
          </div>
          <div style={resultStyle}>
            <ResultRow label="Revenue per close (team)" value={fmt(revenuePerClose)} />
            <ResultRow label="Gross revenue / agent / month" value={fmt(grossRevenuePerAgentPerMonth)} />
            <ResultRow label="COGS / agent / month" value={fmt(cogsPerAgentPerMonth)} />
            <ResultRow label="Net GP / agent / month" value={fmt(netGPPerAgentPerMonth)} />
            <ResultRow label="LTGP per Agent" value={fmt(ltgp)} highlight />
          </div>
        </MetricCard>

        <MetricCard number={2} title="Cost to Acquire an Agent (CAC)" subtitle="Total cost to recruit and onboard one producing agent onto the team.">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <NumberInput label="Marketing / Month" value={marketingMonthly} onChange={setMarketingMonthly} prefix="$" />
            <NumberInput label="Recruiting Labor / Month" value={recruitingLabor} onChange={setRecruitingLabor} prefix="$" />
            <NumberInput label="Agents Acquired / Month" value={agentsAcquiredPerMonth} onChange={setAgentsAcquiredPerMonth} />
          </div>
          <div style={resultStyle}>
            <ResultRow label="Total acquisition spend / mo" value={fmt(totalAcqCost)} />
            <ResultRow label="CAC per Agent" value={fmt(cac)} highlight />
          </div>
        </MetricCard>

        <MetricCard number={3} title="LTGP : CAC Ratio" subtitle="For every dollar spent recruiting, how much do you make back?">
          <div style={resultStyle}>
            <ResultRow label="LTGP" value={fmt(ltgp)} />
            <ResultRow label="CAC" value={fmt(cac)} />
            <ResultRow label="LTGP : CAC Ratio" value={fmt(ltgpCacRatio, "ratio")} highlight />
            <div style={{ marginTop: "12px", padding: "10px 12px", borderRadius: "6px", background: ltgpCacRatio >= 3 ? "rgba(50,180,100,0.1)" : ltgpCacRatio >= 1 ? "rgba(200,146,42,0.1)" : "rgba(220,60,60,0.1)", border: `1px solid ${ltgpCacRatio >= 3 ? "rgba(50,180,100,0.3)" : ltgpCacRatio >= 1 ? "rgba(200,146,42,0.3)" : "rgba(220,60,60,0.3)"}` }}>
              <span style={{ color: ltgpCacRatio >= 3 ? "#5de09a" : ltgpCacRatio >= 1 ? LIGHT_GOLD : "#f07070", fontSize: "12px" }}>
                {ltgpCacRatio >= 5 ? "Excellent — scale aggressively" : ltgpCacRatio >= 3 ? "Healthy — grow with confidence" : ltgpCacRatio >= 1 ? "Breakeven territory — optimize unit economics" : "Underwater — fix before scaling"}
              </span>
            </div>
          </div>
        </MetricCard>

        <MetricCard number={4} title="Agent Churn Rate" subtitle="Of agents at the start of the month, how many leave within 30 days?">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <NumberInput label="Agents at Start of Month" value={agentsAtStart} onChange={setAgentsAtStart} />
            <NumberInput label="Agents Lost That Month" value={agentsLost} onChange={setAgentsLost} />
          </div>
          <div style={resultStyle}>
            <ResultRow label="Monthly churn rate" value={fmt(churnRate, "percent")} />
            <ResultRow label="Implied avg agent tenure" value={fmt(avgLifetimeFromChurn, "months")} highlight />
          </div>
        </MetricCard>

        <MetricCard number={5} title="Return on Invested Capital (ROIC)" subtitle="How much does it cost to bring an agent to full productivity, and what's the return?">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <NumberInput label="Cost to Onboard / Agent" value={costToOnboard} onChange={setCostToOnboard} prefix="$" />
            <NumberInput label="Annual Profit per Agent" value={annualProfitPerAgent} onChange={setAnnualProfitPerAgent} prefix="$" />
          </div>
          <div style={resultStyle}>
            <ResultRow label="ROIC" value={fmt(roic, "ratio")} highlight />
          </div>
        </MetricCard>

        <MetricCard number={6} title="Payback Period" subtitle="How many months until you recoup the cost of acquiring and onboarding an agent?">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <NumberInput label="CAC (fully loaded)" value={cacValue} onChange={setCacValue} prefix="$" />
            <NumberInput label="Gross Profit / Agent / Month" value={grossProfitPerAgentPerMonth} onChange={setGrossProfit} prefix="$" />
          </div>
          <div style={resultStyle}>
            <ResultRow label="Payback Period" value={fmt(paybackPeriod, "months")} highlight />
          </div>
        </MetricCard>

        <MetricCard number={7} title="Sales Velocity × Lifetime Gross Profit" subtitle="If nothing else changes, what is Apex's gross profit engine per month?">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
            <NumberInput label="Agents Recruited / Month (Sales Velocity)" value={salesVelocity} onChange={setSalesVelocity} />
          </div>
          <div style={resultStyle}>
            <ResultRow label="Sales velocity" value={`${salesVelocity} agents/mo`} />
            <ResultRow label="LTGP per agent" value={fmt(ltgp)} />
            <ResultRow label="Monthly Gross Profit Engine" value={fmt(monthlyGrossProfit)} highlight />
          </div>
        </MetricCard>

        <MetricCard number={8} title="Sales Velocity ÷ Churn" subtitle="What is Apex's hypothetical maximum agent count at current rates?">
          <div style={resultStyle}>
            <ResultRow label="Sales velocity" value={`${salesVelocity} agents/mo`} />
            <ResultRow label="Monthly churn rate" value={fmt(churnRate, "percent")} />
            <ResultRow label="Max Agents Sustained" value={fmt(maxAgents, "number")} highlight />
          </div>
        </MetricCard>

        <div style={{ textAlign: "center", marginTop: "32px", paddingTop: "24px", borderTop: "1px solid rgba(200,146,42,0.15)" }}>
          <span style={{ color: MUTED, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Apex Partners & Co. — Powered by eXp Realty</span>
        </div>
      </div>
    </div>
  );
}
