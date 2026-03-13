import { FileText, Download, BarChart3, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext'
import {
  Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, ComposedChart,
} from "recharts";

const monthlyData = [
  { month: "Jan", monthBn: "জান", revenue: 1182000, trips: 412, tickets: 8940 },
  { month: "Feb", monthBn: "ফেব", revenue: 1340000, trips: 428, tickets: 9280 },
  { month: "Mar", monthBn: "মার", revenue: 148250, trips: 63, tickets: 1337 },
];

const routePerformance = [
  { route: "Dhaka→CTG", routeBn: "ঢাকা→চট্টগ্রাম", onTime: 91, loadFactor: 89, revenue: 580000 },
  { route: "Dhaka→Sylhet", routeBn: "ঢাকা→সিলেট", onTime: 85, loadFactor: 82, revenue: 320000 },
  { route: "Dhaka→Cox's Bazar", routeBn: "ঢাকা→কক্সবাজার", onTime: 78, loadFactor: 76, revenue: 280000 },
  { route: "Dhaka→Rajshahi", routeBn: "ঢাকা→রাজশাহী", onTime: 88, loadFactor: 80, revenue: 260000 },
  { route: "Dhaka→Khulna", routeBn: "ঢাকা→খুলনা", onTime: 93, loadFactor: 72, revenue: 190000 },
];

const fleetUtilization = [
  { bus: "DH-1142", utilization: 94, revenue: 440800 },
  { bus: "DH-2087", utilization: 88, revenue: 390200 },
  { bus: "DH-3315", utilization: 76, revenue: 298400 },
  { bus: "DH-0891", utilization: 82, revenue: 340000 },
  { bus: "CTG-441", utilization: 91, revenue: 412000 },
  { bus: "DH-1776", utilization: 68, revenue: 218000 },
];

const complianceSummary = [
  { name: "Valid", nameBn: "বৈধ", value: 18, color: "#2CA85A" },
  { name: "Expiring Soon", nameBn: "শীঘ্রই মেয়াদোত্তীর্ণ", value: 5, color: "#F5A623" },
  { name: "Expired", nameBn: "মেয়াদোত্তীর্ণ", value: 2, color: "#DC2626" },
];

export function ReportsPage() {
  const { t, lang } = useLanguage();

  return (
    <div className="reports-page">
      {/* Header */}
      <div className="reports-header">
        <div className="reports-header-left">
          <h1 className="reports-title">{t("reports_title")}</h1>
          <p className="reports-summary">
            {lang === "bn" ? "মার্চ ২০২৬ পর্যন্ত সামগ্রিক কার্যক্ষমতার সারসংক্ষেপ" : "Overall performance summary through March 2026"}
          </p>
        </div>
        <div className="reports-actions">
          <button type="button" className="reports-btn-export-secondary">
            <Download size={14} />
            {t("btn_export_csv")}
          </button>
          <button type="button" className="reports-btn-export-primary">
            <FileText size={14} />
            {t("btn_export_pdf")}
          </button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="reports-kpi-grid">
        {[
          { label: lang === "bn" ? "মোট আয় (২০২৬)" : "Total Revenue (2026)", value: "৳ 26,70,250", sub: lang === "bn" ? "জানুয়ারি থেকে" : "Jan – Mar", color: "#2CA85A" },
          { label: lang === "bn" ? "মোট ট্রিপ" : "Total Trips", value: "903", sub: lang === "bn" ? "৩ মাস" : "3 months", color: "#1A3C6E" },
          { label: lang === "bn" ? "মোট টিকেট" : "Total Tickets", value: "19,557", sub: lang === "bn" ? "ইস্যু করা হয়েছে" : "issued", color: "#3B82F6" },
          { label: lang === "bn" ? "গড় অন-টাইম হার" : "Avg On-Time Rate", value: "87%", sub: lang === "bn" ? "সব রুট" : "all routes", color: "#F5A623" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="reports-kpi-card">
            <div className="reports-kpi-label">{label}</div>
            <div className="reports-kpi-value" style={{ color }}>{value}</div>
            <div className="reports-kpi-sub">{sub}</div>
          </div>
        ))}
      </div>

      {/* Monthly Revenue Chart */}
      <div className="reports-chart-card">
        <div className="reports-chart-title">{t("monthly_revenue")}</div>
        <div className="reports-chart-sub">
          {lang === "bn" ? "মাসিক রাজস্ব ও টিকেট বিক্রির তুলনা" : "Monthly revenue vs tickets sold comparison"}
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={monthlyData} id="reports-monthly-chart">
            <CartesianGrid vertical={false} stroke="#F3F4F6" />
            <XAxis dataKey={lang === "bn" ? "monthBn" : "month"} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} tickFormatter={(v) => `৳${(v / 100000).toFixed(1)}L`} width={56} />
            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} width={50} />
            <Tooltip
              content={({ active, payload, label }: any) =>
                active && payload?.length ? (
                  <div style={{ background: "#1F2937", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "12px" }}>
                    <div style={{ color: "#9CA3AF", marginBottom: "4px" }}>{label}</div>
                    {payload.map((p: any) => (
                      <div key={p.dataKey} style={{ color: p.color }}>{p.name}: {typeof p.value === "number" && p.dataKey === "revenue" ? `৳${p.value.toLocaleString()}` : p.value}</div>
                    ))}
                  </div>
                ) : null
              }
            />
            <Bar yAxisId="left" dataKey="revenue" name={lang === "bn" ? "আয়" : "Revenue"} fill="#1A3C6E" fillOpacity={0.8} radius={[4, 4, 0, 0]} barSize={40} />
            <Line yAxisId="right" type="monotone" dataKey="tickets" name={lang === "bn" ? "টিকেট" : "Tickets"} stroke="#2CA85A" strokeWidth={2} dot={{ r: 4, fill: "#2CA85A" }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="reports-bottom-row">
        {/* Route Performance */}
        <div className="reports-route-card">
          <div className="reports-route-header">
            <BarChart3 size={16} color="#1A3C6E" />
            <span className="reports-route-title">{t("route_performance")}</span>
          </div>
          <div className="reports-route-table-header">
            {[t("col_route_name"), lang === "bn" ? "অন-টাইম" : "On-Time", lang === "bn" ? "লোড" : "Load", lang === "bn" ? "মোট আয়" : "Revenue"].map((h) => (
              <span key={h}>{h}</span>
            ))}
          </div>
          {routePerformance.map((r, i) => (
            <div
              key={r.route}
              className="reports-route-row"
              style={{ background: i % 2 === 0 ? "#fff" : "#F9FAFB" }}
            >
              <span style={{ fontSize: "12px", color: "#1F2937", fontWeight: 500 }}>{lang === "bn" ? r.routeBn : r.route}</span>
              <div>
                <div style={{ height: "6px", background: "#F3F4F6", borderRadius: "3px", overflow: "hidden", width: "64px", marginBottom: "4px" }}>
                  <div style={{ width: `${r.onTime}%`, height: "100%", background: r.onTime >= 90 ? "#2CA85A" : r.onTime >= 80 ? "#F5A623" : "#DC2626", borderRadius: "3px" }} />
                </div>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "#374151" }}>{r.onTime}%</span>
              </div>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>{r.loadFactor}%</span>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#2CA85A" }}>৳{(r.revenue / 1000).toFixed(0)}k</span>
            </div>
          ))}
        </div>

        {/* Compliance + Fleet Utilization */}
        <div className="reports-side-cards">
          <div className="reports-side-card">
            <div className="reports-side-card-title">{t("compliance_summary")}</div>
            <div className="reports-compliance-wrap">
              <div style={{ width: 90, height: 90, flexShrink: 0 }}>
                <PieChart width={90} height={90}>
                  <Pie data={complianceSummary} cx="50%" cy="50%" innerRadius={24} outerRadius={42} dataKey="value" paddingAngle={3}>
                    {complianceSummary.map((s) => <Cell key={s.name} fill={s.color} />)}
                  </Pie>
                </PieChart>
              </div>
              <div className="reports-compliance-legend">
                {complianceSummary.map((s) => (
                  <div key={s.name} className="reports-compliance-row">
                    <div className="reports-compliance-label">
                      {s.name === "Valid" ? <CheckCircle2 size={14} color={s.color} /> : s.name === "Expiring Soon" ? <AlertTriangle size={14} color={s.color} /> : <XCircle size={14} color={s.color} />}
                      <span>{lang === "bn" ? s.nameBn : s.name}</span>
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="reports-side-card">
            <div className="reports-side-card-title">{t("fleet_utilization")}</div>
            {fleetUtilization.map((f) => {
              const barColor = f.utilization >= 90 ? "#2CA85A" : f.utilization >= 75 ? "#F5A623" : "#DC2626";
              return (
                <div key={f.bus} className="reports-fleet-item">
                  <div className="reports-fleet-row">
                    <span style={{ color: "#374151", fontWeight: 600 }}>{f.bus}</span>
                    <span style={{ fontWeight: 700, color: barColor }}>{f.utilization}%</span>
                  </div>
                  <div className="reports-fleet-bar">
                    <div
                      style={{
                        width: `${f.utilization}%`,
                        height: "100%",
                        borderRadius: "3px",
                        background: barColor,
                        transition: "width 0.4s",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}