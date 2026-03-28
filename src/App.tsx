import { useState, useCallback } from "react";

const NAVY = "#1B3A6B";
const NAVY2 = "#0D1F3C";
const GOLD = "#C8922A";
const GOLD2 = "#E8B84B";
const WHITE = "#F5F1EB";
const MUTED = "#8A9BB5";
const DARK = "#07111E";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${DARK}; color: ${WHITE}; font-family: 'Barlow', sans-serif; }
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
  input[type=number] { -moz-appearance: textfield; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }
  .header { background: linear-gradient(135deg, ${NAVY2} 0%, ${NAVY} 100%); border-bottom: 2px solid ${GOLD}; padding: 0 32px; display: flex; align-items: center; justify-content: space-between; height: 64px; position: sticky; top: 0; z-index: 100; }
  .logo-text { font-family: 'Barlow Condensed', sans-serif; font-size: 26px; font-weight: 800; letter-spacing: 0.08em; color: ${WHITE}; }
  .logo-text span { color: ${GOLD}; }
  .nav { display: flex; gap: 4px; }
  .nav-btn { padding: 8px 18px; border-radius: 6px; border: 1px solid transparent; background: transparent; color: ${MUTED}; font-family: 'Barlow Condensed', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
  .nav-btn:hover { color: ${WHITE}; border-color: rgba(200,146,42,0.3); }
  .nav-btn.active { background: rgba(200,146,42,0.15); border-color: ${GOLD}; color: ${GOLD2}; }
  .main { flex: 1; padding: 32px; max-width: 1400px; margin: 0 auto; width: 100%; }
  .page-title { font-family: 'Barlow Condensed', sans-serif; font-size: 32px; font-weight: 800; letter-spacing: 0.04em; color: ${WHITE}; margin-bottom: 4px; }
  .page-sub { color: ${MUTED}; font-size: 13px; margin-bottom: 28px; }
  .card { background: linear-gradient(160deg, rgba(27,58,107,0.5) 0%, rgba(13,31,60,0.8) 100%); border: 1px solid rgba(200,146,42,0.2); border-radius: 12px; padding: 24px; position: relative; overflow: hidden; }
  .card::before { content: ''; position: absolute; top: 0; right: 0; width: 200px; height: 200px; background: radial-gradient(circle at top right, rgba(200,146,42,0.06), transparent 70%); pointer-events: none; }
  .card-title { font-family: 'Barlow Condensed', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: ${GOLD}; margin-bottom: 16px; }
  .field { margin-bottom: 14px; }
  .field label { display: block; font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: ${MUTED}; margin-bottom: 5px; }
  .field input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(200,146,42,0.25); border-radius: 6px; padding: 9px 12px; color: ${WHITE}; font-family: 'DM Mono', monospace; font-size: 14px; outline: none; transition: border-color 0.2s; }
  .field input:focus { border-color: ${GOLD}; background: rgba(200,146,42,0.05); }
  .field-wrap { position: relative; }
  .field-prefix { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: ${GOLD}; font-family: 'DM Mono', monospace; font-size: 13px; pointer-events: none; }
  .field-suffix { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: ${GOLD}; font-family: 'DM Mono', monospace; font-size: 13px; pointer-events: none; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .result-box { background: linear-gradient(135deg, rgba(200,146,42,0.12), rgba(200,146,42,0.04)); border: 1px solid rgba(200,146,42,0.35); border-radius: 8px; padding: 14px 18px; margin-top: 16px; }
  .result-row { display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px solid rgba(200,146,42,0.08); }
  .result-row:last-child { border-bottom: none; }
  .result-label { font-size: 12px; color: ${MUTED}; }
  .result-value { font-family: 'DM Mono', monospace; font-size: 14px; color: ${WHITE}; font-weight: 500; }
  .result-value.highlight { font-size: 20px; color: ${GOLD2}; font-weight: 700; }
  .result-value.good { color: #5de09a; }
  .result-value.warn { color: #f0c040; }
  .result-value.bad { color: #f07070; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
  .badge-green { background: rgba(45,122,79,0.2); color: #5de09a; border: 1px solid rgba(45,122,79,0.4); }
  .badge-red { background: rgba(192,57,43,0.2); color: #f07070; border: 1px solid rgba(192,57,43,0.4); }
  .opt-header { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; padding: 6px 12px; border-radius: 6px 6px 0 0; text-align: center; }
  .opt-1 { background: rgba(27,58,107,0.8); color: ${GOLD}; border-bottom: 2px solid ${GOLD}; }
  .opt-2 { background: rgba(45,80,130,0.8); color: ${GOLD2}; border-bottom: 2px solid ${GOLD2}; }
  .opt-3 { background: rgba(27,58,107,0.6); color: ${MUTED}; border-bottom: 2px solid ${MUTED}; }
  .rehab-section-header { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: ${WHITE}; background: rgba(27,58,107,0.6); border-left: 3px solid ${GOLD}; padding: 8px 14px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
  .rehab-section-header:hover { background: rgba(27,58,107,0.9); }
  .rehab-table { width: 100%; border-collapse: collapse; }
  .rehab-table th { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: ${MUTED}; padding: 6px 10px; text-align: left; background: rgba(0,0,0,0.2); }
  .rehab-table td { font-size: 12px; padding: 7px 10px; border-bottom: 1px solid rgba(200,146,42,0.06); color: ${WHITE}; vertical-align: middle; }
  .rehab-table tr:hover td { background: rgba(200,146,42,0.03); }
  .rehab-input { width: 80px; background: rgba(255,255,255,0.05); border: 1px solid rgba(200,146,42,0.2); border-radius: 4px; padding: 4px 8px; color: ${WHITE}; font-family: 'DM Mono', monospace; font-size: 12px; outline: none; text-align: center; }
  .rehab-input:focus { border-color: ${GOLD}; }
  .rehab-total { font-family: 'DM Mono', monospace; font-size: 12px; color: ${GOLD2}; text-align: right; }
  .total-row td { font-weight: 700; color: ${GOLD2}; background: rgba(200,146,42,0.08) !important; font-family: 'DM Mono', monospace; }
  .grand-total { background: linear-gradient(135deg, rgba(200,146,42,0.2), rgba(200,146,42,0.08)); border: 1px solid rgba(200,146,42,0.4); border-radius: 8px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; margin-top: 16px; }
  .grand-total-value { font-family: 'DM Mono', monospace; font-size: 28px; font-weight: 700; color: ${GOLD2}; }
  .mao-hero { background: linear-gradient(135deg, rgba(200,146,42,0.18), rgba(200,146,42,0.06)); border: 1px solid rgba(200,146,42,0.4); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 16px; }
  .mao-value { font-family: 'Barlow Condensed', sans-serif; font-size: 56px; font-weight: 800; color: ${GOLD2}; letter-spacing: 0.02em; line-height: 1; }
  .mao-label { font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: ${MUTED}; margin-bottom: 4px; }
  .formula-box { background: rgba(0,0,0,0.3); border: 1px solid rgba(200,146,42,0.15); border-radius: 8px; padding: 14px 18px; font-family: 'DM Mono', monospace; font-size: 12px; color: ${MUTED}; margin-top: 12px; line-height: 1.8; }
  .formula-box span { color: ${GOLD2}; }
  .note-text { font-size: 11px; color: ${MUTED}; font-style: italic; margin-top: 4px; }
  .tabs { display: flex; gap: 2px; margin-bottom: 20px; flex-wrap: wrap; }
  .tab { padding: 8px 16px; border-radius: 6px 6px 0 0; border: 1px solid rgba(200,146,42,0.15); border-bottom: none; background: rgba(27,58,107,0.3); color: ${MUTED}; font-family: 'Barlow Condensed', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
  .tab.active { background: rgba(27,58,107,0.8); color: ${GOLD2}; border-color: rgba(200,146,42,0.35); }
  .property-bar { background: rgba(27,58,107,0.4); border: 1px solid rgba(200,146,42,0.15); border-radius: 8px; padding: 12px 20px; margin-bottom: 20px; display: flex; gap: 24px; flex-wrap: wrap; align-items: center; }
  .prop-field { display: flex; flex-direction: column; gap: 3px; }
  .prop-field label { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: ${MUTED}; }
  .prop-field input { background: transparent; border: none; border-bottom: 1px solid rgba(200,146,42,0.3); color: ${WHITE}; font-family: 'Barlow', sans-serif; font-size: 13px; padding: 2px 0; outline: none; width: 180px; }
  .prop-field input.narrow { width: 80px; }
  .prop-field input:focus { border-bottom-color: ${GOLD}; }
  .score-bar { height: 6px; border-radius: 3px; background: rgba(255,255,255,0.1); margin-top: 6px; overflow: hidden; }
  .score-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }
  .str-market-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 10px; }
  .str-market-card { background: rgba(0,0,0,0.25); border: 1px solid rgba(200,146,42,0.12); border-radius: 8px; padding: 10px 12px; }
  .str-market-label { font-size: 10px; color: ${MUTED}; margin-bottom: 3px; }
  .str-market-val { font-family: 'DM Mono', monospace; font-size: 14px; color: ${GOLD2}; font-weight: 700; }
  .str-market-src { font-size: 9px; color: ${MUTED}; margin-top: 2px; font-style: italic; }
  .bed-btn { flex: 1; padding: 7px 0; border-radius: 6px; border: 1px solid rgba(200,146,42,0.2); background: transparent; color: ${MUTED}; font-family: 'DM Mono', monospace; font-size: 12px; cursor: pointer; transition: all 0.2s; }
  .bed-btn.active { border-color: ${GOLD}; background: rgba(200,146,42,0.15); color: ${GOLD2}; font-weight: 700; }
  .season-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid rgba(200,146,42,0.06); }
  .season-row:last-child { border-bottom: none; }
`;

// ── HELPERS ───────────────────────────────────────────────────────────────────
const fmt = (n: number, type = "dollar"): string => {
  if (n === null || n === undefined || isNaN(n) || !isFinite(n)) return "—";
  if (type === "dollar") return "$" + Math.round(n).toLocaleString("en-US");
  if (type === "pct") return (n * 100).toFixed(1) + "%";
  if (type === "ratio") return n.toFixed(2) + "x";
  return n.toString();
};

interface InpProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  note?: string;
  disabled?: boolean;
}

const Inp = ({ label, value, onChange, prefix, suffix, note, disabled }: InpProps) => (
  <div className="field">
    <label>{label}</label>
    <div className="field-wrap">
      {prefix && <span className="field-prefix">{prefix}</span>}
      <input
        type="number"
        value={value}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        disabled={disabled}
        style={{
          paddingLeft: prefix ? "22px" : "12px",
          paddingRight: suffix ? "30px" : "12px",
          opacity: disabled ? 0.5 : 1,
        }}
      />
      {suffix && <span className="field-suffix">{suffix}</span>}
    </div>
    {note && <div className="note-text">{note}</div>}
  </div>
);

// ── REHAB DATA ────────────────────────────────────────────────────────────────
const REHAB_SECTIONS = [
  {
    name: "Exterior", items: [
      { name: "Roof Replacement", unit: "Per Square", cost: 250, note: "Each square = 100 sq ft" },
      { name: "Roof Maintenance", unit: "Per House", cost: 300, note: "" },
      { name: "Clean Gutters", unit: "Per House", cost: 200, note: "" },
      { name: "Replace Gutters", unit: "Per Linear Ft", cost: 6, note: "" },
      { name: "Replace Vinyl Soffit/Fascia", unit: "Per Linear Ft", cost: 9, note: "" },
      { name: "Pressure Wash House", unit: "Per House", cost: 200, note: "" },
      { name: "Replace Vinyl Siding", unit: "Per Square", cost: 200, note: "" },
      { name: "Exterior Painting", unit: "Per Sq Ft", cost: 1.5, note: "" },
      { name: "Paint Exterior Trim", unit: "Per Sq Ft", cost: 0.6, note: "" },
      { name: "Large Concrete Jobs", unit: "Per Sq Ft", cost: 6, note: "Entire driveway" },
      { name: "Replace Single Garage Door", unit: "Per Door", cost: 500, note: "" },
      { name: "Replace Double Garage Door", unit: "Per Door", cost: 900, note: "" },
      { name: "Replace Garage Door Opener", unit: "Per Opener", cost: 250, note: "" },
      { name: "Lawn Maintenance", unit: "Per 1/4 Acre", cost: 35, note: "" },
      { name: "Trim Bushes", unit: "Per Yard", cost: 50, note: "" },
      { name: "Trim Tree", unit: "Per Tree", cost: 125, note: "30-60 ft tree" },
    ]
  },
  {
    name: "Interior", items: [
      { name: "Roll-off Dumpster", unit: "Per Dumpster", cost: 400, note: "30 yard" },
      { name: "Demo Labor", unit: "Per Hour", cost: 20, note: "" },
      { name: "Service & Certify Plumbing", unit: "Per House", cost: 200, note: "" },
      { name: "Add New Outlet/Box", unit: "Per Outlet", cost: 70, note: "" },
      { name: "Upgrade Outlet to GFCI", unit: "Per Outlet", cost: 40, note: "" },
      { name: "Add New Switch", unit: "Per Switch", cost: 125, note: "" },
      { name: "Install Light", unit: "Per Light", cost: 50, note: "" },
      { name: "Install Bedroom Fan", unit: "Per Fan", cost: 110, note: "" },
      { name: "Install Living/Kitchen Fan", unit: "Per Fan", cost: 140, note: "" },
      { name: "Replace Outlet/Switch", unit: "Per Outlet", cost: 7, note: "" },
      { name: "Install Drywall/Sheetrock", unit: "Per Sq Ft", cost: 1.0, note: "" },
      { name: "Basic Carpentry", unit: "Per Hour", cost: 25, note: "" },
      { name: "Install Exterior Door", unit: "Per Door", cost: 250, note: "Mid-grade with glass" },
      { name: "Install Interior Door", unit: "Per Door", cost: 100, note: "" },
      { name: "Replace Window", unit: "Per Window", cost: 225, note: "Standard double-hung" },
      { name: "Paint Interior", unit: "Per Sq Ft", cost: 1.25, note: "" },
      { name: "Install Carpet and Pad", unit: "Per Sq Yd", cost: 18, note: "" },
      { name: "Clean Carpet", unit: "Per Room", cost: 45, note: "" },
      { name: "Install Wood Laminate", unit: "Per Sq Ft", cost: 2.5, note: "" },
      { name: "Refinish Hardwood", unit: "Per Sq Ft", cost: 1.5, note: "" },
    ]
  },
  {
    name: "Basement & Mechanicals", items: [
      { name: "Fix Foundation Wall", unit: "Per Linear Ft", cost: 200, note: "Bowed/Cracked" },
      { name: "Replace Water Heater", unit: "Per House", cost: 750, note: "" },
      { name: "Replace All Supply Lines", unit: "Per Fixture", cost: 200, note: "PEX lines" },
      { name: "Replace Service Panel", unit: "Per Panel", cost: 800, note: "" },
      { name: "HVAC Maintenance/Cert", unit: "Per System", cost: 125, note: "" },
      { name: "Replace Furnace", unit: "Per Unit", cost: 1500, note: "" },
      { name: "Replace AC Compressor", unit: "Per Unit", cost: 1200, note: "" },
      { name: "Replace AC Compressor + Coil", unit: "Per Unit", cost: 2000, note: "" },
    ]
  },
  {
    name: "Kitchen", items: [
      { name: "Install/Replace Kitchen Sink", unit: "Per Sink", cost: 175, note: "" },
      { name: "Install/Replace Kitchen Faucet", unit: "Per Sink", cost: 180, note: "" },
      { name: "Install Dishwasher", unit: "Per House", cost: 500, note: "" },
      { name: "Install Kitchen Cabinets", unit: "Per Linear Ft", cost: 175, note: "Off-the-shelf" },
      { name: "Install Laminate Countertops", unit: "Per Linear Ft", cost: 20, note: "" },
      { name: "Install Granite Countertops", unit: "Per Sq Ft", cost: 30, note: "" },
      { name: "Install Rolled Vinyl Flooring", unit: "Per Sq Yd", cost: 15, note: "" },
      { name: "Install Tile", unit: "Per Sq Ft", cost: 8, note: "Mid-grade ceramic" },
      { name: "Stainless Kitchen Appliances", unit: "Per Package", cost: 2400, note: "Fridge, range, microwave, dishwasher" },
    ]
  },
  {
    name: "Bathroom", items: [
      { name: "Install/Replace Tub", unit: "Per Tub", cost: 800, note: "3-piece fiberglass" },
      { name: "Build Tile Shower", unit: "Per Sq Ft", cost: 25, note: "" },
      { name: "Install/Replace Bathroom Sink", unit: "Per Sink", cost: 100, note: "" },
      { name: "Install/Replace Bathroom Faucet", unit: "Per Sink", cost: 100, note: "" },
      { name: "Install Tub/Shower Trim Kit", unit: "Per Tub", cost: 140, note: "" },
      { name: "Install/Replace Toilet", unit: "Per Toilet", cost: 180, note: "" },
      { name: "Install Bathroom Vanity", unit: "Per Vanity", cost: 230, note: "Single bowl" },
      { name: "Install Rolled Vinyl Flooring", unit: "Per Sq Yd", cost: 15, note: "" },
      { name: "Install Tile", unit: "Per Sq Ft", cost: 8, note: "" },
    ]
  },
  {
    name: "Permits & Misc", items: [
      { name: "Permits", unit: "Per Permit", cost: 150, note: "Varies by municipality" },
      { name: "Architectural Renderings", unit: "Per House", cost: 2000, note: "" },
    ]
  }
];

// ── STR MARKET DATA (Cleveland area, 2025) ────────────────────────────────────
const STR_BY_BEDS: Record<number, { adr: number; occ: number; annualRev: number }> = {
  1: { adr: 95,  occ: 55, annualRev: 16544 },
  2: { adr: 125, occ: 54, annualRev: 22000 },
  3: { adr: 155, occ: 52, annualRev: 27000 },
  4: { adr: 185, occ: 50, annualRev: 31000 },
  5: { adr: 220, occ: 48, annualRev: 38000 },
};

const STR_SEASONAL: { month: string; adr: number; occ: number }[] = [
  { month: "Jan", adr: 236, occ: 32 },
  { month: "Feb", adr: 236, occ: 35 },
  { month: "Mar", adr: 165, occ: 45 },
  { month: "Apr", adr: 155, occ: 50 },
  { month: "May", adr: 155, occ: 58 },
  { month: "Jun", adr: 165, occ: 68 },
  { month: "Jul", adr: 165, occ: 70 },
  { month: "Aug", adr: 155, occ: 65 },
  { month: "Sep", adr: 155, occ: 55 },
  { month: "Oct", adr: 155, occ: 52 },
  { month: "Nov", adr: 145, occ: 40 },
  { month: "Dec", adr: 145, occ: 38 },
];

// ── DEAL CALCULATOR ───────────────────────────────────────────────────────────
function DealCalc({ rehabTotal }: { rehabTotal: number }) {
  const [prop, setProp] = useState({ seller: "", address: "", beds: "", date: "" });
  const [arv, setArv] = useState(189000);
  const [repairs, setRepairs] = useState(rehabTotal || 38980);
  const [grossRent, setGrossRent] = useState(1800);
  const [netRentPct, setNetRentPct] = useState(70);
  const [desiredProfit, setDesiredProfit] = useState(5000);
  const [askingPrice, setAskingPrice] = useState(95000);
  const [o2DownPct, setO2DownPct] = useState(10);
  const [o2Rate, setO2Rate] = useState(7);
  const [o2BalloonYears, setO2BalloonYears] = useState(10);
  const [o3DownPct, setO3DownPct] = useState(20);
  const [o3Payments, setO3Payments] = useState(300);

  const netRent = grossRent * (netRentPct / 100);
  const annualNetRent = netRent * 12;

  const o1Purchase = arv * 0.65 - repairs - desiredProfit;
  const o1CashIn = o1Purchase + repairs;
  const o1CROI = o1CashIn > 0 ? annualNetRent / o1CashIn : 0;

  const o2UseAskPrice = askingPrice * 0.9;
  const o2DownCash = o2UseAskPrice * (o2DownPct / 100);
  const o2Principal = o2UseAskPrice - o2DownCash;
  const o2MonthlyPmt = o2Principal * (o2Rate / 100) / 12;
  const o2AnnualDebt = o2MonthlyPmt * 12;
  const o2CADS = annualNetRent - o2AnnualDebt;
  const o2CashIn = o2DownCash + repairs;
  const o2CROI = o2CashIn > 0 ? o2CADS / o2CashIn : 0;
  const o2DSCR = o2AnnualDebt > 0 ? annualNetRent / o2AnnualDebt : 0;
  const o2BalloonAmt = o2Principal;

  const o3UseAskPrice = askingPrice;
  const o3DownCash = o3UseAskPrice * (o3DownPct / 100);
  const o3MonthlyPmt = o3Payments > 0 ? (o3UseAskPrice - o3DownCash) / o3Payments : 0;
  const o3AnnualDebt = o3MonthlyPmt * 12;
  const o3CADS = annualNetRent - o3AnnualDebt;
  const o3CashIn = o3DownCash + repairs;
  const o3CROI = o3CashIn > 0 ? o3CADS / o3CashIn : 0;
  const o3DSCR = o3AnnualDebt > 0 ? annualNetRent / o3AnnualDebt : 0;

  const croiColor = (v: number) => v >= 0.15 ? "good" : v >= 0.08 ? "warn" : "bad";
  const dscrColor = (v: number) => v >= 2 ? "good" : v >= 1.2 ? "warn" : "bad";

  return (
    <div>
      <div className="property-bar">
        {([
          { label: "Seller's Name", key: "seller", wide: true },
          { label: "Property Address", key: "address", wide: true },
          { label: "Beds/Baths", key: "beds", wide: false },
          { label: "Date", key: "date", wide: false },
        ] as { label: string; key: keyof typeof prop; wide: boolean }[]).map(f => (
          <div className="prop-field" key={f.key}>
            <label>{f.label}</label>
            <input className={!f.wide ? "narrow" : ""} value={prop[f.key]} onChange={e => setProp(p => ({ ...p, [f.key]: e.target.value }))} />
          </div>
        ))}
        <div className="prop-field">
          <label>Asking Price</label>
          <input type="number" className="narrow" value={askingPrice} onChange={e => setAskingPrice(parseFloat(e.target.value) || 0)}
            style={{ background: "transparent", border: "none", borderBottom: `1px solid rgba(200,146,42,0.3)`, color: WHITE, fontFamily: "'Barlow'", fontSize: 13, padding: "2px 0", outline: "none", width: 110 }} />
        </div>
      </div>

      <div className="grid-2" style={{ gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div className="card-title">📐 Property Inputs</div>
          <div className="grid-2">
            <Inp label="After Repair Value (ARV)" value={arv} onChange={setArv} prefix="$" />
            <Inp label="Repair Cost" value={repairs} onChange={setRepairs} prefix="$" note="Pull from Rehab Sheet" />
            <Inp label="Gross Monthly Rent" value={grossRent} onChange={setGrossRent} prefix="$" />
            <Inp label="Net Rent %" value={netRentPct} onChange={setNetRentPct} suffix="%" note="Typically 70%" />
            <Inp label="Desired Profit" value={desiredProfit} onChange={setDesiredProfit} prefix="$" />
          </div>
          <div className="result-box">
            <div className="result-row"><span className="result-label">Monthly Net Rent</span><span className="result-value">{fmt(netRent)}</span></div>
            <div className="result-row"><span className="result-label">Annual Net Rent</span><span className="result-value">{fmt(annualNetRent)}</span></div>
          </div>
        </div>

        <div className="card">
          <div className="opt-header opt-1">Option 1 — All Cash Offer</div>
          <div style={{ marginTop: 14 }}>
            <div className="result-box">
              <div className="result-row"><span className="result-label">ARV × 65%</span><span className="result-value">{fmt(arv * 0.65)}</span></div>
              <div className="result-row"><span className="result-label">− Repairs</span><span className="result-value">{fmt(repairs)}</span></div>
              <div className="result-row"><span className="result-label">− Desired Profit</span><span className="result-value">{fmt(desiredProfit)}</span></div>
              <div className="result-row"><span className="result-label">Offer Price</span><span className="result-value highlight">{fmt(o1Purchase)}</span></div>
            </div>
            <div className="result-box">
              <div className="result-row"><span className="result-label">Cash In (Purchase + Repairs)</span><span className="result-value">{fmt(o1CashIn)}</span></div>
              <div className="result-row"><span className="result-label">CROI</span><span className={`result-value ${croiColor(o1CROI)}`}>{fmt(o1CROI, "pct")}</span></div>
              <div className="result-row"><span className="result-label">Monthly Net Rent</span><span className="result-value">{fmt(netRent)}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 16 }}>
        <div className="card">
          <div className="opt-header opt-2">Option 2 — Seller Finance (Interest Only)</div>
          <div style={{ marginTop: 14 }}>
            <div className="grid-2">
              <Inp label="Down Payment %" value={o2DownPct} onChange={setO2DownPct} suffix="%" />
              <Inp label="Interest Rate %" value={o2Rate} onChange={setO2Rate} suffix="%" />
              <Inp label="Balloon Due (Years)" value={o2BalloonYears} onChange={setO2BalloonYears} />
            </div>
            <div className="result-box">
              <div className="result-row"><span className="result-label">Purchase Price (90% of asking)</span><span className="result-value highlight">{fmt(o2UseAskPrice)}</span></div>
              <div className="result-row"><span className="result-label">Down Payment Cash</span><span className="result-value">{fmt(o2DownCash)}</span></div>
              <div className="result-row"><span className="result-label">Monthly Payment</span><span className="result-value">{fmt(o2MonthlyPmt)}</span></div>
              <div className="result-row"><span className="result-label">Annual Debt Service</span><span className="result-value">{fmt(o2AnnualDebt)}</span></div>
              <div className="result-row"><span className="result-label">Annual CADS</span><span className="result-value good">{fmt(o2CADS)}</span></div>
              <div className="result-row"><span className="result-label">Cash In (Down + Repairs)</span><span className="result-value">{fmt(o2CashIn)}</span></div>
              <div className="result-row"><span className="result-label">Balloon Amount</span><span className="result-value">{fmt(o2BalloonAmt)}</span></div>
              <div className="result-row"><span className="result-label">CROI</span><span className={`result-value ${croiColor(o2CROI)}`}>{fmt(o2CROI, "pct")}</span></div>
              <div className="result-row"><span className="result-label">DSCR</span><span className={`result-value ${dscrColor(o2DSCR)}`}>{fmt(o2DSCR, "ratio")}</span></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="opt-header opt-3">Option 3 — Seller Finance (Principal Only)</div>
          <div style={{ marginTop: 14 }}>
            <div className="grid-2">
              <Inp label="Down Payment %" value={o3DownPct} onChange={setO3DownPct} suffix="%" />
              <Inp label="# Monthly Payments" value={o3Payments} onChange={setO3Payments} />
            </div>
            <div className="result-box">
              <div className="result-row"><span className="result-label">Purchase Price (100% of asking)</span><span className="result-value highlight">{fmt(o3UseAskPrice)}</span></div>
              <div className="result-row"><span className="result-label">Down Payment Cash</span><span className="result-value">{fmt(o3DownCash)}</span></div>
              <div className="result-row"><span className="result-label">Monthly Payment</span><span className="result-value">{fmt(o3MonthlyPmt)}</span></div>
              <div className="result-row"><span className="result-label">Annual Debt Service</span><span className="result-value">{fmt(o3AnnualDebt)}</span></div>
              <div className="result-row"><span className="result-label">Annual CADS</span><span className="result-value good">{fmt(o3CADS)}</span></div>
              <div className="result-row"><span className="result-label">Cash In (Down + Repairs)</span><span className="result-value">{fmt(o3CashIn)}</span></div>
              <div className="result-row"><span className="result-label">CROI</span><span className={`result-value ${croiColor(o3CROI)}`}>{fmt(o3CROI, "pct")}</span></div>
              <div className="result-row"><span className="result-label">DSCR</span><span className={`result-value ${dscrColor(o3DSCR)}`}>{fmt(o3DSCR, "ratio")}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 16 }}>
        {[
          { label: "Option 1 — All Cash", offer: fmt(o1Purchase), cashIn: fmt(o1CashIn), croi: fmt(o1CROI, "pct"), croiV: o1CROI, dscr: null as string | null, dscrV: 0 },
          { label: "Option 2 — Seller Finance IO", offer: fmt(o2UseAskPrice), cashIn: fmt(o2CashIn), croi: fmt(o2CROI, "pct"), croiV: o2CROI, dscr: fmt(o2DSCR, "ratio"), dscrV: o2DSCR },
          { label: "Option 3 — Seller Finance PO", offer: fmt(o3UseAskPrice), cashIn: fmt(o3CashIn), croi: fmt(o3CROI, "pct"), croiV: o3CROI, dscr: fmt(o3DSCR, "ratio"), dscrV: o3DSCR },
        ].map((opt, i) => (
          <div key={i} style={{ background: "rgba(27,58,107,0.4)", border: "1px solid rgba(200,146,42,0.2)", borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 8 }}>{opt.label}</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: MUTED }}>Offer</span>
              <span style={{ fontFamily: "'DM Mono'", fontSize: 13, color: WHITE }}>{opt.offer}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: MUTED }}>Cash In</span>
              <span style={{ fontFamily: "'DM Mono'", fontSize: 13, color: WHITE }}>{opt.cashIn}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: MUTED }}>CROI</span>
              <span style={{ fontFamily: "'DM Mono'", fontSize: 14, fontWeight: 700, color: opt.croiV >= 0.15 ? "#5de09a" : opt.croiV >= 0.08 ? "#f0c040" : "#f07070" }}>{opt.croi}</span>
            </div>
            {opt.dscr && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: MUTED }}>DSCR</span>
                <span style={{ fontFamily: "'DM Mono'", fontSize: 14, fontWeight: 700, color: opt.dscrV >= 2 ? "#5de09a" : opt.dscrV >= 1.2 ? "#f0c040" : "#f07070" }}>{opt.dscr}</span>
              </div>
            )}
            <div className="score-bar">
              <div className="score-fill" style={{ width: `${Math.min(opt.croiV * 500, 100)}%`, background: opt.croiV >= 0.15 ? "#2D7A4F" : opt.croiV >= 0.08 ? "#C8922A" : "#C0392B" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── REHAB SHEET ───────────────────────────────────────────────────────────────
function RehabSheet({ onTotalChange }: { onTotalChange?: (n: number) => void }) {
  const initQtys = () => {
    const q: Record<string, number> = {};
    REHAB_SECTIONS.forEach((s, si) => s.items.forEach((_, ii) => { q[`${si}-${ii}`] = 0; }));
    return q;
  };
  const [qtys, setQtys] = useState<Record<string, number>>(initQtys);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true, 1: true, 2: false, 3: false, 4: false, 5: false });
  const [contractorFee, setContractorFee] = useState(10);

  const setQty = useCallback((key: string, val: number) => {
    setQtys(q => {
      const next = { ...q, [key]: val };
      const sub = REHAB_SECTIONS.reduce((acc, s, si) =>
        acc + s.items.reduce((a, item, ii) => a + (next[`${si}-${ii}`] || 0) * item.cost, 0), 0);
      onTotalChange && onTotalChange(Math.round(sub * (1 + contractorFee / 100)));
      return next;
    });
  }, [contractorFee, onTotalChange]);

  const subtotal = REHAB_SECTIONS.reduce((acc, s, si) =>
    acc + s.items.reduce((a, item, ii) => a + (qtys[`${si}-${ii}`] || 0) * item.cost, 0), 0);
  const fee = subtotal * (contractorFee / 100);
  const grandTotal = subtotal + fee;
  const sectionTotal = (si: number) =>
    REHAB_SECTIONS[si].items.reduce((a, item, ii) => a + (qtys[`${si}-${ii}`] || 0) * item.cost, 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <label style={{ fontSize: 11, color: MUTED, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>Contractor Fee %</label>
        <input type="number" value={contractorFee} onChange={e => setContractorFee(parseFloat(e.target.value) || 0)}
          style={{ width: 70, background: "rgba(255,255,255,0.05)", border: `1px solid rgba(200,146,42,0.3)`, borderRadius: 6, padding: "6px 10px", color: WHITE, fontFamily: "'DM Mono'", fontSize: 13, outline: "none", textAlign: "center" as const }} />
      </div>
      {REHAB_SECTIONS.map((section, si) => {
        const secTotal = sectionTotal(si);
        return (
          <div key={si} style={{ marginBottom: 6 }}>
            <div className="rehab-section-header" onClick={() => setExpanded(e => ({ ...e, [si]: !e[si] }))}>
              <span>{section.name}</span>
              <span style={{ display: "flex", gap: 16, alignItems: "center" }}>
                {secTotal > 0 && <span style={{ fontFamily: "'DM Mono'", fontSize: 13, color: GOLD2 }}>{fmt(secTotal)}</span>}
                <span style={{ color: MUTED, fontSize: 12 }}>{expanded[si] ? "▲" : "▼"}</span>
              </span>
            </div>
            {expanded[si] && (
              <table className="rehab-table">
                <thead>
                  <tr>
                    <th style={{ width: "36%" }}>Task</th>
                    <th>Unit</th>
                    <th>Unit Cost</th>
                    <th>Qty</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item, ii) => {
                    const qty = qtys[`${si}-${ii}`] || 0;
                    const total = qty * item.cost;
                    return (
                      <tr key={ii}>
                        <td>{item.name}</td>
                        <td style={{ color: MUTED, fontSize: 11 }}>{item.unit}</td>
                        <td style={{ fontFamily: "'DM Mono'", fontSize: 12, color: MUTED }}>{fmt(item.cost)}</td>
                        <td>
                          <input type="number" className="rehab-input" value={qty === 0 ? "" : qty}
                            placeholder="0" onChange={e => setQty(`${si}-${ii}`, parseFloat(e.target.value) || 0)} />
                        </td>
                        <td className="rehab-total">{total > 0 ? fmt(total) : "—"}</td>
                        <td style={{ color: MUTED, fontSize: 10, fontStyle: "italic" }}>{item.note}</td>
                      </tr>
                    );
                  })}
                  {secTotal > 0 && (
                    <tr className="total-row">
                      <td colSpan={4}>Section Total</td>
                      <td style={{ textAlign: "right" }}>{fmt(secTotal)}</td>
                      <td />
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
      <div className="grand-total" style={{ marginTop: 20 }}>
        <div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: MUTED, marginBottom: 4 }}>Subtotal</div>
          <div style={{ fontFamily: "'DM Mono'", fontSize: 18, color: WHITE }}>{fmt(subtotal)}</div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 11, color: MUTED, marginTop: 4 }}>+ {contractorFee}% Contractor Fee: {fmt(fee)}</div>
        </div>
        <div style={{ textAlign: "right" as const }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: MUTED }}>Total Rehab Cost</div>
          <div className="grand-total-value">{fmt(grandTotal)}</div>
          <div style={{ fontSize: 10, color: MUTED, marginTop: 4 }}>Auto-linked to Deal + MAO calculators</div>
        </div>
      </div>
    </div>
  );
}

// ── MAO CALCULATOR ────────────────────────────────────────────────────────────
function MAOCalc({ rehabTotal }: { rehabTotal: number }) {
  const [activeTab, setActiveTab] = useState("flip");

  // Flip / Wholesale / Rental inputs
  const [arv, setArv] = useState(189000);
  const [repairs, setRepairs] = useState(rehabTotal || 38980);
  const [closingCosts, setClosingCosts] = useState(3000);
  const [holdingCosts, setHoldingCosts] = useState(2000);
  const [wholesaleFee, setWholesaleFee] = useState(5000);
  const [arvDiscount, setArvDiscount] = useState(65);

  // STR inputs
  const [strArv, setStrArv] = useState(189000);
  const [strRepairs, setStrRepairs] = useState(rehabTotal || 38980);
  const [strClosing, setStrClosing] = useState(3000);
  const [strBeds, setStrBeds] = useState(3);
  const [strADR, setStrADR] = useState(155);
  const [strOccupancy, setStrOccupancy] = useState(52);
  const [strPlatformFee, setStrPlatformFee] = useState(3);
  const [strMgmtFee, setStrMgmtFee] = useState(20);
  const [strOpEx, setStrOpEx] = useState(30);
  const [strCapRate, setStrCapRate] = useState(8);
  const [strLtv, setStrLtv] = useState(70);

  // Flip calcs
  const flipMAO = arv * (arvDiscount / 100) - repairs - closingCosts - holdingCosts;
  const flipProfit = arv - flipMAO - repairs - closingCosts - holdingCosts;
  const flipROI = (flipMAO + repairs) > 0 ? flipProfit / (flipMAO + repairs) : 0;

  // Wholesale calcs
  const endBuyerPrice = arv * (arvDiscount / 100);
  const wholesaleMAO = endBuyerPrice - repairs - closingCosts - wholesaleFee;

  // Rental calcs
  const rentalMAO = arv * 0.7 - repairs;
  const afterRefi = arv * 0.75;
  const brrrrMAO = afterRefi - repairs - closingCosts;
  const allInCost = brrrrMAO + repairs + closingCosts;
  const cashLeftIn = allInCost - afterRefi;

  // STR calcs
  const strNightsPerYear = 365 * (strOccupancy / 100);
  const strGrossRevenue = strNightsPerYear * strADR;
  const strPlatformCost = strGrossRevenue * (strPlatformFee / 100);
  const strMgmtCost = strGrossRevenue * (strMgmtFee / 100);
  const strOpExCost = strGrossRevenue * (strOpEx / 100);
  const strNetIncome = strGrossRevenue - strPlatformCost - strMgmtCost - strOpExCost;
  const strMonthlyIncome = strNetIncome / 12;
  const strValuation = strCapRate > 0 ? (strNetIncome / (strCapRate / 100)) : 0;
  const strMAO = strValuation * (strLtv / 100) - strRepairs - strClosing;
  const strActualCapRate = strMAO > 0 ? (strNetIncome / strMAO) * 100 : 0;
  const strCashOnCash = (strMAO + strRepairs) > 0 ? strNetIncome / (strMAO + strRepairs) : 0;
  const strGRM = strMAO > 0 ? strMAO / strGrossRevenue : 0;

  const handleBedSelect = (n: number) => {
    setStrBeds(n);
    setStrADR(STR_BY_BEDS[n].adr);
    setStrOccupancy(STR_BY_BEDS[n].occ);
  };

  return (
    <div>
      <div className="tabs">
        {[
          ["flip", "🏠 Fix & Flip"],
          ["wholesale", "📋 Wholesale"],
          ["rental", "🏘 Rental / BRRR"],
          ["str", "🏨 Short Term Rental"],
        ].map(([k, label]) => (
          <div key={k} className={`tab ${activeTab === k ? "active" : ""}`} onClick={() => setActiveTab(k)}>{label}</div>
        ))}
      </div>

      {/* ── FIX & FLIP ── */}
      {activeTab === "flip" && (
        <div className="grid-2" style={{ gap: 20 }}>
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-title">📐 Inputs</div>
              <Inp label="After Repair Value (ARV)" value={arv} onChange={setArv} prefix="$" />
              <Inp label="Repair Cost" value={repairs} onChange={setRepairs} prefix="$" note="Auto-linked from Rehab Sheet" />
              <Inp label="Closing Costs" value={closingCosts} onChange={setClosingCosts} prefix="$" />
              <Inp label="Holding Costs" value={holdingCosts} onChange={setHoldingCosts} prefix="$" />
              <Inp label="ARV Discount %" value={arvDiscount} onChange={setArvDiscount} suffix="%" note="65% typical" />
            </div>
            <div className="formula-box">
              <div>MAO = <span>ARV × {arvDiscount}%</span> − <span>Repairs</span> − <span>Closing</span> − <span>Holding</span></div>
              <div>= <span>{fmt(arv)}</span> × <span>{arvDiscount}%</span> − <span>{fmt(repairs)}</span> − <span>{fmt(closingCosts)}</span> − <span>{fmt(holdingCosts)}</span></div>
            </div>
          </div>
          <div>
            <div className="mao-hero">
              <div className="mao-label">Maximum Allowable Offer</div>
              <div className="mao-value">{fmt(flipMAO)}</div>
              <div style={{ marginTop: 10 }}>
                <span className={`badge ${flipMAO > 0 ? "badge-green" : "badge-red"}`}>{flipMAO > 0 ? "✓ Viable" : "✗ Not Viable"}</span>
              </div>
            </div>
            <div className="card">
              <div className="card-title">Fix & Flip Summary</div>
              <div className="result-box">
                <div className="result-row"><span className="result-label">ARV</span><span className="result-value">{fmt(arv)}</span></div>
                <div className="result-row"><span className="result-label">Purchase (MAO)</span><span className="result-value highlight">{fmt(flipMAO)}</span></div>
                <div className="result-row"><span className="result-label">Repairs</span><span className="result-value">{fmt(repairs)}</span></div>
                <div className="result-row"><span className="result-label">Closing + Holding</span><span className="result-value">{fmt(closingCosts + holdingCosts)}</span></div>
                <div className="result-row"><span className="result-label">Gross Profit</span><span className={`result-value ${flipProfit > 0 ? "good" : "bad"}`}>{fmt(flipProfit)}</span></div>
                <div className="result-row"><span className="result-label">ROI</span><span className={`result-value ${flipROI >= 0.2 ? "good" : flipROI >= 0.1 ? "warn" : "bad"}`}>{fmt(flipROI, "pct")}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── WHOLESALE ── */}
      {activeTab === "wholesale" && (
        <div className="grid-2" style={{ gap: 20 }}>
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-title">📐 Inputs</div>
              <Inp label="After Repair Value (ARV)" value={arv} onChange={setArv} prefix="$" />
              <Inp label="Repair Cost" value={repairs} onChange={setRepairs} prefix="$" />
              <Inp label="Closing Costs" value={closingCosts} onChange={setClosingCosts} prefix="$" />
              <Inp label="Assignment Fee" value={wholesaleFee} onChange={setWholesaleFee} prefix="$" />
              <Inp label="ARV Discount %" value={arvDiscount} onChange={setArvDiscount} suffix="%" note="65% typical" />
            </div>
            <div className="formula-box">
              <div>End Buyer Pays: <span>ARV × {arvDiscount}%</span> = <span>{fmt(endBuyerPrice)}</span></div>
              <div>MAO = <span>End Buyer</span> − <span>Repairs</span> − <span>Closing</span> − <span>Fee</span></div>
            </div>
          </div>
          <div>
            <div className="mao-hero">
              <div className="mao-label">Your Wholesale MAO</div>
              <div className="mao-value">{fmt(wholesaleMAO)}</div>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 12, color: MUTED }}>End Buyer Price: <span style={{ color: GOLD2, fontFamily: "'DM Mono'" }}>{fmt(endBuyerPrice)}</span></div>
                <div style={{ fontSize: 12, color: "#5de09a" }}>Assignment Fee: <span style={{ fontFamily: "'DM Mono'" }}>{fmt(wholesaleFee)}</span></div>
              </div>
            </div>
            <div className="card">
              <div className="card-title">Wholesale Summary</div>
              <div className="result-box">
                <div className="result-row"><span className="result-label">ARV</span><span className="result-value">{fmt(arv)}</span></div>
                <div className="result-row"><span className="result-label">End Buyer Pays</span><span className="result-value">{fmt(endBuyerPrice)}</span></div>
                <div className="result-row"><span className="result-label">Your Offer (MAO)</span><span className="result-value highlight">{fmt(wholesaleMAO)}</span></div>
                <div className="result-row"><span className="result-label">Assignment Fee</span><span className="result-value good">{fmt(wholesaleFee)}</span></div>
                <div className="result-row"><span className="result-label">Total Spread</span><span className="result-value good">{fmt(endBuyerPrice - wholesaleMAO)}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── RENTAL / BRRR ── */}
      {activeTab === "rental" && (
        <div className="grid-2" style={{ gap: 20 }}>
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-title">📐 Inputs</div>
              <Inp label="After Repair Value (ARV)" value={arv} onChange={setArv} prefix="$" />
              <Inp label="Repair Cost" value={repairs} onChange={setRepairs} prefix="$" />
              <Inp label="Closing Costs" value={closingCosts} onChange={setClosingCosts} prefix="$" />
            </div>
            <div className="formula-box">
              <div>70% Rule: <span>ARV × 70%</span> − <span>Repairs</span> = <span>{fmt(rentalMAO)}</span></div>
              <div>BRRR: <span>ARV × 75% Refi</span> − <span>Repairs</span> − <span>Closing</span></div>
            </div>
          </div>
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div className="mao-hero" style={{ padding: 18 }}>
                <div className="mao-label">70% Rule MAO</div>
                <div className="mao-value" style={{ fontSize: 36 }}>{fmt(rentalMAO)}</div>
              </div>
              <div className="mao-hero" style={{ padding: 18 }}>
                <div className="mao-label">BRRR MAO</div>
                <div className="mao-value" style={{ fontSize: 36 }}>{fmt(brrrrMAO)}</div>
              </div>
            </div>
            <div className="card">
              <div className="card-title">BRRR Analysis</div>
              <div className="result-box">
                <div className="result-row"><span className="result-label">ARV</span><span className="result-value">{fmt(arv)}</span></div>
                <div className="result-row"><span className="result-label">Refi at 75% ARV</span><span className="result-value">{fmt(afterRefi)}</span></div>
                <div className="result-row"><span className="result-label">All-In Cost</span><span className="result-value">{fmt(allInCost)}</span></div>
                <div className="result-row">
                  <span className="result-label">Cash Left In Deal</span>
                  <span className={`result-value ${cashLeftIn <= 0 ? "good" : "warn"}`}>
                    {fmt(Math.abs(cashLeftIn))} {cashLeftIn <= 0 ? "← pulled out" : "← still in"}
                  </span>
                </div>
                <div className="result-row">
                  <span className="result-label">True BRRR?</span>
                  <span className={`badge ${cashLeftIn <= 0 ? "badge-green" : "badge-red"}`}>{cashLeftIn <= 0 ? "✓ Full Recycle" : "Partial Recycle"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SHORT TERM RENTAL ── */}
      {activeTab === "str" && (
        <div>
          {/* Market Data Banner */}
          <div style={{ background: "rgba(27,58,107,0.5)", border: "1px solid rgba(200,146,42,0.25)", borderRadius: 10, padding: "16px 20px", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: GOLD }}>
                📊 Cleveland Area STR Market Data — 2025
              </div>
              <div style={{ fontSize: 10, color: MUTED, fontStyle: "italic" }}>Sources: Airbtics · Chalet · AirDNA · AirROI</div>
            </div>
            <div className="str-market-grid">
              {[
                { label: "Cleveland Avg ADR", val: "$120 – $155 / night", src: "Airbtics / Chalet 2025" },
                { label: "Avg Occupancy Rate", val: "52% – 61%", src: "AirDNA / Chalet 2025" },
                { label: "Avg Annual Revenue", val: "$26K – $31K", src: "Airbtics 2025" },
                { label: "Peak ADR (Jan / Feb)", val: "$236 / night", src: "Chalet 2025" },
                { label: "Low Season ADR", val: "$145 / night", src: "Chalet 2025" },
                { label: "Cleveland Heights ADR", val: "$102 – $107 / night", src: "AirROI 2025" },
              ].map((d, i) => (
                <div key={i} className="str-market-card">
                  <div className="str-market-label">{d.label}</div>
                  <div className="str-market-val">{d.val}</div>
                  <div className="str-market-src">{d.src}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 10, color: MUTED, fontStyle: "italic", marginTop: 4 }}>
              ⚠️ Market data is updated annually. Actual performance varies by neighborhood, amenities, and management quality. Always verify with current listings before underwriting.
            </div>
          </div>

          <div className="grid-2" style={{ gap: 20 }}>
            {/* LEFT — Inputs */}
            <div>
              <div className="card" style={{ marginBottom: 16 }}>
                <div className="card-title">🏠 Property & Market Inputs</div>

                {/* Bedroom Selector */}
                <div className="field">
                  <label>Bedrooms — auto-sets Cleveland market ADR & occupancy</label>
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        className={`bed-btn ${strBeds === n ? "active" : ""}`}
                        onClick={() => handleBedSelect(n)}
                      >
                        {n}BR
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize: 10, color: MUTED, marginTop: 6, fontStyle: "italic" }}>
                    Based on Cleveland 2025 market averages. Override ADR and occupancy below.
                  </div>
                </div>

                <Inp label="After Repair Value (ARV)" value={strArv} onChange={setStrArv} prefix="$" />
                <Inp label="Repair Cost" value={strRepairs} onChange={setStrRepairs} prefix="$" note="Auto-linked from Rehab Sheet" />
                <Inp label="Closing Costs" value={strClosing} onChange={setStrClosing} prefix="$" />
              </div>

              <div className="card" style={{ marginBottom: 16 }}>
                <div className="card-title">📈 Revenue & Expense Inputs</div>
                <Inp label="Avg Daily Rate (ADR)" value={strADR} onChange={setStrADR} prefix="$"
                  note={`Cleveland 2025: 1BR=$95 | 2BR=$125 | 3BR=$155 | 4BR=$185 | 5BR=$220`} />
                <Inp label="Occupancy Rate" value={strOccupancy} onChange={setStrOccupancy} suffix="%"
                  note="Cleveland avg: 52–61% | Peak months (Jun–Jul) hit 70%" />
                <Inp label="Platform Fee % (Airbnb / VRBO)" value={strPlatformFee} onChange={setStrPlatformFee} suffix="%"
                  note="Airbnb host fee typically 3% | VRBO ~5%" />
                <Inp label="Property Management Fee %" value={strMgmtFee} onChange={setStrMgmtFee} suffix="%"
                  note="Self-manage = 0% | Full management = 20–30%" />
                <Inp label="Operating Expenses %" value={strOpEx} onChange={setStrOpEx} suffix="%"
                  note="Utilities, supplies, cleaning, insurance, maintenance (~25–35%)" />
              </div>

              <div className="card">
                <div className="card-title">⚙️ Underwriting Assumptions</div>
                <Inp label="Target Cap Rate %" value={strCapRate} onChange={setStrCapRate} suffix="%"
                  note="Used to derive value. STR typically underwritten at 7–10%" />
                <Inp label="MAO as % of Valuation (LTV)" value={strLtv} onChange={setStrLtv} suffix="%"
                  note="How much of the STR valuation you're willing to pay. 70% = conservative." />
              </div>
            </div>

            {/* RIGHT — Results */}
            <div>
              {/* MAO Hero */}
              <div className="mao-hero">
                <div className="mao-label">STR Maximum Allowable Offer</div>
                <div className="mao-value">{fmt(strMAO)}</div>
                <div style={{ marginTop: 8, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" as const }}>
                  <span className={`badge ${strMAO > 0 ? "badge-green" : "badge-red"}`}>{strMAO > 0 ? "✓ Viable" : "✗ Not Viable"}</span>
                  <span style={{ fontSize: 11, color: MUTED }}>{strBeds}BR • {strOccupancy}% occ • {fmt(strADR)}/night</span>
                </div>
              </div>

              {/* Pro Forma */}
              <div className="card" style={{ marginBottom: 16 }}>
                <div className="card-title">STR Annual Pro Forma</div>
                <div className="result-box">
                  <div className="result-row"><span className="result-label">Booked Nights / Year</span><span className="result-value">{strNightsPerYear.toFixed(0)} nights</span></div>
                  <div className="result-row"><span className="result-label">Gross Annual Revenue</span><span className="result-value">{fmt(strGrossRevenue)}</span></div>
                  <div className="result-row"><span className="result-label">− Platform Fees ({strPlatformFee}%)</span><span className="result-value bad">− {fmt(strPlatformCost)}</span></div>
                  <div className="result-row"><span className="result-label">− Mgmt Fees ({strMgmtFee}%)</span><span className="result-value bad">− {fmt(strMgmtCost)}</span></div>
                  <div className="result-row"><span className="result-label">− Operating Expenses ({strOpEx}%)</span><span className="result-value bad">− {fmt(strOpExCost)}</span></div>
                  <div className="result-row"><span className="result-label">Net Annual Income (NOI)</span><span className="result-value good">{fmt(strNetIncome)}</span></div>
                  <div className="result-row"><span className="result-label">Net Monthly Income</span><span className="result-value good">{fmt(strMonthlyIncome)}</span></div>
                </div>
              </div>

              {/* MAO Breakdown */}
              <div className="card" style={{ marginBottom: 16 }}>
                <div className="card-title">MAO Breakdown</div>
                <div className="result-box">
                  <div className="result-row"><span className="result-label">NOI ÷ Cap Rate ({strCapRate}%)</span><span className="result-value">{fmt(strValuation)}</span></div>
                  <div className="result-row"><span className="result-label">× LTV ({strLtv}%)</span><span className="result-value">{fmt(strValuation * (strLtv / 100))}</span></div>
                  <div className="result-row"><span className="result-label">− Repairs</span><span className="result-value">{fmt(strRepairs)}</span></div>
                  <div className="result-row"><span className="result-label">− Closing Costs</span><span className="result-value">{fmt(strClosing)}</span></div>
                  <div className="result-row"><span className="result-label">STR MAO</span><span className="result-value highlight">{fmt(strMAO)}</span></div>
                  <div className="result-row">
                    <span className="result-label">Actual Cap Rate</span>
                    <span className={`result-value ${strActualCapRate >= 8 ? "good" : strActualCapRate >= 5 ? "warn" : "bad"}`}>{strActualCapRate.toFixed(1)}%</span>
                  </div>
                  <div className="result-row">
                    <span className="result-label">Cash-on-Cash Return</span>
                    <span className={`result-value ${strCashOnCash >= 0.12 ? "good" : strCashOnCash >= 0.08 ? "warn" : "bad"}`}>{fmt(strCashOnCash, "pct")}</span>
                  </div>
                  <div className="result-row">
                    <span className="result-label">Gross Rent Multiplier</span>
                    <span className="result-value">{strGRM.toFixed(2)}x</span>
                  </div>
                </div>
              </div>

              {/* Seasonality Table */}
              <div className="card">
                <div className="card-title">🗓 Cleveland STR Seasonality (2025)</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                  {STR_SEASONAL.map((s, i) => (
                    <div key={i} className="season-row" style={{ display: "flex", justifyContent: "space-between", padding: "5px 8px", background: i % 2 === 0 ? "rgba(0,0,0,0.15)" : "transparent", borderRadius: 4 }}>
                      <span style={{ fontSize: 11, color: MUTED, width: 36 }}>{s.month}</span>
                      <span style={{ fontFamily: "'DM Mono'", fontSize: 11, color: WHITE }}>${s.adr}/night</span>
                      <span style={{ fontFamily: "'DM Mono'", fontSize: 11, color: s.occ >= 60 ? "#5de09a" : s.occ >= 45 ? "#f0c040" : MUTED }}>{s.occ}% occ</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 10, fontSize: 10, color: MUTED, fontStyle: "italic" }}>
                  Peak: Jun–Jul (70% occ) | Peak ADR: Jan–Feb ($236) | Low: Jan (32% occ)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("deal");
  const [rehabTotal, setRehabTotal] = useState(0);

  const titles: Record<string, { title: string; sub: string }> = {
    deal: { title: "3-Option Deal Calculator", sub: "Analyze any property across all cash, interest-only, and principal-only seller finance scenarios" },
    rehab: { title: "Rehab Cost Estimator", sub: "Line-item scope of work — total auto-links to Deal Calculator and MAO Calculator" },
    mao: { title: "MAO Calculator", sub: "Maximum Allowable Offer for fix & flip, wholesale, rental / BRRR, and short term rental strategies" },
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <header className="header">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div className="logo-text">AP<span>E</span>X</div>
            <div style={{ width: 1, height: 32, background: "rgba(200,146,42,0.3)" }} />
            <div style={{ fontSize: 11, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" as const, lineHeight: 1.6 }}>
              Investor<br />Dashboard
            </div>
          </div>
          <nav className="nav">
            {[
              { key: "deal", label: "📊 Deal Calculator" },
              { key: "rehab", label: "🔨 Rehab Sheet" },
              { key: "mao", label: "🎯 MAO Calculator" },
            ].map(p => (
              <button key={p.key} className={`nav-btn ${page === p.key ? "active" : ""}`} onClick={() => setPage(p.key)}>
                {p.label}
              </button>
            ))}
          </nav>
        </header>

        <main className="main">
          <div className="page-title">{titles[page].title}</div>
          <div className="page-sub">{titles[page].sub}</div>
          {page === "deal" && <DealCalc rehabTotal={rehabTotal} />}
          {page === "rehab" && <RehabSheet onTotalChange={setRehabTotal} />}
          {page === "mao" && <MAOCalc rehabTotal={rehabTotal} />}
        </main>

        <footer style={{ padding: "12px 32px", borderTop: "1px solid rgba(200,146,42,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>APEX — Investor Tools</span>
          {rehabTotal > 0 && (
            <span style={{ fontSize: 11, color: GOLD, fontFamily: "'DM Mono'" }}>
              Rehab Total: {fmt(rehabTotal)} — linked to all calculators
            </span>
          )}
        </footer>
      </div>
    </>
  );
}
