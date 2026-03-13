import { useState, useRef, useEffect } from "react";
import { ChevronDown, Building2, Check } from "lucide-react";
import { useOperator } from '@/contexts/OperatorContext'

export function OperatorSwitcher() {
  const { operator, operators, setOperatorId } = useOperator();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          padding: "6px 11px",
          borderRadius: "8px",
          border: `1.5px solid ${operator.color}55`,
          background: operator.colorBg,
          cursor: "pointer",
          minWidth: 0,
          maxWidth: "220px",
          transition: "all 0.15s",
        }}
      >
        {/* Colour dot */}
        <span style={{
          width: "9px", height: "9px", borderRadius: "50%",
          background: operator.color, flexShrink: 0,
        }} />
        <span style={{
          fontSize: "12px", fontWeight: 700,
          color: operator.colorText,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {operator.shortName}
        </span>
        <ChevronDown
          size={12}
          color={operator.colorText}
          style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          left: 0,
          zIndex: 999,
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: "10px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          minWidth: "260px",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            padding: "10px 14px 8px",
            borderBottom: "1px solid #F3F4F6",
            display: "flex", alignItems: "center", gap: "7px",
          }}>
            <Building2 size={13} color="#6B7280" />
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", letterSpacing: "0.06em" }}>
              BUS SERVICE PROVIDER
            </span>
          </div>

          {/* List */}
          <div style={{ maxHeight: "320px", overflowY: "auto" }}>
            {operators.map(op => {
              const active = op.id === operator.id;
              return (
                <button
                  key={op.id}
                  onClick={() => { setOperatorId(op.id); setOpen(false); }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: "10px",
                    padding: "9px 14px", border: "none", background: active ? op.colorBg : "transparent",
                    cursor: "pointer", textAlign: "left",
                    borderLeft: active ? `3px solid ${op.color}` : "3px solid transparent",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "#F9FAFB"; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  {/* Colour swatch */}
                  <span style={{
                    width: "32px", height: "32px", borderRadius: "8px",
                    background: op.colorBg, border: `1.5px solid ${op.color}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "16px", flexShrink: 0,
                  }}>
                    {op.logo}
                  </span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#1F2937", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {op.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "1px" }}>
                      {op.totalBuses} buses · Est. {op.founded}
                    </div>
                  </div>

                  {active && <Check size={14} color={op.color} style={{ flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
