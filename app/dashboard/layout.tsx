"use client"

import { ReactNode } from 'react'
import dynamic from 'next/dynamic'

const DashboardLayoutClient = dynamic(() => import('./LayoutClient'), { ssr: false })

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}
