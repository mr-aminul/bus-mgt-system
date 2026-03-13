import { TrendingUp, TrendingDown, Ticket, BanknoteIcon, RefreshCw, Download } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie,
} from "recharts";

const weeklyRevenue = [
  { day: "Thu", amount: 38400, tickets: 268 },
  { day: "Fri", amount: 42100, tickets: 294 },
  { day: "Sat", amount: 35700, tickets: 249 },
  { day: "Sun", amount: 44800, tickets: 312 },
  { day: "Mon", amount: 39200, tickets: 274 },
  { day: "Tue", amount: 46300, tickets: 323 },
  { day: "Wed", amount: 48250, tickets: 337 },
];

const recentTransactions = [
  { id: "TKT-8821", passenger: "Alam Hossain", passengerBn: "আলম হোসেন", route: "Dhaka → CTG", departure: "07:00 AM", payment: "Cash", amount: 550, time: "06:52 AM", seats: "3C" },
  { id: "TKT-8820", passenger: "Shirin Akter", passengerBn: "শিরিন আক্তার", route: "Dhaka → CTG", departure: "07:00 AM", payment: "bKash", amount: 1100, time: "06:48 AM", seats: "4A, 4B" },
  { id: "TKT-8819", passenger: "Kamal Ahmed", passengerBn: "কামাল আহমেদ", route: "Dhaka → Sylhet", departure: "07:30 AM", payment: "Nagad", amount: 480, time: "06:45 AM", seats: "2C" },
  { id: "TKT-8818", passenger: "Nipa Begum", passengerBn: "নিপা বেগম", route: "Dhaka → Sylhet", departure: "07:30 AM", payment: "Cash", amount: 960, time: "06:41 AM", seats: "1A, 1B" },
  { id: "TKT-8817", passenger: "Rafiq Islam", passengerBn: "রফিক ইসলাম", route: "Dhaka → Rajshahi", departure: "08:30 AM", payment: "bKash", amount: 520, time: "06:38 AM", seats: "5D" },
  { id: "TKT-8816", passenger: "Setu Rani", passengerBn: "সেতু রানী", route: "Dhaka → Khulna", departure: "09:30 AM", payment: "Cash", amount: 560, time: "06:30 AM", seats: "6C" },
  { id: "TKT-8815", passenger: "Habib Chowdhury", passengerBn: "হাবিব চৌধুরী", route: "Dhaka → CTG", departure: "07:00 AM", payment: "Nagad", amount: 550, time: "06:24 AM", seats: "7A" },
  { id: "TKT-8814", passenger: "Mitu Akter", passengerBn: "মিতু আক্তার", route: "Dhaka → Cox's Bazar", departure: "08:00 AM", payment: "Cash", amount: 1800, time: "06:20 AM", seats: "2A, 2B" },
];

const routeRevenue = [
  { name: "Dhaka → CTG", nameBn: "ঢাকা → চট্টগ্রাম", value: 38200, color: "#1A3C6E" },
  { name: "Dhaka → Sylhet", nameBn: "ঢাকা → সিলেট", value: 22400, color: "#2CA85A" },
  { name: "Dhaka → Cox's Bazar", nameBn: "ঢাকা → কক্সবাজার", value: 18000, color: "#F5A623" },
  { name: "Dhaka → Rajshahi", nameBn: "ঢাকা → রাজশাহী", value: 20280, color: "#3B82F6" },
  { name: "Dhaka → Khulna", nameBn: "ঢাকা → খুলনা", value: 12600, color: "#8B5CF6" },
];

const paymentMix = [
  { name: "Cash", nameBn: "নগদ", value: 52, color: "#1A3C6E" },
  { name: "bKash", nameBn: "বিকাশ", value: 33, color: "#E91E8C" },
  { name: "Nagad", nameBn: "নগদ পেমেন্ট", value: 15, color: "#F5A623" },
];

const paymentCfg: Record<string, { color: string; bg: string }> = {
  Cash: { color: "#1A3C6E", bg: "#1A3C6E1A" },
  bKash: { color: "#E91E8C", bg: "#E91E8C1A" },
  Nagad: { color: "#F5A623", bg: "#F5A6231A" },
};

export function TicketsPage() {
  const { t, lang } = useLanguage();

  return (
    <div className="tickets-page">
      {/* Header */}
      <div className="tickets-header">
        <div className="tickets-header-left">
          <h1 className="tickets-title">{t("tickets_title")}</h1>
          <p className="tickets-summary">
            {lang === "bn" ? "আজকের বিক্রয় ও আয়ের সংক্ষিপ্ত বিবরণ" : "Today's sales and revenue overview"}
          </p>
        </div>
        <button type="button" className="tickets-btn-export">
          <Download size={14} />
          {lang === "bn" ? "রপ্তানি" : "Export"}
        </button>
      </div>

      {/* KPIs */}
      <div className="tickets-kpi-grid">
        {[
          {
            title: t("total_revenue_today"), value: "৳ 48,250",
            trend: "+12%", trendDir: "up" as const, sub: lang === "bn" ? "গতকালের তুলনায়" : "vs yesterday",
            icon: BanknoteIcon, iconBg: "#2CA85A18", iconColor: "#2CA85A",
          },
          {
            title: t("tickets_sold_today"), value: "337",
            trend: "+24", trendDir: "up" as const, sub: lang === "bn" ? "গতকালের তুলনায়" : "vs yesterday",
            icon: Ticket, iconBg: "#1A3C6E18", iconColor: "#1A3C6E",
          },
          {
            title: t("avg_ticket_value"), value: "৳ 543",
            trend: "-৳ 7", trendDir: "down" as const, sub: lang === "bn" ? "গত সপ্তাহের তুলনায়" : "vs last week",
            icon: TrendingUp, iconBg: "#3B82F618", iconColor: "#3B82F6",
          },
          {
            title: t("refund_rate"), value: "1.2%",
            trend: "-0.3%", trendDir: "down" as const, sub: lang === "bn" ? "গত মাসের তুলনায়" : "vs last month",
            icon: RefreshCw, iconBg: "#F5A62318", iconColor: "#F5A623",
          },
        ].map(({ title, value, trend, trendDir, sub, icon: Icon, iconBg, iconColor }) => (
          <div key={title} className="tickets-kpi-card">
            <div className="tickets-kpi-header">
              <div className="tickets-kpi-icon" style={{ background: iconBg }}>
                <Icon size={20} color={iconColor} />
              </div>
            </div>
            <div className="tickets-kpi-label">{title}</div>
            <div className="tickets-kpi-value">{value}</div>
            <div className="tickets-kpi-trend">
              {trendDir === "up" ? (
                <TrendingUp size={14} color="#2CA85A" />
              ) : (
                <TrendingDown size={14} color="#DC2626" />
              )}
              <span style={{ fontSize: "12px", color: trendDir === "up" ? "#2CA85A" : "#DC2626", fontWeight: 600 }}>{trend}</span>
              <span style={{ fontSize: "12px", color: "#9CA3AF" }}>{sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="tickets-charts-row">
        <div className="tickets-chart-card">
          <div className="tickets-chart-title">{t("revenue_7days")}</div>
          <div className="tickets-chart-sub">{t("revenue_sub")}</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyRevenue}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A3C6E" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1A3C6E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`} width={48} />
              <Tooltip
                content={({ active, payload, label }: any) =>
                  active && payload?.length ? (
                    <div style={{ background: "#1F2937", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "12px" }}>
                      <div style={{ color: "#9CA3AF", marginBottom: "4px" }}>{label}</div>
                      <div style={{ fontWeight: 600 }}>৳ {payload[0].value.toLocaleString()}</div>
                      <div style={{ color: "#9CA3AF" }}>{payload[0].payload.tickets} {lang === "bn" ? "টিকেট" : "tickets"}</div>
                    </div>
                  ) : null
                }
                cursor={{ stroke: "#1A3C6E20", strokeWidth: 2 }}
              />
              <Area type="monotone" dataKey="amount" stroke="#1A3C6E" strokeWidth={2} fill="url(#revGrad)" dot={{ r: 3, fill: "#1A3C6E" }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="tickets-side-cards">
          <div className="tickets-side-card">
            <div className="tickets-side-card-title">
              {lang === "bn" ? "পেমেন্ট মিশ্রণ" : "Payment Mix"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: 100, height: 100, flexShrink: 0 }}>
                <PieChart width={100} height={100}>
                  <Pie data={paymentMix} cx="50%" cy="50%" innerRadius={28} outerRadius={46} dataKey="value" paddingAngle={3}>
                    {paymentMix.map((p) => <Cell key={p.name} fill={p.color} />)}
                  </Pie>
                </PieChart>
              </div>
              <div className="tickets-payment-legend">
                {paymentMix.map((p) => (
                  <div key={p.name} className="tickets-payment-legend-item">
                    <span className="tickets-payment-dot" style={{ background: p.color }} />
                    <span style={{ fontSize: "12px", color: "#374151", flex: 1 }}>{lang === "bn" ? p.nameBn : p.name}</span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#1F2937" }}>{p.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="tickets-side-card">
            <div className="tickets-side-card-title">{t("revenue_by_route")}</div>
            {routeRevenue.map((r) => {
              const pct = (r.value / 38200) * 100;
              return (
                <div key={r.name} className="tickets-route-bar-wrap">
                  <div className="tickets-route-bar-label">
                    <span style={{ color: "#6B7280" }}>{lang === "bn" ? r.nameBn : r.name}</span>
                    <span style={{ fontWeight: 700, color: "#1F2937" }}>৳{(r.value / 1000).toFixed(1)}k</span>
                  </div>
                  <div style={{ height: "6px", background: "#F3F4F6", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", background: r.color, borderRadius: "3px", transition: "width 0.4s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="tickets-transactions-wrap">
        <div className="tickets-transactions-inner">
          <div className="tickets-transactions-header">
            <Ticket size={16} color="#1A3C6E" />
            <span className="tickets-transactions-title">{t("recent_transactions")}</span>
            <span className="tickets-transactions-filter">{lang === "bn" ? "আজ" : "Today"}</span>
          </div>
          <div className="tickets-transactions-table-header">
            {[t("col_ticket_id"), t("col_passenger"), t("col_route"), t("col_departure_time"), lang === "bn" ? "সময়" : "Time", t("col_payment"), t("col_amount")].map((h) => (
              <span key={h}>{h}</span>
            ))}
          </div>
          {recentTransactions.map((tx, i) => {
            const pc = paymentCfg[tx.payment];
            return (
              <div
                key={tx.id}
                className="tickets-transactions-row"
                style={{ background: i % 2 === 0 ? "#fff" : "#F9FAFB" }}
              >
                <span style={{ color: "#1A3C6E", fontWeight: 700 }}>{tx.id}</span>
                <span style={{ color: "#1F2937", fontWeight: 500 }}>{lang === "bn" ? tx.passengerBn : tx.passenger}</span>
                <span style={{ color: "#374151" }}>{tx.route}</span>
                <span style={{ color: "#374151" }}>{tx.departure}</span>
                <span style={{ color: "#6B7280" }}>{tx.time}</span>
                <span className="tickets-payment-badge" style={{ background: pc.bg, color: pc.color }}>
                  {tx.payment}
                </span>
                <span style={{ color: "#1F2937", fontWeight: 700 }}>৳ {tx.amount.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}