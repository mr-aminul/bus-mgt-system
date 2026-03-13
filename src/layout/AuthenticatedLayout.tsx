import { AppLayout } from './AppLayout'
import { useAuth } from '@/contexts/AuthContext'
import { layoutConfig, getPageTitle } from '@/config/layout'
import { OperatorSwitcher } from '@/components/bms/OperatorSwitcher'

/**
 * App shell layout with sidebar and top bar, wired to auth (user name in header).
 * BMS: Operator switcher in top bar center.
 */
export default function AuthenticatedLayout() {
  const { user, displayName, signOut } = useAuth()

  return (
    <AppLayout
      {...layoutConfig}
      getPageTitle={getPageTitle}
      userName={displayName}
      profileLabel={displayName}
      profileSubtext={user?.email}
      onSignOut={signOut}
      topBarCenterSlot={<OperatorSwitcher />}
    />
  )
}
