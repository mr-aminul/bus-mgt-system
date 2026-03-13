import {
  LayoutDashboard,
  User,
  BarChart3,
  Bus,
  Zap,
  LayoutGrid,
} from 'lucide-react'
import type { AppLayoutConfig } from '@/layout'
import { assets } from './assets'

/**
 * Bus Management System: brand, nav items, and page titles.
 * Sidebar groups: Operations (routes, tickets, counters), Fleet (vehicles, drivers), Account (profile, settings).
 */
export const layoutConfig: Omit<AppLayoutConfig, 'getPageTitle'> = {
  brand: {
    name: 'FleetOS',
    subtitle: 'Bus Management System',
    icon: Zap,
    logoColor: '#2CA85A',
    logoUrl: assets.logoUrl || undefined,
  },
  fullScreenPaths: ['/pos'],
  navItems: [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
    {
      path: '/routes',
      label: 'Operations',
      icon: LayoutGrid,
      end: false,
      children: [
        { path: '/routes', label: 'Routes & Trips' },
        { path: '/tickets', label: 'Tickets & Revenue' },
        { path: '/counters', label: 'Counters' },
      ],
    },
    {
      path: '/fleet',
      label: 'Fleet',
      icon: Bus,
      end: false,
      children: [
        { path: '/fleet', label: 'Vehicles' },
        { path: '/drivers', label: 'Drivers' },
      ],
    },
    { path: '/reports', label: 'Reports', icon: BarChart3, end: true },
    {
      path: '/profile',
      label: 'Account',
      icon: User,
      end: false,
      children: [
        { path: '/profile', label: 'Profile' },
        { path: '/settings', label: 'Settings' },
      ],
    },
  ],
}

export function getPageTitle(pathname: string): string {
  const titles: Record<string, string> = {
    '/': 'Operations Dashboard',
    '/fleet': 'Fleet Management',
    '/reports': 'Reports',
    '/routes': 'Routes & Trips',
    '/drivers': 'Drivers',
    '/tickets': 'Tickets & Revenue',
    '/counters': 'Counters',
    '/profile': 'Profile',
    '/settings': 'Settings',
    '/pos': 'POS Terminal',
  }
  if (pathname.startsWith('/fleet/')) return 'Vehicle Detail'
  return titles[pathname] ?? 'Bus Management System'
}
