import { TrendingUp, TrendingDown, Bus, BanknoteIcon, Ticket, Clock, AlertTriangle, RefreshCw, MapPin, ArrowUpRight, Wind } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BangladeshMap } from '@/components/bms/BangladeshMap'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/contexts/LanguageContext'
import { useOperator } from '@/contexts/OperatorContext'
import { ALL_BUSES } from '@/data/operators'
import React from "react";

// ─── Data ───────────────────────────────────────────────────────────────────

const revenueData = [
  { day: "Thu", dayBn: "বৃহ", amount: 38400 },
  { day: "Fri", dayBn: "শুক্র", amount: 42100 },
  { day: "Sat", dayBn: "শনি", amount: 35700 },
  { day: "Sun", dayBn: "রবি", amount: 44800 },
  { day: "Mon", dayBn: "সোম", amount: 39200 },
  { day: "Tue", dayBn: "মঙ্গল", amount: 46300 },
  { day: "Wed", dayBn: "বুধ", amount: 48250 },
];

const trips = [
  { route: "Dhaka → Chittagong", routeBn: "ঢাকা → চট্টগ্রাম", departure: "07:00 AM", bus: "GL-1142", ac: true,  operatorId: "greenline",   status: "On Time"  as const, load: { booked: 40, total: 44 } },
  { route: "Dhaka → Sylhet",     routeBn: "ঢাকা → সিলেট",     departure: "07:30 AM", bus: "GL-2087", ac: true,  operatorId: "greenline",   status: "Departed" as const, load: { booked: 44, total: 44 } },
  { route: "Dhaka → Cox's Bazar",routeBn: "ঢাকা → কক্সবাজার", departure: "08:00 AM", bus: "HN-3302", ac: false, operatorId: "hanif",       status: "Delayed"  as const, load: { booked: 28, total: 44 } },
  { route: "Dhaka → Rajshahi",   routeBn: "ঢাকা → রাজশাহী",   departure: "08:30 AM", bus: "GL-0891", ac: true,  operatorId: "greenline",   status: "On Time"  as const, load: { booked: 33, total: 44 } },
  { route: "Chittagong → Dhaka", routeBn: "চট্টগ্রাম → ঢাকা", departure: "09:00 AM", bus: "SM-0934", ac: false, operatorId: "saintmartin", status: "Arrived"  as const, load: { booked: 44, total: 44 } },
  { route: "Dhaka → Khulna",     routeBn: "ঢাকা → খুলনা",     departure: "09:30 AM", bus: "SH-1776", ac: true,  operatorId: "shyamoli",    status: "On Time"  as const, load: { booked: 19, total: 44 } },
  { route: "Dhaka → Chittagong", routeBn: "ঢাকা → চট্টগ্রাম", departure: "10:00 AM", bus: "SM-1101", ac: true,  operatorId: "saintmartin", status: "On Time"  as const, load: { booked: 38, total: 44 } },
  { route: "Dhaka → Comilla",    routeBn: "ঢাকা → কুমিল্লা",  departure: "10:30 AM", bus: "SG-0441", ac: false, operatorId: "shohag",      status: "On Time"  as const, load: { booked: 22, total: 44 } },
  { route: "Dhaka → Rajshahi",   routeBn: "ঢাকা → রাজশাহী",   departure: "11:00 AM", bus: "DT-3388", ac: true,  operatorId: "desh",        status: "On Time"  as const, load: { booked: 30, total: 44 } },
];

const complianceAlerts = [
  { bus: "DH-1142", doc: "Fitness Certificate", docBn: "ফিটনেস সার্টিফিকেট", expiry: "11 Jan 2026", days: 18 },
  { bus: "CTG-441", doc: "Route Permit", docBn: "রুট পারমিট", expiry: "28 Feb 2026", days: 45 },
  { bus: "DH-2087", doc: "Insurance", docBn: "বীমা", expiry: "14 Aug 2025", days: 6 },
  { bus: "DH-3315", doc: "Tax Token", docBn: "ট্যাক্স টোকেন", expiry: "04 Jun 2026", days: 92 },
  { bus: "DH-0891", doc: "Fitness Certificate", docBn: "ফিটনেস সার্টিফিকেট", expiry: "22 Jan 2026", days: 3 },
];

// ─── Sub Components ──────────────────────────────────────────────────────────

function KPICard({
  title, value, sub, icon: Icon, iconBg, badge, badgeColor, trend, trendDir,
}: {
  title: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  iconBg: string;
  badge?: string;
  badgeColor?: string;
  trend?: string;
  trendDir?: "up" | "down";
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "8px",
        padding: "20px 24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        border: "1px solid #E5E7EB",
        minHeight: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={20} />
        </div>
        {badge && (
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              padding: "4px 10px",
              borderRadius: "20px",
              background: `${badgeColor}18`,
              color: badgeColor,
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <div style={{ color: "#6B7280", fontSize: "13px", fontWeight: 500, marginBottom: "6px" }}>
        {title}
      </div>
      <div style={{ color: "#1F2937", fontSize: "24px", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
        {value}
      </div>
      {trend && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
          {trendDir === "up" ? (
            <TrendingUp size={14} color="#2CA85A" />
          ) : (
            <TrendingDown size={14} color="#DC2626" />
          )}
          <span style={{ fontSize: "12px", color: trendDir === "up" ? "#2CA85A" : "#DC2626", fontWeight: 500 }}>
            {trend}
          </span>
          {sub && <span style={{ fontSize: "12px", color: "#9CA3AF" }}>{sub}</span>}
        </div>
      )}
      {!trend && sub && (
        <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "8px" }}>{sub}</div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const { t } = useLanguage();
  const statusConfig: Record<string, { labelKey: string; color: string; bg: string }> = {
    "On Time": { labelKey: "status_on_time", color: "#2CA85A", bg: "#2CA85A1A" },
    "Delayed": { labelKey: "status_delayed", color: "#F5A623", bg: "#F5A6231A" },
    "Departed": { labelKey: "status_departed", color: "#3B82F6", bg: "#3B82F61A" },
    "Arrived": { labelKey: "status_arrived", color: "#6B7280", bg: "#6B72801A" },
  };
  const cfg = statusConfig[status] || { labelKey: status, color: "#6B7280", bg: "#6B72801A" };
  return (
    <span
      style={{
        fontSize: "10px",
        fontWeight: 600,
        padding: "2px 6px",
        borderRadius: "12px",
        background: cfg.bg,
        color: cfg.color,
      }}
    >
      {t(cfg.labelKey)}
    </span>
  );
}

function LoadBar({ booked, total }: { booked: number; total: number }) {
  const pct = (booked / total) * 100;
  const color = pct >= 100 ? "#DC2626" : pct >= 80 ? "#F5A623" : "#2CA85A";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <div
        style={{
          width: "60px",
          height: "5px",
          borderRadius: "3px",
          background: "#E5E7EB",
          overflow: "hidden",
        }}
      >
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "3px" }} />
      </div>
      <span style={{ fontSize: "11px", color: "#6B7280", whiteSpace: "nowrap" }}>
        {booked}/{total}
      </span>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#1F2937",
          borderRadius: "8px",
          padding: "8px 12px",
          color: "#fff",
          fontSize: "12px",
        }}
      >
        <div style={{ color: "#9CA3AF", marginBottom: "2px" }}>{label}</div>
        <div style={{ fontWeight: 600 }}>৳ {payload[0].value.toLocaleString()}</div>
      </div>
    );
  }
  return null;
};

// Custom bar shape to avoid Cell-induced duplicate SVG key warnings in recharts
const RevenueBar = (props: any) => {
  const { x, y, width, height, index, dataLength } = props;
  const isLast = index === dataLength - 1;
  const fill = isLast ? "#2CA85A" : "#1A3C6E";
  const opacity = isLast ? 1 : 0.75;
  const r = 4;
  if (!height || height <= 0) return null;
  return (
    <path
      d={`M${x + r},${y} h${width - 2 * r} a${r},${r} 0 0 1 ${r},${r} v${height - r} h${-(width)} v${-(height - r)} a${r},${r} 0 0 1 ${r},${-r}z`}
      fill={fill}
      fillOpacity={opacity}
    />
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export function OperationsDashboard() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { operator } = useOperator();
  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  const chartData = revenueData.map((d) => ({ ...d, dayLabel: lang === "bn" ? d.dayBn : d.day }));

  // Operator-filtered buses and trips
  const opBuses = ALL_BUSES.filter(b => b.operatorId === operator.id);
  const activeBuses = opBuses.filter(b => b.status === "Active").length;
  const opTrips = trips.filter(t => t.operatorId === operator.id);

  return (
    <div className="dashboard-page">
      {/* Row 1 — KPI cards grid */}
      <div className="kpi-grid">
        <KPICard
          title={t("kpi_active_buses")}
          value={lang === "bn" ? `${activeBuses} / ১২` : `${activeBuses} / 12`}
          sub={`3 ${t("kpi_active_buses_sub")}`}
          icon={Bus}
          iconBg="#1A3C6E1A"
          badge={t("kpi_active_badge")}
          badgeColor="#2CA85A"
        />
        <KPICard
          title={t("kpi_revenue")}
          value="৳ 48,250"
          trend={t("kpi_revenue_trend")}
          trendDir="up"
          icon={BanknoteIcon}
          iconBg="#2CA85A1A"
        />
        <KPICard
          title={t("kpi_tickets")}
          value={lang === "bn" ? "৩১২" : "312"}
          trend={t("kpi_tickets_trend")}
          trendDir="up"
          icon={Ticket}
          iconBg="#3B82F61A"
        />
        <KPICard
          title={t("kpi_ontime")}
          value={lang === "bn" ? "৮৭%" : "87%"}
          sub={t("kpi_ontime_sub")}
          icon={Clock}
          iconBg="#F5A6231A"
          badge={t("kpi_ontime_badge")}
          badgeColor="#F5A623"
        />
      </div>

      {/* Row 2 — Map + Trips */}
      <div className="dashboard-section dashboard-section--map-trips">
        {/* Live Fleet Map */}
        <div className="dashboard-card dashboard-card--map">
          <div className="dashboard-card-header">
            <MapPin size={16} color="#1A3C6E" />
            <span className="dashboard-card-title">{t("live_fleet_map")}</span>
            <div className="dashboard-card-header-actions">
              <div className="dashboard-legend-item">
                <span className="dashboard-legend-dot" style={{ background: "#2CA85A" }} />
                <span>{t("on_time")}</span>
              </div>
              <div className="dashboard-legend-item">
                <span className="dashboard-legend-dot" style={{ background: "#F5A623" }} />
                <span>{t("delayed")}</span>
              </div>
              <div className="dashboard-legend-item">
                <span className="dashboard-legend-dot" style={{ background: "#9CA3AF" }} />
                <span>{t("idle")}</span>
              </div>
              <button type="button" className="dashboard-live-btn">
                <RefreshCw size={12} />
                {t("live")}
              </button>
            </div>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <BangladeshMap />
          </div>
        </div>

        {/* Today's Trips */}
        <div className="dashboard-card dashboard-card--trips">
          <div className="dashboard-card-header">
            <Bus size={16} color="#1A3C6E" />
            <span className="dashboard-card-title">{t("todays_trips")}</span>
            <span className="dashboard-card-meta">{today}</span>
          </div>
          <div className="dashboard-table-header dashboard-table-header--trips">
            {[t("col_route"), t("col_depart"), t("col_bus"), t("col_status"), t("col_load")].map((h, i) => (
              <span key={i}>{h}</span>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {opTrips.map((trip, i) => (
              <div
                key={i}
                className="dashboard-table-row dashboard-table-row--trips"
                style={{
                  background: i % 2 === 0 ? "#FFFFFF" : "#F9FAFB",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#EFF6FF"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? "#FFFFFF" : "#F9FAFB"; }}
              >
                <span className="dashboard-trip-route">
                  {lang === "bn" ? trip.routeBn : trip.route}
                  {trip.ac && <Wind size={10} color="#3B82F6" style={{ flexShrink: 0 }} />}
                </span>
                <span className="dashboard-trip-meta">{trip.departure}</span>
                <span
                  className="dashboard-bus-tag"
                  onClick={() => navigate(`/fleet/${trip.bus}`)}
                >
                  {trip.bus}
                </span>
                <StatusBadge status={trip.status} />
                <LoadBar booked={trip.load.booked} total={trip.load.total} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3 — Revenue Chart + Compliance */}
      <div className="dashboard-section dashboard-section--charts">
        {/* Revenue Chart */}
        <div className="dashboard-card dashboard-card--revenue">
          <div className="dashboard-revenue-header">
            <div>
              <div className="dashboard-revenue-title">{t("revenue_7days")}</div>
              <div className="dashboard-revenue-sub">{t("revenue_sub")}</div>
            </div>
            <div className="dashboard-revenue-trend">
              <TrendingUp size={14} />
              {t("revenue_trend")}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={28}>
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis
                dataKey="dayLabel"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`}
                width={48}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(26,60,110,0.05)" }} />
              <Bar
                dataKey="amount"
                shape={(props: any) => <RevenueBar {...props} dataLength={chartData.length} />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Compliance Alerts */}
        <div className="dashboard-card dashboard-card--compliance">
          <div className="dashboard-card-header">
            <AlertTriangle size={16} color="#F5A623" />
            <span className="dashboard-card-title">{t("compliance_alerts")}</span>
            <span className="dashboard-card-badge dashboard-card-badge--critical">
              2 {t("compliance_critical")}
            </span>
          </div>
          <div className="dashboard-table-header dashboard-table-header--compliance">
            {[t("col_bus_num"), t("col_document"), t("col_expiry"), t("col_days"), t("col_action")].map((h, i) => (
              <span key={i}>{h}</span>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {complianceAlerts.map((alert, i) => {
              const urgent = alert.days <= 7;
              const warning = alert.days > 7 && alert.days <= 30;
              const dayColor = urgent ? "#DC2626" : warning ? "#F5A623" : "#2CA85A";
              return (
                <div
                  key={i}
                  className="dashboard-table-row dashboard-table-row--compliance"
                  style={{
                    background: i % 2 === 0 ? "#FFFFFF" : "#F9FAFB",
                  }}
                >
                  <span
                    className="dashboard-bus-tag"
                    style={{ cursor: "pointer" }}
                    onClick={() => window.location.href = `/fleet/${alert.bus}`}
                  >
                    {alert.bus}
                  </span>
                  <span className="dashboard-compliance-doc">{lang === "bn" ? alert.docBn : alert.doc}</span>
                  <span className="dashboard-compliance-expiry">{alert.expiry}</span>
                  <span
                    className="dashboard-compliance-days"
                    style={{ color: dayColor, background: `${dayColor}18` }}
                  >
                    {alert.days}{lang === "bn" ? "দি" : "d"}
                  </span>
                  <button type="button" className="dashboard-renew-btn">
                    {t("action_renew")} <ArrowUpRight size={10} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}