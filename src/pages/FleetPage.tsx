import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { Bus, Plus, Filter, Search, Wind } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useOperator } from '@/contexts/OperatorContext'
import { ALL_BUSES } from '@/data/operators'

const statusCfg: Record<string, { color: string; bg: string; labelBn: string }> = {
  Active:      { color: "#2CA85A", bg: "#2CA85A1A", labelBn: "সক্রিয়" },
  Delayed:     { color: "#F5A623", bg: "#F5A6231A", labelBn: "বিলম্বিত" },
  Idle:        { color: "#6B7280", bg: "#6B72801A", labelBn: "অলস" },
  Maintenance: { color: "#3B82F6", bg: "#3B82F61A", labelBn: "রক্ষণাবেক্ষণ" },
};

const complianceCfg: Record<string, { color: string; label: string; labelBn: string }> = {
  OK:       { color: "#2CA85A", label: "✓ OK",       labelBn: "✓ ঠিক আছে" },
  Warning:  { color: "#F5A623", label: "⚠ Warning",  labelBn: "⚠ সতর্কতা" },
  Critical: { color: "#DC2626", label: "✕ Critical", labelBn: "✕ জরুরি" },
};

export function FleetPage() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { operator } = useOperator();
  const [acFilter, setAcFilter] = useState<"all" | "ac" | "nonac">("all");
  const [query, setQuery] = useState("");

  const operatorBuses = ALL_BUSES.filter(b => b.operatorId === operator.id);

  const filtered = operatorBuses.filter(b => {
    const acMatch = acFilter === "all" ? true : acFilter === "ac" ? b.ac : !b.ac;
    const q = query.toLowerCase();
    const textMatch = !q || b.id.toLowerCase().includes(q) || b.model.toLowerCase().includes(q) || b.driver.toLowerCase().includes(q) || b.route.toLowerCase().includes(q);
    return acMatch && textMatch;
  });

  return (
    <div className="fleet-page">
      {/* Header */}
      <div className="fleet-header">
        <div className="fleet-header-left">
          <div className="fleet-title-row">
            <h1 className="fleet-title">{t("fleet_title")}</h1>
            <span
              className="fleet-operator-badge"
              style={{
                background: operator.colorBg,
                color: operator.colorText,
                border: `1px solid ${operator.color}33`,
              }}
            >
              <span className="fleet-operator-dot" style={{ background: operator.color }} />
              {operator.shortName}
            </span>
          </div>
          <p className="fleet-summary">
            {operatorBuses.length} {t("fleet_registered")} — {operatorBuses.filter(b => b.status === "Active").length} {t("fleet_active")}
            {" · "}
            <span style={{ color: "#3B82F6" }}>{operatorBuses.filter(b => b.ac).length} AC</span>
            {" · "}
            <span style={{ color: "#6B7280" }}>{operatorBuses.filter(b => !b.ac).length} Non-AC</span>
          </p>
        </div>
      </div>

      {/* Toolbar: search + filters + actions */}
      <div className="fleet-toolbar">
        <div className="fleet-search-wrap">
          <Search size={16} color="#9CA3AF" style={{ flexShrink: 0 }} />
          <input
            placeholder={t("search_fleet")}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="fleet-filter-chips">
          {(["all", "ac", "nonac"] as const).map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setAcFilter(f)}
              className={`fleet-filter-chip ${acFilter === f ? "fleet-filter-chip--active" : ""}`}
            >
              {f === "ac" && <Wind size={12} />}
              {f === "all" ? "All" : f === "ac" ? "AC" : "Non-AC"}
            </button>
          ))}
        </div>
        <button type="button" className="fleet-btn-secondary">
          <Filter size={14} />
          {t("btn_filter")}
        </button>
        <button type="button" className="fleet-btn-primary">
          <Plus size={14} />
          {t("btn_add_vehicle")}
        </button>
      </div>

      {/* Table */}
      <div className="fleet-table-wrap">
        <div className="fleet-table-inner">
          <div className="fleet-table-header">
            {[t("col_bus_id"), t("col_registration"), t("col_model"), "Type", t("col_route"), t("col_driver"), t("col_status"), t("col_compliance"), t("col_last_trip")].map(h => (
              <span key={h}>{h}</span>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="fleet-table-empty">
              No buses found for {operator.name}
            </div>
          ) : filtered.map((bus, i) => {
            const sc = statusCfg[bus.status] ?? statusCfg.Idle;
            const cc = complianceCfg[bus.compliance] ?? complianceCfg.OK;
            return (
              <div
                key={bus.id}
                onClick={() => navigate(`/fleet/${bus.id}`)}
                className="fleet-table-row"
                style={{ background: i % 2 === 0 ? "#fff" : "#F9FAFB" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#EFF6FF"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? "#fff" : "#F9FAFB"; }}
              >
                <div className="fleet-bus-cell">
                  <div className="fleet-bus-icon" style={{ background: `${operator.color}18` }}>
                    <Bus size={14} color={operator.color} />
                  </div>
                  <span className="fleet-bus-id" style={{ color: operator.color }}>{bus.id}</span>
                </div>
                <span className="fleet-cell-muted">{bus.reg}</span>
                <span className="fleet-cell-default">{bus.model}</span>
                <span className={`fleet-type-badge ${bus.ac ? "fleet-type-badge--ac" : "fleet-type-badge--nonac"}`}>
                  {bus.ac && <Wind size={10} />}
                  {bus.ac ? "AC" : "Non-AC"}
                </span>
                <span className="fleet-cell-default" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {lang === "bn" ? bus.routeBn : bus.route}
                </span>
                <span className="fleet-cell-default">{lang === "bn" ? bus.driverBn : bus.driver}</span>
                <span className="fleet-status-badge" style={{ background: sc.bg, color: sc.color }}>
                  {lang === "bn" ? sc.labelBn : bus.status}
                </span>
                <span className="fleet-compliance-cell" style={{ color: cc.color }}>
                  {lang === "bn" ? cc.labelBn : cc.label}
                </span>
                <span className="fleet-last-trip">{bus.lastTrip}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
