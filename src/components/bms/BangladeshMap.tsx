import { useState } from "react";

interface BusMarker {
  id: string;
  x: number;
  y: number;
  status: "on-time" | "delayed" | "idle";
  route: string;
  destination: string;
  eta: string;
  driver: string;
}

const buses: BusMarker[] = [
  { id: "DH-1142", x: 255, y: 205, status: "on-time", route: "Dhaka→Chittagong", destination: "Chittagong", eta: "14:30", driver: "Rahim Uddin" },
  { id: "DH-2087", x: 268, y: 160, status: "on-time", route: "Dhaka→Sylhet", destination: "Sylhet", eta: "13:45", driver: "Karim Ali" },
  { id: "DH-3315", x: 240, y: 270, status: "delayed", route: "Dhaka→Cox's Bazar", destination: "Cox's Bazar", eta: "17:20", driver: "Hasan Mia" },
  { id: "DH-0891", x: 185, y: 192, status: "on-time", route: "Dhaka→Rajshahi", destination: "Rajshahi", eta: "15:00", driver: "Jalal Khan" },
  { id: "CTG-441", x: 290, y: 248, status: "on-time", route: "Chittagong→Dhaka", destination: "Dhaka", eta: "16:10", driver: "Ruhul Amin" },
  { id: "DH-1776", x: 222, y: 232, status: "idle", route: "Dhaka→Khulna", destination: "Khulna", eta: "–", driver: "Faruk Hossain" },
];

const statusColor = {
  "on-time": "#2CA85A",
  "delayed": "#F5A623",
  "idle": "#9CA3AF",
};

// Route lines between cities (approximate pixel coords)
const routeLines = [
  { x1: 242, y1: 200, x2: 286, y2: 248, status: "on-time" as const },  // Dhaka→CTG
  { x1: 242, y1: 200, x2: 268, y2: 160, status: "on-time" as const },  // Dhaka→Sylhet
  { x1: 242, y1: 200, x2: 280, y2: 290, status: "delayed" as const },  // Dhaka→Cox'sBazar
  { x1: 242, y1: 200, x2: 175, y2: 188, status: "on-time" as const },  // Dhaka→Rajshahi
  { x1: 242, y1: 200, x2: 215, y2: 255, status: "idle" as const },     // Dhaka→Khulna
];

// Bangladesh outline — simplified polygon path
const bangladeshPath = `
  M 215 70
  L 230 68
  L 248 72
  L 265 78
  L 280 90
  L 295 108
  L 305 125
  L 310 140
  L 308 158
  L 300 170
  L 296 185
  L 298 200
  L 300 218
  L 296 235
  L 292 250
  L 290 265
  L 286 278
  L 278 292
  L 268 300
  L 258 310
  L 248 318
  L 240 320
  L 228 315
  L 218 305
  L 210 290
  L 205 278
  L 200 265
  L 198 250
  L 194 238
  L 188 225
  L 182 215
  L 175 205
  L 168 195
  L 162 182
  L 158 168
  L 160 155
  L 165 142
  L 170 130
  L 175 118
  L 182 108
  L 190 98
  L 198 88
  L 206 78
  Z
`;

export function BangladeshMap() {
  const [hoveredBus, setHoveredBus] = useState<string | null>(null);

  const hovered = buses.find((b) => b.id === hoveredBus);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "#EEF4FF", minHeight: "300px" }}>
      <svg
        viewBox="0 0 480 370"
        style={{ width: "100%", height: "100%" }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Ocean / background detail */}
        <defs>
          <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#D1E3F8" strokeWidth="0.4" />
          </pattern>
          <filter id="busShadow">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.25" />
          </filter>
        </defs>
        <rect width="480" height="370" fill="#EEF4FF" />
        <rect width="480" height="370" fill="url(#mapGrid)" />

        {/* Bay of Bengal label */}
        <text x="360" y="280" style={{ fontSize: "10px", fill: "#93B4D4", fontStyle: "italic", fontFamily: "Inter, sans-serif" }}>
          Bay of Bengal
        </text>

        {/* Bangladesh country fill */}
        <path
          d={bangladeshPath}
          fill="#D6E8D4"
          stroke="#A5C9A1"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Rivers */}
        <path d="M 242 200 Q 246 220 244 240 Q 242 260 248 280" fill="none" stroke="#93C5FD" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.7" />
        <path d="M 230 160 Q 238 180 242 200" fill="none" stroke="#93C5FD" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />

        {/* Route lines */}
        {routeLines.map((r, i) => (
          <line
            key={i}
            x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
            stroke={statusColor[r.status]}
            strokeWidth="1.5"
            strokeDasharray="5,3"
            opacity="0.5"
          />
        ))}

        {/* City labels */}
        {[
          { x: 242, y: 200, label: "Dhaka", major: true },
          { x: 292, y: 252, label: "Chittagong", major: false },
          { x: 278, y: 155, label: "Sylhet", major: false },
          { x: 170, y: 185, label: "Rajshahi", major: false },
          { x: 212, y: 260, label: "Khulna", major: false },
          { x: 280, y: 296, label: "Cox's Bazar", major: false },
        ].map((city) => (
          <g key={city.label}>
            <circle cx={city.x} cy={city.y - 12} r={city.major ? 4 : 2.5} fill={city.major ? "#1A3C6E" : "#6B7280"} />
            <text
              x={city.x}
              y={city.y}
              textAnchor="middle"
              style={{
                fontSize: city.major ? "9px" : "7.5px",
                fill: city.major ? "#1A3C6E" : "#6B7280",
                fontWeight: city.major ? "700" : "400",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {city.label}
            </text>
          </g>
        ))}

        {/* Bus markers */}
        {buses.map((bus) => {
          const color = statusColor[bus.status];
          const isHovered = hoveredBus === bus.id;
          return (
            <g
              key={bus.id}
              transform={`translate(${bus.x}, ${bus.y})`}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHoveredBus(bus.id)}
              onMouseLeave={() => setHoveredBus(null)}
              filter={isHovered ? "url(#busShadow)" : "none"}
            >
              {/* Pulse ring for active buses */}
              {bus.status !== "idle" && (
                <circle r={isHovered ? 14 : 10} fill={color} opacity="0.15" />
              )}
              {/* Bus circle */}
              <circle
                r={isHovered ? 9 : 7}
                fill={color}
                stroke="#fff"
                strokeWidth="1.5"
              />
              {/* Bus icon (simplified) */}
              <rect x="-3.5" y="-4" width="7" height="8" rx="1.5" fill="#fff" opacity="0.9" />
              <rect x="-2.5" y="-3" width="2.5" height="2" rx="0.5" fill={color} opacity="0.8" />
              <rect x="0.5" y="-3" width="2.5" height="2" rx="0.5" fill={color} opacity="0.8" />
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            background: "#1F2937",
            color: "#fff",
            borderRadius: "10px",
            padding: "10px 14px",
            fontSize: "12px",
            lineHeight: 1.6,
            zIndex: 10,
            pointerEvents: "none",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            minWidth: "190px",
          }}
        >
          <div style={{ fontWeight: 700, color: "#fff", marginBottom: "4px" }}>
            Bus #{hovered.id}
          </div>
          <div style={{ color: "#D1D5DB" }}>Route: {hovered.route}</div>
          <div style={{ color: "#D1D5DB" }}>ETA: {hovered.eta}</div>
          <div style={{ color: "#D1D5DB" }}>Driver: {hovered.driver}</div>
          <div style={{ marginTop: "5px", display: "flex", alignItems: "center", gap: "5px" }}>
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: statusColor[hovered.status],
                display: "inline-block",
              }}
            />
            <span style={{ color: statusColor[hovered.status], fontWeight: 600, textTransform: "capitalize" }}>
              {hovered.status.replace("-", " ")}
            </span>
          </div>
        </div>
      )}

      {/* Scale indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "12px",
          fontSize: "10px",
          color: "#9CA3AF",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <span style={{ display: "inline-block", width: "24px", height: "2px", background: "#9CA3AF" }} />
        100 km
      </div>
    </div>
  );
}