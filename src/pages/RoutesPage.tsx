import { useState } from "react";
import { MapPin, Plus, Clock, Bus, ArrowRight } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const routes = [
  { id: "R01", name: "Dhaka → Chittagong", origin: "Dhaka", destination: "Chittagong", distance: "248 km", buses: 3, dailyTrips: 6, avgFare: "৳ 550", revenue: 38200, color: "#1A3C6E" },
  { id: "R02", name: "Dhaka → Sylhet", origin: "Dhaka", destination: "Sylhet", distance: "240 km", buses: 2, dailyTrips: 4, avgFare: "৳ 480", revenue: 22400, color: "#2CA85A" },
  { id: "R03", name: "Dhaka → Cox's Bazar", origin: "Dhaka", destination: "Cox's Bazar", distance: "412 km", buses: 2, dailyTrips: 2, avgFare: "৳ 900", revenue: 18000, color: "#F5A623" },
  { id: "R04", name: "Dhaka → Rajshahi", origin: "Dhaka", destination: "Rajshahi", distance: "259 km", buses: 2, dailyTrips: 4, avgFare: "৳ 520", revenue: 20280, color: "#3B82F6" },
  { id: "R05", name: "Dhaka → Khulna", origin: "Dhaka", destination: "Khulna", distance: "278 km", buses: 1, dailyTrips: 3, avgFare: "৳ 560", revenue: 12600, color: "#8B5CF6" },
  { id: "R06", name: "CTG → Cox's Bazar", origin: "Chittagong", destination: "Cox's Bazar", distance: "154 km", buses: 1, dailyTrips: 4, avgFare: "৳ 350", revenue: 9800, color: "#EC4899" },
];

const todaySchedule = [
  { time: "07:00 AM", route: "Dhaka → Chittagong", bus: "DH-1142", status: "On Time", seats: "40/44" },
  { time: "07:30 AM", route: "Dhaka → Sylhet", bus: "DH-2087", status: "Departed", seats: "44/44" },
  { time: "08:00 AM", route: "Dhaka → Cox's Bazar", bus: "DH-3315", status: "Delayed", seats: "28/44" },
  { time: "08:30 AM", route: "Dhaka → Rajshahi", bus: "DH-0891", status: "On Time", seats: "33/44" },
  { time: "09:00 AM", route: "CTG → Dhaka", bus: "CTG-441", status: "Arrived", seats: "44/44" },
  { time: "09:30 AM", route: "Dhaka → Khulna", bus: "DH-1776", status: "On Time", seats: "19/44" },
  { time: "11:00 AM", route: "Dhaka → Chittagong", bus: "DH-1903", status: "On Time", seats: "22/44" },
  { time: "02:00 PM", route: "Dhaka → Sylhet", bus: "DH-2087", status: "On Time", seats: "18/44" },
];

const statusCfg: Record<string, { color: string; bg: string; label_en: string; label_bn: string }> = {
  "On Time": { color: "#2CA85A", bg: "#2CA85A1A", label_en: "On Time", label_bn: "সময়মতো" },
  "Delayed": { color: "#F5A623", bg: "#F5A6231A", label_en: "Delayed", label_bn: "বিলম্বিত" },
  "Departed": { color: "#3B82F6", bg: "#3B82F61A", label_en: "Departed", label_bn: "প্রস্থান" },
  "Arrived": { color: "#6B7280", bg: "#6B72801A", label_en: "Arrived", label_bn: "পৌঁছেছে" },
};

export function RoutesPage() {
  const { t, lang } = useLanguage();
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const totalTrips = routes.reduce((s, r) => s + r.dailyTrips, 0);

  return (
    <div className="routes-page">
      {/* Header */}
      <div className="routes-header">
        <div className="routes-header-left">
          <h1 className="routes-title">{t("routes_title")}</h1>
          <p className="routes-summary">
            {routes.length} {t("routes_sub")} — {totalTrips} {t("routes_trips_today")}
          </p>
        </div>
        <button type="button" className="routes-btn-add">
          <Plus size={14} />
          {t("btn_add_route")}
        </button>
      </div>

      {/* Route Cards */}
      <div className="routes-cards-grid">
        {routes.map((r) => (
          <div
            key={r.id}
            onClick={() => setSelectedRoute(selectedRoute === r.id ? null : r.id)}
            className={`routes-card ${selectedRoute === r.id ? "routes-card--selected" : ""}`}
            style={{ "--routes-card-color": r.color } as Record<string, string>}
          >
            <div className="routes-card-header">
              <div className="routes-card-icon" style={{ background: `${r.color}18` }}>
                <MapPin size={16} color={r.color} />
              </div>
              <span className="routes-card-id" style={{ background: `${r.color}18`, color: r.color }}>
                {r.id}
              </span>
            </div>
            <div className="routes-card-route">
              {r.origin}
              <ArrowRight size={12} color="#9CA3AF" />
              {r.destination}
            </div>
            <div className="routes-card-distance">{r.distance}</div>
            <div className="routes-card-metrics">
              {[
                { label: lang === "bn" ? "বাস" : "Buses", value: `${r.buses}` },
                { label: lang === "bn" ? "দৈনিক ট্রিপ" : "Daily Trips", value: `${r.dailyTrips}` },
                { label: lang === "bn" ? "গড় ভাড়া" : "Avg Fare", value: r.avgFare },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="routes-card-metric-label">{label}</div>
                  <div className="routes-card-metric-value">{value}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Revenue by Route + Today's Schedule */}
      <div className="routes-middle-row">
        <div className="routes-chart-card">
          <div className="routes-chart-title">{t("revenue_by_route")}</div>
          <div className="routes-chart-sub">
            {lang === "bn" ? "আজকের টিকেট আয় (টাকায়)" : "Today's ticket revenue (BDT)"}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={routes} barSize={32} layout="vertical">
              <CartesianGrid horizontal={false} stroke="#F3F4F6" />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`}
              />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} width={140} />
              <Tooltip
                content={({ active, payload, label }: any) =>
                  active && payload?.length ? (
                    <div style={{ background: "#1F2937", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "12px" }}>
                      <div style={{ color: "#9CA3AF", marginBottom: "4px" }}>{label}</div>
                      <div style={{ fontWeight: 600 }}>৳ {payload[0].value.toLocaleString()}</div>
                    </div>
                  ) : null
                }
              />
              <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                {routes.map((route) => (
                  <Cell key={route.id} fill={route.color} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="routes-schedule-card">
          <div className="routes-schedule-header">
            <Clock size={16} color="#1A3C6E" />
            <span className="routes-schedule-title">{t("today_schedule")}</span>
          </div>
          <div className="routes-schedule-table-header">
            {[lang === "bn" ? "সময়" : "Time", t("col_route"), t("col_bus"), t("col_status"), lang === "bn" ? "আসন" : "Seats"].map((h) => (
              <span key={h}>{h}</span>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {todaySchedule.map((trip, i) => {
              const sc = statusCfg[trip.status];
              return (
                <div
                  key={i}
                  className="routes-schedule-row"
                  style={{ background: i % 2 === 0 ? "#fff" : "#F9FAFB" }}
                >
                  <span style={{ fontWeight: 700, color: "#1F2937" }}>{trip.time}</span>
                  <span style={{ color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{trip.route}</span>
                  <span style={{ fontSize: "11px", color: "#1A3C6E", fontWeight: 700, background: "#1A3C6E12", padding: "4px 8px", borderRadius: "4px", width: "fit-content" }}>{trip.bus}</span>
                  <span style={{ fontSize: "11px", fontWeight: 600, padding: "4px 8px", borderRadius: "20px", background: sc.bg, color: sc.color, width: "fit-content" }}>
                    {lang === "bn" ? sc.label_bn : sc.label_en}
                  </span>
                  <span style={{ color: "#6B7280" }}>{trip.seats}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* All Routes Detail */}
      <div className="routes-detail-wrap">
        <div className="routes-detail-inner">
          <div className="routes-detail-header">
            <Bus size={16} color="#1A3C6E" />
            <span className="routes-detail-title">
              {lang === "bn" ? "সব রুটের বিবরণ" : "All Routes Detail"}
            </span>
          </div>
          <div className="routes-detail-table-header">
            {[t("col_bus_id"), t("col_route_name"), t("col_origin"), t("col_destination"), t("col_distance"), t("col_buses"), t("col_daily_trips"), t("col_avg_fare")].map((h) => (
              <span key={h}>{h}</span>
            ))}
          </div>
          {routes.map((r, i) => (
            <div
              key={r.id}
              className="routes-detail-row"
              style={{ background: i % 2 === 0 ? "#fff" : "#F9FAFB" }}
            >
              <span className="routes-detail-id" style={{ background: `${r.color}18`, color: r.color }}>{r.id}</span>
              <div className="routes-detail-route-cell">
                <MapPin size={12} color={r.color} style={{ flexShrink: 0 }} />
                <span style={{ color: "#1F2937", fontWeight: 500 }}>{r.name}</span>
              </div>
              <span style={{ color: "#374151" }}>{r.origin}</span>
              <span style={{ color: "#374151" }}>{r.destination}</span>
              <span style={{ color: "#6B7280" }}>{r.distance}</span>
              <span style={{ color: "#1F2937", fontWeight: 600 }}>{r.buses}</span>
              <span style={{ color: "#1F2937", fontWeight: 600 }}>{r.dailyTrips}</span>
              <span style={{ color: "#2CA85A", fontWeight: 600 }}>{r.avgFare}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}