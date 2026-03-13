import { createRoot } from 'react-dom/client'
import './index.css'

const rootEl = document.getElementById('root')!
const root = createRoot(rootEl)

function ConfigError({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
        maxWidth: '560px',
        lineHeight: 1.5,
      }}
    >
      <h1 style={{ marginTop: 0 }}>Configuration needed</h1>
      <p>{message}</p>
      <p>
        Add <strong>VITE_SUPABASE_URL</strong> and <strong>VITE_SUPABASE_ANON_KEY</strong> in
        Vercel → Project → Settings → Environment Variables, then redeploy.
      </p>
    </div>
  )
}

import('./bootstrap')
  .then(({ renderApp }) => renderApp(root))
  .catch((err) => {
    root.render(<ConfigError message={err?.message ?? 'Failed to load app'} />)
  })
