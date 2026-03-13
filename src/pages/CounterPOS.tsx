import { useState, useEffect } from "react";
import { CheckCircle2, ArrowLeft, ChevronRight, Printer, RotateCcw, Wind, Building2 } from "lucide-react";
import { useNavigate } from 'react-router-dom'
import { useOperator } from '@/contexts/OperatorContext'

// ─── Data ─────────────────────────────────────────────────────────────────────

const CITIES = ["Dhaka", "Chittagong", "Comilla", "Feni"] as const;
type City = typeof CITIES[number];

const FARES: Partial<Record<string, { ac: number; nonac: number }>> = {
  "Dhaka-Chittagong": { ac: 750, nonac: 550 },
  "Chittagong-Dhaka": { ac: 750, nonac: 550 },
  "Dhaka-Comilla":    { ac: 380, nonac: 280 },
  "Comilla-Dhaka":    { ac: 380, nonac: 280 },
  "Dhaka-Feni":       { ac: 500, nonac: 380 },
  "Feni-Dhaka":       { ac: 500, nonac: 380 },
};

const BOARDING: Record<City, { id: string; name: string; offset: number }[]> = {
  Dhaka:      [
    { id: "sy", name: "Sayedabad",    offset: 0  },
    { id: "mk", name: "Mohakhali",    offset: 30 },
    { id: "kl", name: "Kalyanpur",    offset: 45 },
    { id: "ab", name: "Abdullahpur",  offset: 75 },
  ],
  Chittagong: [
    { id: "dp", name: "Dampara",      offset: 0  },
    { id: "mr", name: "Muradpur",     offset: 15 },
    { id: "ox", name: "Oxygen",       offset: 30 },
  ],
  Comilla:    [{ id: "cb", name: "Comilla Bus Stand", offset: 0 }],
  Feni:       [{ id: "fb", name: "Feni Bus Stand",    offset: 0 }],
};

const BASE_TRIPS = [
  { base: "07:00", bus: "DH-1142", seats: 12, full: false, ac: true  },
  { base: "09:30", bus: "DH-2087", seats: 4,  full: false, ac: true  },
  { base: "11:00", bus: "DH-3315", seats: 0,  full: true,  ac: false },
  { base: "14:00", bus: "DH-0891", seats: 28, full: false, ac: false },
  { base: "17:30", bus: "CTG-441", seats: 38, full: false, ac: true  },
  { base: "20:00", bus: "DH-1776", seats: 44, full: false, ac: false },
];

function fmtTime(base: string, offset: number): string {
  const [h, m] = base.split(":").map(Number);
  const t = h * 60 + m + offset;
  const nh = Math.floor(t / 60) % 24;
  const nm = t % 60;
  return `${nh > 12 ? nh - 12 : nh === 0 ? 12 : nh}:${nm.toString().padStart(2, "0")} ${nh >= 12 ? "PM" : "AM"}`;
}

// ─── Seats ────────────────────────────────────────────────────────────────────

const ROWS = ["A","B","C","D","E","F","G","H","I"];
type SS = "available" | "booked" | "selected" | "reserved";

const BOOKED_SET = new Set([
  "A1","A2","A3","B1","B2","C3","C4","D1","D2","D3","D4",
  "E1","E2","F3","F4","G1","G2","G3","H4","I1","I2",
]);
const RESERVED_SET = new Set(["C1","H2"]);

function initSeats(): Record<string, SS> {
  const s: Record<string, SS> = {};
  for (const r of ROWS)
    for (const n of [1,2,3,4]) {
      const id = `${r}${n}`;
      s[id] = RESERVED_SET.has(id) ? "reserved" : BOOKED_SET.has(id) ? "booked" : "available";
    }
  return s;
}

// ─── Seat component ────────────────────────────────────────────────────────────

const ST: Record<SS, { head: string; body: string; low: string; leg: string; txt: string; glow?: string }> = {
  available: { head: "#3562A6", body: "#4A7CC9", low: "#3A65A8", leg: "#2D4E80", txt: "#fff" },
  booked:    { head: "#0D1F38", body: "#1A3152", low: "#13253D", leg: "#0A1929", txt: "#4A6080" },
  selected:  { head: "#1A7A3E", body: "#2CA85A", low: "#228B4A", leg: "#145930", txt: "#fff", glow: "0 0 0 2.5px #2CA85A, 0 0 0 5px rgba(44,168,90,0.2)" },
  reserved:  { head: "#A86C00", body: "#F5A623", low: "#D48F1A", leg: "#7A5000", txt: "#fff" },
};

function Seat({ id, state, onTap }: { id: string; state: SS; onTap: () => void }) {
  const c = ST[state];
  const active = state === "available" || state === "selected";
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={active ? onTap : undefined}
      onMouseEnter={() => active && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: "1px",
        cursor: active ? "pointer" : "default",
        transform: hov ? "scale(1.1) translateY(-2px)" : "scale(1)",
        transition: "transform 0.09s",
        userSelect: "none",
      }}
    >
      {/* headrest */}
      <div style={{
        width: "36px", height: "9px", background: c.head,
        borderRadius: "6px 6px 2px 2px",
        boxShadow: "inset 0 -2px 3px rgba(0,0,0,0.22), 0 1px 2px rgba(0,0,0,0.12)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "2px", left: "7px", right: "7px", height: "3px", background: "rgba(255,255,255,0.16)", borderRadius: "2px" }} />
      </div>
      {/* body */}
      <div style={{
        width: "42px", height: "32px",
        background: `linear-gradient(165deg, ${c.body} 0%, ${c.low} 100%)`,
        borderRadius: "4px",
        boxShadow: c.glow ?? "0 2px 4px rgba(0,0,0,0.16), inset 0 1px 2px rgba(255,255,255,0.1)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        paddingTop: "5px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", bottom: "4px", left: "5px", right: "5px", height: "8px", background: c.low, borderRadius: "3px", opacity: 0.65 }} />
        <div style={{ position: "absolute", top: "4px", left: "4px", bottom: "13px", width: "1.5px", background: "rgba(0,0,0,0.1)", borderRadius: "1px" }} />
        <div style={{ position: "absolute", top: "4px", right: "4px", bottom: "13px", width: "1.5px", background: "rgba(0,0,0,0.1)", borderRadius: "1px" }} />
        <span style={{ fontSize: "9px", fontWeight: 800, color: c.txt, opacity: state === "booked" ? 0.4 : 0.95, position: "relative", zIndex: 1 }}>
          {id}
        </span>
      </div>
      {/* legs */}
      <div style={{ display: "flex", justifyContent: "space-between", width: "30px", marginTop: "1px" }}>
        <div style={{ width: "7px", height: "4px", background: c.leg, borderRadius: "1px 1px 3px 3px", boxShadow: "0 1px 2px rgba(0,0,0,0.2)" }} />
        <div style={{ width: "7px", height: "4px", background: c.leg, borderRadius: "1px 1px 3px 3px", boxShadow: "0 1px 2px rgba(0,0,0,0.2)" }} />
      </div>
    </div>
  );
}

function Wheel() {
  return (
    <div style={{ position: "relative", width: "32px", height: "32px" }}>
      <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "3.5px solid #6B7280", position: "absolute" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "8px", height: "8px", borderRadius: "50%", background: "#9CA3AF", border: "2px solid #6B7280" }} />
      <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "2px", background: "#6B7280", transform: "translateY(-50%)" }} />
      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "2px", background: "#6B7280", transform: "translateX(-50%)" }} />
    </div>
  );
}

function DriverSeat({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
      <div style={{ width: "32px", height: "8px", background: "#9A6E00", borderRadius: "5px 5px 2px 2px" }} />
      <div style={{ width: "36px", height: "26px", background: "linear-gradient(160deg,#F5C842,#E2AA20)", borderRadius: "3px", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "4px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: "3px", left: "3px", right: "3px", height: "7px", background: "#C99010", borderRadius: "2px", opacity: 0.5 }} />
        <span style={{ fontSize: "7px", fontWeight: 800, color: "#6B4A00", position: "relative", zIndex: 1 }}>{label}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", width: "26px" }}>
        <div style={{ width: "6px", height: "4px", background: "#7A5000", borderRadius: "1px 1px 2px 2px" }} />
        <div style={{ width: "6px", height: "4px", background: "#7A5000", borderRadius: "1px 1px 2px 2px" }} />
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function CounterPOS() {
  const navigate = useNavigate();
  const { operator, operators, setOperatorId } = useOperator();
  const [from, setFrom]           = useState<City>("Dhaka");
  const [to, setTo]               = useState<City>("Chittagong");
  const [boardId, setBoardId]     = useState("sy");
  const [journeyDate, setJourneyDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [tripIdx, setTripIdx]     = useState(0);
  const [seats, setSeats]         = useState<Record<string, SS>>(initSeats);
  const [selected, setSelected]   = useState<string[]>([]);
  const [payment, setPayment]     = useState<"Cash" | "bKash" | "Nagad">("Cash");
  const [phone, setPhone]         = useState("");
  const [issued, setIssued]       = useState(false);
  const [ticketNo, setTicketNo]   = useState("");
  const [opOpen, setOpOpen]       = useState(false);

  const bpts      = BOARDING[from];
  const boardPt   = bpts.find(p => p.id === boardId) ?? bpts[0];
  const trips     = BASE_TRIPS.map(t => ({ ...t, time: fmtTime(t.base, boardPt.offset) }));
  const trip      = trips[tripIdx];
  const fareRates = FARES[`${from}-${to}`] ?? { ac: 750, nonac: 550 };
  const fare      = trip.ac ? fareRates.ac : fareRates.nonac;
  const total     = fare * selected.length;

  function toggleSeat(id: string) {
    const st = seats[id];
    if (st === "booked" || st === "reserved") return;
    if (st === "selected") {
      setSeats(s => ({ ...s, [id]: "available" }));
      setSelected(p => p.filter(x => x !== id));
    } else {
      setSeats(s => ({ ...s, [id]: "selected" }));
      setSelected(p => [...p, id]);
    }
  }

  function changeFrom(city: City) {
    setFrom(city);
    setBoardId(BOARDING[city][0].id);
    setSeats(initSeats());
    setSelected([]);
    if (city === to) setTo(CITIES.find(c => c !== city)!);
  }

  function issue() {
    if (!selected.length) return;
    setTicketNo(`TK-${Date.now().toString().slice(-5)}`);
    setIssued(true);
  }

  function reset() {
    const ns = { ...seats };
    selected.forEach(id => { ns[id] = "booked"; });
    setSeats(ns);
    setSelected([]);
    setPhone("");
    setIssued(false);
  }

  // ── Layout ────────────────────────────────────────────────────────────────
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#E8EDF4", fontFamily: "'Inter',sans-serif", overflow: "hidden" }}>

      {/* ── Header with route selectors ── */}
      <div style={{ height: "52px", background: "#1A3C6E", display: "flex", alignItems: "center", padding: "0 14px", gap: "10px", flexShrink: 0, position: "relative" }}>
        <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "4px", color: "rgba(255,255,255,0.6)", fontSize: "12px", background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}>
          <ArrowLeft size={13} />
        </button>
        <div style={{ width: "1px", height: "32px", background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />
        <span style={{ color: "#fff", fontSize: "13px", fontWeight: 700, flexShrink: 0 }}>FleetOS</span>
        <div style={{ width: "1px", height: "32px", background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />

        {/* ── Operator selector ── */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <button
            onClick={() => setOpOpen(o => !o)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "4px 10px", borderRadius: "6px",
              border: `1.5px solid ${operator.color}66`,
              background: `${operator.color}22`,
              cursor: "pointer",
            }}
          >
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: operator.color, flexShrink: 0 }} />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>
              {operator.shortName}
            </span>
            <ChevronRight size={11} color="rgba(255,255,255,0.5)" style={{ transform: opOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }} />
          </button>

          {opOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 999,
              background: "#fff", border: "1px solid #E5E7EB",
              borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
              minWidth: "230px", overflow: "hidden",
            }}>
              <div style={{ padding: "8px 12px 6px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: "6px" }}>
                <Building2 size={12} color="#9CA3AF" />
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.06em" }}>SELECT PROVIDER</span>
              </div>
              {operators.map(op => (
                <button
                  key={op.id}
                  onClick={() => { setOperatorId(op.id); setOpOpen(false); setSeats(initSeats()); setSelected([]); setTripIdx(0); }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: "8px",
                    padding: "8px 12px", border: "none",
                    background: op.id === operator.id ? op.colorBg : "transparent",
                    borderLeft: op.id === operator.id ? `3px solid ${op.color}` : "3px solid transparent",
                    cursor: "pointer", textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>{op.logo}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: op.id === operator.id ? op.colorText : "#1F2937", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{op.name}</div>
                    <div style={{ fontSize: "10px", color: "#9CA3AF" }}>{op.totalBuses} buses</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ width: "1px", height: "32px", background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />

        {/* FROM */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.38)", fontWeight: 700, letterSpacing: "0.08em" }}>FROM</span>
          <select
            value={from}
            onChange={e => changeFrom(e.target.value as City)}
            style={{
              padding: "4px 7px", borderRadius: "6px",
              border: "1.5px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.1)",
              color: "#fff", fontSize: "12px", fontWeight: 600,
              cursor: "pointer", outline: "none", appearance: "auto",
            }}
          >
            {CITIES.filter(c => c !== to).map(c => (
              <option key={c} value={c} style={{ background: "#1A3C6E" }}>{c}</option>
            ))}
          </select>
        </div>

        {/* Arrow */}
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "13px", flexShrink: 0, marginTop: "10px" }}>→</span>

        {/* TO */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.38)", fontWeight: 700, letterSpacing: "0.08em" }}>TO</span>
          <select
            value={to}
            onChange={e => setTo(e.target.value as City)}
            style={{
              padding: "4px 7px", borderRadius: "6px",
              border: "1.5px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.1)",
              color: "#fff", fontSize: "12px", fontWeight: 600,
              cursor: "pointer", outline: "none", appearance: "auto",
            }}
          >
            {CITIES.filter(c => c !== from).map(c => (
              <option key={c} value={c} style={{ background: "#1A3C6E" }}>{c}</option>
            ))}
          </select>
        </div>

        <div style={{ width: "1px", height: "32px", background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />

        {/* BOARD AT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.38)", fontWeight: 700, letterSpacing: "0.08em" }}>BOARD AT</span>
          <select
            value={boardId}
            onChange={e => setBoardId(e.target.value)}
            style={{
              padding: "4px 7px", borderRadius: "6px",
              border: "1.5px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.1)",
              color: "#fff", fontSize: "12px", fontWeight: 600,
              cursor: "pointer", outline: "none", appearance: "auto",
            }}
          >
            {bpts.map(pt => (
              <option key={pt.id} value={pt.id} style={{ background: "#1A3C6E" }}>
                {pt.name}{pt.offset > 0 ? ` (+${pt.offset}m)` : ""}
              </option>
            ))}
          </select>
        </div>

        <div style={{ width: "1px", height: "32px", background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />

        {/* DATE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.38)", fontWeight: 700, letterSpacing: "0.08em" }}>DATE</span>
          <input
            type="date"
            value={journeyDate}
            min={new Date().toISOString().slice(0, 10)}
            onChange={e => setJourneyDate(e.target.value)}
            style={{
              padding: "4px 7px", borderRadius: "6px",
              border: "1.5px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.1)",
              color: "#fff", fontSize: "12px", fontWeight: 600,
              cursor: "pointer", outline: "none", colorScheme: "dark",
            }}
          />
        </div>

        <div style={{ flex: 1 }} />
        <Clock12 />
      </div>

      {/* ── 3 panels ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

        {/* ── LEFT: Departures only ── */}
        <div style={{ width: "180px", flexShrink: 0, background: "#fff", borderRight: "1px solid #E2E8F0", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Departures */}
          <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
            {trips.map((dep, i) => {
              const sel = tripIdx === i;
              const low = !dep.full && dep.seats <= 5;
              const clr = dep.full ? "#DC2626" : low ? "#F5A623" : "#2CA85A";
              return (
                <div
                  key={i}
                  onClick={() => !dep.full && setTripIdx(i)}
                  style={{
                    padding: "9px 10px", borderRadius: "8px", marginBottom: "4px",
                    cursor: dep.full ? "not-allowed" : "pointer",
                    background: sel ? "#1A3C6E" : "#F9FAFB",
                    border: `1.5px solid ${sel ? "#1A3C6E" : "#EAECF0"}`,
                    opacity: dep.full ? 0.5 : 1,
                    transition: "all 0.1s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "15px", fontWeight: 800, color: sel ? "#fff" : "#1F2937", fontVariantNumeric: "tabular-nums" }}>
                      {dep.time}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      {dep.ac && <Wind size={10} color={sel ? "rgba(147,197,253,0.9)" : "#3B82F6"} />}
                      <span style={{ fontSize: "12px", fontWeight: 700, color: sel ? "rgba(255,255,255,0.8)" : clr }}>
                        {dep.full ? "FULL" : dep.seats}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "3px" }}>
                    <span style={{ fontSize: "9px", color: sel ? "rgba(255,255,255,0.45)" : "#9CA3AF" }}>{dep.bus}</span>
                    <span style={{
                      fontSize: "9px", fontWeight: 700, padding: "1px 5px", borderRadius: "10px",
                      background: dep.ac ? (sel ? "rgba(59,130,246,0.25)" : "#EFF6FF") : (sel ? "rgba(255,255,255,0.1)" : "#F3F4F6"),
                      color: dep.ac ? (sel ? "#93C5FD" : "#3B82F6") : (sel ? "rgba(255,255,255,0.5)" : "#9CA3AF"),
                    }}>
                      {dep.ac ? "AC" : "Non-AC"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── MIDDLE: Seat map ── */}
        <div style={{ flex: 1, overflow: "auto", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "20px 12px", background: "#E8EDF4" }}>
          {/* Bus shell */}
          <div style={{
            background: "#EDF1F7",
            borderRadius: "32px 32px 14px 14px",
            border: "2.5px solid #9BAAC0",
            padding: "0 18px 18px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.55)",
            minWidth: "210px",
          }}>
            {/* Windshield */}
            <div style={{ height: "42px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", marginBottom: "4px" }}>
              <div style={{ position: "absolute", top: "8px", left: "20px", right: "20px", bottom: "4px", background: "linear-gradient(180deg,#B8D0EC,#D6E8F7)", borderRadius: "10px 10px 3px 3px", border: "1.5px solid #8BAAC8" }} />
              <div style={{ position: "absolute", top: "1px", left: "6px", width: "10px", height: "16px", background: "#4B5563", borderRadius: "3px", zIndex: 1 }} />
              <div style={{ position: "absolute", top: "1px", right: "6px", width: "10px", height: "16px", background: "#4B5563", borderRadius: "3px", zIndex: 1 }} />
            </div>

            {/* Column labels */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 28px 1fr 1fr", gap: "6px", marginBottom: "4px", padding: "0 2px" }}>
              <div style={{ textAlign: "center", fontSize: "9px", color: "#94A3B8", fontWeight: 700 }}>1</div>
              <div style={{ textAlign: "center", fontSize: "9px", color: "#94A3B8", fontWeight: 700 }}>2</div>
              <div />
              <div style={{ textAlign: "center", fontSize: "9px", color: "#94A3B8", fontWeight: 700 }}>3</div>
              <div style={{ textAlign: "center", fontSize: "9px", color: "#94A3B8", fontWeight: 700 }}>4</div>
            </div>

            {/* Driver row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 28px 1fr 1fr", gap: "6px", marginBottom: "10px", padding: "0 2px", alignItems: "center" }}>
              <DriverSeat label="DRV" />
              <div />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><Wheel /></div>
              <div />
              <DriverSeat label="HLP" />
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "linear-gradient(90deg,transparent,#9BAAC0,transparent)", marginBottom: "10px" }} />

            {/* Seat rows */}
            {ROWS.map(row => (
              <div key={row} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 28px 1fr 1fr", gap: "6px", marginBottom: "7px", alignItems: "center", padding: "0 2px" }}>
                <Seat id={`${row}1`} state={seats[`${row}1`]} onTap={() => toggleSeat(`${row}1`)} />
                <Seat id={`${row}2`} state={seats[`${row}2`]} onTap={() => toggleSeat(`${row}2`)} />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                  <span style={{ fontSize: "9px", fontWeight: 800, color: "#94A3B8" }}>{row}</span>
                  <div style={{ width: "1px", height: "12px", background: "#CBD5E1" }} />
                </div>
                <Seat id={`${row}3`} state={seats[`${row}3`]} onTap={() => toggleSeat(`${row}3`)} />
                <Seat id={`${row}4`} state={seats[`${row}4`]} onTap={() => toggleSeat(`${row}4`)} />
              </div>
            ))}

            {/* Rear */}
            <div style={{ height: "14px", background: "linear-gradient(180deg,transparent,rgba(155,170,192,0.25))", borderRadius: "0 0 10px 10px", marginTop: "4px" }} />
          </div>
        </div>

        {/* ── RIGHT: Checkout ── */}
        <div style={{ width: "260px", flexShrink: 0, background: "#fff", display: "flex", flexDirection: "column", overflow: "hidden", borderLeft: "1px solid #E2E8F0" }}>

          {issued ? (
            /* Success */
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", gap: "14px" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#ECFDF5", border: "2px solid #86EFAC", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle2 size={28} color="#2CA85A" />
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "#15803D" }}>Issued!</div>
                <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "2px" }}>{ticketNo}</div>
              </div>
              {/* stub */}
              <div style={{ width: "100%", background: "#F8FAFC", border: "1px dashed #CBD5E1", borderRadius: "10px", padding: "12px" }}>
                {[
                  ["Route",   `${from} → ${to}`],
                  ["Depart",  trip.time],
                  ["Date",    new Date(journeyDate + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })],
                  ["Board",   boardPt.name],
                  ["Seats",   selected.join(", ")],
                  ["Payment", payment],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "11px", color: "#9CA3AF" }}>{l}</span>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#1F2937" }}>{v}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px dashed #E2E8F0", marginTop: "8px", paddingTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "#6B7280" }}>Total</span>
                  <span style={{ fontSize: "20px", fontWeight: 800, color: "#1A3C6E" }}>৳{total.toLocaleString()}</span>
                </div>
              </div>
              <button onClick={reset} style={{ width: "100%", padding: "7px", borderRadius: "8px", border: "none", background: "#F1F5F9", color: "#374151", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <Printer size={13} /> Print
              </button>
              <button onClick={reset} style={{ width: "100%", padding: "13px", borderRadius: "10px", border: "none", background: "#1A3C6E", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <RotateCcw size={14} /> New Ticket
              </button>
            </div>

          ) : (
            <>
              {/* Trip summary */}
              <div style={{ padding: "12px 14px", background: "#1A3C6E", flexShrink: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>{from} → {to}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "1px" }}>{boardPt.name}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "16px", fontWeight: 800, color: "#F5A623", fontVariantNumeric: "tabular-nums" }}>{trip.time}</div>
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>#{trip.bus}</div>
                  </div>
                </div>
              </div>

              {/* Selected seats + total */}
              <div style={{ padding: "12px 14px", borderBottom: "1px solid #F1F5F9", flexShrink: 0 }}>
                <div style={{ minHeight: "28px", display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap", marginBottom: "8px" }}>
                  {selected.length === 0
                    ? <span style={{ fontSize: "12px", color: "#CBD5E1" }}>Select seats on the map</span>
                    : selected.map(s => (
                        <span key={s} onClick={() => toggleSeat(s)} style={{ fontSize: "11px", fontWeight: 700, color: "#fff", background: "#2CA85A", padding: "2px 8px", borderRadius: "20px", cursor: "pointer" }}>
                          {s}
                        </span>
                      ))
                  }
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "11px", color: "#9CA3AF" }}>৳{fare} × {selected.length || "—"}</span>
                  <span style={{ fontSize: "26px", fontWeight: 800, color: selected.length > 0 ? "#1A3C6E" : "#E2E8F0", fontVariantNumeric: "tabular-nums" }}>
                    ৳{total || "0"}
                  </span>
                </div>
              </div>

              {/* Form */}
              <div style={{ flex: 1, padding: "12px 14px", display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto" }}>
                {/* Phone */}
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "12px", color: "#6B7280", userSelect: "none", pointerEvents: "none" }}>+880</span>
                  <input
                    placeholder="Mobile number"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    type="tel"
                    style={{ width: "100%", padding: "9px 10px 9px 52px", border: "1.5px solid #E5E7EB", borderRadius: "8px", fontSize: "13px", color: "#1F2937", outline: "none", background: "#fff", boxSizing: "border-box" }}
                    onFocus={e => { e.currentTarget.style.borderColor = "#1A3C6E"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; }}
                  />
                </div>

                {/* Payment */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                  {(["Cash","bKash","Nagad"] as const).map(m => (
                    <button key={m} onClick={() => setPayment(m)} style={{
                      padding: "10px 4px", borderRadius: "8px",
                      border: `2px solid ${payment === m ? "#1A3C6E" : "#E5E7EB"}`,
                      background: payment === m ? "#EEF4FF" : "#fff",
                      color: payment === m ? "#1A3C6E" : "#6B7280",
                      fontSize: "11px", fontWeight: payment === m ? 800 : 500,
                      cursor: "pointer", transition: "all 0.1s",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
                    }}>
                      <span style={{ fontSize: "15px" }}>{m === "Cash" ? "💵" : m === "bKash" ? "📱" : "🔴"}</span>
                      <span>{m}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Issue button */}
              <div style={{ padding: "12px 14px", borderTop: "1px solid #F1F5F9", flexShrink: 0 }}>
                <button
                  onClick={issue}
                  disabled={selected.length === 0}
                  style={{
                    width: "100%", padding: "15px",
                    borderRadius: "10px", border: "none",
                    background: selected.length > 0 ? "#2CA85A" : "#E5E7EB",
                    color: selected.length > 0 ? "#fff" : "#9CA3AF",
                    fontSize: "15px", fontWeight: 800,
                    cursor: selected.length > 0 ? "pointer" : "not-allowed",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    boxShadow: selected.length > 0 ? "0 4px 14px rgba(44,168,90,0.3)" : "none",
                    transition: "all 0.15s",
                  }}
                >
                  Issue Ticket <ChevronRight size={17} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Clock12() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  return <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", fontVariantNumeric: "tabular-nums" }}>{t.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>;
}