"use client"

import SuperAdminSidebar from '@/components/super-admin/sidebar'
import { cn } from '@/lib/utils'
import React, { useState } from 'react'

type Props = {
    children: React.ReactNode
}

const SuperAdminLayout = ({ children }: Props) => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className='min-h-screen bg-background'>
        <SuperAdminSidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div
        className={cn(
          "transition-all duration-300",
          isSidebarOpen ? "ml-64" : "ml-16",
          "min-h-screen"
        )}
      >{children}</div>
    </div>
  )
}

export default SuperAdminLayout