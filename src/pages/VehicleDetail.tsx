import { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom'
import {
  ChevronRight, Bus, FileText, Wrench, Clock, Users,
  UploadCloud, Bell, CheckCircle2, AlertTriangle, XCircle,
  Calendar, ArrowLeft, MapPin, Fuel, Wind, Eye,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLanguage } from '@/contexts/LanguageContext'
import { ALL_BUSES, OPERATORS } from '@/data/operators'

// ─── Data ────────────────────────────────────────────────────────────────────

const tripHistory = [
  { id: "T-1081", route: "Dhaka → Chittagong", routeBn: "ঢাকা → চট্টগ্রাম", date: "02 Mar 2026", depart: "07:00", arrive: "13:20", status: "Completed", statusBn: "সম্পন্ন", load: "40/44", revenue: "৳ 22,000" },
  { id: "T-1075", route: "Chittagong → Dhaka", routeBn: "চট্টগ্রাম → ঢাকা", date: "01 Mar 2026", depart: "15:00", arrive: "21:30", status: "Completed", statusBn: "সম্পন্ন", load: "38/44", revenue: "৳ 20,900" },
  { id: "T-1068", route: "Dhaka → Chittagong", routeBn: "ঢাকা → চট্টগ্রাম", date: "28 Feb 2026", depart: "07:00", arrive: "13:45", status: "Delayed", statusBn: "বিলম্বিত", load: "44/44", revenue: "৳ 24,200" },
  { id: "T-1062", route: "Chittagong → Dhaka", routeBn: "চট্টগ্রাম → ঢাকা", date: "27 Feb 2026", depart: "15:00", arrive: "21:15", status: "Completed", statusBn: "সম্পন্ন", load: "36/44", revenue: "৳ 19,800" },
  { id: "T-1055", route: "Dhaka → Chittagong", routeBn: "ঢাকা → চট্টগ্রাম", date: "26 Feb 2026", depart: "07:00", arrive: "13:30", status: "Completed", statusBn: "সম্পন্ন", load: "42/44", revenue: "৳ 23,100" },
];

const documents = [
  { name: "Fitness Certificate", nameBn: "ফিটনেস সার্টিফিকেট", issued: "12 Jan 2024", expiry: "11 Jan 2026", status: "expiring", days: 18 },
  { name: "Route Permit (Dhaka–CTG)", nameBn: "রুট পারমিট (ঢাকা–চট্টগ্রাম)", issued: "01 Mar 2024", expiry: "28 Feb 2027", status: "valid", days: 360 },
  { name: "Tax Token", nameBn: "ট্যাক্স টোকেন", issued: "05 Jun 2024", expiry: "04 Jun 2026", status: "valid", days: 93 },
  { name: "Insurance", nameBn: "বীমা", issued: "15 Aug 2023", expiry: "14 Aug 2025", status: "expired", days: -200 },
  { name: "Custom Duty Certificate", nameBn: "কাস্টম ডিউটি সার্টিফিকেট", issued: "20 Nov 2020", expiry: "Lifetime", status: "valid", days: 9999 },
];

const maintenanceLog = [
  { date: "18 Feb 2026", type: "Engine Oil Change", typeBn: "ইঞ্জিন অয়েল পরিবর্তন", tech: "Sohel Mia", techBn: "সোহেল মিয়া", cost: "৳ 4,500", status: "Done", statusBn: "সম্পন্ন" },
  { date: "05 Feb 2026", type: "Tyre Replacement (FL)", typeBn: "টায়ার প্রতিস্থাপন (সামনে বাম)", tech: "Kamal Hossen", techBn: "কামাল হোসেন", cost: "৳ 8,200", status: "Done", statusBn: "সম্পন্ন" },
  { date: "22 Jan 2026", type: "AC Servicing", typeBn: "এসি সার্ভিসিং", tech: "Sohel Mia", techBn: "সোহেল মিয়া", cost: "৳ 3,100", status: "Done", statusBn: "সম্পন্ন" },
  { date: "10 Jan 2026", type: "Brake Pad Check", typeBn: "ব্রেক প্যাড চেক", tech: "Jalal Khan", techBn: "জলাল খান", cost: "৳ 1,200", status: "Done", statusBn: "সম্পন্ন" },
  { date: "28 Dec 2025", type: "General Inspection", typeBn: "সাধারণ পরিদর্শন", tech: "Kamal Hossen", techBn: "কামাল হোসেন", cost: "৳ 2,800", status: "Done", statusBn: "সম্পন্ন" },
];

const driverLog = [
  { date: "02 Mar 2026", driver: "Rahim Uddin", driverBn: "রহিম উদ্দিন", trip: "Dhaka → CTG", tripBn: "ঢাকা → চট্টগ্রাম", hrs: "6h 20m", rating: 4.8 },
  { date: "01 Mar 2026", driver: "Rahim Uddin", driverBn: "রহিম উদ্দিন", trip: "CTG → Dhaka", tripBn: "চট্টগ্রাম → ঢাকা", hrs: "6h 30m", rating: 4.7 },
  { date: "28 Feb 2026", driver: "Faruk Hossain", driverBn: "ফারুক হোসেন", trip: "Dhaka → CTG", tripBn: "ঢাকা → চট্টগ্রাম", hrs: "6h 45m", rating: 4.5 },
  { date: "27 Feb 2026", driver: "Rahim Uddin", driverBn: "রহিম উদ্দিন", trip: "CTG → Dhaka", tripBn: "চট্টগ্রাম → ঢাকা", hrs: "6h 15m", rating: 4.9 },
];

const revenueData = [
  { week: "W1 Feb", weekBn: "ফেব সপ্তা-১", revenue: 95200 },
  { week: "W2 Feb", weekBn: "ফেব সপ্তা-২", revenue: 102400 },
  { week: "W3 Feb", weekBn: "ফেব সপ্তা-৩", revenue: 88700 },
  { week: "W4 Feb", weekBn: "ফেব সপ্তা-৪", revenue: 110500 },
  { week: "W1 Mar", weekBn: "মার সপ্তা-১", revenue: 43900 },
];

// ─── Status helpers ──────────────────────────────────────────────────────────

type DocStatus = "valid" | "expiring" | "expired";

function DocStatusBadge({ status, days }: { status: DocStatus; days: number }) {
  const { t } = useLanguage();
  if (status === "expired") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <XCircle size={14} color="#DC2626" />
        <span style={{ fontSize: "12px", color: "#DC2626", fontWeight: 600 }}>{t("doc_expired")}</span>
      </div>
    );
  }
  if (status === "expiring") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <AlertTriangle size={14} color="#F5A623" />
        <span style={{ fontSize: "12px", color: "#F5A623", fontWeight: 600 }}>
          {t("doc_expires_in")} {days} {t("days_label")}
        </span>
      </div>
    );
  }
  if (days === 9999) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <CheckCircle2 size={14} color="#2CA85A" />
        <span style={{ fontSize: "12px", color: "#2CA85A", fontWeight: 600 }}>{t("doc_lifetime")}</span>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <CheckCircle2 size={14} color="#2CA85A" />
      <span style={{ fontSize: "12px", color: "#2CA85A", fontWeight: 600 }}>{t("doc_valid")}</span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const busId = id || "GL-1142";
  const [activeTab, setActiveTab] = useState("Documents");

  // Lookup bus and operator from shared data
  const busData = ALL_BUSES.find(b => b.id === busId);
  const operator = OPERATORS.find(o => o.id === busData?.operatorId) ?? OPERATORS[0];
  const meta = { ac: busData?.ac ?? true, model: busData?.model ?? "Hino AK", reg: busData?.reg ?? `${busId}` };

  const TABS = [
    { key: "Overview", label: t("tab_overview"), icon: Bus },
    { key: "Trip History", label: t("tab_trip_history"), icon: Clock },
    { key: "Documents", label: t("tab_documents"), icon: FileText },
    { key: "Maintenance", label: t("tab_maintenance"), icon: Wrench },
    { key: "Driver Log", label: t("tab_driver_log"), icon: Users },
  ];

  return (
    <div className="vehicle-detail-page">
      {/* Breadcrumb */}
      <div className="vehicle-breadcrumb">
        <button type="button" onClick={() => navigate("/fleet")} className="vehicle-breadcrumb-back">
          <ArrowLeft size={14} />
          {t("back_fleet")}
        </button>
        <ChevronRight size={13} color="#D1D5DB" />
        <span style={{ fontSize: "13px", color: "#1F2937", fontWeight: 600 }}>{t("bus_label")} #{busId}</span>
      </div>

      {/* Hero card */}
      <div className="vehicle-hero">
        {/* Bus illustration */}
        <div
          className="vehicle-hero-visual"
          style={{
            background: meta.ac
              ? "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)"
              : "linear-gradient(135deg, #EEF4FF 0%, #E0EAFF 100%)",
            border: `1px solid ${meta.ac ? "#BFDBFE" : "#D1D5DB"}`,
          }}
        >
          {/* AC snowflake watermark */}
          {meta.ac && (
            <div style={{ position: "absolute", top: "6px", right: "8px", opacity: 0.25 }}>
              <Wind size={22} color="#3B82F6" />
            </div>
          )}
          <svg viewBox="0 0 200 110" width="200" height="110">
            <rect x="10" y="30" width="175" height="65" rx="8" fill="#1A3C6E" />
            <rect x="15" y="22" width="165" height="18" rx="5" fill="#1A3C6E" />
            {[30, 60, 90, 120, 150].map((x) => (
              <rect key={x} x={x} y="35" width="22" height="14" rx="3" fill="#93C5FD" opacity="0.9" />
            ))}
            <rect x="160" y="50" width="18" height="30" rx="3" fill="#2CA85A" />
            <circle cx="42" cy="97" r="12" fill="#374151" />
            <circle cx="42" cy="97" r="6" fill="#6B7280" />
            <circle cx="148" cy="97" r="12" fill="#374151" />
            <circle cx="148" cy="97" r="6" fill="#6B7280" />
            <rect x="10" y="60" width="12" height="20" rx="2" fill="#F5A623" opacity="0.9" />
            <text x="60" y="70" style={{ fontSize: "9px", fill: "#fff", fontWeight: "bold", fontFamily: "Inter, sans-serif" }}>
              {busId}
            </text>
            {/* AC label on bus */}
            {meta.ac && (
              <text x="60" y="82" style={{ fontSize: "7px", fill: "#93C5FD", fontFamily: "Inter, sans-serif" }}>❄ AIR CONDITIONED</text>
            )}
          </svg>
        </div>

        {/* Details */}
        <div className="vehicle-hero-details">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="vehicle-hero-title-row">
                <h1 className="vehicle-hero-title">
                  {t("bus_label")} #{busId}
                </h1>
                <span style={{ fontSize: "12px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px", background: "#2CA85A1A", color: "#2CA85A" }}>
                  {t("status_active")}
                </span>
                {/* Operator badge */}
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "5px",
                  fontSize: "12px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px",
                  background: operator.colorBg, color: operator.colorText,
                  border: `1px solid ${operator.color}33`,
                }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: operator.color, display: "inline-block" }} />
                  {operator.shortName}
                </span>
                {/* AC / Non-AC badge */}
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px", background: meta.ac ? "#EFF6FF" : "#F3F4F6", color: meta.ac ? "#3B82F6" : "#6B7280" }}>
                  {meta.ac ? <Wind size={12} /> : null}
                  {meta.ac ? "AC" : "Non-AC"}
                </span>
              </div>
              <div className="vehicle-hero-meta">
                {t("registration")}: {meta.reg} — {operator.name}
              </div>
            </div>
            <div className="vehicle-hero-actions">
              <button type="button" className="vehicle-btn-secondary">
                <Bell size={14} />
                {t("btn_set_reminder")}
              </button>
              <button type="button" className="vehicle-btn-primary">
                <UploadCloud size={14} />
                {t("btn_upload_doc")}
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="vehicle-hero-stats">
            {[
              { icon: Bus,      labelKey: "stat_model",      value: meta.model },
              { icon: Wind,     labelKey: "stat_type",       value: meta.ac ? "AC" : "Non-AC", color: meta.ac ? "#3B82F6" : "#6B7280" },
              { icon: Users,    labelKey: "stat_capacity",   value: lang === "bn" ? "৪৪ আসন" : "44 seats" },
              { icon: MapPin,   labelKey: "stat_route",      value: lang === "bn" ? "ঢাকা–চট্টগ্রাম" : "Dhaka–CTG" },
              { icon: Fuel,     labelKey: "stat_total_km",   value: lang === "bn" ? "১,২৪,৮৩০ কিমি" : "1,24,830 km" },
              { icon: Calendar, labelKey: "stat_in_service", value: lang === "bn" ? "মার্চ ২০২১" : "Mar 2021" },
            ].map(({ icon: Icon, labelKey, value, color }) => (
              <div key={labelKey}>
                <div className="vehicle-stat-label">
                  <Icon size={13} color="#9CA3AF" />
                  <span>{t(labelKey)}</span>
                </div>
                <div className="vehicle-stat-value" style={color ? { color } : undefined}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="vehicle-tabs-wrap">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={activeTab === key ? "vehicle-tab vehicle-tab--active" : "vehicle-tab"}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="vehicle-tab-content">
        {activeTab === "Overview" && <OverviewTab />}
        {activeTab === "Trip History" && <TripHistoryTab />}
        {activeTab === "Documents" && <DocumentsTab />}
        {activeTab === "Maintenance" && <MaintenanceTab />}
        {activeTab === "Driver Log" && <DriverLogTab />}
      </div>
    </div>
  );
}

// ─── Tab: Overview ───────────────────────────────────────────────────────────

function OverviewTab() {
  const { t, lang } = useLanguage();
  const chartData = revenueData.map((d) => ({ ...d, weekLabel: lang === "bn" ? d.weekBn : d.week }));
  return (
    <div className="vehicle-overview-inner">
      <div className="vehicle-overview-chart">
        <div className="vehicle-overview-chart-title">
          {t("revenue_5weeks")}
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barSize={28}>
            <CartesianGrid vertical={false} stroke="#F3F4F6" />
            <XAxis dataKey="weekLabel" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`} width={50} />
            <Tooltip
              content={({ active, payload, label }: any) =>
                active && payload?.length ? (
                  <div style={{ background: "#1F2937", borderRadius: "8px", padding: "8px 12px", color: "#fff", fontSize: "12px" }}>
                    <div style={{ color: "#9CA3AF" }}>{label}</div>
                    <div style={{ fontWeight: 600 }}>৳ {payload[0].value.toLocaleString()}</div>
                  </div>
                ) : null
              }
              cursor={{ fill: "rgba(26,60,110,0.05)" }}
            />
            <Bar dataKey="revenue" fill="#1A3C6E" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="vehicle-quick-stats">
        <div className="vehicle-quick-stats-title">
          {t("quick_stats")}
        </div>
        {[
          { labelKey: "stat_total_trips", value: lang === "bn" ? "৬৪" : "64" },
          { labelKey: "stat_avg_load", value: lang === "bn" ? "৮৯%" : "89%" },
          { labelKey: "stat_ontime_rate", value: lang === "bn" ? "৯১%" : "91%" },
          { labelKey: "stat_total_revenue", value: "৳ 4,40,800" },
          { labelKey: "stat_incidents", value: lang === "bn" ? "০" : "0" },
        ].map(({ labelKey, value }) => (
          <div key={labelKey} className="vehicle-quick-stat-row">
            <span style={{ fontSize: "12px", color: "#6B7280" }}>{t(labelKey)}</span>
            <span style={{ fontSize: "13px", color: "#1F2937", fontWeight: 700 }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Trip History ────────────────────────────────────────────────────────

function TripHistoryTab() {
  const { t, lang } = useLanguage();
  return (
    <div className="vehicle-table-wrap">
    <div className="vehicle-table-inner" style={{ minWidth: "620px" }}>
      <div
        className="vehicle-table-header"
        style={{ display: "grid", gridTemplateColumns: "80px 1fr 100px 80px 80px 80px 100px" }}
      >
        {[t("col_trip_id"), t("col_route"), t("col_date"), t("col_depart"), t("col_arrive"), t("col_load"), t("col_revenue")].map((h) => (
          <span key={h}>{h}</span>
        ))}
      </div>
      {tripHistory.map((trip, i) => (
        <div
          key={trip.id}
          className="vehicle-table-row"
          style={{
            display: "grid",
            gridTemplateColumns: "80px 1fr 100px 80px 80px 80px 100px",
            background: i % 2 === 0 ? "#fff" : "#F9FAFB",
          }}
        >
          <span style={{ fontSize: "12px", color: "#1A3C6E", fontWeight: 600 }}>{trip.id}</span>
          <span style={{ fontSize: "13px", color: "#1F2937" }}>{lang === "bn" ? trip.routeBn : trip.route}</span>
          <span style={{ fontSize: "12px", color: "#6B7280" }}>{trip.date}</span>
          <span style={{ fontSize: "12px", color: "#374151" }}>{trip.depart}</span>
          <span style={{ fontSize: "12px", color: "#374151" }}>{trip.arrive}</span>
          <span style={{ fontSize: "12px", color: "#374151" }}>{trip.load}</span>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", color: "#1F2937", fontWeight: 600 }}>{trip.revenue}</span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                padding: "2px 7px",
                borderRadius: "20px",
                background: trip.status === "Completed" ? "#2CA85A1A" : "#F5A6231A",
                color: trip.status === "Completed" ? "#2CA85A" : "#F5A623",
              }}
            >
              {lang === "bn" ? trip.statusBn : trip.status}
            </span>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}

// ─── Tab: Documents ───────────────────────────────────────────────────────────

function DocumentsTab() {
  const { t, lang } = useLanguage();
  return (
    <div className="vehicle-table-wrap">
    <div className="vehicle-table-inner" style={{ minWidth: "640px" }}>
      <div
        className="vehicle-table-header"
        style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px 200px 160px" }}
      >
        {[t("col_document"), t("col_issue_date"), t("col_expiry_date"), t("col_doc_status"), t("col_action")].map((h) => (
          <span key={h}>{h}</span>
        ))}
      </div>
      {documents.map((doc, i) => {
        const isExpired = doc.status === "expired";
        const isExpiring = doc.status === "expiring";
        return (
          <div
            key={doc.name}
            className="vehicle-table-row"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 120px 120px 200px 160px",
              background: i % 2 === 0 ? "#fff" : "#F9FAFB",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FileText size={15} color={isExpired ? "#DC2626" : isExpiring ? "#F5A623" : "#2CA85A"} />
              <span style={{ fontSize: "13px", color: "#1F2937", fontWeight: 500 }}>
                {lang === "bn" ? doc.nameBn : doc.name}
              </span>
            </div>
            <span style={{ fontSize: "12px", color: "#6B7280" }}>{doc.issued}</span>
            <span style={{ fontSize: "12px", color: isExpired ? "#DC2626" : "#6B7280", fontWeight: isExpired ? 600 : 400 }}>
              {doc.expiry}
            </span>
            <DocStatusBadge status={doc.status as DocStatus} days={doc.days} />
            <div style={{ display: "flex", gap: "8px" }}>
              {(isExpired || isExpiring) ? (
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "6px 12px",
                    borderRadius: "7px",
                    border: "none",
                    background: isExpired ? "#DC2626" : "#1A3C6E",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <UploadCloud size={12} />
                  {isExpired ? t("btn_upload_now") : t("btn_upload_renewal")}
                </button>
              ) : (
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "6px 12px",
                    borderRadius: "7px",
                    border: "1px solid #E5E7EB",
                    background: "#fff",
                    color: "#374151",
                    fontSize: "12px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  <Eye size={12} />
                  {t("btn_view")}
                </button>
              )}
            </div>
          </div>
        );
      })}
      <div className="vehicle-doc-actions">
        <button type="button" className="vehicle-btn-primary">
          <UploadCloud size={14} />
          {t("btn_upload_doc")}
        </button>
        <button type="button" className="vehicle-btn-secondary">
          <Bell size={14} />
          {t("btn_set_reminder")}
        </button>
      </div>
    </div>
    </div>
  );
}

// ─── Tab: Maintenance ─────────────────────────────────────────────────────────

function MaintenanceTab() {
  const { t, lang } = useLanguage();
  return (
    <div className="vehicle-table-wrap">
    <div className="vehicle-table-inner" style={{ minWidth: "540px" }}>
      <div
        className="vehicle-table-header"
        style={{ display: "grid", gridTemplateColumns: "100px 1fr 150px 100px 80px" }}
      >
        {[t("col_date"), t("col_service_type"), t("col_technician"), t("col_cost"), t("col_doc_status")].map((h) => (
          <span key={h}>{h}</span>
        ))}
      </div>
      {maintenanceLog.map((m, i) => (
        <div
          key={i}
          className="vehicle-table-row"
          style={{
            display: "grid",
            gridTemplateColumns: "100px 1fr 150px 100px 80px",
            background: i % 2 === 0 ? "#fff" : "#F9FAFB",
          }}
        >
          <span style={{ fontSize: "12px", color: "#6B7280" }}>{m.date}</span>
          <span style={{ fontSize: "13px", color: "#1F2937" }}>{lang === "bn" ? m.typeBn : m.type}</span>
          <span style={{ fontSize: "12px", color: "#374151" }}>{lang === "bn" ? m.techBn : m.tech}</span>
          <span style={{ fontSize: "12px", color: "#1F2937", fontWeight: 600 }}>{m.cost}</span>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: "20px",
              background: "#2CA85A1A",
              color: "#2CA85A",
              width: "fit-content",
            }}
          >
            {lang === "bn" ? m.statusBn : m.status}
          </span>
        </div>
      ))}
    </div>
    </div>
  );
}

// ─── Tab: Driver Log ──────────────────────────────────────────────────────────

function DriverLogTab() {
  const { t, lang } = useLanguage();
  return (
    <div className="vehicle-table-wrap">
    <div className="vehicle-table-inner" style={{ minWidth: "500px" }}>
      <div
        className="vehicle-table-header"
        style={{ display: "grid", gridTemplateColumns: "100px 150px 1fr 80px 80px" }}
      >
        {[t("col_date"), t("col_driver"), t("col_trip"), t("col_duration"), t("col_rating")].map((h) => (
          <span key={h}>{h}</span>
        ))}
      </div>
      {driverLog.map((d, i) => (
        <div
          key={i}
          className="vehicle-table-row"
          style={{
            display: "grid",
            gridTemplateColumns: "100px 150px 1fr 80px 80px",
            background: i % 2 === 0 ? "#fff" : "#F9FAFB",
          }}
        >
          <span style={{ fontSize: "12px", color: "#6B7280" }}>{d.date}</span>
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <div
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                background: "#1A3C6E1A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: 700,
                color: "#1A3C6E",
                flexShrink: 0,
              }}
            >
              {d.driver.split(" ").map((n) => n[0]).join("")}
            </div>
            <span style={{ fontSize: "13px", color: "#1F2937" }}>{lang === "bn" ? d.driverBn : d.driver}</span>
          </div>
          <span style={{ fontSize: "12px", color: "#374151" }}>{lang === "bn" ? d.tripBn : d.trip}</span>
          <span style={{ fontSize: "12px", color: "#6B7280" }}>{d.hrs}</span>
          <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <span style={{ color: "#F5A623", fontSize: "12px" }}>★</span>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#1F2937" }}>{d.rating}</span>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}