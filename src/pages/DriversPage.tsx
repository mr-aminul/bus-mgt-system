import { useState } from "react";
import { Users, Plus, Search, Star, Phone, MapPin, FileText } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";

const drivers = [
  {
    id: "DRV-001", name: "Rahim Uddin", nameBn: "রহিম উদ্দিন",
    phone: "+880 1711-223344", route: "Dhaka → Chittagong", routeBn: "ঢাকা → চট্টগ্রাম",
    tripsMonth: 22, rating: 4.8, license: "15 Aug 2027", status: "Active",
    experience: "8 yrs", avatar: "RU",
  },
  {
    id: "DRV-002", name: "Karim Ali", nameBn: "করিম আলী",
    phone: "+880 1812-334455", route: "Dhaka → Sylhet", routeBn: "ঢাকা → সিলেট",
    tripsMonth: 18, rating: 4.5, license: "22 Mar 2026", status: "Active",
    experience: "5 yrs", avatar: "KA",
  },
  {
    id: "DRV-003", name: "Hasan Mia", nameBn: "হাসান মিয়া",
    phone: "+880 1912-445566", route: "Dhaka → Cox's Bazar", routeBn: "ঢাকা → কক্সবাজার",
    tripsMonth: 10, rating: 4.2, license: "01 Dec 2025", status: "Active",
    experience: "3 yrs", avatar: "HM",
  },
  {
    id: "DRV-004", name: "Jalal Khan", nameBn: "জলাল খান",
    phone: "+880 1711-556677", route: "Dhaka → Rajshahi", routeBn: "ঢাকা → রাজশাহী",
    tripsMonth: 20, rating: 4.6, license: "10 May 2027", status: "Active",
    experience: "6 yrs", avatar: "JK",
  },
  {
    id: "DRV-005", name: "Ruhul Amin", nameBn: "রুহুল আমিন",
    phone: "+880 1812-667788", route: "Chittagong → Dhaka", routeBn: "চট্টগ্রাম → ঢাকা",
    tripsMonth: 21, rating: 4.7, license: "29 Sep 2026", status: "Active",
    experience: "7 yrs", avatar: "RA",
  },
  {
    id: "DRV-006", name: "Faruk Hossain", nameBn: "ফারুক হোসেন",
    phone: "+880 1912-778899", route: "Dhaka → Khulna", routeBn: "ঢাকা → খুলনা",
    tripsMonth: 14, rating: 4.3, license: "05 Feb 2026", status: "On Leave",
    experience: "4 yrs", avatar: "FH",
  },
  {
    id: "DRV-007", name: "Bellal Hossain", nameBn: "বেলাল হোসেন",
    phone: "+880 1711-889900", route: "Dhaka → Chittagong", routeBn: "ঢাকা → চট্টগ্রাম",
    tripsMonth: 19, rating: 4.4, license: "12 Nov 2027", status: "Active",
    experience: "5 yrs", avatar: "BH",
  },
  {
    id: "DRV-008", name: "Sohel Mia", nameBn: "সোহেল মিয়া",
    phone: "+880 1812-990011", route: "Unassigned", routeBn: "অনির্ধারিত",
    tripsMonth: 0, rating: 4.1, license: "20 Jul 2026", status: "Inactive",
    experience: "2 yrs", avatar: "SM",
  },
];

const statusCfg: Record<string, { color: string; bg: string; labelBn: string }> = {
  Active: { color: "#2CA85A", bg: "#2CA85A1A", labelBn: "সক্রিয়" },
  "On Leave": { color: "#F5A623", bg: "#F5A6231A", labelBn: "ছুটিতে" },
  Inactive: { color: "#6B7280", bg: "#6B72801A", labelBn: "নিষ্ক্রিয়" },
};

const avatarColors = [
  "#1A3C6E", "#2CA85A", "#3B82F6", "#8B5CF6",
  "#F5A623", "#EC4899", "#06B6D4", "#EF4444",
];

const performanceData = [
  { subject: "On-Time", subjectBn: "সময়মতো", A: 91 },
  { subject: "Safety", subjectBn: "নিরাপত্তা", A: 96 },
  { subject: "Trips", subjectBn: "ট্রিপ", A: 88 },
  { subject: "Rating", subjectBn: "রেটিং", A: 94 },
  { subject: "Revenue", subjectBn: "আয়", A: 85 },
];

export function DriversPage() {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof drivers[0] | null>(null);

  const filtered = drivers.filter((d) =>
    (lang === "bn" ? d.nameBn : d.name).toLowerCase().includes(search.toLowerCase()) ||
    d.id.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = drivers.filter((d) => d.status === "Active").length;

  return (
    <div className="drivers-page">
      {/* Header */}
      <div className="drivers-header">
        <div className="drivers-header-left">
          <h1 className="drivers-title">{t("drivers_title")}</h1>
          <p className="drivers-summary">
            {drivers.length} {t("drivers_sub")} — {activeCount} {t("driver_active")}
          </p>
        </div>
        <button type="button" className="drivers-btn-add">
          <Plus size={14} />
          {t("btn_add_driver")}
        </button>
      </div>

      {/* KPI cards */}
      <div className="drivers-kpi-grid">
        {[
          { label: lang === "bn" ? "মোট চালক" : "Total Drivers", value: drivers.length, color: "#1A3C6E" },
          { label: lang === "bn" ? "সক্রিয়" : "Active", value: drivers.filter(d => d.status === "Active").length, color: "#2CA85A" },
          { label: lang === "bn" ? "ছুটিতে" : "On Leave", value: drivers.filter(d => d.status === "On Leave").length, color: "#F5A623" },
          { label: lang === "bn" ? "গড় রেটিং" : "Avg Rating", value: (drivers.reduce((s, d) => s + d.rating, 0) / drivers.length).toFixed(1), color: "#3B82F6" },
        ].map(({ label, value, color }) => (
          <div key={label} className="drivers-kpi-card">
            <div className="drivers-kpi-label">{label}</div>
            <div className="drivers-kpi-value" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      <div className="drivers-main">
        {/* Driver list + search */}
        <div className="drivers-list">
          <div className="drivers-search-wrap">
            <Search size={16} color="#9CA3AF" style={{ flexShrink: 0 }} />
            <input
              placeholder={t("search_drivers")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="drivers-table-wrap">
            <div className="drivers-table-inner">
              <div className="drivers-table-header">
                {[t("col_driver_id"), t("col_name"), t("col_phone"), t("col_assigned_route"), t("col_trips_month"), t("col_rating"), t("col_status")].map((h) => (
                  <span key={h}>{h}</span>
                ))}
              </div>
              {filtered.map((d, i) => {
                const sc = statusCfg[d.status];
                return (
                  <div
                    key={d.id}
                    onClick={() => setSelected(selected?.id === d.id ? null : d)}
                    className="drivers-table-row"
                    style={{
                      background: selected?.id === d.id ? "#EFF6FF" : i % 2 === 0 ? "#fff" : "#F9FAFB",
                    }}
                    onMouseEnter={(e) => { if (selected?.id !== d.id) (e.currentTarget as HTMLElement).style.background = "#F8FAFF"; }}
                    onMouseLeave={(e) => { if (selected?.id !== d.id) (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? "#fff" : "#F9FAFB"; }}
                  >
                    <span className="drivers-driver-id">{d.id}</span>
                    <div className="drivers-name-cell">
                      <div
                        className="drivers-avatar"
                        style={{ background: avatarColors[i % avatarColors.length] }}
                      >
                        {d.avatar}
                      </div>
                      <div>
                        <div style={{ fontSize: "13px", color: "#1F2937", fontWeight: 600 }}>{lang === "bn" ? d.nameBn : d.name}</div>
                        <div style={{ fontSize: "11px", color: "#9CA3AF" }}>{d.experience}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: "12px", color: "#6B7280" }}>{d.phone.slice(0, 14)}</span>
                    <span style={{ fontSize: "12px", color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lang === "bn" ? d.routeBn : d.route}</span>
                    <span style={{ fontSize: "12px", color: "#1F2937", fontWeight: 600 }}>{d.tripsMonth}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Star size={12} color="#F5A623" fill="#F5A623" />
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#1F2937" }}>{d.rating}</span>
                    </div>
                    <span className="drivers-status-badge" style={{ background: sc.bg, color: sc.color }}>
                      {lang === "bn" ? sc.labelBn : d.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="drivers-detail-panel">
            <div className="drivers-detail-avatar-wrap">
              <div
                style={{
                  width: "64px", height: "64px", borderRadius: "50%",
                  background: avatarColors[drivers.indexOf(selected) % avatarColors.length],
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "22px", fontWeight: 700, color: "#fff",
                }}
              >
                {selected.avatar}
              </div>
              <div>
                <div className="drivers-detail-name">{lang === "bn" ? selected.nameBn : selected.name}</div>
                <div className="drivers-detail-id">{selected.id}</div>
              </div>
              <span
                className="drivers-status-badge"
                style={{ background: statusCfg[selected.status].bg, color: statusCfg[selected.status].color }}
              >
                {lang === "bn" ? statusCfg[selected.status].labelBn : selected.status}
              </span>
            </div>

            <div className="drivers-detail-info">
              {[
                { icon: Phone, label: lang === "bn" ? "ফোন" : "Phone", value: selected.phone },
                { icon: MapPin, label: lang === "bn" ? "রুট" : "Route", value: lang === "bn" ? selected.routeBn : selected.route },
                { icon: FileText, label: lang === "bn" ? "লাইসেন্স" : "License", value: selected.license },
                { icon: Star, label: lang === "bn" ? "রেটিং" : "Rating", value: `★ ${selected.rating}` },
                { icon: Users, label: lang === "bn" ? "ট্রিপ/মাস" : "Trips/Month", value: `${selected.tripsMonth}` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="drivers-detail-info-row">
                  <Icon size={14} color="#9CA3AF" style={{ marginTop: "2px", flexShrink: 0 }} />
                  <div>
                    <div className="drivers-detail-info-label">{label}</div>
                    <div className="drivers-detail-info-value">{value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="drivers-detail-performance-title">
                {lang === "bn" ? "কার্যক্ষমতা স্কোর" : "Performance Score"}
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <RadarChart data={performanceData}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis
                    dataKey={lang === "bn" ? "subjectBn" : "subject"}
                    tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  />
                  <Radar dataKey="A" stroke="#1A3C6E" fill="#1A3C6E" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}