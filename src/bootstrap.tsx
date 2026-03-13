import { StrictMode } from 'react'
import type { Root } from 'react-dom/client'
import { AuthProvider } from '@/contexts/AuthContext'
import { SettingsProvider } from '@/contexts/SettingsContext'
import { NotificationsProvider } from '@/contexts/NotificationsContext'
import App from './App'

/**
 * Loaded via dynamic import so that missing env (e.g. on Vercel) fails here
 * and main.tsx can catch and show a friendly message instead of a blank screen.
 */
export function renderApp(root: Root) {
  root.render(
    <StrictMode>
      <AuthProvider>
        <SettingsProvider>
          <NotificationsProvider>
            <App />
          </NotificationsProvider>
        </SettingsProvider>
      </AuthProvider>
    </StrictMode>,
  )
}
