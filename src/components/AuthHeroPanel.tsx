import type { CSSProperties } from 'react'

type AuthHeroPanelProps = {
  title: string
  subtitle: string
}

/**
 * Static abstract left panel for auth screens — navy fleet palette,
 * geometric routes and soft shapes. No photo backgrounds, no motion.
 */
export function AuthHeroPanel({ title, subtitle }: AuthHeroPanelProps) {
  return (
    <div style={styles.panel}>
      <style>{HERO_CSS}</style>
      <div className="bms-auth-hero__art" aria-hidden>
        <div className="bms-auth-hero__wash" />
        <div className="bms-auth-hero__blob bms-auth-hero__blob--a" />
        <div className="bms-auth-hero__blob bms-auth-hero__blob--b" />
        <div className="bms-auth-hero__blob bms-auth-hero__blob--c" />
        <div className="bms-auth-hero__grid" />
        <svg
          className="bms-auth-hero__routes"
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="bmsRouteStroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(125, 211, 252, 0)" />
              <stop offset="35%" stopColor="rgba(125, 211, 252, 0.55)" />
              <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
            </linearGradient>
            <linearGradient id="bmsRouteStroke2" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(148, 163, 184, 0)" />
              <stop offset="40%" stopColor="rgba(148, 163, 184, 0.45)" />
              <stop offset="100%" stopColor="rgba(148, 163, 184, 0)" />
            </linearGradient>
          </defs>
          <path
            d="M-40 420 C 120 280, 220 520, 380 360 S 560 180, 840 240"
            fill="none"
            stroke="url(#bmsRouteStroke)"
            strokeWidth="2.5"
          />
          <path
            d="M-20 160 C 160 80, 280 260, 420 200 S 620 40, 860 120"
            fill="none"
            stroke="url(#bmsRouteStroke2)"
            strokeWidth="1.75"
          />
          <path
            d="M60 560 C 200 480, 300 600, 460 500 S 680 420, 820 520"
            fill="none"
            stroke="rgba(96, 165, 250, 0.28)"
            strokeWidth="1.5"
            strokeDasharray="6 10"
          />
          <circle cx="380" cy="360" r="5" fill="rgba(125, 211, 252, 0.85)" />
          <circle cx="420" cy="200" r="4" fill="rgba(186, 230, 253, 0.7)" />
          <circle cx="460" cy="500" r="4" fill="rgba(147, 197, 253, 0.65)" />
          <circle cx="180" cy="300" r="3" fill="rgba(148, 163, 184, 0.5)" />
          <circle cx="620" cy="280" r="3.5" fill="rgba(125, 211, 252, 0.55)" />
        </svg>
        <div className="bms-auth-hero__ring bms-auth-hero__ring--lg" />
        <div className="bms-auth-hero__ring bms-auth-hero__ring--sm" />
        <div className="bms-auth-hero__vignette" />
      </div>

      <div style={styles.copy}>
        <p style={styles.eyebrow}>Bus Management System</p>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.subtitle}>{subtitle}</p>
      </div>
    </div>
  )
}

const HERO_CSS = `
.bms-auth-hero__art {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.bms-auth-hero__wash {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(120% 90% at 18% 20%, rgba(37, 99, 235, 0.35) 0%, transparent 55%),
    radial-gradient(90% 80% at 88% 78%, rgba(14, 165, 233, 0.22) 0%, transparent 50%),
    linear-gradient(155deg, #040d31 0%, #07183e 42%, #0b2a5c 100%);
}
.bms-auth-hero__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(48px);
  opacity: 0.55;
}
.bms-auth-hero__blob--a {
  width: 42%;
  height: 42%;
  top: -8%;
  left: -6%;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.45), transparent 68%);
}
.bms-auth-hero__blob--b {
  width: 48%;
  height: 48%;
  bottom: -16%;
  right: -10%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent 70%);
}
.bms-auth-hero__blob--c {
  width: 28%;
  height: 28%;
  top: 42%;
  left: 48%;
  background: radial-gradient(circle, rgba(125, 211, 252, 0.28), transparent 72%);
}
.bms-auth-hero__grid {
  position: absolute;
  inset: 0;
  opacity: 0.22;
  background-image:
    linear-gradient(rgba(186, 230, 253, 0.14) 1px, transparent 1px),
    linear-gradient(90deg, rgba(186, 230, 253, 0.14) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 75% 70% at 40% 45%, #000 20%, transparent 75%);
}
.bms-auth-hero__routes {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.95;
}
.bms-auth-hero__ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(186, 230, 253, 0.18);
}
.bms-auth-hero__ring--lg {
  width: min(52vw, 520px);
  height: min(52vw, 520px);
  top: 50%;
  left: 38%;
  transform: translate(-50%, -50%);
}
.bms-auth-hero__ring--sm {
  width: min(28vw, 280px);
  height: min(28vw, 280px);
  top: 50%;
  left: 38%;
  transform: translate(-50%, -50%);
  border-color: rgba(125, 211, 252, 0.22);
}
.bms-auth-hero__vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(120% 100% at 35% 45%, transparent 35%, rgba(2, 8, 28, 0.55) 100%);
}
`

const styles: Record<string, CSSProperties> = {
  panel: {
    position: 'relative',
    flex: 7.5,
    minWidth: 0,
    minHeight: 0,
    padding: '2.5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '0.5rem',
    overflow: 'hidden',
    background: '#040d31',
  },
  copy: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '36rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem',
  },
  eyebrow: {
    margin: 0,
    fontSize: '0.72rem',
    fontWeight: 600,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'rgba(186, 230, 253, 0.72)',
  },
  title: {
    margin: 0,
    fontSize: 'clamp(2.4rem, 5vw, 3.5rem)',
    fontWeight: 700,
    color: '#fff',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  subtitle: {
    margin: 0,
    fontSize: '1.05rem',
    fontWeight: 400,
    color: 'rgba(226, 232, 240, 0.88)',
    lineHeight: 1.45,
    maxWidth: '28rem',
  },
}
