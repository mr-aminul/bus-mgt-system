import { useState } from "react";
import { Building2, Bell, Shield, Globe, ChevronRight, Check, User, Lock } from "lucide-react";
import { useLanguage, type Lang } from '@/contexts/LanguageContext'

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: "40px", height: "22px", borderRadius: "11px",
        background: value ? "#2CA85A" : "#D1D5DB",
        position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute", top: "3px",
          left: value ? "21px" : "3px",
          width: "16px", height: "16px", borderRadius: "50%",
          background: "#fff", transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      />
    </div>
  );
}

const sectionTabs = [
  { key: "company", icon: Building2 },
  { key: "notifications", icon: Bell },
  { key: "language", icon: Globe },
  { key: "security", icon: Shield },
];

export function SettingsPage() {
  const { t, lang, setLang } = useLanguage();
  const [activeTab, setActiveTab] = useState("company");
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({ compliance: true, trip: true, revenue: false, sms: true });
  const [companyName, setCompanyName] = useState(t("company_name_val"));
  const [companyPhone, setCompanyPhone] = useState("+880 2 9561234");
  const [companyEmail, setCompanyEmail] = useState("admin@dhakaexpress.com.bd");

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const tabLabels: Record<string, string> = {
    company: t("settings_company"),
    notifications: t("settings_notifications"),
    language: t("settings_language"),
    security: t("settings_security"),
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <h1 className="settings-title">{t("settings_title")}</h1>
        <p className="settings-summary">
          {lang === "bn" ? "সিস্টেম কনফিগারেশন ও পছন্দসমূহ" : "System configuration and preferences"}
        </p>
      </div>

      <div className="settings-layout">
        {/* Sidebar nav */}
        <nav className="settings-nav">
          {sectionTabs.map(({ key, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`settings-nav-item ${activeTab === key ? "settings-nav-item--active" : ""}`}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Icon size={16} />
                {tabLabels[key]}
              </div>
              {activeTab !== key && <ChevronRight size={14} color="#9CA3AF" />}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="settings-content">
          {/* Company Info */}
          {activeTab === "company" && (
            <div className="settings-panel">
              <div className="settings-panel-title">{t("settings_company")}</div>
              <div className="settings-form-grid">
                {[
                  { label: t("company_name"), value: companyName, onChange: setCompanyName, full: true },
                  { label: t("company_reg"), value: t("company_reg_val"), onChange: () => {}, disabled: true },
                  { label: t("company_phone"), value: companyPhone, onChange: setCompanyPhone },
                  { label: t("company_email"), value: companyEmail, onChange: setCompanyEmail },
                ].map(({ label, value, onChange, disabled, full }) => (
                  <div key={label} className={`settings-field ${full ? "settings-field--full" : ""}`}>
                    <label className="settings-label">{label}</label>
                    <input
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      disabled={disabled}
                      className="settings-input"
                    />
                  </div>
                ))}
                <div className="settings-field settings-field--full">
                  <label className="settings-label">{t("company_address")}</label>
                  <input
                    defaultValue={t("company_address_val")}
                    className="settings-input"
                  />
                </div>
              </div>
              <div className="settings-actions">
                <button
                  type="button"
                  onClick={handleSave}
                  className="settings-btn-save"
                  style={{ background: saved ? "#2CA85A" : "#1A3C6E" }}
                >
                  {saved ? <Check size={14} /> : null}
                  {saved ? (lang === "bn" ? "সংরক্ষিত!" : "Saved!") : t("btn_save")}
                </button>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="settings-panel">
              <div className="settings-panel-title">{t("settings_notifications")}</div>
              <div>
                {[
                  { key: "compliance", title: t("notif_compliance"), sub: t("notif_compliance_sub") },
                  { key: "trip", title: t("notif_trip"), sub: t("notif_trip_sub") },
                  { key: "revenue", title: t("notif_revenue"), sub: t("notif_revenue_sub") },
                  { key: "sms", title: t("notif_sms"), sub: t("notif_sms_sub") },
                ].map(({ key, title, sub }) => (
                  <div key={key} className="settings-row">
                    <div>
                      <div className="settings-row-title">{title}</div>
                      <div className="settings-row-sub">{sub}</div>
                    </div>
                    <Toggle
                      value={notifs[key as keyof typeof notifs]}
                      onChange={(v) => setNotifs((n) => ({ ...n, [key]: v }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Language & Region */}
          {activeTab === "language" && (
            <div className="settings-panel">
              <div className="settings-panel-title">{t("settings_language")}</div>
              <div className="settings-section">
                <div>
                  <label className="settings-label" style={{ marginBottom: "10px" }}>{t("lang_select")}</label>
                  <div className="settings-lang-options">
                    {(["en", "bn"] as Lang[]).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLang(l)}
                        className={`settings-lang-option ${lang === l ? "settings-lang-option--active" : ""}`}
                      >
                        <span style={{ fontSize: "20px" }}>{l === "en" ? "🇬🇧" : "🇧🇩"}</span>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: lang === l ? "#1A3C6E" : "#374151" }}>
                          {l === "en" ? t("lang_en") : t("lang_bn")}
                        </span>
                        {lang === l && (
                          <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#2CA85A", fontWeight: 600 }}>
                            <Check size={12} />
                            {lang === "bn" ? "নির্বাচিত" : "Selected"}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                {[
                  { label: t("currency_format"), value: "৳ BDT (Bangladeshi Taka)" },
                  { label: t("date_format"), value: "DD MMM YYYY" },
                  { label: t("timezone"), value: "Asia/Dhaka (UTC+6)" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <label className="settings-label">{label}</label>
                    <div className="settings-readonly-field">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div className="settings-panel">
              <div className="settings-panel-title">{t("settings_security")}</div>

              <div className="settings-profile-card">
                <div className="settings-profile-avatar">MA</div>
                <div>
                  <div className="settings-profile-name">Mohammad Alam</div>
                  <div className="settings-profile-email">admin@dhakaexpress.com.bd</div>
                  <div className="settings-profile-role">{lang === "bn" ? "বহর মালিক • অ্যাডমিন" : "Fleet Owner • Administrator"}</div>
                </div>
              </div>

              <div>
                {[
                  { icon: Lock, title: t("security_change_pass"), sub: lang === "bn" ? "শেষবার পরিবর্তন: ৩ মাস আগে" : "Last changed 3 months ago", btn: lang === "bn" ? "পরিবর্তন" : "Change" },
                  { icon: Shield, title: t("security_2fa"), sub: t("security_2fa_sub"), btn: lang === "bn" ? "সক্ষম করুন" : "Enable", status: lang === "bn" ? "অক্ষম" : "Disabled" },
                  { icon: User, title: t("security_sessions"), sub: t("security_sessions_sub"), btn: lang === "bn" ? "পরিচালনা" : "Manage", status: lang === "bn" ? "২ সক্রিয়" : "2 Active" },
                ].map(({ icon: Icon, title, sub, btn, status }) => (
                  <div key={title} className="settings-security-row">
                    <div className="settings-security-left">
                      <div className="settings-security-icon">
                        <Icon size={16} color="#1A3C6E" />
                      </div>
                      <div>
                        <div className="settings-security-title">{title}</div>
                        <div className="settings-security-sub">{sub}</div>
                      </div>
                    </div>
                    <div className="settings-security-actions">
                      {status && (
                        <span style={{ fontSize: "12px", color: "#9CA3AF", fontWeight: 500 }}>{status}</span>
                      )}
                      <button type="button" className="settings-btn-secondary">{btn}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}