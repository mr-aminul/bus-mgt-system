import { useState } from "react";
import { Store, Plus, Wifi, WifiOff, TrendingUp, Users } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const counters = [
  {
    id: "CTR-01", name: "Sayedabad Counter", nameBn: "সায়েদাবাদ কাউন্টার",
    location: "Sayedabad Bus Terminal, Dhaka", locationBn: "সায়েদাবাদ বাস টার্মিনাল, ঢাকা",
    agent: "Rina Begum", agentBn: "রিনা বেগম", agentId: "AGT-001",
    status: "Online", todaySales: 18200, todayTickets: 33, shift: "06:00 – 14:00",
    avatar: "RB",
  },
  {
    id: "CTR-02", name: "Kamalapur Counter", nameBn: "কমলাপুর কাউন্টার",
    location: "Kamalapur Station, Dhaka", locationBn: "কমলাপুর স্টেশন, ঢাকা",
    agent: "Jamal Uddin", agentBn: "জামাল উদ্দিন", agentId: "AGT-002",
    status: "Online", todaySales: 14600, todayTickets: 27, shift: "08:00 – 16:00",
    avatar: "JU",
  },
  {
    id: "CTR-03", name: "Gabtoli Counter", nameBn: "গাবতলী কাউন্টার",
    location: "Gabtoli Bus Stand, Dhaka", locationBn: "গাবতলী বাস স্ট্যান্ড, ঢাকা",
    agent: "Sumaiya Khatun", agentBn: "সুমাইয়া খাতুন", agentId: "AGT-003",
    status: "Online", todaySales: 9800, todayTickets: 18, shift: "07:00 – 15:00",
    avatar: "SK",
  },
  {
    id: "CTR-04", name: "Chittagong Main Counter", nameBn: "চট্টগ্রাম মূল কাউন্টার",
    location: "BRTC Depot, Agrabad, CTG", locationBn: "BRTC ডিপো, আগ্রাবাদ, চট্টগ্রাম",
    agent: "Babul Islam", agentBn: "বাবুল ইসলাম", agentId: "AGT-004",
    status: "Online", todaySales: 7200, todayTickets: 21, shift: "07:00 – 15:00",
    avatar: "BI",
  },
  {
    id: "CTR-05", name: "Sylhet Counter", nameBn: "সিলেট কাউন্টার",
    location: "Kumargaon Bus Stand, Sylhet", locationBn: "কুমারগাঁও বাস স্ট্যান্ড, সিলেট",
    agent: "Monira Begum", agentBn: "মনিরা বেগম", agentId: "AGT-005",
    status: "Offline", todaySales: 0, todayTickets: 0, shift: "—",
    avatar: "MB",
  },
  {
    id: "CTR-06", name: "Rajshahi Counter", nameBn: "রাজশাহী কাউন্টার",
    location: "Shiromoni, Rajshahi", locationBn: "শিরোমণি, রাজশাহী",
    agent: "Abul Kalam", agentBn: "আবুল কালাম", agentId: "AGT-006",
    status: "Online", todaySales: 5400, todayTickets: 10, shift: "09:00 – 17:00",
    avatar: "AK",
  },
];

const hourlySales = [
  { hour: "6 AM", sales: 2200 },
  { hour: "7 AM", sales: 8400 },
  { hour: "8 AM", sales: 12100 },
  { hour: "9 AM", sales: 9800 },
  { hour: "10 AM", sales: 6200 },
  { hour: "11 AM", sales: 4100 },
  { hour: "12 PM", sales: 3800 },
  { hour: "1 PM", sales: 4600 },
  { hour: "2 PM", sales: 7200 },
  { hour: "3 PM", sales: 9400 },
];

const avatarColors = ["#1A3C6E", "#2CA85A", "#3B82F6", "#8B5CF6", "#F5A623", "#EC4899"];

export function CountersPage() {
  const { t, lang } = useLanguage();
  const [selected, setSelected] = useState<typeof counters[0] | null>(null);

  const onlineCount = counters.filter((c) => c.status === "Online").length;
  const totalSales = counters.reduce((s, c) => s + c.todaySales, 0);
  const totalTickets = counters.reduce((s, c) => s + c.todayTickets, 0);

  return (
    <div className="counters-page">
      {/* Header */}
      <div className="counters-header">
        <div className="counters-header-left">
          <h1 className="counters-title">{t("counters_title")}</h1>
          <p className="counters-summary">
            {onlineCount} {t("counters_sub")} — {counters.length - onlineCount} {lang === "bn" ? "অফলাইন" : "offline"}
          </p>
        </div>
        <button type="button" className="counters-btn-add">
          <Plus size={14} />
          {t("btn_add_counter")}
        </button>
      </div>

      {/* KPIs */}
      <div className="counters-kpi-grid">
        {[
          { label: lang === "bn" ? "মোট কাউন্টার" : "Total Counters", value: counters.length, icon: Store, color: "#1A3C6E" },
          { label: lang === "bn" ? "অনলাইন" : "Online", value: onlineCount, icon: Wifi, color: "#2CA85A" },
          { label: lang === "bn" ? "আজকের আয়" : "Today's Revenue", value: `৳${(totalSales / 1000).toFixed(1)}k`, icon: TrendingUp, color: "#3B82F6" },
          { label: lang === "bn" ? "আজ টিকেট" : "Today's Tickets", value: totalTickets, icon: Users, color: "#F5A623" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="counters-kpi-card">
            <div className="counters-kpi-icon-wrap">
              <div className="counters-kpi-icon" style={{ background: `${color}18` }}>
                <Icon size={20} color={color} />
              </div>
            </div>
            <div className="counters-kpi-label">{label}</div>
            <div className="counters-kpi-value" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Counter Cards Grid */}
      <div className="counters-cards-grid">
        {counters.map((c, i) => {
          const isOnline = c.status === "Online";
          return (
            <div
              key={c.id}
              onClick={() => setSelected(selected?.id === c.id ? null : c)}
              className={`counters-card ${selected?.id === c.id ? "counters-card--selected" : ""} ${!isOnline ? "counters-card--offline" : ""}`}
              style={{
                borderColor: selected?.id === c.id ? "#1A3C6E" : isOnline ? "#E5E7EB" : "#F3F4F6",
              }}
            >
              <div className="counters-card-header">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    className="counters-card-avatar"
                    style={{ background: avatarColors[i % avatarColors.length] }}
                  >
                    {c.avatar}
                  </div>
                  <div>
                    <div className="counters-card-name">{lang === "bn" ? c.nameBn : c.name}</div>
                    <div className="counters-card-id">{c.id}</div>
                  </div>
                </div>
                <div className="counters-card-status" style={{ color: isOnline ? "#2CA85A" : "#9CA3AF" }}>
                  {isOnline ? <Wifi size={12} color="#2CA85A" /> : <WifiOff size={12} color="#9CA3AF" />}
                  {lang === "bn" ? (isOnline ? "অনলাইন" : "অফলাইন") : c.status}
                </div>
              </div>

              <div className="counters-card-location">
                📍 {lang === "bn" ? c.locationBn : c.location}
              </div>

              <div className="counters-card-metrics">
                <div>
                  <div className="counters-card-metric-label">{lang === "bn" ? "এজেন্ট" : "Agent"}</div>
                  <div className="counters-card-metric-value" style={{ color: "#1F2937" }}>{lang === "bn" ? c.agentBn : c.agent}</div>
                </div>
                <div>
                  <div className="counters-card-metric-label">{lang === "bn" ? "আজকের আয়" : "Today's Sales"}</div>
                  <div className="counters-card-metric-value" style={{ color: isOnline ? "#2CA85A" : "#9CA3AF" }}>
                    {isOnline ? `৳ ${c.todaySales.toLocaleString()}` : "—"}
                  </div>
                </div>
                <div>
                  <div className="counters-card-metric-label">{lang === "bn" ? "আজ টিকেট" : "Tickets Today"}</div>
                  <div className="counters-card-metric-value" style={{ color: "#1F2937" }}>
                    {isOnline ? c.todayTickets : "—"}
                  </div>
                </div>
                <div>
                  <div className="counters-card-metric-label">{lang === "bn" ? "শিফট" : "Shift"}</div>
                  <div className="counters-card-metric-value" style={{ color: "#374151", fontWeight: 500 }}>{c.shift}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hourly Sales Chart */}
      <div className="counters-chart-card">
        <div className="counters-chart-title">
          {lang === "bn" ? "ঘণ্টাওয়ারি বিক্রয় — সব কাউন্টার" : "Hourly Sales — All Counters"}
        </div>
        <div className="counters-chart-sub">
          {lang === "bn" ? "সমস্ত কাউন্টারের মোট বিক্রয় (টাকায়)" : "Combined sales across all counters (BDT)"}
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={hourlySales} barSize={28}>
            <CartesianGrid vertical={false} stroke="#F3F4F6" />
            <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`} width={44} />
            <Tooltip
              content={({ active, payload, label }: any) =>
                active && payload?.length ? (
                  <div style={{ background: "#1F2937", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "12px" }}>
                    <div style={{ color: "#9CA3AF", marginBottom: "4px" }}>{label}</div>
                    <div style={{ fontWeight: 600 }}>৳ {payload[0].value.toLocaleString()}</div>
                  </div>
                ) : null
              }
              cursor={{ fill: "rgba(26,60,110,0.05)" }}
            />
            <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
              {hourlySales.map((_, i) => (
                <Cell key={i} fill={i === 2 ? "#2CA85A" : "#1A3C6E"} fillOpacity={i === 2 ? 1 : 0.7} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}